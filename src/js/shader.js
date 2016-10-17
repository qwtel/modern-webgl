const object = Symbol('object');

export default class Shader {
  static fromFile(gl, url, shaderType) {
    return fetch(url)
      .then(r => r.text())
      .then(shaderCode => new Shader(gl, shaderCode, shaderType));
  }

  constructor(gl, shaderCode, shaderType) {
    this.gl = gl;
    this[object] = gl.createShader(shaderType);
    gl.shaderSource(this.object, shaderCode);
    gl.compileShader(this.object);

    if (!gl.getShaderParameter(this.object, gl.COMPILE_STATUS)) {
      throw Error(gl.getShaderInfoLog(this.object));
    }
  }

  get object() {
    return this[object];
  }
}
