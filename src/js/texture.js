import Holder from './holder';

// function handleTextureLoaded(image, texture) {
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
//   gl.generateMipmap(gl.TEXTURE_2D);
//   gl.bindTexture(gl.TEXTURE_2D, null);
// }

function textureFormat(image) {
  // TODO
  return gl.RGBA;
}

export default class Texture extends Holder {
  constructor(gl, image, minMagFilter = gl.LINEAR, wrapMode = gl.CLAMP_TO_EDGE) {
    super(gl, gl.createTexture());

    this.originalWidth = image.width;
    this.originalHeight = image.height;

    gl.bindTexture(gl.TEXTURE_2D, this.object);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minMagFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, minMagFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      textureFormat(image),
      textureFormat(image),
      gl.UNSIGNED_BYTE,
      image
    );
    // gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}
