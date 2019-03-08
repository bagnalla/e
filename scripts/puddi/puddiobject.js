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
