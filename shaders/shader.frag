precision lowp float;

uniform mat4 model;
uniform vec3 cameraPosition;
uniform mat3 normalMatrix;

uniform struct Material {
  sampler2D tex;
  float shininess;
  vec3 specularColor;
} material;

uniform struct Light {
  vec3 position;
  vec3 intensities;
  float attenuation;
  float ambientCoefficient;
} light;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec3 fragVert;

void main()
{
  vec3 gamma = vec3(1.0/2.2);

  // calculate normal in world coordinates
  vec3 normal = normalize(normalMatrix * fragNormal);
  vec3 surfacePos = vec3(model * vec4(fragVert, 1.0));
  vec4 texSample = texture2D(material.tex, fragTexCoord);
  vec4 surfaceColor = vec4(pow(texSample.rgb, vec3(2.2)), texSample.a); // TODO: undo texture gamma correction
  vec3 surfaceToLight = normalize(light.position - surfacePos);
  vec3 surfaceToCamera = normalize(cameraPosition - surfacePos);

  // ambient
  vec3 ambient = light.ambientCoefficient * surfaceColor.rgb * light.intensities;

  // diffuse
  float diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));
  vec3 diffuse = diffuseCoefficient * surfaceColor.rgb * light.intensities;

  //specular
  float specularCoefficient = 0.0;
  if (diffuseCoefficient > 0.0) {
    specularCoefficient = pow(max(0.0, dot(surfaceToCamera, reflect(-surfaceToLight, normal))), material.shininess);
  }
  vec3 specular = specularCoefficient * material.specularColor * light.intensities;

  // attenuation
  float distanceToLight = length(light.position - surfacePos);
  float attenuation = 1.0 / (1.0 + light.attenuation * pow(distanceToLight, 2.0));

  // linear color (color before gamma correction)
  vec3 linearColor = ambient + attenuation * (diffuse + specular);

  // final color (after gamma correction)
  gl_FragColor = vec4(pow(linearColor, gamma), surfaceColor.a);
}
