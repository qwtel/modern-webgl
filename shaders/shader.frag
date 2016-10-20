precision lowp float;

uniform mat4 model;
uniform mat3 normalMatrix;
uniform sampler2D tex;

uniform struct Light {
   vec3 position;
   vec3 intensities;
} light;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec3 fragVert;

void main()
{
  //calculate normal in world coordinates
  // mat3 normalMatrix = transpose(inverse(mat3(model)));
  vec3 normal = normalize(normalMatrix * fragNormal);

  //calculate the location of this fragment (pixel) in world coordinates
  vec3 fragPosition = vec3(model * vec4(fragVert, 1));

  //calculate the vector from this pixels surface to the light source
  vec3 surfaceToLight = light.position - fragPosition;

  //calculate the cosine of the angle of incidence
  float brightness = dot(normal, surfaceToLight) / (length(surfaceToLight) * length(normal));
  brightness = clamp(brightness, 0.0, 1.0);

  //calculate final color of the pixel, based on:
  // 1. The angle of incidence: brightness
  // 2. The color/intensities of the light: light.intensities
  // 3. The texture and texture coord: texture(tex, fragTexCoord)
  vec4 surfaceColor = texture2D(tex, fragTexCoord);
  gl_FragColor = vec4(brightness * light.intensities * surfaceColor.rgb, surfaceColor.a);
}
