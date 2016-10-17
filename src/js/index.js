import 'core-js';
import { vec3, mat4 } from 'gl-matrix';

import Shader from './shader';
import Program from './program';

function getContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

function loadShaders(gl) {
  const shaders = [
    new Shader(gl, document.getElementById('vertex-shader').textContent, gl.VERTEX_SHADER),
    new Shader(gl, document.getElementById('fragment-shader').textContent, gl.FRAGMENT_SHADER),
  ];
  return new Program(gl, shaders);
}

function loadTriangle(gl, program) {
  const triangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

  const vertices = [
     0.0,  0.8,  0.0,
    -0.8, -0.8,  0.0,
     0.8, -0.8,  0.0,
  ];

  gl.enableVertexAttribArray(program.attrib('vert'));
  gl.vertexAttribPointer(program.attrib('vert'), 3, gl.FLOAT, false, 0, 0);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // glBindBuffer(GL_ARRAY_BUFFER, 0);
  // glBindVertexArray(0);

  return triangleVertexPositionBuffer;
}

function render(gl, program, buff) {
  // gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  // // clear everything
  gl.clearColor(0, 0, 0, 1); // black
  gl.clear(gl.COLOR_BUFFER_BIT/* | gl.DEPTH_BUFFER_BIT*/);

  // // bind the program (the shaders)
  gl.useProgram(program.object);

  // // bind the VAO (the triangle)
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);

  // // draw the VAO
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // requestAnimationFrame(render.bind(null, gl, program, buff));
}

function start() {
  const canvas = document.getElementById('glcanvas');

  const gl = window.gl = getContext(canvas);

  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }

  const program = loadShaders(gl);
  const buff = loadTriangle(gl, program);

  render(gl, program, buff);
}

window.addEventListener('load', start);
