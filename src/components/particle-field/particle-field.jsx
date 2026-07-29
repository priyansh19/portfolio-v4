'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { useTheme } from '@/components/theme-provider';
import { useInViewport } from '@/lib/hooks';
import { throttle } from '@/lib/throttle';
import { cleanRenderer, cleanScene } from '@/lib/three-utils';
import styles from './particle-field.module.css';

const NODE_COUNT = 150;
const BOUNDS = { x: 90, y: 60, z: 60 };
const LINK_DISTANCE = 22;
const MAX_LINKS = 900;

/** Round, soft-edged points — cheaper and crisper than a sprite texture. */
const pointVertex = /* glsl */ `
  attribute float size;
  attribute float twinkle;
  uniform float time;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.45 + 0.55 * sin(time * 1.2 + twinkle * 6.283);
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 color;
  uniform float opacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float falloff = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(color, falloff * vAlpha * opacity);
  }
`;

/**
 * Drifting constellation of nodes with links that form and break as
 * particles move. Fills its parent element (sized via ResizeObserver, not
 * the viewport) — meant to sit inside a positioned container such as the
 * hero, not as a full-page fixed backdrop.
 */
export const ParticleField = ({ className = '', ...rest }) => {
  const { theme } = useTheme();
  const containerRef = useRef();
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const points = useRef();
  const lines = useRef();
  const velocities = useRef();
  const positions = useRef();
  const linePositions = useRef();
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const clock = useRef(0);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const [visible, setVisible] = useState(false);

  // Build the scene once — theme only swaps material colours afterwards.
  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // updateStyle=false: CSS owns the canvas box, the renderer only owns pixels
    renderer.current.setSize(width, height, false);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    camera.current = new PerspectiveCamera(60, width / height, 1, 400);
    camera.current.position.z = width < 700 ? 150 : 110;

    scene.current = new Scene();

    positions.current = new Float32Array(NODE_COUNT * 3);
    velocities.current = new Float32Array(NODE_COUNT * 3);
    const sizes = new Float32Array(NODE_COUNT);
    const twinkles = new Float32Array(NODE_COUNT);

    for (let i = 0; i < NODE_COUNT; i++) {
      positions.current[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x;
      positions.current[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
      positions.current[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;

      velocities.current[i * 3] = (Math.random() - 0.5) * 0.06;
      velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

      sizes[i] = Math.random() * 2.6 + 1.1;
      twinkles[i] = Math.random();
    }

    const pointGeometry = new BufferGeometry();
    pointGeometry.setAttribute('position', new BufferAttribute(positions.current, 3));
    pointGeometry.setAttribute('size', new BufferAttribute(sizes, 1));
    pointGeometry.setAttribute('twinkle', new BufferAttribute(twinkles, 1));

    const pointMaterial = new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new Color(0x0d74ce) },
        opacity: { value: 0.6 },
      },
      vertexShader: pointVertex,
      fragmentShader: pointFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    points.current = new Points(pointGeometry, pointMaterial);
    scene.current.add(points.current);

    // Link buffer is allocated at max size and drawn partially each frame.
    linePositions.current = new Float32Array(MAX_LINKS * 6);
    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute('position', new BufferAttribute(linePositions.current, 3));
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new LineBasicMaterial({
      color: new Color(0x0d74ce),
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    lines.current = new LineSegments(lineGeometry, lineMaterial);
    scene.current.add(lines.current);

    const visibilityTimeout = setTimeout(() => setVisible(true), 200);

    return () => {
      clearTimeout(visibilityTimeout);
      cleanScene(scene.current);
      pointGeometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      cleanRenderer(renderer.current);
    };
  }, []);

  // Theme swap: sky blue for dark canvases, a deeper text-link blue for light.
  useEffect(() => {
    if (!points.current) return;

    const isLight = theme === 'light';
    const color = new Color(isLight ? 0x0d74ce : 0x5eb0ff);

    points.current.material.uniforms.color.value = color;
    points.current.material.uniforms.opacity.value = isLight ? 0.45 : 0.75;
    lines.current.material.color = color;
    lines.current.material.opacity = isLight ? 0.1 : 0.15;
  }, [theme]);

  // Resize with the container, not the window — this field lives inside a
  // positioned parent (the hero), not as a full-viewport fixed backdrop.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      if (!renderer.current) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.current.setSize(width, height, false);
      camera.current.aspect = width / height;
      camera.current.position.z = width < 700 ? 150 : 110;
      camera.current.updateProjectionMatrix();

      if (reduceMotion) {
        renderer.current.render(scene.current, camera.current);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    const onPointerMove = throttle(event => {
      pointer.current.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    }, 40);

    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointerMove);
    }

    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduceMotion]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);
      clock.current += 0.016;

      const pos = positions.current;
      const vel = velocities.current;

      for (let i = 0; i < NODE_COUNT; i++) {
        const ix = i * 3;

        pos[ix] += vel[ix];
        pos[ix + 1] += vel[ix + 1];
        pos[ix + 2] += vel[ix + 2];

        // Bounce off the invisible box instead of wrapping, which would
        // snap links across the whole field.
        if (pos[ix] > BOUNDS.x || pos[ix] < -BOUNDS.x) vel[ix] *= -1;
        if (pos[ix + 1] > BOUNDS.y || pos[ix + 1] < -BOUNDS.y) vel[ix + 1] *= -1;
        if (pos[ix + 2] > BOUNDS.z || pos[ix + 2] < -BOUNDS.z) vel[ix + 2] *= -1;
      }

      let linkIndex = 0;

      for (let i = 0; i < NODE_COUNT && linkIndex < MAX_LINKS; i++) {
        for (let j = i + 1; j < NODE_COUNT && linkIndex < MAX_LINKS; j++) {
          const ix = i * 3;
          const jx = j * 3;
          const dx = pos[ix] - pos[jx];
          const dy = pos[ix + 1] - pos[jx + 1];
          const dz = pos[ix + 2] - pos[jx + 2];

          if (dx * dx + dy * dy + dz * dz > LINK_DISTANCE * LINK_DISTANCE) continue;

          const lx = linkIndex * 6;
          linePositions.current[lx] = pos[ix];
          linePositions.current[lx + 1] = pos[ix + 1];
          linePositions.current[lx + 2] = pos[ix + 2];
          linePositions.current[lx + 3] = pos[jx];
          linePositions.current[lx + 4] = pos[jx + 1];
          linePositions.current[lx + 5] = pos[jx + 2];
          linkIndex += 1;
        }
      }

      points.current.geometry.attributes.position.needsUpdate = true;
      points.current.material.uniforms.time.value = clock.current;
      lines.current.geometry.attributes.position.needsUpdate = true;
      lines.current.geometry.setDrawRange(0, linkIndex * 2);

      // Ease the camera toward the pointer for a parallax drift
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.04;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.04;

      scene.current.rotation.y = pointer.current.x * 0.16 + clock.current * 0.012;
      scene.current.rotation.x = pointer.current.y * 0.1;

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else if (renderer.current) {
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion]);

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef} aria-hidden {...rest}>
      <canvas className={styles.canvas} data-visible={visible} ref={canvasRef} />
    </div>
  );
};
