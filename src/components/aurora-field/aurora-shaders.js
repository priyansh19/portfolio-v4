// Shaders for the aurora backdrop.
//
// 2D simplex noise by Ian McEwan / Ashima Arts (MIT), the standard compact
// implementation. Used here for fbm and domain warping.

const SIMPLEX_2D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

export const auroraVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Domain-warped fbm producing slow drifting aurora bands. The warp is what
 * stops it reading as generic noise — it gives the flow a sense of current.
 *
 * A little ordered dither is added at the end because smooth wide gradients
 * band badly on 8-bit displays.
 */
export const auroraFragmentShader = /* glsl */ `
${SIMPLEX_2D}

uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uIntensity;

varying vec2 vUv;

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.045;

  // Pointer nudges the field rather than moving the camera, so the parallax
  // reads as the medium itself shifting.
  vec2 p = uv * 2.2 + uPointer * 0.14;

  // Domain warp: offset the sample point by another fbm evaluation
  vec2 warp = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(t * 0.8, 4.7))
  );
  float field = fbm(p + warp * 0.85 + vec2(0.0, t * 0.6));

  // Two soft bands sliding at different rates
  float band1 = smoothstep(-0.15, 0.75, field);
  float band2 = smoothstep(0.05, 0.95, fbm(p * 0.7 - warp * 0.5 + vec2(t * 0.4, 0.0)));

  vec3 color = mix(uColorA, uColorB, band1);
  color = mix(color, uColorC, band2 * 0.55);

  // Fade toward the edges so it never hits a hard rectangle boundary
  float vignette = smoothstep(1.15, 0.25, length(uv - 0.5) * 1.6);

  float alpha = band1 * 0.55 + band2 * 0.35;
  alpha *= vignette * uIntensity;

  // Ordered dither kills banding across the wide gradient
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  alpha += (dither - 0.5) * 0.012;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;

/**
 * Soft round motes with depth attenuation — the parallax layer in front of
 * the aurora. No connecting lines; depth comes from scale and opacity.
 */
export const moteVertexShader = /* glsl */ `
attribute float size;
attribute float phase;

uniform float uTime;
uniform float uPixelRatio;

varying float vFade;

void main() {
  vec3 pos = position;

  // Gentle independent drift so the field never looks like a rigid lattice
  pos.y += sin(uTime * 0.25 + phase * 6.283) * 1.4;
  pos.x += cos(uTime * 0.19 + phase * 6.283) * 1.1;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = size * uPixelRatio * (34.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  // Nearer motes brighter; far ones sink into the aurora
  vFade = smoothstep(-46.0, -6.0, mvPosition.z);
}
`;

export const moteFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;

varying float vFade;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;

  // Wide soft falloff — bokeh, not a hard dot
  float falloff = pow(smoothstep(0.5, 0.0, d), 1.7);
  gl_FragColor = vec4(uColor, falloff * vFade * uOpacity);
}
`;
