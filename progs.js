alert(123);

var TYPE_NUMBER = "number", TYPE_BOOLEAN = "boolean", TYPE_STRING = "string", TYPE_OBJECT = "object", TYPE_UNDEFINED = "undefined", TYPE_NAN = typeof NaN, NS_SVG = "http://www.w3.org/2000/svg", NS_XLINK = "http://www.w3.org/1999/xlink", INT_MAX = 1, INT_MIN = -1;
(function () {
	for (var c = 1, d = 1; 0 < c; )
		INT_MAX = c, c <<= 1, c |= 1, d <<= 1;
	INT_MIN = d
})();
function Int(c) {
	if (isNaN(c) || !1 === c || null === c)
		return 0;
	if (!0 === c)
		return 1;
	if (Infinity === c)
		return 0;
	type = typeof c;
	switch (type) {
		case TYPE_NUMBER:
			return c > INT_MAX ? INT_MAX : c < INT_MIN ? INT_MIN : c & c;
		case TYPE_STRING:
			return parseInt(c);
		case TYPE_OBJECT:
			return 1
	}
	return 0
}
function Float(c) {
	if (isNaN(c))
		return c;
	if (!1 === c || null === c)
		return 0;
	if (!0 === c)
		return 1;
	type = typeof c;
	switch (type) {
		case TYPE_NUMBER:
			return c;
		case TYPE_STRING:
			return parseFloat(c);
		case TYPE_OBJECT:
			return 1
	}
	return 0
}
function showAttrs(c) {
	console.log("SHOWATTRS");
	var d = [], b;
	for (b in c) {
		var e;
		try {
			e = typeof c[b]
		} catch (f) {
			e = "UNKNOWN"
		}
		var g = e + ":" + b;
		"number" == e && (g += ":" + c[b]);
		d.push(g)
	}
	d.sort();
	for (b = 0; b < d.length; b++)
		console.log(d[b])
}
;
var Piece;
(function () {
	function c(b, c, d) {
		if (!b.inUse)
			return!1;
		for (var g = 0; g < b.size; g++)
			for (var h = 0; h < b.size; h++)
				if (b.Grid[g][h]) {
					var k = g + c + b.gridX, l = h + d + b.gridY;
					if (0 > k || k >= b.PlayArea.width || l >= b.PlayArea.height || b.PlayArea.Grid[k][l])
						return!0
				}
		return!1
	}
	function d(b) {
		b.movingX && (b.speedX = (b.goalX - b.x) / 0.05);
		b.movingY && (b.speedY = (b.goalY - b.y) / 0.075);
		b.movingAngle && (b.speedAngle = (b.goalAngle - b.angle) / 0.1)
	}
	Piece = function (b, c) {
		this.node = document.createElementNS(NS_SVG, "g");
		this.root = this.node.ownerDocument.documentElement;
		this.Queue =
				b;
		this.Queue.Node.appendChild(this.node);
		this.PlayArea = b.Area;
		var d = Math.floor(Math.random() * Piece.types.length), g = Piece.types[d].grid;
		this.size = Piece.types[d].width;
		var h = this.spriteOfs = this.size / 2 - 0.5;
		this.Grid = Array(this.size);
		for (var k = 0; k < this.size; k++)
			this.Grid[k] = Array(this.size);
		for (k = 0; k < this.size; k++)
			for (var l = 0; l < this.size; l++)
				if (g[l][k]) {
					var m = document.createElementNS(NS_SVG, "use");
					m.setAttributeNS(NS_XLINK, "href", "#" + Piece.types[d].use);
					m.Translate = this.root.createSVGTransform();
					m.transform.baseVal.appendItem(m.Translate);
					m.Translate.setTranslate(k - h, l - h);
					this.node.appendChild(m);
					this.Grid[k][l] = m
				}
		this.SpriteOffset = this.root.createSVGTransform();
		this.node.transform.baseVal.appendItem(this.SpriteOffset);
		this.Translate = this.root.createSVGTransform();
		this.node.transform.baseVal.appendItem(this.Translate);
		this.Rotate = this.root.createSVGTransform();
		this.node.transform.baseVal.appendItem(this.Rotate);
		this.y = this.x = 0;
		(this.queueNumber = c) ? (this.y = this.goalY = 4 * this.queueNumber, this.Translate.setTranslate(0, this.y)) : this.queueNumber =
		0
	};
	Piece.prototype.inUse = !1;
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
	Piece.prototype.movingX = !1;
	Piece.prototype.movingY = !1;
	Piece.prototype.movingAngle = !1;
	Piece.prototype.gridX = 0;
	Piece.prototype.gridY = 0;
	Piece.prototype.gravity = 1;
	Piece.prototype.rotateCw = function () {
		if (this.inUse && !this.dropping) {
			do {
				for (var b =
						0, e = this.size - 1, f = e - b; b < e; ) {
					for (x = 0; x < f; x++) {
						var g = x + b, h = e - x, k = this.Grid[g][b];
						this.Grid[g][b] = this.Grid[e][g];
						this.Grid[e][g] = this.Grid[h][e];
						this.Grid[h][e] = this.Grid[b][h];
						this.Grid[b][h] = k
					}
					b++;
					e--;
					f = e - b
				}
				this.goalAngle -= 90
			} while (c(this, 0, 0));
			this.movingAngle = !0;
			d(this)
		}
	};
	Piece.prototype.rotateCcw = function () {
		if (this.inUse && !this.dropping) {
			do {
				for (var b = 0, e = this.size - 1, f = e - b; b < e; ) {
					for (x = 0; x < f; x++) {
						var g = x + b, h = e - x, k = this.Grid[g][b];
						this.Grid[g][b] = this.Grid[b][h];
						this.Grid[b][h] = this.Grid[h][e];
						this.Grid[h][e] =
								this.Grid[e][g];
						this.Grid[e][g] = k
					}
					b++;
					e--;
					f = e - b
				}
				this.goalAngle += 90
			} while (c(this, 0, 0));
			this.movingAngle = !0;
			d(this)
		}
	};
	Piece.prototype.rotate180 = function () {
		if (this.inUse && !this.dropping) {
			do {
				this.goalAngle += 180;
				var b = this.size - 1, e, f;
				b % 2 ? (e = -1, f = this.size / 2 - 1) : (e = b / 2, f = b / 2);
				for (y = 0; y <= f; y++) {
					var g = b - y;
					for (x = 0; x < this.size && (x !== y || x !== e); x++) {
						var h = b - x, k = this.Grid[x][y];
						this.Grid[x][y] = this.Grid[h][g];
						this.Grid[h][g] = k
					}
				}
			} while (c(this, 0, 0));
			this.movingAngle = !0;
			d(this)
		}
	};
	Piece.prototype.moveTo = function (b) {
		if (this.inUse &&
				!this.dropping) {
			var e;
			b = Int(b);
			if (b < this.gridX)
				e = -1;
			else if (b > this.gridX)
				e = 1;
			else
				return;
			this.goalX = this.gridX;
			for (var f = e; this.goalX !== b && !c(this, f, 0); )
				this.goalX += e, f += e;
			this.movingX = !0;
			d(this)
		}
	};
	Piece.prototype.fall = function () {
		!this.inUse || this.dropping || c(this, 0, this.goalY - this.gridY) || (this.goalY++, this.movingY = !0, d(this))
	};
	Piece.prototype.drop = function () {
		if (this.inUse && !this.dropping) {
			this.dropping = !0;
			var b;
			for (b = 1; !c(this, 0, b); b++)
				;
			this.goalY += b;
			this.movingY = !0;
			d(this)
		}
	};
	Piece.prototype.moveQueue =
			function () {
				this.inUse || (this.queueNumber--, this.goalY = 4 * this.queueNumber, this.movingY = !0, d(this))
			};
	Piece.prototype.log = function () {
		for (var b = 0; b < this.size; b++) {
			for (var c = "", d = 0; d < this.size; d++)
				c += this.Grid[d][b] ? "#" : "_";
			console.log("" + b + "" + c)
		}
	};
	Piece.prototype.update = function (b) {
		this.inUse && !this.dropping && (this.y += b * this.gravity, this.gridY = Int(Math.ceil(this.y)), this.y > this.goalY && (this.goalY = this.gridY, this.speedY = 0, this.movingY = !1));
		this.movingX ? (0 < this.speedX ? (this.x += this.speedX * b, this.x > this.goalX &&
				(this.x = this.goalX, this.speedX = 0, this.movingX = !1), this.gridX = Math.ceil(this.x)) : 0 > this.speedX ? (this.x += this.speedX * b, this.x < this.goalX && (this.x = this.goalX, this.speedX = 0, this.movingX = !1), this.gridX = Math.floor(this.x)) : this.gridX = this.x = Math.round(this.x), this.gridX = Int(this.gridX)) : this.goalX = this.gridX;
		this.movingY ? (0 < this.speedY ? (this.y += this.speedY * b, this.y > this.goalY && (this.y = this.goalY, this.speedY = 0, this.movingY = !1), this.gridY = Math.ceil(this.y)) : 0 > this.speedY ? (this.y += this.speedY * b, this.y < this.goalY &&
				(this.y = this.goalY, this.speedY = 0, this.movingY = !1), this.gridY = Math.floor(this.y)) : this.gridY = this.y = Math.round(this.y), this.gridY = Int(this.gridY)) : this.goalY = this.gridY;
		this.movingAngle ? 0 < this.speedAngle ? (this.angle += this.speedAngle * b, this.angle > this.goalAngle && (this.angle = this.goalAngle, this.speedAngle = 0, this.movingAngle = !1)) : 0 > this.speedAngle && (this.angle += this.speedAngle * b, this.angle < this.goalAngle && (this.angle = this.goalAngle, this.speedAngle = 0, this.movingAngle = !1)) : this.goalAngle = this.angle;
		this.Translate.setTranslate(this.x,
				this.y);
		this.Rotate.setRotate(this.angle, 0, 0);
		if (this.inUse) {
			for (b = !1; c(this, 0, 0); )
				this.goalY = this.y = this.gridY -= 1, this.movingY = !1, b = !0;
			b && this.PlayArea.fix(this)
		} else
			0 > this.queueNumber && !this.movingY && (this.PlayArea.put(this), this.inUse || (this.inUse = !0, this.y = this.gridY = -8, this.goalY = 0, this.x = this.gridX = this.goalX = Math.round((this.PlayArea.width - this.size) / 2), this.SpriteOffset.setTranslate(this.spriteOfs, this.spriteOfs), this.movingY = !0, d(this)))
	};
	Piece.prototype.update_old = function (b) {
		this.x += this.speedX *
				b;
		var c = this.speedX;
		if (0 < this.speedX && this.x > this.goalX || 0 > this.speedX && this.x < this.goalX)
			this.x = this.goalX, this.speedX = 0;
		this.gridX = 0 < c ? Math.floor(this.x) : 0 > c ? Math.ceil(this.x) : Math.round(this.x);
		this.hasYGoal && (this.y += this.speedY * b, 0 < this.speedY && this.y > this.goalY || 0 > this.speedY && this.y < this.goalY) && (!this.inUse && 0 > this.queueNumber ? (this.y = this.goalY + (this.goalY - this.y), this.goalY = -1 * (this.ofs - 0.5), 0 < this.y ? this.speedY = this.y = 0 : this.speedY *= -1, this.inUse = !0, this.goalX = this.x = Math.floor((this.playArea.width -
				this.width) / 2), this.playArea.put(this), this.hasYGoal = !0) : (this.y = this.goalY, this.speedY = 0, this.hasYGoal = !1));
		this.angle += this.speedAngle * b;
		if (0 < this.speedAngle && this.angle > this.goalAngle || 0 > this.speedAngle && this.angle < this.goalAngle) {
			this.angle = this.goalAngle % 360;
			for (this.speedAngle = 0; 0 > this.angle; )
				this.angle += 360;
			this.goalAngle = this.angle
		}
		if (this.inUse)
			for (this.y += this.gravity * b, this.gridY = Math.floor(this.y), b = 0; b < this.size; b++)
				for (c = 0; c < this.size; c++)
					if (this.grid[b][c] && (c > this.area.height + 4 || this.area.grid[b][c])) {
						this.fix();
						b = size;
						break
					}
		this.translate.setTranslate(this.x, this.y);
		this.rotate.setRotate(this.angle, 0, 0)
	};
	Piece.types = [{width: 2, use: "RedRect", grid: [[!0, !0], [!0, !0]]}, {width: 4, use: "CyanRect", grid: [[!1, !1, !1, !1], [!0, !0, !0, !0], [!1, !1, !1, !1], [!1, !1, !1, !1]]}, {width: 3, use: "GrayRect", grid: [[!1, !0, !1], [!0, !0, !0], [!1, !1, !1]]}, {width: 3, use: "GreenRect", grid: [[!0, !1, !1], [!0, !0, !0], [!1, !1, !1]]}, {width: 3, use: "MagentaRect", grid: [[!1, !1, !0], [!0, !0, !0], [!1, !1, !1]]}, {width: 3, use: "BlueRect", grid: [[!1, !0, !0], [!0, !0, !1], [!1, !1,
					!1]]}, {width: 3, use: "YellowRect", grid: [[!0, !0, !1], [!1, !0, !0], [!1, !1, !1]]}]
})();
var PieceQueue;
(function () {
	PieceQueue = function (c, d, b, e) {
		this.size = Int(e);
		this.Area = c;
		this.Area.Queue = this;
		this.Node = d;
		this.Rect = b;
		d = 4 * e + 1;
		this.Rect.setAttribute("height", d);
		c = c.Border.getAttribute("height");
		this.Rect.parentNode.setAttribute("transform", "scale(" + c / d + ")");
		this.Pieces = [];
		for (c = 0; c < e; c++)
			this.Pieces.push(new Piece(this, c))
	};
	PieceQueue.prototype.size = 0;
	PieceQueue.prototype.area = null;
	PieceQueue.prototype.node = null;
	PieceQueue.prototype.pieces = null;
	PieceQueue.prototype.next = function () {
		for (var c = this.Pieces[0],
				d = 0; d < this.size; d++)
			this.Pieces[d].moveQueue(), 0 < d && (this.Pieces[d - 1] = this.Pieces[d]);
		this.Pieces[this.size - 1] = new Piece(this, this.size);
		this.Pieces[this.size - 1].moveQueue();
		return c
	};
	PieceQueue.prototype.update = function (c) {
		for (var d = 0; d < this.size; d++)
			this.Pieces[d].update(c)
	}
})();
var PlayArea;
(function () {
	PlayArea = function (c, d, b, e) {
		this.Area = c;
		this.Border = d;
		this.SvgRoot = c.ownerDocument.documentElement;
		this.windowObj = b;
		this.background = e;
		var f = this;
		this.resize = function () {
			var b = f.windowObj.innerWidth / f.windowObj.innerHeight;
			if (b > f.screenRatio) {
				var c = f.screenHeight * b;
				f.ratio = f.screenHeight / f.windowObj.innerHeight;
				f.xOfs = (c - f.screenWidth) / -2;
				f.yOfs = 0
			} else
				c = f.screenWidth / b, f.ratio = f.screenWidth / f.windowObj.innerWidth, f.xOfs = 0, f.yOfs = (c - f.screenHeight) / -2;
			var c = f.background.getAttribute("width"), d =
					f.background.getAttribute("height");
			c / d > b ? (b = f.windowObj.innerHeight / d * f.ratio, d = (f.windowObj.innerHeight * f.ratio - f.screenHeight) / -2, c = (c * b - f.screenWidth) / -2) : (b = f.windowObj.innerWidth / c * f.ratio, c = (f.windowObj.innerWidth * f.ratio - f.screenWidth) / -2, d = (d * b - f.screenHeight) / -2);
			f.background.setAttribute("transform", "translate(" + c + " " + d + ") scale(" + b + ")");
			f.background.setAttribute("x", 0);
			f.background.setAttribute("y", 0)
		};
		this.windowObj.addEventListener("resize", this.resize)
	};
	PlayArea.prototype.setup = function (c,
			d) {
		this.width = Int(c);
		this.height = Int(d) + 4;
		this.Grid = Array(this.width);
		for (var b = 0; b < this.width; b++)
			this.Grid[b] = Array(this.height);
		this.screenWidth = this.width + 2;
		this.screenHeight = this.height + 2;
		this.screenRatio = this.screenWidth / this.screenHeight;
		this.Border.setAttribute("width", this.width + 1);
		this.Border.setAttribute("height", this.height + 1);
		this.SvgRoot.setAttribute("viewBox", "0 0 " + this.screenWidth + " " + this.screenHeight);
		this.resize()
	};
	PlayArea.prototype.Area = null;
	PlayArea.prototype.Grid = null;
	PlayArea.prototype.width =
			0;
	PlayArea.prototype.height = 0;
	PlayArea.prototype.lineCount = 0;
	PlayArea.prototype.pieceCount = 0;
	PlayArea.prototype.score = 0;
	PlayArea.prototype.put = function (c) {
		this.Piece = c;
		this.Area.appendChild(c.node)
	};
	PlayArea.prototype.update = function (c) {
		this.Piece && this.Piece.update(c)
	};
	PlayArea.prototype.fix = function (c) {
		if (c.node.parentNode) {
			c.node.parentNode.removeChild(c.node);
			for (var d = !1, b = 0; b < c.size; b++)
				for (var e = 0; e < c.size; e++) {
					var f = c.gridX + b, g = c.gridY + e, h = c.Grid[b][e];
					h && (4 > g && (d = !0), console.log("height: " +
							(g - 3)), this.score += (g - 3) / this.height * 25, this.Grid[f][g] = h, this.Area.appendChild(h), h.Translate.setTranslate(c.gridX + b, c.gridY + e))
				}
			console.log(Math.round(this.score));
			d ? (this.Piece = null, alert("Game Over!")) : (this.clearLines(), this.Piece = this.Queue.next())
		}
	};
	PlayArea.prototype.clearLines = function () {
		var c = 0, d, b;
		for (b = 0; b < this.height; b++) {
			var e = !0;
			for (d = 0; d < this.width; d++)
				if (!this.Grid[d][b]) {
					e = !1;
					break
				}
			if (e)
				for (c++, d = 0; d < this.width; d++) {
					this.Area.removeChild(this.Grid[d][b]);
					this.Grid[d][b] = null;
					for (e =
							b; 0 < e; e--)
						this.Grid[d][e] = this.Grid[d][e - 1];
					this.Grid[d][0] = null
				}
		}
		if (0 < c) {
			for (d = 0; d < this.width; d++)
				for (b = 0; b < this.height; b++)
					this.Grid[d][b] && this.Grid[d][b].Translate.setTranslate(d, b);
			this.lineCount += c;
			this.LineCounter && (this.LineCounter.textContent = this.lineCount)
		}
		this.pieceCount++;
		this.PieceCounter && (this.PieceCounter.textContent = this.pieceCount);
		return c
	}
})();
var Svg = document.documentElement, playArea = document.getElementById("PlayArea"), playAreaBorder = document.getElementById("PlayAreaBorder"), P = new PlayArea(playArea, playAreaBorder, window, document.getElementById("BackGround"));
P.setup(12, 24);
var Q = new PieceQueue(P, document.getElementById("Queue"), document.getElementById("QueueBorder"), 10);
P.Piece = Q.next();
var last = Date.now();
P.PieceCounter = document.createTextNode("");
document.getElementById("PieceCount").appendChild(P.PieceCounter);
P.LineCounter = document.createTextNode("");
document.getElementById("LineCount").appendChild(P.LineCounter);
setInterval(function () {
	var c = Date.now(), d = (c - last) / 1E3;
	last = c;
	P.update(d);
	Q.update(d)
}, 1E3 / 60);
var a = window.addEventListener("click", function (c) {
	switch (c.button) {
		case 0:
			P.Piece.rotateCw();
			break;
		case 1:
			P.Piece.drop();
			break;
		case 2:
			P.Piece.rotateCcw()
	}
	c.preventDefault()
});
window.addEventListener("mousewheel", function (c) {
	c.preventDefault()
});
window.addEventListener("DOMMouseScroll", function (c) {
	var d = c.wheelDelta || c.detail;
	0 > d && P.Piece.rotate180();
	0 < d && P.Piece.fall();
	c.preventDefault()
});
window.addEventListener("contextmenu", function (c) {
	c.preventDefault()
});
window.addEventListener("drag", function (c) {
	c.preventDefault()
});
window.addEventListener("keydown", function (c) {
	switch (c.keyCode) {
		case 37:
			P.Piece.moveTo(P.Piece.goalX - 1);
			break;
		case 39:
			P.Piece.moveTo(P.Piece.goalX + 1);
			break;
		case 38:
			P.Piece.rotate180();
			break;
		case 40:
			P.Piece.fall();
			break;
		case 32:
			P.Piece.drop();
			break;
		case 96:
		case 45:
		case 34:
			P.Piece.rotateCw();
			break;
		case 46:
		case 17:
			P.Piece.rotateCw();
			break;
		default:
			console.log(c.keyCode)
	}
	c.preventDefault()
});
window.addEventListener("mousemove", function (c) {
	P.Piece.moveTo(Math.round(c.pageX * P.ratio + P.xOfs - P.Piece.size / 2) - 1)
});
