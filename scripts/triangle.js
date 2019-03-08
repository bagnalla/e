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
