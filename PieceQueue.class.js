/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var PieceQueue;
(function() {
	PieceQueue = function(area, node, rect, size) {
		this.size = Int(size);
		this.Area = area;
		this.Area.Queue = this;
		this.Node = node;
		this.Rect = rect;
		var h1 = (size * 4) + 1;
		this.Rect.setAttribute('height', h1);
		var h2 = area.Border.getAttribute('height');
		this.Rect.parentNode.setAttribute('transform', 'scale(' + (h2 / h1) + ')');
		this.Pieces = [];
		for (var i = 0; i < size; i++) {
			this.Pieces.push(new Piece(this, i));
		}
	}
	PieceQueue.prototype.size = 0;
	PieceQueue.prototype.area = null;
	PieceQueue.prototype.node = null;
	PieceQueue.prototype.pieces = null;

	PieceQueue.prototype.next = function() {

		var out = this.Pieces[0];
		for (var i = 0; i < this.size; i++) {
			
			this.Pieces[i].moveQueue();
			if (i > 0){
				this.Pieces[i-1] = this.Pieces[i];
			}
		}
		this.Pieces[this.size-1] = new Piece(this, this.size);
		this.Pieces[this.size-1].moveQueue();
		return out;
	};

	PieceQueue.prototype.update = function(interval) {
		for (var i = 0; i < this.size; i++) {
				this.Pieces[i].update(interval);
		}
	}
})();