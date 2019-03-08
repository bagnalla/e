var Puddi = require('./puddi/puddi.js');
var PuddiObject = require('./puddi/puddiobject.js');
var Square = require('./square.js');
var Triangle = require('./triangle.js');
var Vector = require('victor');

// http://stackoverflow.com/a/4253415
String.prototype.escape = function() {
    return this.replace(/\n/g, "\\n")
        .replace(/\"/g, '\\"')
        .replace(/\t/g, "\\t")
};

var puddi = null;
// var triangle = null;
// var isDragging = false;

// Initialization.
function init() {
    // Set up puddi.
    let canvas = document.getElementById("canvas");
    puddi = new Puddi(canvas);

    // // Register some mouse event handlers
    // canvas.addEventListener('mousedown', function(evt) {
    // 	isDragging = true;
    // }, false);
    // $(window).mouseup(function() {
    // 	isDragging = false;
    // });
    // canvas.addEventListener('mousemove', function(evt) {
    // 	let pos = getMousePos(canvas, evt);
    // 	if (isDragging) {
    // 	    triangle.translate(new Vector(evt.movementX, evt.movementY));
    // 	}
    // }, false);
    // canvas.addEventListener('mousewheel', handleMouseWheel, false);
    // canvas.addEventListener('DOMMouseScroll', handleMouseWheel, false);

    let size = 100;

    let container = new PuddiObject(puddi, null);
    // container.setPosition(new Vector(canvas.width/2.0 + size/4,
    // 				     canvas.height/2.0 + size/4));
    container.setPosition(new Vector(canvas.width/2.0,
				     canvas.height/2.0));

    let sq = new Square(puddi, container)
    sq.setScaleX(size/5);
    sq.setScaleY(size);

    sq = new Square(puddi, container)
    sq.setScaleX(size);
    sq.setScaleY(size/5);

    let time_counter = 0.0;
    let rad_per_s = 3.0;
    let scale_speed = 3.0;
    container.setUpdate(function(ms_elapsed) {
    	let s_elapsed = ms_elapsed / 1000;
    	this.rotate(rad_per_s * s_elapsed);
	this.setScale(Math.max(0, Math.sin(scale_speed * time_counter)));
	time_counter += s_elapsed;
    })

    // Start the update/draw loop.
    puddi.run();
}

// compute mouse pos relative to canvas given event object
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var MOVE_AMT = 10;

function moveLeft(evt) {
    if (evt) { evt.preventDefault(); }
    triangle.translate(new Vector(-MOVE_AMT, 0));
}

function moveUp(evt) {
    if (evt) { evt.preventDefault(); }
    triangle.translate(new Vector(0, -MOVE_AMT));
}

function moveRight(evt) {
    if (evt) { evt.preventDefault(); }
    triangle.translate(new Vector(MOVE_AMT, 0));
}

function moveDown(evt) {
    if (evt) { evt.preventDefault(); }
    triangle.translate(new Vector(0, MOVE_AMT));
}

function handleMouseWheel(e) {
    var delta = e.wheelDelta || -e.detail;
    if (delta < 0) {
	triangle.scale(0.9);
    }
    else {
	triangle.scale(1.1);
    }
}

var X_MARGIN = 50;
var Y_MARGIN = 50;

function rescale() {
    screen_width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
    screen_height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
    console.log("width: " + screen_width + ", height: " + screen_height);

    let w = screen_width - X_MARGIN;
    let h = screen_height - Y_MARGIN; // vertical space available

    let canvas = document.getElementById("canvas");
    canvas.width = w
    canvas.height = h
}

window.addEventListener('resize', function(event) {
    rescale();
    puddi.refresh();
});

$(document).ready(function() {
    rescale();
    init();
    puddi.refresh();
});

document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
    case 37: // left
    case 65: // a
	moveLeft(e);
	break;
    case 38: // up
    case 87: // w
	moveUp(e);
	break;
    case 39: // right
    case 68: // d
	moveRight(e);
	break;
    case 40: // down
    case 83: // s
	moveDown(e);
	break;
    default:
    }
});
