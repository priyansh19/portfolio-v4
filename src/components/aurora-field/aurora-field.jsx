'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { useTheme } from '@/components/theme-provider';
import { useInViewport } from '@/lib/hooks';
import { throttle } from '@/lib/throttle';
import { cleanRenderer } from '@/lib/three-utils';
import {
  auroraFragmentShader,
  auroraVertexShader,
  moteFragmentShader,
  moteVertexShader,
} from './aurora-shaders';
import styles from './aurora-field.module.css';

const MOTE_COUNT = 130;
const AURORA_DEPTH = 30;
const CAMERA_FOV = 60;

const PALETTE = {
  light: {
    a: 0xcfe7ff,
    b: 0x8ab8e8,
    c: 0xffffff,
    mote: 0x0d74ce,
    intensity: 0.85,
    moteOpacity: 0.32,
  },
  dark: {
    a: 0x0d2a52,
    b: 0x1d5fa8,
    c: 0x0a1626,
    mote: 0x8fd0ff,
    intensity: 1,
    moteOpacity: 0.5,
  },
};

/**
 * Ambient backdrop: a domain-warped aurora plane far back, with soft bokeh
 * motes drifting in front of it. Both sit in one perspective scene, so the
 * pointer parallax separates them by real depth rather than faking it.
 *
 * Replaces the connected-node "constellation" look, which reads as dated.
 */
export const AuroraField = ({ className = '', ...rest }) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const renderer = useRef(null);
  const scene = useRef(null);
  const camera = useRef(null);
  const aurora = useRef(null);
  const motes = useRef(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const clock = useRef(0);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const [visible, setVisible] = useState(false);

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
    renderer.current.setSize(width, height, false);
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.current.setPixelRatio(pixelRatio);

    camera.current = new PerspectiveCamera(CAMERA_FOV, width / height, 0.1, 200);
    camera.current.position.z = 12;

    scene.current = new Scene();

    // --- Aurora plane, sized to overfill the frustum at its depth so the
    // parallax shift never exposes an edge.
    const distance = AURORA_DEPTH + camera.current.position.z;
    const frustumHeight = 2 * distance * Math.tan((CAMERA_FOV * Math.PI) / 360);
    const planeGeometry = new PlaneGeometry(frustumHeight * 3.2, frustumHeight * 1.9);

    const auroraMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: [0, 0] },
        uColorA: { value: new Color(PALETTE.light.a) },
        uColorB: { value: new Color(PALETTE.light.b) },
        uColorC: { value: new Color(PALETTE.light.c) },
        uIntensity: { value: PALETTE.light.intensity },
      },
      vertexShader: auroraVertexShader,
      fragmentShader: auroraFragmentShader,
      transparent: true,
      depthWrite: false,
    });

    aurora.current = new Mesh(planeGeometry, auroraMaterial);
    aurora.current.position.z = -AURORA_DEPTH;
    scene.current.add(aurora.current);

    // --- Motes spread through the depth range in front of the plane
    const positions = new Float32Array(MOTE_COUNT * 3);
    const sizes = new Float32Array(MOTE_COUNT);
    const phases = new Float32Array(MOTE_COUNT);

    for (let i = 0; i < MOTE_COUNT; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * 46;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 28;
      positions[i * 3 + 2] = -Math.random() * 42 - 3;
      sizes[i] = Math.random() * 2.6 + 0.9;
      phases[i] = Math.random();
    }

    const moteGeometry = new BufferGeometry();
    moteGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    moteGeometry.setAttribute('size', new BufferAttribute(sizes, 1));
    moteGeometry.setAttribute('phase', new BufferAttribute(phases, 1));

    const moteMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uColor: { value: new Color(PALETTE.light.mote) },
        uOpacity: { value: PALETTE.light.moteOpacity },
      },
      vertexShader: moteVertexShader,
      fragmentShader: moteFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    motes.current = new Points(moteGeometry, moteMaterial);
    scene.current.add(motes.current);

    const timeout = setTimeout(() => setVisible(true), 160);

    return () => {
      clearTimeout(timeout);
      planeGeometry.dispose();
      auroraMaterial.dispose();
      moteGeometry.dispose();
      moteMaterial.dispose();
      cleanRenderer(renderer.current);
    };
  }, []);

  // Theme only swaps uniforms — no rebuild
  useEffect(() => {
    if (!aurora.current) return;
    const palette = theme === 'dark' ? PALETTE.dark : PALETTE.light;
    const u = aurora.current.material.uniforms;
    u.uColorA.value = new Color(palette.a);
    u.uColorB.value = new Color(palette.b);
    u.uColorC.value = new Color(palette.c);
    u.uIntensity.value = palette.intensity;
    motes.current.material.uniforms.uColor.value = new Color(palette.mote);
    motes.current.material.uniforms.uOpacity.value = palette.moteOpacity;
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      if (!renderer.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width < 2 || height < 2) return;
      renderer.current.setSize(width, height, false);
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
      renderer.current.render(scene.current, camera.current);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const onPointerMove = throttle(event => {
      pointer.current.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    }, 40);

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduceMotion]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);
      clock.current += 0.016;

      // Ease toward the pointer so the parallax glides rather than snaps
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.035;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.035;

      const auroraUniforms = aurora.current.material.uniforms;
      auroraUniforms.uTime.value = clock.current;
      auroraUniforms.uPointer.value = [pointer.current.x, pointer.current.y];

      motes.current.material.uniforms.uTime.value = clock.current;

      // The plane sits far back, motes near — moving the camera a little
      // separates them by genuine perspective.
      camera.current.position.x = pointer.current.x * 2.4;
      camera.current.position.y = -pointer.current.y * 1.6;
      camera.current.lookAt(0, 0, -AURORA_DEPTH * 0.4);

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport && renderer.current) {
      animate();
    } else if (renderer.current) {
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion]);

  return (
    <div
      aria-hidden
      className={`${styles.container} ${className}`}
      data-visible={visible}
      ref={containerRef}
      {...rest}
    >
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};
