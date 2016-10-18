const object = Symbol('object');

export default class Holder {
  constructor(gl, obj) {
    this.gl = gl;
    this[object] = obj;
  }

  get object() {
    return this[object];
  }
}

class Mix {}

Holder.mixin = (C = Mix) => class extends C {
  constructor(gl, obj) {
    super(gl, obj);
    this.gl = gl;
    this[object] = obj;
  }

  get object() {
    return this[object];
  }
}
