import glm, { vec2, vec3, vec4, mat4 } from 'glm-js';

import Holder from './holder';

export default class Program extends Holder {
  constructor(gl, shaders)  {
    if (!gl) throw Error('No GL context provided');
    if (!shaders || shaders.length === 0) {
      throw Error('No shaders were provided to create the program');
    }

    super(gl, gl.createProgram());
    this.shaders = shaders;

    for (const shader of shaders) {
      gl.attachShader(this.object, shader.object);
    }

    gl.linkProgram(this.object);

    // TODO: why detach?
    // for (const shader of shaders) {
    //   gl.detachShader(this.object, shader.object);
    // }

    if (!gl.getProgramParameter(this.object, gl.LINK_STATUS)) {
      throw Error('Could not initialise shaders');
    }
  }

  use() {
    this.gl.useProgram(this.object);
  }

  stopUsing() {
    this.gl.useProgram(null);
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

  setUniform(name, value) {
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return this.gl.uniform1i(this.uniform(name), value);
      } else {
        return this.gl.uniform1f(this.uniform(name), value);
      }
    } else switch (value.constructor) {
      case vec2: return this.gl.uniform2fv(this.uniform(name), false, value.elements);
      case vec3: return this.gl.uniform3fv(this.uniform(name), false, value.elements);
      case vec4: return this.gl.uniform4fv(this.uniform(name), false, value.elements);
      case mat4: return this.gl.uniformMatrix4fv(this.uniform(name), false, value.elements);
      default: throw Error('Unrecognized type');
    }
  }
}
