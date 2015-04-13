/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var PlayArea;
(function () {
	PlayArea = function (area, border, windowObj, background) {
		this.Area = area;
		this.Border = border;
		this.SvgRoot = area.ownerDocument.documentElement;
		this.windowObj = windowObj;
		this.background = background;
		var This = this;

		this.resize = function () {
			var windowRatio = This.windowObj.innerWidth / This.windowObj.innerHeight;
			if (windowRatio > This.screenRatio) {
				var virtwidth = This.screenHeight * windowRatio;
				This.ratio = This.screenHeight / This.windowObj.innerHeight;
				This.xOfs = (virtwidth - This.screenWidth) / -2;
				This.yOfs = 0;
			}
			else {
				var virtheight = (This.screenWidth / windowRatio);
				This.ratio = This.screenWidth / This.windowObj.innerWidth;
				This.xOfs = 0;
				This.yOfs = (virtheight - This.screenHeight) / -2;
			}

			if (This.background) {

				var bgw = This.background.getAttribute('width');
				var bgh = This.background.getAttribute('height');
				var bgRatio = bgw / bgh;
				var bgscale, bgy, bgx;

				bgx = 0;
				bgy = 0;
				if (bgRatio > windowRatio) {
					bgscale = (This.windowObj.innerHeight / bgh) * This.ratio;
					bgy = ((This.windowObj.innerHeight * This.ratio) - This.screenHeight) / -2;
					bgx = ((bgw * bgscale) - This.screenWidth) / -2;
				}
				else {
					bgscale = (This.windowObj.innerWidth / bgw) * This.ratio;
					bgx = ((This.windowObj.innerWidth * This.ratio) - This.screenWidth) / -2;
					bgy = ((bgh * bgscale) - This.screenHeight) / -2;
				}



				var tr = 'translate(' + bgx + ' ' + bgy + ') scale(' + bgscale + ')';

				This.background.setAttribute('transform', tr);
				This.background.setAttribute('x', 0);
				This.background.setAttribute('y', 0);
			}
		};
		this.windowObj.addEventListener('resize', this.resize);
		this.topScores = unserializeScores(localStorage['Top.Scores']);
	};
	PlayArea.prototype.setup = function (width, height) {
		this.width = Int(width);
		this.gameHeight = Int(height);
		this.height = this.gameHeight + 4;

		this.Grid = Array(this.width);
		for (var x = 0; x < this.width; x++) {
			this.Grid[x] = Array(this.height + 4);
		}

		this.screenWidth = this.width + 2;
		this.screenHeight = this.height + 2;
		this.screenRatio = this.screenWidth / this.screenHeight;


		this.Border.setAttribute('width', this.width + 1);
		this.Border.setAttribute('height', this.height + 1);
		this.SvgRoot.setAttribute('viewBox', '0 0 ' + (this.screenWidth) + ' ' + (this.screenHeight));

		this.speedIncrease = 4 / (this.width * this.height);

		this.resize();
	};

	PlayArea.prototype.reset = function () {
		this.Area.innerHTML = '';
		this.score = 0;
		this.pieceCount = 0;
		this.lineCount = 0;
		this.time = 0;
		Piece.prototype.gravity = 1;
		for (var i = 0; i < this.Grid.length; i++) {
			for (var j = 0; j < this.Grid[i].length; j++) {
				this.Grid[i][j] = null;
			}
		}
		this.Piece = this.Queue.next();
		this.gameOver = false;
	};
	PlayArea.prototype.updateCounters = function () {
		if (this.Speedometer) {
			this.Speedometer.textContent = Math.round(Piece.prototype.gravity * 100) + '%';
		}
		if (this.ScoreCounter) {
			this.ScoreCounter.textContent = Math.round(this.score);
		}
		if (this.PieceCounter) {
			this.PieceCounter.textContent = this.pieceCount;
		}
		if (this.LineCounter) {
			this.LineCounter.textContent = this.lineCount;
		}

		if (this.TimeCounter) {
			var t = this.time;
			var sec = t % 60;
			t = (t - sec) / 60;
			var min = t % 60;
			t = (t - min) / 60;
			var hour = t;

			if (min < 10) {
				min = '0' + min;
			}
			sec = Math.round(sec * 100) / 100;
			if (sec < 10) {
				sec = '0' + sec;
			}
			else {
				sec = '' + sec;
			}

			if (sec.length < 3) {
				sec += '.';
			}
			while (sec.length < 5) {
				sec += '0';
			}

			this.TimeCounter.textContent = hour + ':' + min + ':' + sec;
		}

	};

	PlayArea.prototype.Area = null;
	PlayArea.prototype.Grid = null;
	PlayArea.prototype.width = 0;
	PlayArea.prototype.height = 0;
	PlayArea.prototype.lineCount = 0;
	PlayArea.prototype.pieceCount = 0;
	PlayArea.prototype.score = 0;
	PlayArea.prototype.time = 0;
	PlayArea.prototype.put = function (piece) {
		this.Piece = piece;
		this.Area.appendChild(piece.node);
	};
	PlayArea.prototype.update = function (interval) {
		if (this.Piece) {
			this.Piece.update(interval);
		}

		if (!this.gameOver) {
			this.time += interval;
		}
		this.updateCounters();
	}

	PlayArea.prototype.fix = function (This) {
		if (!This.node.parentNode) {
			return;
		}
		This.node.parentNode.removeChild(This.node);
		var gameOver = false;
		for (var x = 0; x < This.size; x++) {
			for (var y = 0; y < This.size; y++) {
				var xOfs = This.gridX + x;
				var yOfs = This.gridY + y;
				var block = This.Grid[x][y];
				if (block) {
					if (yOfs < 4) {
						gameOver = true;
					}
					this.score += ((yOfs - 3 + this.gameHeight) / this.gameHeight) * 2.5 * Piece.prototype.gravity;
					this.Grid[xOfs][yOfs] = block;
					this.Area.appendChild(block);
					block.Translate.setTranslate(This.gridX + x, This.gridY + y);
				}
			}
		}


		if (gameOver) {
			this.Piece = null;
			this.gameOver = true;

			this.topScores.push({time: Date.now(), value: this.score});
			orderScores(this.topScores);

			localStorage['Top.Scores'] = serializeScores(this.topScores);

			alert('Game Over!');
			this.reset();
		}
		else {
			this.clearLines();
			this.Piece = this.Queue.next();
		}
		Piece.prototype.gravity += this.speedIncrease;

		this.pieceCount++;
	};

	PlayArea.prototype.setTarget = function (idx, x, y) {
		//console.log (x,y);
		if (!this.TargetArea) {
			return;
		}
		if (!this.TargetBlocks) {
			this.TargetBlocks = Array(idx);
		}

		while (this.TargetBlocks.length <= idx) {
			this.TargetBlocks.push(null);
		}

		var bl = this.TargetBlocks[idx];
		if (!bl || bl === null) {
			console.log('created');
			bl = this.TargetBlocks[idx] = document.createElementNS(NS_SVG, 'use');
			bl.setAttributeNS(NS_XLINK, 'href', '#TargetRect');
			bl.Translate = bl.ownerDocument.documentElement.createSVGTransform();
			bl.transform.baseVal.appendItem(bl.Translate);
			this.TargetArea.appendChild(bl);
		}

		bl.Translate.setTranslate(x, y);

	};

	/**
	 * Clears the completed lines
	 * @returns {Number} Ammount of lines removed
	 */
	PlayArea.prototype.clearLines = function () {
		var count = 0;
		var x, y;
		var addscore = 0;
		for (y = 0; y < this.height; y++) {
			var lineFull = true;
			for (x = 0; x < this.width; x++) {
				if (!this.Grid[x][y]) {
					lineFull = false;
					break;
				}
			}
			if (lineFull) {
				count++;
				for (x = 0; x < this.width; x++) {
					this.Area.removeChild(this.Grid[x][y]);
					this.Grid[x][y] = null;
					var y2;
					for (var y2 = y; y2 > 0; y2--) {
						this.Grid[x][y2] = this.Grid[x][y2 - 1];
					}
					this.Grid[x][0] = null;
				}
				addscore += ((y - 3 + this.gameHeight) / this.gameHeight) * (5 * this.width) * Piece.prototype.gravity;
			}
		}

		if (count > 0) {
			for (x = 0; x < this.width; x++) {
				for (y = 0; y < this.height; y++) {
					if (this.Grid[x][y]) {
						this.Grid[x][y].Translate.setTranslate(x, y);
					}
				}
			}

			this.lineCount += count;

			this.score += addscore * ((1 + count) / 2);
		}

		return count;
	};

	/**
	 * 
	 * @param {String} value
	 * @returns {Array}
	 */
	function unserializeScores(value) {
		var out = [];
		try {
			value = value.split('\n');
			for (var i = 0; i < value.length; i++) {
				var data = value[i].split('\t');
				out.push({time: parseInt(data[0]), value: parseFloat(data[1])});
			}
		} catch (ex) {
		}
		return out;
	}

	/**
	 * 
	 * @param {Array} scores
	 * @returns {String}
	 */
	function serializeScores(scores) {
		var out = '';
		try {
			for (var i = 0; i < scores.length; i++) {
				if (i) {
					out += '\n';
				}
				out += scores[i].time + '\t' + scores[i].value;
			}
		} catch (ex) {
		}
		return out;
	}

	function orderScores(scores) {
		var reorder = false;
		do {
			reorder = false;
			for (var i = 1; i < scores.length; i++) {
				if (scores[i - 1].value < scores[i].value) {
					var aux = scores[i - 1];
					scores[i - 1] = scores[i];
					scores[i] = aux;
					reorder = true;
				}
			}
			console.log('reordering');
		} while (reorder);
		return scores;
	}
})();

