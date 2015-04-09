/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Svg = document.documentElement;
var playArea = document.getElementById('PlayArea');
var playAreaBorder = document.getElementById('PlayAreaBorder');
var P = new PlayArea(playArea, playAreaBorder, window, document.getElementById('BackGround'));
P.setup(12, 24);
var Q = new PieceQueue(P, document.getElementById('Queue'), document.getElementById('QueueBorder'), 10);
P.reset();
//P.Piece = Q.next();
var last = Date.now();

P.PieceCounter = document.createTextNode('');
document.getElementById('PieceCount').appendChild(P.PieceCounter);
P.LineCounter = document.createTextNode('');
document.getElementById('LineCount').appendChild(P.LineCounter);
P.ScoreCounter = document.createTextNode('');
document.getElementById('ScoreBoard').appendChild(P.ScoreCounter);
P.TimeCounter = document.createTextNode('');
document.getElementById('TimeCounter').appendChild(P.TimeCounter);
P.Speedometer = document.createTextNode('');
//document.getElementById('Speedometer').appendChild(P.Speedometer);
P.TargetArea = document.getElementById('TargetArea');

var Paused = false;

setInterval(function() {
	var cur = Date.now();
	var diff = (cur - last) / 1000;
	last = cur;
	if (!Paused) {
		P.update(diff);
		Q.update(diff);
	}
}, 1000 / 60);

function Pause() {
	if (P.gameOver) {
		return;
	}
	Paused = true;
	document.getElementById('GameScreen').style.opacity = 0;
	document.getElementById('PauseScreen').style.opacity = 1;
}
function UnPause() {
	if (P.gameOver) {
		return;
	}
	Paused = false;
	document.getElementById('GameScreen').style.opacity = 1;
	document.getElementById('PauseScreen').style.opacity = 0;
}

window.addEventListener(Events.blur, function() {
	Pause();
});

window.addEventListener(Events.mousedown, function(event) {
	switch (event.button) {
		case 0:
			P.Piece.rotateCw();
			break;
		case 1:
			P.Piece.drop();
			break;
		case 2:
			P.Piece.rotateCcw();
			break;
		default:
			alert(event.button);
	}
	event.preventDefault();
});
window.addEventListener(Events.click, function(event) {
	event.preventDefault();
});


window.addEventListener(Events.mouseup, function(event) {
	event.preventDefault();
});
window.addEventListener(Events.click, function(event) {
	event.preventDefault();
});

window.addEventListener(Events.contextmenu, function(event) {
	event.preventDefault();
});
window.addEventListener(Events.drag, function(event) {
	event.preventDefault();
});
window.addEventListener(Events.keydown, function(event) {
	switch (event.keyCode) {
		case 37:
		case 65:
			P.Piece.moveTo(P.Piece.goalX - 1);
			break;
		case 39:
		case 68:
			P.Piece.moveTo(P.Piece.goalX + 1);
			break;
		case 38:
		case 87:
			P.Piece.rotate180();
			break;
		case 40:
		case 83:
			P.Piece.fall();
			break;
		case 32:
			P.Piece.drop();
			break;
		case 81:
		case 17:
			P.Piece.rotateCw();
			break;
		case 69:
		case 96:
		case 45:
			P.Piece.rotateCcw();
			break;
		case 19:
		case 27:
			if (Paused) {
				UnPause();
			}
			else {
				Pause();
			}
			break;
		default: alert(event.keyCode);
	}
	event.preventDefault();
});

window.addEventListener(Events.mousemove, function(event) {
	var xpos = (event.pageX * P.ratio) + P.xOfs;
	P.Piece.moveTo(Math.round(xpos - (P.Piece.size / 2)) - 1);
});


window.addEventListener(Events.mousewheel, function(event) {
	var delta = event.wheelDelta || -event.detail;

	if (delta < 0) {
		P.Piece.fall();
	}
	else {
		P.Piece.rotate180();
	}

	event.preventDefault();
});

localStorage['Version'] = '100000';