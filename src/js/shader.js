import Holder from './holder';

export default class Shader extends Holder {
  static fromFile(gl, url, shaderType) {
    return fetch(url)
      .then(r => r.text())
      .then(shaderCode => new Shader(gl, shaderCode, shaderType));
  }

  constructor(gl, shaderCode, shaderType) {
    super(gl, gl.createShader(shaderType));
    gl.shaderSource(this.object, shaderCode);
    gl.compileShader(this.object);

    if (!gl.getShaderParameter(this.object, gl.COMPILE_STATUS)) {
      throw Error(gl.getShaderInfoLog(this.object));
    }
  }
}
