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