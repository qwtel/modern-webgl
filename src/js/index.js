import 'core-js';

import { vec3, mat4 } from 'gl-matrix';

import { sizeof } from './common';
import Shader from './shader';
import Program from './program';
import Texture from './texture';

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

function loadTexture(gl) {
  const image = document.getElementById('texture');
  //image.flipVertically();
  return new Texture(gl, image);
}

function loadTriangle(gl, program) {
  const buff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);

  const vertices = [
     0.0, 0.8, 0.0,   0.5, 1.0,
    -0.8,-0.8, 0.0,   0.0, 0.0,
     0.8,-0.8, 0.0,   1.0, 0.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(program.attrib('vert'));
  gl.vertexAttribPointer(
    program.attrib('vert'),
    3,
    gl.FLOAT,
    false,
    5 * sizeof(gl, gl.FLOAT),
    null
  );

  gl.enableVertexAttribArray(program.attrib('vertTexCoord'));
  gl.vertexAttribPointer(
    program.attrib('vertTexCoord'),
    2,
    gl.FLOAT,
    true,
    5 * sizeof(gl, gl.FLOAT),
    3 * sizeof(gl, gl.FLOAT)
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buff;
}

function render(gl, program, texture, buff) {
  // // clear everything
  gl.clearColor(0, 0, 0, 1); // black
  gl.clear(gl.COLOR_BUFFER_BIT/* | gl.DEPTH_BUFFER_BIT*/);

  // // bind the program (the shaders)
  program.use();

  // bind the texture and set the "tex" uniform in the fragment shader
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture.object);
  gl.uniform1i(program.uniform('tex'), 0); // set to 0 because the texture is bound to GL_TEXTURE0

  // // bind
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);

  // // draw the VAO
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // unbind the program, the buffer and the texture
  program.stopUsing();
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  // requestAnimationFrame(render.bind(null, gl, program, buff));
}

function start() {
  const canvas = document.getElementById('canvas');

  const gl = window.gl = getContext(canvas);

  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }

  const program = loadShaders(gl);
  const texture = loadTexture(gl);
  const buffer = loadTriangle(gl, program);

  // gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  render(gl, program, texture, buffer);
}

window.addEventListener('load', start);
