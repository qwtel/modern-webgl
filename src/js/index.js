import 'core-js';
import 'webvr-polyfill';

import GLMAT from 'gl-matrix';
import glm, { vec3, mat3, mat4 } from 'glm-js';

import { sizeof, e2c } from './common';
import Shader from './shader';
import Program from './program';
import Texture from './texture';
import Camera from './camera';

// global.glm = glm;
// global.vec3 = vec3;
// global.mat4 = mat4;

let vrDisplay = null;
let frameData = null;

Object.assign(window.WebVRConfig, {
  DIRTY_SUBMIT_FRAME_BINDINGS: true,
  BUFFER_SCALE: 0.75,
});

global.InitializeWebVRPolyfill();

const DEG_PER_SECOND = 180;
const MOVE_SPEED = 4; //units per second
const MOUSE_SENSITIVITY = 0.1;
const TOUCH_SENSITIVITY = 1;
const ZOOM_SENSITIVITY = -0.2;

global.currentlyPressedKeys = new Map();
let canvas;
let camera;
let degreesRotated = 0;
let lastTime = 0;
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let touchDown = false;
let touchX = 0;
let touchY = 0;
let lastTouchX = 0;
let lastTouchY = 0;
let scrollY = 0;
let instances;
const light = {
  position: vec3(4, 4, -25).add(vec3(-4,0,4)),
  intensities: vec3(1,1,1),
  attenuation: 0.2,
  ambientCoefficient: 0.01,
};

// glm.lookAt returns a quat for some reason
function lookAt(eye, target, up) {
  return new glm.mat4(GLMAT.mat4.lookAt(
    new Float32Array(16),
    eye.elements, target.elements, up.elements
  ));
}

// glm.inverse not implemented for mat3 for some reason
function inverse(a) {
  return new glm.mat3(GLMAT.mat3.invert(
    new Float32Array(9),
    a.elements
  ));
}

// glm.transpose not implemented for mat3 for some reason
function transpose(a) {
  return new glm.mat3(GLMAT.mat3.transpose(
    new Float32Array(9),
    a.elements
  ));
}

// convenience function that returns a translation matrix
function translate(x, y, z) {
  return glm.translate(mat4(), vec3(x,y,z));
}

// convenience function that returns a scaling matrix
function scale(x, y, z) {
  return glm.scale(mat4(), vec3(x,y,z));
}

function getContext(canvas, config = {}) {
  return canvas.getContext('webgl', config) || canvas.getContext('experimental-webgl', config);
}

function loadShaders(vid, fid) {
  const shaders = [
    new Shader(gl, document.getElementById(vid).textContent, gl.VERTEX_SHADER),
    new Shader(gl, document.getElementById(fid).textContent, gl.FRAGMENT_SHADER),
  ];
  return new Program(gl, shaders);
}

function loadTexture() {
  const image = document.getElementById('texture');
  //image.flipVertically();
  return new Texture(gl, image);
}

function loadWoodenCrateAsset() {
  const asset = {
    program: loadShaders('vertex-shader', 'fragment-shader'),
    material: {
      tex: loadTexture(gl, 'texture'),
      shininess: 80,
      specularColor: vec3(1,1,1),
    },
    buffer: gl.createBuffer(),
    attribs: new Map([
      ['vert', [3, gl.FLOAT, false, 8 * sizeof(gl.FLOAT), 0]],
      ['vertTexCoord', [2, gl.FLOAT, true, 8 * sizeof(gl.FLOAT), 3 * sizeof(gl.FLOAT)]],
      ['vertNormal', [3, gl.FLOAT, true,  8 * sizeof(gl.FLOAT), 5 * sizeof(gl.FLOAT)]],
    ]),
    drawType: gl.TRIANGLES,
    drawStart: 0,
    drawCount: 6*2*3,
  };

  gl.enableVertexAttribArray(asset.program.attrib('vert'));
  gl.enableVertexAttribArray(asset.program.attrib('vertTexCoord'));
  gl.enableVertexAttribArray(asset.program.attrib('vertNormal'));

  gl.bindBuffer(gl.ARRAY_BUFFER, asset.buffer);

  const vertices = [
    // X     Y     Z      U    V        Normal
    -1.0, -1.0, -1.0,   0.0, 0.0,   0.0, -1.0, 0.0, // bottom
     1.0, -1.0, -1.0,   1.0, 0.0,   0.0, -1.0, 0.0,
    -1.0, -1.0,  1.0,   0.0, 1.0,   0.0, -1.0, 0.0,
     1.0, -1.0, -1.0,   1.0, 0.0,   0.0, -1.0, 0.0,
     1.0, -1.0,  1.0,   1.0, 1.0,   0.0, -1.0, 0.0,
    -1.0, -1.0,  1.0,   0.0, 1.0,   0.0, -1.0, 0.0,

    -1.0,  1.0, -1.0,   0.0, 0.0,   0.0, 1.0, 0.0, // top
    -1.0,  1.0,  1.0,   0.0, 1.0,   0.0, 1.0, 0.0,
     1.0,  1.0, -1.0,   1.0, 0.0,   0.0, 1.0, 0.0,
     1.0,  1.0, -1.0,   1.0, 0.0,   0.0, 1.0, 0.0,
    -1.0,  1.0,  1.0,   0.0, 1.0,   0.0, 1.0, 0.0,
     1.0,  1.0,  1.0,   1.0, 1.0,   0.0, 1.0, 0.0,

    -1.0, -1.0,  1.0,   1.0, 0.0,   0.0, 0.0, 1.0, // front
     1.0, -1.0,  1.0,   0.0, 0.0,   0.0, 0.0, 1.0,
    -1.0,  1.0,  1.0,   1.0, 1.0,   0.0, 0.0, 1.0,
     1.0, -1.0,  1.0,   0.0, 0.0,   0.0, 0.0, 1.0,
     1.0,  1.0,  1.0,   0.0, 1.0,   0.0, 0.0, 1.0,
    -1.0,  1.0,  1.0,   1.0, 1.0,   0.0, 0.0, 1.0,

    -1.0, -1.0, -1.0,   0.0, 0.0,   0.0, 0.0, -1.0, // back
    -1.0,  1.0, -1.0,   0.0, 1.0,   0.0, 0.0, -1.0,
     1.0, -1.0, -1.0,   1.0, 0.0,   0.0, 0.0, -1.0,
     1.0, -1.0, -1.0,   1.0, 0.0,   0.0, 0.0, -1.0,
    -1.0,  1.0, -1.0,   0.0, 1.0,   0.0, 0.0, -1.0,
     1.0,  1.0, -1.0,   1.0, 1.0,   0.0, 0.0, -1.0,

    -1.0, -1.0,  1.0,   0.0, 1.0,   -1.0, 0.0, 0.0, // left
    -1.0,  1.0, -1.0,   1.0, 0.0,   -1.0, 0.0, 0.0,
    -1.0, -1.0, -1.0,   0.0, 0.0,   -1.0, 0.0, 0.0,
    -1.0, -1.0,  1.0,   0.0, 1.0,   -1.0, 0.0, 0.0,
    -1.0,  1.0,  1.0,   1.0, 1.0,   -1.0, 0.0, 0.0,
    -1.0,  1.0, -1.0,   1.0, 0.0,   -1.0, 0.0, 0.0,

     1.0, -1.0,  1.0,   1.0, 1.0,   1.0, 0.0, 0.0, // right
     1.0, -1.0, -1.0,   1.0, 0.0,   1.0, 0.0, 0.0,
     1.0,  1.0, -1.0,   0.0, 0.0,   1.0, 0.0, 0.0,
     1.0, -1.0,  1.0,   1.0, 1.0,   1.0, 0.0, 0.0,
     1.0,  1.0, -1.0,   0.0, 0.0,   1.0, 0.0, 0.0,
     1.0,  1.0,  1.0,   0.0, 1.0,   1.0, 0.0, 0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return asset;
}

function createInstances(woodenCrate) {
  return [
    {
      asset: woodenCrate,
      transform: translate(4,4,-25),
    },
    // ModelInstance i;
    {
      asset: woodenCrate,
      transform: translate(4,0,-25).mul(scale(1,2,1)),
    },
    // ModelInstance hLeft;
    {
      asset: woodenCrate,
      transform: translate(-4,4,-25).mul(scale(1,6,1)),
    },
    // ModelInstance hRight;
    {
      asset: woodenCrate,
      transform: translate(0,4,-25).mul(scale(1,6,1)),
    },
    // ModelInstance hMid;
    {
      asset: woodenCrate,
      transform: translate(-2,4,-25).mul(scale(2,1,0.8)),
    },
    // floor
    {
      asset: woodenCrate,
      transform: translate(0,-4,0).mul(scale(50,1,50)),
    },
  ];
}

function update(time) {
  const diff = (time - lastTime) / 1000;
  lastTime = time;

  degreesRotated += diff * DEG_PER_SECOND;
  while (degreesRotated > 360) degreesRotated -= 360;
  instances[0].transform = glm.rotate(translate(4,4,-25), glm.radians(degreesRotated), vec3(0,1,0));

  if (currentlyPressedKeys.get('KeyS')) {
    camera.offsetPosition(camera.forward.mul(-diff * MOVE_SPEED));
  }
  if (currentlyPressedKeys.get('KeyW')) {
    camera.offsetPosition(camera.forward.mul(diff * MOVE_SPEED));
  }

  if (currentlyPressedKeys.get('KeyA')) {
    camera.offsetPosition(camera.right.mul(-diff * MOVE_SPEED));
  }
  if (currentlyPressedKeys.get('KeyD')) {
    camera.offsetPosition(camera.right.mul(diff * MOVE_SPEED));
  }

  if (currentlyPressedKeys.get('KeyZ') ||
     (currentlyPressedKeys.get('Space') && currentlyPressedKeys.get('ShiftLeft'))) {
    camera.offsetPosition(vec3(0,1,0).mul(-diff * MOVE_SPEED));
  }
  if (currentlyPressedKeys.get('KeyX') ||
     (currentlyPressedKeys.get('Space') && !currentlyPressedKeys.get('ShiftLeft'))) {
    camera.offsetPosition(vec3(0,1,0).mul(diff * MOVE_SPEED));
  }

  if (currentlyPressedKeys.get('Digit1')) {
    light.position = camera.position;
  }
  if (currentlyPressedKeys.get('Digit2')) {
    light.intensities = vec3(1,0,0); // red
  }
  if (currentlyPressedKeys.get('Digit3')) {
    light.intensities = vec3(0,1,0); // green
  }
  if (currentlyPressedKeys.get('Digit4')) {
    light.intensities = vec3(0,0,1); // blue
  }
  if (currentlyPressedKeys.get('Digit5')) {
    light.intensities = vec3(1,1,1); // white
  }

  //rotate camera based on mouse movement
  if (mouseDown) {
    camera.offsetOrientation(
      MOUSE_SENSITIVITY * (lastMouseY - mouseY),
      MOUSE_SENSITIVITY * (lastMouseX - mouseX)
    );
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }

  if (touchDown) {
    camera.rotatePosition(
      TOUCH_SENSITIVITY * (lastTouchY - touchY),
      TOUCH_SENSITIVITY * (lastTouchX - touchX)
    );
    lastTouchX = touchX;
    lastTouchY = touchY;
  }

  // //increase or decrease field of view based on mouse wheel
  if (scrollY) {
    let fieldOfView = camera.fieldOfView + ZOOM_SENSITIVITY * scrollY;
    if (fieldOfView < 5) fieldOfView = 5;
    if (fieldOfView > 130) fieldOfView = 130;
    camera.fieldOfView = fieldOfView;
    scrollY = 0;
  }
}

function renderInstance(projection, view, inst) {
  const { asset, transform } = inst;
  const { program, material, buffer, attribs } = asset;

  // bind the shaders
  program.use();

  // set the shader uniforms

  program.setUniform('camera', mat4(projection).mul(mat4(view)));
  program.setUniform('cameraPosition', camera.position);
  program.setUniform('model', transform);
  program.setUniform('normalMatrix', transpose(inverse(mat3(transform))));
  program.setUniform('material.tex', 0); //set to 0 because the texture will be bound to GL_TEXTURE0
  program.setUniform('material.shininess', material.shininess + 0.000000001); // FIXME
  program.setUniform('material.specularColor', material.specularColor);
  program.setUniform('light.position', light.position);
  program.setUniform('light.intensities', light.intensities);
  program.setUniform('light.attenuation', light.attenuation + 0.000000001); // FIXME
  program.setUniform('light.ambientCoefficient', light.ambientCoefficient + 0.000000001); // FIXME

  // bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, material.tex.object);

  // bind "VAO" and draw
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  for (const [name, args] of attribs) {
    gl.vertexAttribPointer(program.attrib(name), ...args);
  }
  gl.drawArrays(asset.drawType, asset.drawStart, asset.drawCount);

  //unbind everything
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  program.stopUsing();
}

function render(projection, view) {
  for (const instance of instances) {
    renderInstance(projection, view, instance);
  }
}

function bindEvents() {
  document.addEventListener('keydown', (e) => {
    currentlyPressedKeys.set(e2c(e), true);
  }, { passive: true });

  document.addEventListener('keyup', (e) => {
    currentlyPressedKeys.set(e2c(e), false);
  }, { passive: true });

  document.addEventListener('mousedown', (e) => {
    mouseDown = true;
    lastMouseX = mouseX = e.clientX;
    lastMouseY = mouseY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseup', (e) => {
    mouseDown = false;
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchDown = true;
    lastTouchX = touchX = e.touches[0].clientX;
    lastTouchY = touchY = e.touches[0].clientY;
  });

  document.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchDown = false;
  });

  document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!touchDown) return;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  });

  document.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollY = e.deltaY;
  });
}

// function startLoop() {
//   const loop = (time = 0) => {
//     update(time);
//     render();
//     requestAnimationFrame(loop);
//   };
//
//   loop();
// }

function onResize () {
  if (vrDisplay && vrDisplay.isPresenting) {
    // If we're presenting we want to use the drawing buffer size
    // recommended by the VRDevice, since that will ensure the best
    // results post-distortion.
    const leftEye = vrDisplay.getEyeParameters('left');
    const rightEye = vrDisplay.getEyeParameters('right');
    // For simplicity we're going to render both eyes at the same size,
    // even if one eye needs less resolution. You can render each eye at
    // the exact size it needs, but you'll need to adjust the viewports to
    // account for that.
    canvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
    canvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
  } else {
    // We only want to change the size of the canvas drawing buffer to
    // match the window dimensions when we're not presenting.
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  }
  camera.viewportAspectRatio = canvas.width / canvas.height;
}

function initGL() {
  canvas = document.getElementById('canvas');

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  global.gl = getContext(canvas, { antialias: true });

  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const woodenCrate = loadWoodenCrateAsset();
  instances = createInstances(woodenCrate);

  camera = new Camera();
  camera.position = vec3(0,0,0);
  camera.viewportAspectRatio = canvas.width / canvas.height;
  // camera.lookAt(vec3(4,0,-25));

  // bindEvents();
  window.requestAnimationFrame(onAnimationFrame);
}

function onVRRequestPresent () {
  document.getElementById('vr-btn').style.display = 'none';

  // This can only be called in response to a user gesture.
  vrDisplay.requestPresent([{ source: canvas }])
    .catch(e => console.error('requestPresent failed', e));
}

function onVRExitPresent () {
  // No sense in exiting presentation if we're not actually presenting.
  // (This may happen if we get an event like vrdisplaydeactivate when
  // we weren't presenting.)
  if (!vrDisplay.isPresenting)
    return;

  document.getElementById('vr-btn').style.display = '';

  vrDisplay.exitPresent()
    .catch(e => console.error('exitPresent failed', e));
}

function onVRPresentChange () {
  // When we begin or end presenting, the canvas should be resized to the
  // recommended dimensions for the display.
  onResize();
}

function initVR(displays) {
  if (displays.length > 0) {
    vrDisplay = displays[0];

    window.addEventListener('resize', onResize);
    onResize();

    // It's heighly reccommended that you set the near and far planes to
    // something appropriate for your scene so the projection matricies
    // WebVR produces have a well scaled depth buffer.
    vrDisplay.depthNear = 0.1;
    vrDisplay.depthFar = 100.0;

    // Generally, you want to wait until VR support is confirmed and
    // you know the user has a VRDisplay capable of presenting connected
    // before adding UI that advertises VR features.
    if (vrDisplay.capabilities.canPresent) {
      document.getElementById('vr-btn').addEventListener('click', onVRRequestPresent);
    }

    // The UA may kick us out of VR present mode for any reason, so to
    // ensure we always know when we begin/end presenting we need to
    // listen for vrdisplaypresentchange events.
    window.addEventListener('vrdisplaypresentchange', onVRPresentChange, false);

    // it would be appropariate to enter or exit VR presentation mode, such
    // as the user putting on a headset and triggering a proximity sensor.
    // You can inspect the `reason` property of the event to learn why the
    // event was fired, but in this case we're going to always trust the
    // event and enter or exit VR presentation mode when asked.
    window.addEventListener('vrdisplayactivate', onVRRequestPresent, false);
    window.addEventListener('vrdisplaydeactivate', onVRExitPresent, false);
  } else {
    console.error('WebVR supported, but no VRDisplays found.');
  }
}

function onAnimationFrame(t) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0, 0, 0, 1); // black
  gl.clearDepth(1);

  update(t);

  if (vrDisplay) {
    // When presenting content to the VRDisplay we want to update at its
    // refresh rate if it differs from the refresh rate of the main
    // display. Calling VRDisplay.requestAnimationFrame ensures we render
    // at the right speed for VR.
    vrDisplay.requestAnimationFrame(onAnimationFrame);

    // As a general rule you want to get the pose as late as possible
    // and call VRDisplay.submitFrame as early as possible after
    // retrieving the pose. Do any work for the frame that doesn't need
    // to know the pose earlier to ensure the lowest latency possible.
    //var pose = vrDisplay.getPose();
    vrDisplay.getFrameData(frameData);

    if (vrDisplay.isPresenting) {
      // When presenting render a stereo view.
      gl.viewport(0, 0, canvas.width * 0.5, canvas.height);
      render(frameData.leftProjectionMatrix, frameData.leftViewMatrix);

      gl.viewport(canvas.width * 0.5, 0, canvas.width * 0.5, canvas.height);
      render(frameData.rightProjectionMatrix, frameData.rightViewMatrix);

      // If we're currently presenting to the VRDisplay we need to
      // explicitly indicate we're done rendering.
      vrDisplay.submitFrame();
    } else {
      // When not presenting render a mono view that still takes pose into
      // account.
      gl.viewport(0, 0, canvas.width, canvas.height);
      // It's best to use our own projection matrix in this case, but we can use the left eye's view matrix
      render(camera.projection, frameData.leftViewMatrix);
    }
  } else {
    window.requestAnimationFrame(onAnimationFrame);
    // No VRDisplay found.
    gl.viewport(0, 0, canvas.width, canvas.height);
    render(camera.projection, camera.view);
  }
}

global.addEventListener('load', () => {
  frameData = new VRFrameData();
  navigator.getVRDisplays().then(initVR)
  initGL();
});
