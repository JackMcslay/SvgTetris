
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var Piece;
(function() {
	Piece = function(queue, queueNumber) {
		this.node = document.createElementNS(NS_SVG, 'g');
		this.root = this.node.ownerDocument.documentElement;
		this.Queue = queue;
		this.Queue.Node.appendChild(this.node);
		this.PlayArea = queue.Area;

		var type = Math.floor(Math.random() * Piece.types.length);
		//type = 1;
		var gr = Piece.types[type].grid;
		this.size = Piece.types[type].width;
		this.spriteOfs = (this.size / 2) - 0.5;

		var blOfs = this.spriteOfs;

		this.Grid = Array(this.size);
		for (var x = 0; x < this.size; x++) {
			this.Grid[x] = Array(this.size);
		}
		for (var x = 0; x < this.size; x++) {
			for (var y = 0; y < this.size; y++) {
				if (gr[y][x]) {
					var bl = document.createElementNS(NS_SVG, 'use');
					bl.setAttributeNS(NS_XLINK, 'href', '#' + Piece.types[type].use);
					bl.Translate = this.root.createSVGTransform();
					bl.transform.baseVal.appendItem(bl.Translate);

					bl.Translate.setTranslate(x - blOfs, y - blOfs);

					this.node.appendChild(bl);
					this.Grid[x][y] = bl;
				}
			}
		}
		this.SpriteOffset = this.root.createSVGTransform();
		this.node.transform.baseVal.appendItem(this.SpriteOffset);

		this.Translate = this.root.createSVGTransform();
		this.node.transform.baseVal.appendItem(this.Translate);

		this.Rotate = this.root.createSVGTransform();
		this.node.transform.baseVal.appendItem(this.Rotate);

		this.x = 0;
		this.y = 0;
		this.queueNumber = queueNumber;
		if (this.queueNumber) {
			this.y = this.goalY = 4 * this.queueNumber;
			this.Translate.setTranslate(0, this.y);
		}
		else {
			this.queueNumber = 0;
		}
	};

	Piece.prototype.inUse = false;
	Piece.prototype.sprite = null;
	Piece.prototype.x = 0;
	Piece.prototype.y = 0;
	Piece.prototype.angle = 0;
	Piece.prototype.speedX = 0;
	Piece.prototype.speedY = 0;
	Piece.prototype.speedAngle = 0;
	Piece.prototype.goalX = 0;
	Piece.prototype.goalY = 0;
	Piece.prototype.goalAngle = 0;
	Piece.prototype.movingX = false;
	Piece.prototype.movingY = false;
	Piece.prototype.movingAngle = false;
	Piece.prototype.gridX = 0;
	Piece.prototype.gridY = 0;
	Piece.prototype.gravity = 1;
	Piece.prototype.rotateCw = function() {
		if (!this.inUse || this.dropping)
			return;

		do {
			var start = 0;
			var end = this.size - 1;
			var cursize = end - start;

			while (start < end) {
				for (x = 0; x < cursize; x++) {
					var x1 = x + start;
					var x2 = end - x;
					var aux = this.Grid[x1][start];

					this.Grid[x1][start] = this.Grid[end][x1];
					this.Grid[end][x1] = this.Grid[x2][end];
					this.Grid[x2][end] = this.Grid[start][x2];
					this.Grid[start][x2] = aux;
				}
				start++;
				end--;
				cursize = end - start;
			}
			this.goalAngle -= 90;
		} while (checkCollision(this, 0, 0));
		this.movingAngle = true;
		calculateSpeed(this);
	};
	Piece.prototype.rotateCcw = function() {
		if (!this.inUse || this.dropping)
			return;

		do {
			var start = 0;
			var end = this.size - 1;
			var cursize = end - start;

			while (start < end) {
				for (x = 0; x < cursize; x++) {
					var x1 = x + start;
					var x2 = end - x;
					var aux = this.Grid[x1][start];

					this.Grid[x1][start] = this.Grid[start][x2];//1
					this.Grid[start][x2] = this.Grid[x2][end];//4
					this.Grid[x2][end] = this.Grid[end][x1];//3
					this.Grid[end][x1] = aux;//2
				}
				start++;
				end--;
				cursize = end - start;
			}
			this.goalAngle += 90;
		} while (checkCollision(this, 0, 0));
		this.movingAngle = true;
		calculateSpeed(this);
	};
	Piece.prototype.rotate180 = function() {
		if (!this.inUse || this.dropping)
			return;

		do {
			this.goalAngle += 180;

			var lastIdx = this.size - 1;
			var midIdx, lastLine;
			if (lastIdx % 2) {
				midIdx = -1;
				lastLine = (this.size / 2) - 1;
			}
			else {
				midIdx = lastIdx / 2;
				lastLine = lastIdx / 2;
			}

			for (y = 0; y <= lastLine; y++) {
				var y2 = lastIdx - y;
				for (x = 0; x < this.size; x++) {
					if (x === y && x === midIdx) {
						break;
					}
					var x2 = lastIdx - x;
					var aux = this.Grid[x][y];
					this.Grid[x][y] = this.Grid[x2][y2];
					this.Grid[x2][y2] = aux;
				}
			}
		} while (checkCollision(this, 0, 0));

		this.movingAngle = true;
		calculateSpeed(this);
	};
	Piece.prototype.moveTo = function(idx) {
		if (!this.inUse || this.dropping)
			return;

		var diff;
		idx = Int(idx);
		if (idx < this.gridX) {
			diff = -1;
		}
		else if (idx > this.gridX) {
			diff = 1;
		}
		else {
			return;
		}

		this.goalX = this.gridX;
		var diffAcc = diff;
		while (this.goalX !== idx) {
			if (checkCollision(this, diffAcc, 0)) {
				break;
			}

			this.goalX += diff;
			diffAcc += diff;
		}

		this.movingX = true;
		calculateSpeed(this);
	};
	Piece.prototype.fall = function() {
		if (!this.inUse || this.dropping || checkCollision(this, 0, this.goalY - this.gridY))
			return;
		this.goalY++;
		this.movingY = true;
		calculateSpeed(this);
	};
	Piece.prototype.drop = function() {
		if (!this.inUse || this.dropping)
			return;
		this.dropping = true;
		var add;
		this.x = this.gridX = this.goalX;
		this.movingX = false;
		for (add = 1; !checkCollision(this, 0, add); add++)
			;
		this.goalY += add-1;
		this.movingY = true;
		calculateSpeed(this);

	}

	Piece.prototype.moveQueue = function() {
		if (this.inUse)
			return;
		this.queueNumber--;
		this.goalY = 4 * this.queueNumber;
		this.movingY = true;
		calculateSpeed(this);
	};

	Piece.prototype.log = function() {
		for (var y = 0; y < this.size; y++) {
			var str = '';
			for (var x = 0; x < this.size; x++) {
				str += this.Grid[x][y] ? '#' : '_';
			}
			console.log('' + y + '' + str);
		}
	};
	
	Piece.prototype.getTarget = function(){
		if (!this.inUse){
			return;
		}
		var ofs = 0;
		var xofs = this.goalX - this.gridX;
		while (!checkCollision(this,xofs,ofs)){
			ofs++;
		}
		var c = 0;
		for (x = 0; x < this.size; x++){
			for (y = 0; y < this.size; y++){
				if (this.Grid[x][y]) this.PlayArea.setTarget(c++,x+xofs+this.gridX,y+ofs+this.gridY-1);
			}			
		}
	}


	/**
	 * 
	 * @param {Piece} This object to modify
	 * @param {Number} ammount ammount of change to apply
	 */
	function moveToGoal(This, ammount) {
		if (This.movingX) {
			This.x += This.speedX * ammount;
			if (This.speedX > 0) {
				if (This.x > This.goalX) {
					This.x = This.goalX;
					This.speedX = 0;
					This.movingX = false;
				}
				This.gridX = Math.ceil(This.x);
			}
			else if (This.speedX < 0) {
				if (This.x < This.goalX) {
					This.x = This.goalX;
					This.speedX = 0;
					This.movingX = false;
				}
				This.gridX = Math.floor(This.x);
			}
			else {
				This.gridX = This.x = Math.round(This.x)
			}
			This.gridX = Int(This.gridX);
		}
		else {
			This.goalX = This.gridX;
		}

		if (This.movingY) {
			This.y += This.speedY * ammount;
			if (This.speedY > 0) {
				if (This.y > This.goalY) {
					This.y = This.goalY;
					This.speedY = 0;
					This.movingY = false;
				}
				This.gridY = Math.ceil(This.y);
			}
			else if (This.speedY < 0) {
				if (This.y < This.goalY) {
					This.y = This.goalY;
					This.speedY = 0;
					This.movingY = false;
				}
				This.gridY = Math.floor(This.y);
			}
			else {
				This.gridY = This.y = Math.round(This.y);
			}
			This.gridY = Int(This.gridY);
		}
		else {
			This.goalY = This.gridY;
		}

		if (This.movingAngle) {
			if (This.speedAngle > 0) {
				This.angle += This.speedAngle * ammount;
				if (This.angle > This.goalAngle) {
					This.angle = This.goalAngle;
					This.speedAngle = 0;
					This.movingAngle = false;
				}
			}
			else if (This.speedAngle < 0) {
				This.angle += This.speedAngle * ammount;
				if (This.angle < This.goalAngle) {
					This.angle = This.goalAngle;
					This.speedAngle = 0;
					This.movingAngle = false;
				}
			}
		}
		else {
			This.goalAngle = This.angle;
		}

		This.Translate.setTranslate(This.x, This.y);
		This.Rotate.setRotate(This.angle, 0, 0);
		This.getTarget();
	}

	function applyGravity(This, interval) {
		if (!This.inUse || This.dropping) {
			return;
		}
		This.y += interval * This.gravity;
		This.gridY = Int(Math.ceil(This.y));
		if (This.y > This.goalY) {
			This.goalY = This.gridY;
			This.speedY = 0;
			This.movingY = false;
		}
	}
	function checkCollision(This, ofsX, ofsY) {
		if (!This.inUse) {
			return false;
		}
		for (var x = 0; x < This.size; x++) {
			for (var y = 0; y < This.size; y++) {
				if (!This.Grid[x][y]) {
					continue;
				}
				var xO = x + ofsX + This.gridX;
				var yO = y + ofsY + This.gridY;
				if (xO < 0) {
					return true;
				}
				if (xO >= This.PlayArea.width) {
					return true;
				}
				if (yO >= This.PlayArea.height) {
					return true;
				}
				if (This.PlayArea.Grid[xO][yO]) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 
	 * @param {Piece} This
	 * @returns {undefined}
	 */
	function activate(This) {
		if (This.inUse) {
			return;
		}
		This.inUse = true;
		This.y = This.gridY = -8;
		This.goalY = 0;
		This.x = This.gridX = This.goalX = Math.round((This.PlayArea.width - This.size) / 2);
		This.SpriteOffset.setTranslate(This.spriteOfs, This.spriteOfs);
		This.movingY = true;
		calculateSpeed(This);
	}

	function calculateSpeed(This) {
		if (This.movingX)
			This.speedX = (This.goalX - This.x) / 0.05;
		if (This.movingY)
			This.speedY = (This.goalY - This.y) / 0.075;
		if (This.movingAngle)
			This.speedAngle = (This.goalAngle - This.angle) / 0.1;
	}


	Piece.prototype.update = function(interval) {
		applyGravity(this, interval);
		moveToGoal(this, interval);

		if (this.inUse) {
			var done = false;
			while (checkCollision(this, 0, 0)){
				this.goalY = this.y = this.gridY -= 1;				
				this.movingY = false;
				done = true;
			}
			if (done || (this.dropping && !this.movingY)) {
				this.PlayArea.fix(this);
				return;
			}
		}
		else {
			if (this.queueNumber < 0 && !this.movingY) {
				this.PlayArea.put(this);
				activate(this);
			}
		}
	};

	Piece.types = [
		{
			width: 2,
			use: 'RedRect',
			grid: [
				[true, true],
				[true, true]
			]
		},
		{
			width: 4,
			use: 'CyanRect',
			grid: [
				[false, false, false, false],
				[true, true, true, true],
				[false, false, false, false],
				[false, false, false, false]
			]
		},
		{
			width: 3,
			use: 'GrayRect',
			grid: [
				[false, true, false],
				[true, true, true],
				[false, false, false]
			]
		},
		{
			width: 3,
			use: 'GreenRect',
			grid: [
				[true, false, false],
				[true, true, true],
				[false, false, false]
			]
		},
		{
			width: 3,
			use: 'MagentaRect',
			grid: [
				[false, false, true],
				[true, true, true],
				[false, false, false]
			]
		},
		{
			width: 3,
			use: 'BlueRect',
			grid: [
				[false, true, true],
				[true, true, false],
				[false, false, false]
			]
		},
		{
			width: 3,
			use: 'YellowRect',
			grid: [
				[true, true, false],
				[false, true, true],
				[false, false, false]
			]
		}
	];
})();
