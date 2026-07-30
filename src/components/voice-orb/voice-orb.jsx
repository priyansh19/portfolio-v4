'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  BackSide,
  Color,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { useTheme } from '@/components/theme-provider';
import { useInViewport } from '@/lib/hooks';
import { cleanRenderer } from '@/lib/three-utils';
import { glowFragmentShader, orbFragmentShader, orbVertexShader } from './orb-shaders';
import styles from './voice-orb.module.css';

/**
 * The four states a voice assistant moves through. Each maps to how the
 * surface behaves, so the orb reads differently at a glance.
 */
const STATE_CONFIG = {
  idle: { speed: 0.22, displace: 0.1, floor: 0.04, label: 'Assistant idle' },
  listening: { speed: 0.55, displace: 0.17, floor: 0.16, label: 'Assistant listening' },
  thinking: { speed: 1.15, displace: 0.13, floor: 0.34, label: 'Assistant thinking' },
  speaking: { speed: 0.85, displace: 0.24, floor: 0.3, label: 'Assistant speaking' },
};

const PALETTE = {
  light: { core: 0x0d74ce, rim: 0x8fd0ff, glow: 0x4aa8ef },
  dark: { core: 0x0b3f77, rim: 0xa8d8ff, glow: 0x47c2ff },
};

/**
 * Animated orb for the voice assistant.
 *
 * Drive it from real audio by passing `amplitude` (0..1) — e.g. RMS from an
 * AnalyserNode — and `state`. With no props it breathes on its own, so the
 * hero looks alive before the assistant is wired up.
 *
 * This component deliberately does NOT request microphone access; that is the
 * integration's job, so permission is asked at a moment the user expects.
 */
export const VoiceOrb = ({ state = 'idle', amplitude = null, className = '', ...rest }) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const renderer = useRef(null);
  const scene = useRef(null);
  const camera = useRef(null);
  const orb = useRef(null);
  const halo = useRef(null);
  const clock = useRef(0);
  const level = useRef(0);
  const stateRef = useRef(state);
  const amplitudeRef = useRef(amplitude);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const [visible, setVisible] = useState(false);

  // Mirror the live props into refs so the rAF loop reads current values
  // without the scene being torn down and rebuilt on every amplitude tick.
  useEffect(() => {
    stateRef.current = state;
    amplitudeRef.current = amplitude;
  }, [state, amplitude]);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // updateStyle=false: CSS owns the box, the renderer owns pixels only
    renderer.current.setSize(width, height, false);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.current = new PerspectiveCamera(45, width / height, 0.1, 100);
    camera.current.position.z = 3.4;

    scene.current = new Scene();

    const geometry = new IcosahedronGeometry(1, 48);

    const orbMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 0 },
        uSpeed: { value: STATE_CONFIG.idle.speed },
        uDisplace: { value: STATE_CONFIG.idle.displace },
        uColorCore: { value: new Color(PALETTE.light.core) },
        uColorRim: { value: new Color(PALETTE.light.rim) },
        uOpacity: { value: 1 },
      },
      vertexShader: orbVertexShader,
      fragmentShader: orbFragmentShader,
      transparent: true,
      depthWrite: false,
    });

    orb.current = new Mesh(geometry, orbMaterial);
    scene.current.add(orb.current);

    // Slightly larger back-facing shell renders the halo
    const haloMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 0 },
        uSpeed: { value: 0.18 },
        uDisplace: { value: 0.06 },
        uColor: { value: new Color(PALETTE.light.glow) },
      },
      vertexShader: orbVertexShader,
      fragmentShader: glowFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: BackSide,
    });

    halo.current = new Mesh(geometry, haloMaterial);
    halo.current.scale.setScalar(1.28);
    scene.current.add(halo.current);

    const timeout = setTimeout(() => setVisible(true), 120);

    return () => {
      clearTimeout(timeout);
      geometry.dispose();
      orbMaterial.dispose();
      haloMaterial.dispose();
      cleanRenderer(renderer.current);
    };
  }, []);

  // Theme swap only touches uniforms — no scene rebuild
  useEffect(() => {
    if (!orb.current) return;
    const palette = theme === 'dark' ? PALETTE.dark : PALETTE.light;
    orb.current.material.uniforms.uColorCore.value = new Color(palette.core);
    orb.current.material.uniforms.uColorRim.value = new Color(palette.rim);
    halo.current.material.uniforms.uColor.value = new Color(palette.glow);
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
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);
      clock.current += 0.016;

      const config = STATE_CONFIG[stateRef.current] ?? STATE_CONFIG.idle;

      // Real amplitude wins; otherwise breathe around the state's floor so it
      // still looks alive with nothing connected.
      const target =
        amplitudeRef.current === null
          ? config.floor + Math.sin(clock.current * 1.6) * 0.035
          : Math.max(0, Math.min(1, amplitudeRef.current));

      // Ease toward the target so a spiky mic signal doesn't jitter the mesh
      level.current += (target - level.current) * 0.12;

      const orbUniforms = orb.current.material.uniforms;
      orbUniforms.uTime.value = clock.current;
      orbUniforms.uAmplitude.value = level.current;
      orbUniforms.uSpeed.value += (config.speed - orbUniforms.uSpeed.value) * 0.05;
      orbUniforms.uDisplace.value += (config.displace - orbUniforms.uDisplace.value) * 0.05;

      const haloUniforms = halo.current.material.uniforms;
      haloUniforms.uTime.value = clock.current * 0.6;
      haloUniforms.uAmplitude.value = level.current;

      orb.current.rotation.y = clock.current * 0.12;
      halo.current.rotation.y = -clock.current * 0.08;

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport && renderer.current) {
      animate();
    } else if (renderer.current) {
      // One static frame — still a shaped, coloured orb, just not moving
      orb.current.material.uniforms.uAmplitude.value = 0.1;
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion]);

  const config = STATE_CONFIG[state] ?? STATE_CONFIG.idle;

  return (
    <div
      className={`${styles.container} ${className}`}
      data-visible={visible}
      data-state={state}
      ref={containerRef}
      {...rest}
    >
      <canvas className={styles.canvas} ref={canvasRef} aria-hidden />
      <p className={styles.status} role="status">
        <span className={styles.statusDot} aria-hidden />
        {config.label}
      </p>
    </div>
  );
};
