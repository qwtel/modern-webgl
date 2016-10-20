precision lowp float;

uniform mat4 camera;
uniform mat4 model;

attribute vec3 vert;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec3 fragVert;

void main()
{
  // Pass the tex coord straight through to the fragment shader
  fragTexCoord = vertTexCoord;
  fragNormal = vertNormal;
  fragVert = vert;

  // Apply all matrix transformations to vert
  gl_Position = camera * model * vec4(vert, 1);
}
