import 'core-js';

import GLMAT from 'gl-matrix';
import glm, { vec3, mat4 } from 'glm-js';

import { sizeof } from './common';
import Shader from './shader';
import Program from './program';
import Texture from './texture';

window.vec3 = vec3;
window.mat4 = mat4;
// console.log('glm-js version: ', glm.version);
// console.log('glm.vec3 example: ', vec3(1,2,3));

// glm.lookAt returns a quat for no reason
function lookAt(eye, target, up) {
  return new glm.mat4(GLMAT.mat4.lookAt(
    new Float32Array(16),
    eye.elements, target.elements, up.elements
  ));
}

function getContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

function loadShaders(gl) {
  const shaders = [
    new Shader(gl, document.getElementById('vertex-shader').textContent, gl.VERTEX_SHADER),
    new Shader(gl, document.getElementById('fragment-shader').textContent, gl.FRAGMENT_SHADER),
  ];
  const program = new Program(gl, shaders);

  program.use();

  // //set the "projection" uniform in the vertex shader, because it's not going to change
  const projection = glm.perspective(glm.radians(50), 800 / 600, 0.1, 10);
  gl.uniformMatrix4fv(program.uniform('projection'), false, projection.elements);

  //set the "camera" uniform in the vertex shader, because it's also not going to change
  const camera = lookAt(vec3(3,3,3), vec3(0,0,0), vec3(0,1,0));
  gl.uniformMatrix4fv(program.uniform('camera'), false, camera.elements);

  program.stopUsing();

  return program;
}

function loadTexture(gl) {
  const image = document.getElementById('texture');
  //image.flipVertically();
  return new Texture(gl, image);
}

function loadCube(gl, program) {
  const buff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);

  const vertices = [
    // X     Y     Z      U    V
    -1.0, -1.0, -1.0,   0.0, 0.0, // bottom
     1.0, -1.0, -1.0,   1.0, 0.0,
    -1.0, -1.0,  1.0,   0.0, 1.0,
     1.0, -1.0, -1.0,   1.0, 0.0,
     1.0, -1.0,  1.0,   1.0, 1.0,
    -1.0, -1.0,  1.0,   0.0, 1.0,

    -1.0,  1.0, -1.0,   0.0, 0.0, // top
    -1.0,  1.0,  1.0,   0.0, 1.0,
     1.0,  1.0, -1.0,   1.0, 0.0,
     1.0,  1.0, -1.0,   1.0, 0.0,
    -1.0,  1.0,  1.0,   0.0, 1.0,
     1.0,  1.0,  1.0,   1.0, 1.0,

    -1.0, -1.0,  1.0,   1.0, 0.0, // front
     1.0, -1.0,  1.0,   0.0, 0.0,
    -1.0,  1.0,  1.0,   1.0, 1.0,
     1.0, -1.0,  1.0,   0.0, 0.0,
     1.0,  1.0,  1.0,   0.0, 1.0,
    -1.0,  1.0,  1.0,   1.0, 1.0,

    -1.0, -1.0, -1.0,   0.0, 0.0, // back
    -1.0,  1.0, -1.0,   0.0, 1.0,
     1.0, -1.0, -1.0,   1.0, 0.0,
     1.0, -1.0, -1.0,   1.0, 0.0,
    -1.0,  1.0, -1.0,   0.0, 1.0,
     1.0,  1.0, -1.0,   1.0, 1.0,

    -1.0, -1.0,  1.0,   0.0, 1.0, // left
    -1.0,  1.0, -1.0,   1.0, 0.0,
    -1.0, -1.0, -1.0,   0.0, 0.0,
    -1.0, -1.0,  1.0,   0.0, 1.0,
    -1.0,  1.0,  1.0,   1.0, 1.0,
    -1.0,  1.0, -1.0,   1.0, 0.0,

     1.0, -1.0,  1.0,   1.0, 1.0, // right
     1.0, -1.0, -1.0,   1.0, 0.0,
     1.0,  1.0, -1.0,   0.0, 0.0,
     1.0, -1.0,  1.0,   1.0, 1.0,
     1.0,  1.0, -1.0,   0.0, 0.0,
     1.0,  1.0,  1.0,   0.0, 1.0,
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

const DEG_PER_SECOND = 180;
let degreesRotated = 0;
let lastTime = 0;

function update(gl, time) {
  const diff = time - lastTime;
  lastTime = time;

  degreesRotated += diff * (DEG_PER_SECOND / 1000);
  while (degreesRotated > 360) degreesRotated -= 360;
}

function render(gl, program, texture, buff) {
  // // clear everything
  gl.clearColor(0, 0, 0, 1); // black
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // // bind the program (the shaders)
  program.use();

  // set the "model" uniform in the vertex shader, based on the gDegreesRotated global
  const model = glm.rotate(mat4(), glm.radians(degreesRotated), vec3(0,1,0));
  gl.uniformMatrix4fv(program.uniform('model'), false, model.elements);

  // bind the texture and set the "tex" uniform in the fragment shader
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture.object);
  gl.uniform1i(program.uniform('tex'), 0); // set to 0 because the texture is bound to GL_TEXTURE0

  // // bind
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);

  // // draw the VAO
  gl.drawArrays(gl.TRIANGLES, 0, 6*2*3);

  // unbind the program, the buffer and the texture
  program.stopUsing();
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function start() {
  const canvas = document.getElementById('canvas');

  const gl = window.gl = getContext(canvas);

  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const program = loadShaders(gl);
  const texture = loadTexture(gl);
  const buffer = loadCube(gl, program);

  const loop = (time = 0) => {
    update(gl, time);
    render(gl, program, texture, buffer);
    requestAnimationFrame(loop);
  }

  loop();
}

window.addEventListener('load', start);
