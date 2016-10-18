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
