// uniform mat4 u_modelViewProjMatrix;
// uniform mat4 u_normalMatrix;
// uniform vec3 lightDir;
//
// attribute vec3 vNormal;
// attribute vec4 vTexCoord;
// attribute vec4 vPosition;
//
// varying float v_Dot;
// varying vec2 v_texCoord;


attribute vec3 vert;
attribute vec2 vertTexCoord;

varying vec2 fragTexCoord;

void main()
{
  // gl_Position = u_modelViewProjMatrix * vPosition;
  // v_texCoord = vTexCoord.st;
  // vec4 transNormal = u_normalMatrix * vec4(vNormal, 1);
  // v_Dot = max(dot(transNormal.xyz, lightDir), 0.0);

  fragTexCoord = vertTexCoord;
  gl_Position = vec4(vert, 1);
}
