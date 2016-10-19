export function sizeof(glType) {
  const gl = global.gl;
  switch (glType) {
    case gl.BYTE: return 1;
    case gl.UNSIGNED_BYTE: return 1;
    case gl.SHORT: return 2;
    case gl.UNSIGNED_SHORT: return 2;
    case gl.FIXED: return 4;
    case gl.FLOAT: return 4;
    default: throw Error('Unrecognized type for sizeof');
  }
}

export const KEY_SHIFT_LEFT = 16;
export const KEY_SPACE = 32;
export const KEY_A = 65;
export const KEY_D = 68;
export const KEY_W = 87;
export const KEY_S = 83;
export const KEY_X = 88;
export const KEY_Y = 90;

export const e2c = ('code' in new KeyboardEvent(null)) ? (e => e.code) : (e) => {
  switch(e.keyCode) {
    case KEY_SHIFT_LEFT: return 'ShiftLeft';
    case KEY_SPACE: return 'Space';
    case KEY_A: return 'KeyA';
    case KEY_D: return 'KeyD';
    case KEY_W: return 'KeyW';
    case KEY_S: return 'KeyS';
    case KEY_X: return 'KeyX';
    case KEY_Y: return 'KeyY';
    default: return null;
  }
};
