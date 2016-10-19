const gls = Symbol('gl');
const objects = Symbol('object');

export default class Holder {
  constructor(gl, object) {
    this[gls] = gl;
    this[objects] = object;
  }

  get gl() {
    return this[gls];
  }

  get object() {
    return this[objects];
  }
}
