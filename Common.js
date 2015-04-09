/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var TYPE_NUMBER = typeof 1.0;
var TYPE_BOOLEAN = typeof true;
var TYPE_STRING = typeof 'string';
var TYPE_OBJECT = typeof {};
var TYPE_UNDEFINED = typeof undefined;
var TYPE_NAN = typeof NaN;
var NS_SVG = 'http://www.w3.org/2000/svg';
var NS_XLINK = 'http://www.w3.org/1999/xlink';

var Events = {
	load: 'load',
	mousewheel: (navigator.userAgent.indexOf('Gecko/') >= 0) ? 'DOMMouseScroll' : 'mousewheel',
	contextmenu: 'contextmenu',
	drag: 'drag',
	keydown: 'keydown',
	mousemove: 'mousemove',
	mousedown: 'mousedown',
	mouseup: 'mouseup',
	click: 'click',
	blur: 'blur'
};

var INT_MAX = 1;
var INT_MIN = -1;
(function(){
	var next = 1;
	var bit = 1;
	while (next > 0){
		INT_MAX = next;
		next = next << 1;
		next = next | 0x1;
		bit = bit << 1;
	}
	INT_MIN = bit;
})();

function Int(value) {
	if (isNaN(value) || value === false || value === null) {
		return 0;
	}
	if (value === true) {
		return 1;
	}
	if (value === Infinity){
		return 0;
	}
	type = typeof (value);
	switch (type) {
		case TYPE_NUMBER:
			if (value > INT_MAX){
				return INT_MAX;
			}
			if (value < INT_MIN){
				return INT_MIN;
			}
			return value & value;
		case TYPE_STRING:
			return parseInt(value);
		case TYPE_OBJECT:
			return 1;
	}
	return 0;
}

function Float(value) {
	if (isNaN(value)) {
		return value;
	}
	if (value === false || value === null) {
		return 0;
	}
	if (value === true) {
		return 1;
	}
	type = typeof (value);
	switch (type) {
		case TYPE_NUMBER:
			return value ;
		case TYPE_STRING:
			return parseFloat(value);
		case TYPE_OBJECT:
			return 1;
	}
	return 0;
}

function showAttrs(obj) {
	console.log('SHOWATTRS');
	var attrs = [];
	for (var i in obj) {
		var type;
		try {
			type = typeof obj[i];
		}
		catch (ex) {
			type = 'UNKNOWN';
		}
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
