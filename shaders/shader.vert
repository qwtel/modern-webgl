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

uniform mat4 projection;
uniform mat4 camera;
uniform mat4 model;

attribute vec3 vert;
attribute vec2 vertTexCoord;

varying vec2 fragTexCoord;

void main()
{
  // gl_Position = u_modelViewProjMatrix * vPosition;
  // v_texCoord = vTexCoord.st;
  // vec4 transNormal = u_normalMatrix * vec4(vNormal, 1);
  // v_Dot = max(dot(transNormal.xyz, lightDir), 0.0);

  // Pass the tex coord straight through to the fragment shader
  fragTexCoord = vertTexCoord;

  // Apply all matrix transformations to vert
  gl_Position = projection * camera * model * vec4(vert, 1);
}
