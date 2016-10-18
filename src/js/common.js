export function sizeof(gl, glType) {
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
