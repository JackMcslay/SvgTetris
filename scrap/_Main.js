var NS_SVG = 'http://www.w3.org/2000/svg';
var NS_XLINK = 'http://www.w3.org/1999/xlink';

var Lines = 20;
var Rows = 10;
var BlockSize = 64;
var Margin = 16;
var Padding = 16;

var PlayArea = document.getElementById('PlayArea');
var Svg = document.getElementById('Svg');
var MovingPieces = document.getElementById('MovingPieces');
var Screen = {};

function Piece() {
	this.sprite = document.createElementNS(NS_SVG, 'g');
	var type = Math.floor(Math.random() * Piece.types.length);
	var gr = Piece.types[type].grid;
	var w = Piece.types[type].width;
	var ofs = (w / -2) + 0.5;

	for (var x = 0; x < w; x++) {
		for (var y = 0; y < w; y++) {
			if (gr[y][x]){
				var bl = document.createElementNS(NS_SVG, 'use');
				bl.setAttributeNS(NS_XLINK,'href','#'+Piece.types[type].use);
				var tr = 'translate(' + ((x+ofs) * BlockSize) +',' + ((y+ofs) * BlockSize) + ') scale(1)';
				bl.setAttribute('transform',tr);
				this.sprite.appendChild(bl);
			}
		}
	}
}
Piece.prototype.sprite = null;
Piece.types = [
	{
		width: 2,
		use:'RedRect',
		grid: [
			[true, true],
			[true, true]
		]
	},
	{
		width: 4,
		use:'GreenRect',
		grid: [
			[false, false, false, false],
			[true, true, true, true],
			[false, false, false, false],
			[false, false, false, false]
		]
	},
	{
		width: 3,
		use:'BlueRect',
		grid: [
			[false, true, false],
			[true, true, true],
			[false, false, false]
		]
	},
	{
		width: 3,
		use:'YellowRect',
		grid: [
			[true, false, false],
			[true, true, true],
			[false, false, false]
		]
	},
	{
		width: 3,
		use:'CyanRect',
		grid: [
			[false, false, true],
			[true, true, true],
			[false, false, false]
		]
	},
	{
		width: 3,
		use:'MagentaRect',
		grid: [
			[false, true, true],
			[true, true, false],
			[false, false, false]
		]
	},
	{
		width: 3,
		use:'GrayRect',
		grid: [
			[true, true, false],
			[false, true, true],
			[false, false, false]
		]
	}
];

var p = new Piece();
document.getElementById('Next').appendChild(p.sprite);


var Grid;


function createGame() {

	Screen.width = (Rows * BlockSize) + (Padding * 2);
	Screen.height = (Lines * BlockSize) + (Padding * 2);
	Screen.baseOffset = Padding + Margin + (BlockSize / 2);


	PlayArea.setAttribute('width', Screen.width);
	PlayArea.setAttribute('height', Screen.height);
	PlayArea.setAttribute('x', Margin);
	PlayArea.setAttribute('y', Margin);

	Screen.width += Margin * 2;
	Screen.height += Margin * 2;
	Screen.ratio = Screen.width / Screen.height;

	Svg.setAttribute('viewBox', '0 0 ' + Screen.width + ' ' + Screen.height);
	MovingPieces.transform.baseVal[0].setTranslate(64,64);
}

createGame();

PlayArea.addEventListener('mousemove', function(event) {
	if (!this.lol) {
		this.lol = true;
	}

});


function showAttrs(obj) {
	console.log('SHOWATTRS');
	var attrs = [];
	for (var i in obj) {
		var type = typeof obj[i];
		var str = type + ':' + i;
		if (type == 'number')
			str += ':' + obj[i];
		attrs.push(str);
	}
	attrs.sort();
	for (var i = 0; i < attrs.length; i++) {
		console.log(attrs[i]);
	}
}

var piece = document.getElementById('Piece');
var Tr = piece.transform.baseVal[0];
var Rot = piece.transform.baseVal[1];

var prev = Date.now();
var Y = 0;
var X = 0;
var Angle = 0;
var goalX = 0;
var goalY = 0;
var goalAngle = 0;
var speedX = 0;
var speedY = 0;
var speedAngle = 0;
var posX = 0;
var posY = 0;

function calcSpeed() {
	speedX = (goalX - X) / 0.05;
	speedY = (goalY - Y) / 0.05;
	speedAngle = (goalAngle - Angle) / 0.1;
}

setInterval(function() {
	var cur = Date.now();
	var diff = (cur - prev) / 1000;
	prev = cur;

	X += speedX * diff;
	if ((speedX > 0 && X > goalX) || (speedX < 0 && X < goalX)) {
		X = goalX;
		speedX = 0;
	}

	Y += speedY * diff;
	if ((speedY > 0 && Y > goalY) || (speedY < 0 && Y < goalY)) {
		Y = goalY;
		speedY = 0;
	}

	Angle += speedAngle * diff;
	if ((speedAngle > 0 && Angle > goalAngle) || (speedAngle < 0 && Angle < goalAngle)) {
		Angle = goalAngle % 360;
		speedAngle = 0;

		while (Angle < 0) {
			Angle += 360;
		}
		goalAngle = Angle;
	}


	Tr.setTranslate(X, Y);
	try {
		Rot.setRotate(Angle, 0, 0);
	}
	catch (ex) {
		//console.log(typeof Angle+':'+Angle);
	}

}, 1000 / 60);
/*
 var attrs = [];
 for (var i in Date){
 
 attrs.push(typeof Date[i] + ':' + i);
 
 }
 attrs.sort();
 for (var i = 0; i < attrs.length; i++){
 console.log(attrs[i]);
 }*/
window.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 37:
			X -= 64;
			break;
		case 39:
			X += 64;
			break;
		default:
			//console.log(event.keyCode);
	}
});

var shown = false;
var Ratio;
var xOfs;
var yOfs;
window.addEventListener('mousemove', function(event) {

	goalX = xOfs + (event.pageX * Ratio);
	var idx = Math.round((Screen.baseOffset + goalX) / 64);
	if (idx < 0) {
		idx = 0;
	}
	else if (idx >= Rows) {
		idx = Rows - 1;
	}
	console.log(idx);

	goalX = ((idx) * 64) - Screen.baseOffset;
	calcSpeed();
});
window.addEventListener('mousedown', function(event) {
	switch (event.which) {
		case 1:
			goalAngle -= 90;
			calcSpeed();
			break;
		case 2:
			goalAngle += 180;
			calcSpeed();
			break;
		case 3:
			goalAngle += 90;
			calcSpeed();
			break;
	}

});

window.addEventListener('DOMMouseScroll', function(evt) {
	var delta = evt.detail ? evt.detail : evt.wheelDelta;
	if (delta > 0) {
		goalY += 64;
		calcSpeed();
	}

});
window.addEventListener('mousewheel', function(evt) {
	var delta = evt.detail ? evt.detail : evt.wheelDelta;
	if (delta > 0) {
		goalY += 64;
		calcSpeed();
	}

});


function adjustWindow() {
	var scrRatio = window.innerWidth / window.innerHeight;
	var diff = Screen.ratio / scrRatio;
	if (diff > 1) {
		Ratio = Screen.width / window.innerWidth;
		xOfs = 0;
		yOfs = ((Screen.height * Ratio) - Screen.height) / 2;
	}
	else {
		Ratio = Screen.height / window.innerHeight;
		xOfs = (Screen.width - (Screen.height * scrRatio)) / 2;
		yOfs = 0;
	}
}
adjustWindow();
window.addEventListener('resize', adjustWindow);
window.addEventListener('contextmenu', function(evt) {
	evt.preventDefault();
	return false;
});
window.addEventListener('click', function(evt) {
	evt.preventDefault();
	return false;
});

window.addEventListener('drag', function(evt) {
	evt.preventDefault();
	return false;
});
