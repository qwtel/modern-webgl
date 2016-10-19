import glm, { vec3, vec4, mat4 } from 'glm-js';

const MAX_VERTICAL_ANGLE = 85; //must be less than 90 to avoid gimbal lock

function fmod(a, b) {
  return Number(a - (Math.floor(a / b) * b));
}

export default class Camera {
  constructor() {
    this.position = vec3(0, 0, 1);
    this.horizontalAngle = 0;
    this.verticalAngle = 0;
    this.fieldOfView = 50;
    this.nearPlane = 0.01;
    this.farPlane = 100;
    this.viewportAspectRatio = 800/600;
  }

  get forward() {
    const forward = glm.inverse(this.orientation).mul(vec4(0,0,-1,1));
    return vec3(forward);
  }

  get right() {
    const right = glm.inverse(this.orientation).mul(vec4(1,0,0,1));
    return vec3(right);
  }

  get up() {
    const up = glm.inverse(this.orientation).mul(vec4(0,1,0,1));
    return vec3(up);
  }

  get orientation() {
    let orientation = mat4();
    orientation = glm.rotate(orientation, glm.radians(this.verticalAngle), vec3(1,0,0));
    orientation = glm.rotate(orientation, glm.radians(this.horizontalAngle), vec3(0,1,0));
    return orientation;
  }

  get matrix() {
    return this.projection.mul(this.view);
  }

  get projection() {
    const fov = glm.radians(this.fieldOfView);
    return glm.perspective(fov, this.viewportAspectRatio, this.nearPlane, this.farPlane);
  }

  get view() {
    return this.orientation.mul(glm.translate(mat4(), this.position.mul(-1)));
  }

  offsetPosition(offset) {
    this.position = this.position.add(offset);
  }

  offsetOrientation(upAngle, rightAngle) {
    this.horizontalAngle += rightAngle;
    this.verticalAngle += upAngle;
    this.normalizeAngles();
  }

  lookAt(position) {
    // if (position.eq(this.position)) throw Error()
    const direction = glm.normalize(position.sub(this.position));
    this.verticalAngle = glm.radians(Math.asin(-direction.y));
    this.horizontalAngle = -glm.radians(Math.atan2(-direction.x, -direction.z));
    normalizeAngles();
  }

  normalizeAngles() {
    // horizontal
    this.horizontalAngle = fmod(this.horizontalAngle, 360);
    if (this.horizontalAngle < 0) this.horizontalAngle += 360;

    // vertical
    if (this.verticalAngle > MAX_VERTICAL_ANGLE) this.verticalAngle = MAX_VERTICAL_ANGLE;
    else if (this.verticalAngle < -MAX_VERTICAL_ANGLE) this.verticalAngle = -MAX_VERTICAL_ANGLE;
  }
}
