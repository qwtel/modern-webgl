const object = Symbol('object');

export default class Program {
  constructor(gl, shaders)  {
    if (!gl) throw Error('No GL context provided');
    if (!shaders || shaders.length === 0) {
      throw Error('No shaders were provided to create the program');
    }

    this.gl = gl;
    this[object] = gl.createProgram();

    for (const shader of shaders) {
      gl.attachShader(this.object, shader.object);
    }

    gl.linkProgram(this.object);

    for (const shader of shaders) {
      gl.detachShader(this.object, shader.object);
    }

    if (!gl.getProgramParameter(this.object, gl.LINK_STATUS)) {
      throw Error('Could not initialise shaders');
    }
  }

  get object() {
    return this[object];
  }

  attrib(attribName) {
    const attrib =  this.gl.getAttribLocation(this.object, attribName);
    if (attrib == -1) throw Error(`Program attribute not found: ${attribName}`);
    return attrib;
  }

  uniform(uniformName) {
    const uniform = this.gl.getUniformLocation(this.object, uniformName);
    if (uniform == -1) throw Error(`Program uniform not found: ${uniformName}`);
    return uniform;
  }
}
