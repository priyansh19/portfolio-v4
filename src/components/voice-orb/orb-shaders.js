// Shaders for the voice-assistant orb.
//
// The noise functions are Stefan Gustavson's classic Perlin noise
// (webgl-noise, MIT) — the same family already used by the displacement
// sphere in this repo.

const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  return 2.2 * mix(n_yz.x, n_yz.y, fade_xyz.x);
}
`;

/**
 * Displaces the sphere by layered noise. `uAmplitude` is the live voice level
 * (0..1) — it scales both the displacement and the noise travel speed, so a
 * louder voice makes a more agitated surface.
 */
export const orbVertexShader = /* glsl */ `
${NOISE}

uniform float uTime;
uniform float uAmplitude;
uniform float uSpeed;
uniform float uDisplace;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vNoise;

void main() {
  float t = uTime * uSpeed;

  // Two octaves: a slow rolling swell plus a finer ripple that only really
  // shows up once the voice level rises.
  float base = cnoise(position * 1.15 + vec3(0.0, t * 0.45, 0.0));
  float detail = cnoise(position * 3.1 - vec3(t * 0.7, 0.0, t * 0.35));

  float noise = base + detail * (0.25 + uAmplitude * 0.75);
  vNoise = noise;

  float swell = uDisplace * (0.55 + uAmplitude * 1.35);
  vec3 displaced = position + normal * noise * swell;

  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

/**
 * Fresnel rim + a two-colour core gradient. Deliberately emissive-looking so
 * the orb reads as lit from within rather than lit by the scene.
 */
export const orbFragmentShader = /* glsl */ `
uniform vec3 uColorCore;
uniform vec3 uColorRim;
uniform float uAmplitude;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vNoise;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0), 2.4);

  // Noise ridges brighten slightly, so the surface has readable motion
  float ridge = smoothstep(-0.4, 0.9, vNoise);
  vec3 color = mix(uColorCore, uColorRim, ridge * 0.55 + fresnel * 0.85);

  // Voice level lifts overall brightness
  color += uColorRim * uAmplitude * 0.35;

  float alpha = uOpacity * (0.32 + fresnel * 0.85);
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;

/** Faint outer shell that only shows at grazing angles — the halo. */
export const glowFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uAmplitude;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vNoise;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0), 3.2);
  float alpha = fresnel * (0.28 + uAmplitude * 0.4);
  gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
}
`;
