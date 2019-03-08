(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./puddi/puddi.js":3,"./puddi/puddiobject.js":4,"./square.js":5,"./triangle.js":6,"victor":2}],2:[function(require,module,exports){
exports = module.exports = Victor;

/**
 * # Victor - A JavaScript 2D vector class with methods for common vector operations
 */

/**
 * Constructor. Will also work without the `new` keyword
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = Victor(42, 1337);
 *
 * @param {Number} x Value of the x axis
 * @param {Number} y Value of the y axis
 * @return {Victor}
 * @api public
 */
function Victor (x, y) {
	if (!(this instanceof Victor)) {
		return new Victor(x, y);
	}

	/**
	 * The X axis
	 *
	 * ### Examples:
	 *     var vec = new Victor.fromArray(42, 21);
	 *
	 *     vec.x;
	 *     // => 42
	 *
	 * @api public
	 */
	this.x = x || 0;

	/**
	 * The Y axis
	 *
	 * ### Examples:
	 *     var vec = new Victor.fromArray(42, 21);
	 *
	 *     vec.y;
	 *     // => 21
	 *
	 * @api public
	 */
	this.y = y || 0;
};

/**
 * # Static
 */

/**
 * Creates a new instance from an array
 *
 * ### Examples:
 *     var vec = Victor.fromArray([42, 21]);
 *
 *     vec.toString();
 *     // => x:42, y:21
 *
 * @name Victor.fromArray
 * @param {Array} array Array with the x and y values at index 0 and 1 respectively
 * @return {Victor} The new instance
 * @api public
 */
Victor.fromArray = function (arr) {
	return new Victor(arr[0] || 0, arr[1] || 0);
};

/**
 * Creates a new instance from an object
 *
 * ### Examples:
 *     var vec = Victor.fromObject({ x: 42, y: 21 });
 *
 *     vec.toString();
 *     // => x:42, y:21
 *
 * @name Victor.fromObject
 * @param {Object} obj Object with the values for x and y
 * @return {Victor} The new instance
 * @api public
 */
Victor.fromObject = function (obj) {
	return new Victor(obj.x || 0, obj.y || 0);
};

/**
 * # Manipulation
 *
 * These functions are chainable.
 */

/**
 * Adds another vector's X axis to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.addX(vec2);
 *     vec1.toString();
 *     // => x:30, y:10
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addX = function (vec) {
	this.x += vec.x;
	return this;
};

/**
 * Adds another vector's Y axis to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.addY(vec2);
 *     vec1.toString();
 *     // => x:10, y:40
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addY = function (vec) {
	this.y += vec.y;
	return this;
};

/**
 * Adds another vector to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.add(vec2);
 *     vec1.toString();
 *     // => x:30, y:40
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.add = function (vec) {
	this.x += vec.x;
	this.y += vec.y;
	return this;
};

/**
 * Adds the given scalar to both vector axis
 *
 * ### Examples:
 *     var vec = new Victor(1, 2);
 *
 *     vec.addScalar(2);
 *     vec.toString();
 *     // => x: 3, y: 4
 *
 * @param {Number} scalar The scalar to add
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addScalar = function (scalar) {
	this.x += scalar;
	this.y += scalar;
	return this;
};

/**
 * Adds the given scalar to the X axis
 *
 * ### Examples:
 *     var vec = new Victor(1, 2);
 *
 *     vec.addScalarX(2);
 *     vec.toString();
 *     // => x: 3, y: 2
 *
 * @param {Number} scalar The scalar to add
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addScalarX = function (scalar) {
	this.x += scalar;
	return this;
};

/**
 * Adds the given scalar to the Y axis
 *
 * ### Examples:
 *     var vec = new Victor(1, 2);
 *
 *     vec.addScalarY(2);
 *     vec.toString();
 *     // => x: 1, y: 4
 *
 * @param {Number} scalar The scalar to add
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addScalarY = function (scalar) {
	this.y += scalar;
	return this;
};

/**
 * Subtracts the X axis of another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtractX(vec2);
 *     vec1.toString();
 *     // => x:80, y:50
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractX = function (vec) {
	this.x -= vec.x;
	return this;
};

/**
 * Subtracts the Y axis of another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtractY(vec2);
 *     vec1.toString();
 *     // => x:100, y:20
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractY = function (vec) {
	this.y -= vec.y;
	return this;
};

/**
 * Subtracts another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtract(vec2);
 *     vec1.toString();
 *     // => x:80, y:20
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtract = function (vec) {
	this.x -= vec.x;
	this.y -= vec.y;
	return this;
};

/**
 * Subtracts the given scalar from both axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 200);
 *
 *     vec.subtractScalar(20);
 *     vec.toString();
 *     // => x: 80, y: 180
 *
 * @param {Number} scalar The scalar to subtract
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractScalar = function (scalar) {
	this.x -= scalar;
	this.y -= scalar;
	return this;
};

/**
 * Subtracts the given scalar from the X axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 200);
 *
 *     vec.subtractScalarX(20);
 *     vec.toString();
 *     // => x: 80, y: 200
 *
 * @param {Number} scalar The scalar to subtract
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractScalarX = function (scalar) {
	this.x -= scalar;
	return this;
};

/**
 * Subtracts the given scalar from the Y axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 200);
 *
 *     vec.subtractScalarY(20);
 *     vec.toString();
 *     // => x: 100, y: 180
 *
 * @param {Number} scalar The scalar to subtract
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractScalarY = function (scalar) {
	this.y -= scalar;
	return this;
};

/**
 * Divides the X axis by the x component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 0);
 *
 *     vec.divideX(vec2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Victor} vector The other vector you want divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideX = function (vector) {
	this.x /= vector.x;
	return this;
};

/**
 * Divides the Y axis by the y component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(0, 2);
 *
 *     vec.divideY(vec2);
 *     vec.toString();
 *     // => x:100, y:25
 *
 * @param {Victor} vector The other vector you want divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideY = function (vector) {
	this.y /= vector.y;
	return this;
};

/**
 * Divides both vector axis by a axis values of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 2);
 *
 *     vec.divide(vec2);
 *     vec.toString();
 *     // => x:50, y:25
 *
 * @param {Victor} vector The vector to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divide = function (vector) {
	this.x /= vector.x;
	this.y /= vector.y;
	return this;
};

/**
 * Divides both vector axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.divideScalar(2);
 *     vec.toString();
 *     // => x:50, y:25
 *
 * @param {Number} The scalar to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideScalar = function (scalar) {
	if (scalar !== 0) {
		this.x /= scalar;
		this.y /= scalar;
	} else {
		this.x = 0;
		this.y = 0;
	}

	return this;
};

/**
 * Divides the X axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.divideScalarX(2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Number} The scalar to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideScalarX = function (scalar) {
	if (scalar !== 0) {
		this.x /= scalar;
	} else {
		this.x = 0;
	}
	return this;
};

/**
 * Divides the Y axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.divideScalarY(2);
 *     vec.toString();
 *     // => x:100, y:25
 *
 * @param {Number} The scalar to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideScalarY = function (scalar) {
	if (scalar !== 0) {
		this.y /= scalar;
	} else {
		this.y = 0;
	}
	return this;
};

/**
 * Inverts the X axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invertX();
 *     vec.toString();
 *     // => x:-100, y:50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invertX = function () {
	this.x *= -1;
	return this;
};

/**
 * Inverts the Y axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invertY();
 *     vec.toString();
 *     // => x:100, y:-50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invertY = function () {
	this.y *= -1;
	return this;
};

/**
 * Inverts both axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invert();
 *     vec.toString();
 *     // => x:-100, y:-50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invert = function () {
	this.invertX();
	this.invertY();
	return this;
};

/**
 * Multiplies the X axis by X component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 0);
 *
 *     vec.multiplyX(vec2);
 *     vec.toString();
 *     // => x:200, y:50
 *
 * @param {Victor} vector The vector to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyX = function (vector) {
	this.x *= vector.x;
	return this;
};

/**
 * Multiplies the Y axis by Y component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(0, 2);
 *
 *     vec.multiplyX(vec2);
 *     vec.toString();
 *     // => x:100, y:100
 *
 * @param {Victor} vector The vector to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyY = function (vector) {
	this.y *= vector.y;
	return this;
};

/**
 * Multiplies both vector axis by values from a given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 2);
 *
 *     vec.multiply(vec2);
 *     vec.toString();
 *     // => x:200, y:100
 *
 * @param {Victor} vector The vector to multiply by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiply = function (vector) {
	this.x *= vector.x;
	this.y *= vector.y;
	return this;
};

/**
 * Multiplies both vector axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.multiplyScalar(2);
 *     vec.toString();
 *     // => x:200, y:100
 *
 * @param {Number} The scalar to multiply by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyScalar = function (scalar) {
	this.x *= scalar;
	this.y *= scalar;
	return this;
};

/**
 * Multiplies the X axis by the given scalar
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.multiplyScalarX(2);
 *     vec.toString();
 *     // => x:200, y:50
 *
 * @param {Number} The scalar to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyScalarX = function (scalar) {
	this.x *= scalar;
	return this;
};

/**
 * Multiplies the Y axis by the given scalar
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.multiplyScalarY(2);
 *     vec.toString();
 *     // => x:100, y:100
 *
 * @param {Number} The scalar to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyScalarY = function (scalar) {
	this.y *= scalar;
	return this;
};

/**
 * Normalize
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.normalize = function () {
	var length = this.length();

	if (length === 0) {
		this.x = 1;
		this.y = 0;
	} else {
		this.divide(Victor(length, length));
	}
	return this;
};

Victor.prototype.norm = Victor.prototype.normalize;

/**
 * If the absolute vector axis is greater than `max`, multiplies the axis by `factor`
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.limit(80, 0.9);
 *     vec.toString();
 *     // => x:90, y:50
 *
 * @param {Number} max The maximum value for both x and y axis
 * @param {Number} factor Factor by which the axis are to be multiplied with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.limit = function (max, factor) {
	if (Math.abs(this.x) > max){ this.x *= factor; }
	if (Math.abs(this.y) > max){ this.y *= factor; }
	return this;
};

/**
 * Randomizes both vector axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomize(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:67, y:73
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomize = function (topLeft, bottomRight) {
	this.randomizeX(topLeft, bottomRight);
	this.randomizeY(topLeft, bottomRight);

	return this;
};

/**
 * Randomizes the y axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeX(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:55, y:50
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeX = function (topLeft, bottomRight) {
	var min = Math.min(topLeft.x, bottomRight.x);
	var max = Math.max(topLeft.x, bottomRight.x);
	this.x = random(min, max);
	return this;
};

/**
 * Randomizes the y axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeY(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:100, y:66
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeY = function (topLeft, bottomRight) {
	var min = Math.min(topLeft.y, bottomRight.y);
	var max = Math.max(topLeft.y, bottomRight.y);
	this.y = random(min, max);
	return this;
};

/**
 * Randomly randomizes either axis between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeAny(new Victor(50, 60), new Victor(70, 80));
 *     vec.toString();
 *     // => x:100, y:77
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeAny = function (topLeft, bottomRight) {
	if (!! Math.round(Math.random())) {
		this.randomizeX(topLeft, bottomRight);
	} else {
		this.randomizeY(topLeft, bottomRight);
	}
	return this;
};

/**
 * Rounds both axis to an integer value
 *
 * ### Examples:
 *     var vec = new Victor(100.2, 50.9);
 *
 *     vec.unfloat();
 *     vec.toString();
 *     // => x:100, y:51
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.unfloat = function () {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	return this;
};

/**
 * Rounds both axis to a certain precision
 *
 * ### Examples:
 *     var vec = new Victor(100.2, 50.9);
 *
 *     vec.unfloat();
 *     vec.toString();
 *     // => x:100, y:51
 *
 * @param {Number} Precision (default: 8)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.toFixed = function (precision) {
	if (typeof precision === 'undefined') { precision = 8; }
	this.x = this.x.toFixed(precision);
	this.y = this.y.toFixed(precision);
	return this;
};

/**
 * Performs a linear blend / interpolation of the X axis towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mixX(vec2, 0.5);
 *     vec.toString();
 *     // => x:150, y:100
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mixX = function (vec, amount) {
	if (typeof amount === 'undefined') {
		amount = 0.5;
	}

	this.x = (1 - amount) * this.x + amount * vec.x;
	return this;
};

/**
 * Performs a linear blend / interpolation of the Y axis towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mixY(vec2, 0.5);
 *     vec.toString();
 *     // => x:100, y:150
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mixY = function (vec, amount) {
	if (typeof amount === 'undefined') {
		amount = 0.5;
	}

	this.y = (1 - amount) * this.y + amount * vec.y;
	return this;
};

/**
 * Performs a linear blend / interpolation towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mix(vec2, 0.5);
 *     vec.toString();
 *     // => x:150, y:150
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mix = function (vec, amount) {
	this.mixX(vec, amount);
	this.mixY(vec, amount);
	return this;
};

/**
 * # Products
 */

/**
 * Creates a clone of this vector
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = vec1.clone();
 *
 *     vec2.toString();
 *     // => x:10, y:10
 *
 * @return {Victor} A clone of the vector
 * @api public
 */
Victor.prototype.clone = function () {
	return new Victor(this.x, this.y);
};

/**
 * Copies another vector's X component in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copyX(vec1);
 *
 *     vec2.toString();
 *     // => x:20, y:10
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copyX = function (vec) {
	this.x = vec.x;
	return this;
};

/**
 * Copies another vector's Y component in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copyY(vec1);
 *
 *     vec2.toString();
 *     // => x:10, y:20
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copyY = function (vec) {
	this.y = vec.y;
	return this;
};

/**
 * Copies another vector's X and Y components in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copy(vec1);
 *
 *     vec2.toString();
 *     // => x:20, y:20
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copy = function (vec) {
	this.copyX(vec);
	this.copyY(vec);
	return this;
};

/**
 * Sets the vector to zero (0,0)
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *		 var1.zero();
 *     vec1.toString();
 *     // => x:0, y:0
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.zero = function () {
	this.x = this.y = 0;
	return this;
};

/**
 * Calculates the dot product of this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.dot(vec2);
 *     // => 23000
 *
 * @param {Victor} vector The second vector
 * @return {Number} Dot product
 * @api public
 */
Victor.prototype.dot = function (vec2) {
	return this.x * vec2.x + this.y * vec2.y;
};

Victor.prototype.cross = function (vec2) {
	return (this.x * vec2.y ) - (this.y * vec2.x );
};

/**
 * Projects a vector onto another vector, setting itself to the result.
 *
 * ### Examples:
 *     var vec = new Victor(100, 0);
 *     var vec2 = new Victor(100, 100);
 *
 *     vec.projectOnto(vec2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Victor} vector The other vector you want to project this vector onto
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.projectOnto = function (vec2) {
    var coeff = ( (this.x * vec2.x)+(this.y * vec2.y) ) / ((vec2.x*vec2.x)+(vec2.y*vec2.y));
    this.x = coeff * vec2.x;
    this.y = coeff * vec2.y;
    return this;
};


Victor.prototype.horizontalAngle = function () {
	return Math.atan2(this.y, this.x);
};

Victor.prototype.horizontalAngleDeg = function () {
	return radian2degrees(this.horizontalAngle());
};

Victor.prototype.verticalAngle = function () {
	return Math.atan2(this.x, this.y);
};

Victor.prototype.verticalAngleDeg = function () {
	return radian2degrees(this.verticalAngle());
};

Victor.prototype.angle = Victor.prototype.horizontalAngle;
Victor.prototype.angleDeg = Victor.prototype.horizontalAngleDeg;
Victor.prototype.direction = Victor.prototype.horizontalAngle;

Victor.prototype.rotate = function (angle) {
	var nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
	var ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

	this.x = nx;
	this.y = ny;

	return this;
};

Victor.prototype.rotateDeg = function (angle) {
	angle = degrees2radian(angle);
	return this.rotate(angle);
};

Victor.prototype.rotateTo = function(rotation) {
	return this.rotate(rotation-this.angle());
};

Victor.prototype.rotateToDeg = function(rotation) {
	rotation = degrees2radian(rotation);
	return this.rotateTo(rotation);
};

Victor.prototype.rotateBy = function (rotation) {
	var angle = this.angle() + rotation;

	return this.rotate(angle);
};

Victor.prototype.rotateByDeg = function (rotation) {
	rotation = degrees2radian(rotation);
	return this.rotateBy(rotation);
};

/**
 * Calculates the distance of the X axis between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceX(vec2);
 *     // => -100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceX = function (vec) {
	return this.x - vec.x;
};

/**
 * Same as `distanceX()` but always returns an absolute number
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.absDistanceX(vec2);
 *     // => 100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Absolute distance
 * @api public
 */
Victor.prototype.absDistanceX = function (vec) {
	return Math.abs(this.distanceX(vec));
};

/**
 * Calculates the distance of the Y axis between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceY(vec2);
 *     // => -10
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceY = function (vec) {
	return this.y - vec.y;
};

/**
 * Same as `distanceY()` but always returns an absolute number
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceY(vec2);
 *     // => 10
 *
 * @param {Victor} vector The second vector
 * @return {Number} Absolute distance
 * @api public
 */
Victor.prototype.absDistanceY = function (vec) {
	return Math.abs(this.distanceY(vec));
};

/**
 * Calculates the euclidean distance between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distance(vec2);
 *     // => 100.4987562112089
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distance = function (vec) {
	return Math.sqrt(this.distanceSq(vec));
};

/**
 * Calculates the squared euclidean distance between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceSq(vec2);
 *     // => 10100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceSq = function (vec) {
	var dx = this.distanceX(vec),
		dy = this.distanceY(vec);

	return dx * dx + dy * dy;
};

/**
 * Calculates the length or magnitude of the vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.length();
 *     // => 111.80339887498948
 *
 * @return {Number} Length / Magnitude
 * @api public
 */
Victor.prototype.length = function () {
	return Math.sqrt(this.lengthSq());
};

/**
 * Squared length / magnitude
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.lengthSq();
 *     // => 12500
 *
 * @return {Number} Length / Magnitude
 * @api public
 */
Victor.prototype.lengthSq = function () {
	return this.x * this.x + this.y * this.y;
};

Victor.prototype.magnitude = Victor.prototype.length;

/**
 * Returns a true if vector is (0, 0)
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     vec.zero();
 *
 *     // => true
 *
 * @return {Boolean}
 * @api public
 */
Victor.prototype.isZero = function() {
	return this.x === 0 && this.y === 0;
};

/**
 * Returns a true if this vector is the same as another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(100, 50);
 *     vec1.isEqualTo(vec2);
 *
 *     // => true
 *
 * @return {Boolean}
 * @api public
 */
Victor.prototype.isEqualTo = function(vec2) {
	return this.x === vec2.x && this.y === vec2.y;
};

/**
 * # Utility Methods
 */

/**
 * Returns an string representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toString();
 *     // => x:10, y:20
 *
 * @return {String}
 * @api public
 */
Victor.prototype.toString = function () {
	return 'x:' + this.x + ', y:' + this.y;
};

/**
 * Returns an array representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toArray();
 *     // => [10, 20]
 *
 * @return {Array}
 * @api public
 */
Victor.prototype.toArray = function () {
	return [ this.x, this.y ];
};

/**
 * Returns an object representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toObject();
 *     // => { x: 10, y: 20 }
 *
 * @return {Object}
 * @api public
 */
Victor.prototype.toObject = function () {
	return { x: this.x, y: this.y };
};


var degrees = 180 / Math.PI;

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function radian2degrees (rad) {
	return rad * degrees;
}

function degrees2radian (deg) {
	return deg / degrees;
}

},{}],3:[function(require,module,exports){
// Puddi graphics runtime. Each instance of puddi is associated with a
// canvas element.

var Vector = require('victor');

var Puddi = function(canvas) {
    this._ctx = canvas.getContext('2d');
    this._objects = [];
    this._scale = 1.0;
    this._translate = new Vector(0.0, 0.0);
    this._state = {
	canvas: canvas,
	objects: [],
	scale: 1.0,
	translate: new Vector(0.0, 0.0),
	time: 0,
	stopCycle: 0,
	centered: false // scaling mode
    }
};

function update(tFrame, state) {
    // compute the time elapsed since the last update
    let time_elapsed = tFrame - state.time;

    // update the timestamp
    state.time = tFrame;

    // update all objects
    for (let o of state.objects) {
	o.update(time_elapsed);
    }
};

function centeredTranslate(state) {
    return new Vector(state.canvas.width / 2 +
		      state.translate.x * state.scale,
		      state.canvas.height / 2 +
		      state.translate.y * state.scale);
}

function getModTranslate(state) {
    if (state.centered) {
	return centeredTranslate(state);
    }
    else {
	return state.translate;
    }
}

function draw(ctx, state) {
    // clear canvas
    let scaleInv = 1 / state.scale;
    let modTranslate = getModTranslate(state);
    ctx.clearRect(-modTranslate.x * scaleInv,
		  -modTranslate.y * scaleInv,
		  ctx.canvas.width * scaleInv,
		  ctx.canvas.height * scaleInv);

    // draw all objects
    for (let o of state.objects) {
	if (o.draw) {
	    o.draw(ctx);
	}
    }
};

Puddi.prototype.run = function() {
    // initialize this._time to the current time
    this._state.time = performance.now();

    // Since "this" won't be bound to the puddi object when cycle is
    // called, introduce some of our member fields as locals to be
    // captured by the 'cycle' closure.
    
    let stop = this._stop;
    let ctx = this._ctx;
    let state = this._state;
    let cycle = function(tFrame) {
	// console.log(state.objects);

	// re-register for the next frame
	state.stopCycle = window.requestAnimationFrame(cycle);

	// update
	if (update(tFrame, state) < 0) {
	    stop();
	    return;
	}

	// draw
	draw(ctx, state);
    };

    // register the cycle function with the browser update loop
    this._state.stopCycle = window.requestAnimationFrame(cycle);
};

// deregister from the browser update loop
Puddi.prototype.stop = function() {
    window.cancelAnimationFrame(this._state.stopCycle);
};

// reregister with the browser update loop
Puddi.prototype.resume = function() {
    // this._stopCycle = window.requestAnimationFrame(this._cycle);
    this.run();
};

Puddi.prototype.addObject = function(o) {
    this._state.objects.push(o);
};

Puddi.prototype.removeObject = function(o) {
    for (let i = 0; i < this.state._objects.length; i++) {
	// use the object's provided equals method
	if (o.equals(this._state.objects[i])) {
	    this._state.objects.splice(i, 1);
	}
    }
};

Puddi.prototype.getCtx = function() { return this._ctx; };

Puddi.prototype.refresh = function() {
    this._state.canvas.width += 0; //  reset canvas transform
    let translate = getModTranslate(this._state);
    this._ctx.transform(this._state.scale, 0, 0, this._state.scale,
			translate.x, translate.y);

    // this._ctx.transform(this._state.scale, 0, 0, this._state.scale,
    // 			this._state.translate.x,
    // 			this._state.translate.y);

    // this._ctx.scale(this._state.scale, this._state.scale);
    // this._ctx.translate(this._state.translate.x * this._state.scale,
    // 			this._state.translate.y * this._state.scale);
};

Puddi.prototype.translate = function(t) {
    this._state.translate.x += t.x;
    this._state.translate.y += t.y;
    this.refresh();
};

Puddi.prototype.translateScaled = function(t) {
    this._state.translate.x += t.x * (1 / this._state.scale);
    this._state.translate.y += t.y * (1 / this._state.scale);
    this.refresh();
};

Puddi.prototype.scale = function(s) {
    this._state.scale *= s;
    this.refresh();
};

Puddi.prototype.scaleTranslated = function(s) {
    // let oldScale = this._state.scale;
    this._state.scale *= s;
    // this._state.translate.x *= 1 / s;
    // this._state.translate.y *= 1 / s;
    this.refresh();
};

Puddi.prototype.getScale = function() { return this._state.scale; };

Puddi.prototype.clearTransform = function() {
    this._state.scale = 1.0;
    this._state.translate = new Vector(0, 0);
    this.refresh();
}

Puddi.prototype.setCentered = function(b) { this._state.centered = b; };

Puddi.prototype.getTranslate = function() {
    return this._state.translate;
}

// EXPORT
module.exports = Puddi;

},{"victor":2}],4:[function(require,module,exports){
// Base puddi object class

var Puddi = require('./puddi.js');
var Vector = require('victor');

// Every object has a unique ID. Equality of objects is determined by
// their IDs.
var idCounter = 0;

// If parent is non-null, this object adds itself automatically as a
// child of the parent object.
var PuddiObject = function (puddi, parent) {
    this._puddi = puddi;
    this._id = idCounter++;
    this._position = new Vector(0, 0);
    this._rotation = 0.0;
    this._scale_x = 1.0
    this._scale_y = 1.0
    this._targetPosition = new Vector(0, 0);
    this._velocity = 0.0;
    this._children = []
    this._color = "black";
    
    if (parent) {
	parent.addChild(this);
    }
    else {
	puddi.addObject(this);
    }
};

PuddiObject.prototype.equals = function(o) {
    if (!o._id) { return false; }
    return this._id == o._id;
};

PuddiObject.prototype.getId = function() { return this._id; };
PuddiObject.prototype.getPosition = function() { return this._position; };
PuddiObject.prototype.getRotation = function() { return this._rotation; };
PuddiObject.prototype.getScaleX = function() { return this._scale_x; };
PuddiObject.prototype.getScaleT = function() { return this._scale_y; };
PuddiObject.prototype.getTargetPosition = function() {
    return this._targetPosition;
};
PuddiObject.prototype.getVelocity = function() { return this._velocity; };

PuddiObject.prototype.setPosition = function(p) { this._position = p; };
PuddiObject.prototype.setRotation = function(r) { this._rotation = r; };
PuddiObject.prototype.setScaleX = function(s) { this._scale_x = s; };
PuddiObject.prototype.setScaleY = function(s) { this._scale_y = s; };
PuddiObject.prototype.setScale = function(s) { this._scale_x = this._scale_y = s; };
PuddiObject.prototype.setTargetPosition = function(tp) {
    this._targetPosition = tp;
};
PuddiObject.prototype.setVelocity = function(v) {
    console.log('WARNING: setting object velocity to a negative value: ' + v);
    this._velocity = v;
};

PuddiObject.prototype.translate = function(v) {
    this.setPosition(this._position.add(v));
};
PuddiObject.prototype.rotate = function(r) { this._rotation += r; };
PuddiObject.prototype.scale = function(s) {
    this._scale_x *= s;
    this._scale_y *= s;
};

PuddiObject.prototype.addChild = function(o) { this._children.push(o); };
PuddiObject.prototype.removeChild = function(o) {
    for (let i = 0; i < this._children.length; i++) {
	if (o.equals(this._children[i])) {
	    this._children.splice(i, 1);
	}
    }
};
PuddiObject.prototype.removeChildAt = function(i) {
    this._children.splice(i, 1);
}
PuddiObject.prototype.clearChildren = function() {
    this._children = [];
}

PuddiObject.prototype.transform = function(ctx) {
    ctx.transform(this._scale_x, 0, 0, this._scale_y,
		  this._position.x, this._position.y);
    ctx.rotate(this._rotation);
};

// subclasses should override this for their update code
PuddiObject.prototype._updateSelf = function(time_elapsed) {}

PuddiObject.prototype.update = function(time_elapsed) {
    if (this._position.x != this._targetPosition.x ||
	this._position.y != this._targetPosition.y) {
	let v = this._velocity * time_elapsed;
	let displacement =
	    this._targetPosition.clone().subtract(this._position);
	if (displacement.length() <= v) {
	    this.setPosition(this._targetPosition.clone());
	}
	else {
	    this.translate(displacement.normalize().multiply(new Vector(v, v)));
	}
    }
    
    this._updateSelf(time_elapsed);

    for (let o of this._children) {
	o.update(time_elapsed);
    }
}

PuddiObject.prototype.delete = function() {
    for (let o of this._children) {
	o.delete();
    }
    this.puddi.removeObject(this);
}

PuddiObject.prototype.getColor = function() { return this._color; };
PuddiObject.prototype.setColor = function(c) { this._color = c; };

PuddiObject.prototype._drawSelf = function(ctx) {}

PuddiObject.prototype.draw = function(ctx) {
    ctx.save();
    this.transform(ctx);

    ctx.fillStyle = this._color;
    ctx.strokeStyle = this._color;

    // draw myself
    this._drawSelf(ctx);
    
    // draw children
    for (let o of this._children) {
	if (o.draw) {
	    o.draw(ctx);
	}
    }
    
    ctx.restore();
};

PuddiObject.prototype.setDraw = function(f) { this._drawSelf = f; }
PuddiObject.prototype.setUpdate = function(f) { this._updateSelf = f; }


// EXPORT
module.exports = PuddiObject;

},{"./puddi.js":3,"victor":2}],5:[function(require,module,exports){
var Puddi = require('./puddi/puddi.js');
var PuddiObject = require('./puddi/puddiobject.js');
var Vector = require('victor');

var Square = function(puddi, parent) {
    // Call superclass constructor.
    PuddiObject.call(this, puddi, parent);
    this._color = "green";
}

// Set up inheritance.
Square.prototype = Object.create(PuddiObject.prototype);
Square.prototype.constructor = Square;

Square.prototype._drawSelf = function(ctx) {
    ctx.fillStyle = this._color;
    ctx.fillRect(-1/2.0, -1/2.0, 1, 1);
    ctx.strokeStyle = '#666666';
    ctx.strokeRect(-1/2.0, -1/2.0, 1, 1);
}

module.exports = Square;

},{"./puddi/puddi.js":3,"./puddi/puddiobject.js":4,"victor":2}],6:[function(require,module,exports){
var Puddi = require('./puddi/puddi.js');
var PuddiObject = require('./puddi/puddiobject.js');
var Vector = require('victor');

var Triangle = function(puddi, parent) {
    // Call superclass constructor.
    PuddiObject.call(this, puddi, parent);
    this._color = "red";

    // Compute the points of an equilateral triangle with edge length
    // 1, so that the center of the triangle is at the origin (0, 0).
    let height = Math.sqrt(3/4);
    let y1 = 1 / Math.sqrt(3);
    let y2 = height - y1;
    this._p1 = new Vector(0, -y1);
    this._p2 = new Vector(-0.5, y2);
    this._p3 = new Vector(0.5, y2);
}

// Set up inheritance.
Triangle.prototype = Object.create(PuddiObject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype._drawSelf = function(ctx) {
    // Make triangle path.
    ctx.beginPath();
    ctx.moveTo(this._p1.x, this._p1.y);
    ctx.lineTo(this._p2.x, this._p2.y);
    ctx.lineTo(this._p3.x, this._p3.y);
    ctx.closePath();

    // Outline.
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = '#666666';
    ctx.stroke();

    // Fill.
    ctx.fillStyle = this._color;
    ctx.fill();
}

Triangle.prototype.getP1 = function() { return this._p1; }
Triangle.prototype.getP2 = function() { return this._p2; }
Triangle.prototype.getP3 = function() { return this._p3; }

module.exports = Triangle;

},{"./puddi/puddi.js":3,"./puddi/puddiobject.js":4,"victor":2}]},{},[1]);
