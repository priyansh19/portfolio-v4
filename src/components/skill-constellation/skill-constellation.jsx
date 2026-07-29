'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  NormalBlending,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from 'three';
import { useTheme } from '@/components/theme-provider';
import { orbitSkills } from '@/lib/content';
import { useInViewport } from '@/lib/hooks';
import { cleanRenderer } from '@/lib/three-utils';
import styles from './skill-constellation.module.css';

const RADIUS = 3.4;
const LABEL_SCALE = 0.62;

/** Even point distribution on a sphere — avoids the clustering of naive random. */
function fibonacciSphere(count, radius) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(
      new Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius)
    );
  }

  return points;
}

/** Renders a skill label to an offscreen canvas for use as a sprite texture. */
function makeLabelTexture(text, color) {
  const dpr = Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, 2);
  const fontSize = 44;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = `600 ${fontSize}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
  const width = Math.ceil(context.measureText(text).width) + 32;
  const height = fontSize * 1.8;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);

  context.font = `600 ${fontSize}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(text, width / 2, height / 2);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;

  return { texture, aspect: width / height };
}

/**
 * Interactive sphere of skill labels wrapped in a wireframe icosahedron.
 * Drag to spin; it idles with a slow auto-rotation.
 */
export const SkillConstellation = props => {
  const { theme } = useTheme();
  const containerRef = useRef();
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const group = useRef();
  const sprites = useRef([]);
  const wireframe = useRef();
  const rotation = useRef({ x: 0, y: 0, vx: 0, vy: 0.0025 });
  const drag = useRef({ active: false, x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const [visible, setVisible] = useState(false);

  // Labels are baked into textures, so the whole scene is rebuilt on theme change.
  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const isLight = theme === 'light';
    const labelColor = isLight ? '#a9583e' : '#f0b876';
    const wireColor = new Color(isLight ? 0xcc785c : 0x5db8a6);

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // updateStyle=false: CSS owns the element's box, the renderer owns pixels
    renderer.current.setSize(width, height, false);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.current = new PerspectiveCamera(45, width / height, 0.1, 100);
    camera.current.position.z = 11;

    scene.current = new Scene();
    group.current = new Group();
    scene.current.add(group.current);

    const wireGeometry = new WireframeGeometry(new IcosahedronGeometry(RADIUS + 0.9, 1));
    const wireMaterial = new LineBasicMaterial({
      color: wireColor,
      transparent: true,
      opacity: isLight ? 0.22 : 0.3,
      blending: isLight ? NormalBlending : AdditiveBlending,
    });
    wireframe.current = new LineSegments(wireGeometry, wireMaterial);
    group.current.add(wireframe.current);

    const positions = fibonacciSphere(orbitSkills.length, RADIUS);

    sprites.current = orbitSkills.map((skill, index) => {
      const { texture, aspect } = makeLabelTexture(skill, labelColor);
      const material = new SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new Sprite(material);
      sprite.position.copy(positions[index]);
      sprite.scale.set(LABEL_SCALE * aspect, LABEL_SCALE, 1);
      group.current.add(sprite);
      return sprite;
    });

    const visibilityTimeout = setTimeout(() => setVisible(true), 150);

    return () => {
      clearTimeout(visibilityTimeout);
      wireGeometry.dispose();
      wireMaterial.dispose();
      for (const sprite of sprites.current) {
        sprite.material.map.dispose();
        sprite.material.dispose();
      }
      sprites.current = [];
      cleanRenderer(renderer.current);
    };
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      if (!renderer.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.current.setSize(width, height, false);
      camera.current.aspect = width / height;
      // Narrow containers need a wider framing or labels clip at the edges
      camera.current.position.z = width < 520 ? 13.5 : 11;
      camera.current.updateProjectionMatrix();
      renderer.current.render(scene.current, camera.current);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    return () => observer.disconnect();
  }, [theme]);

  // Drag to spin
  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    const onPointerDown = event => {
      drag.current = { active: true, x: event.clientX, y: event.clientY };
      container.setPointerCapture(event.pointerId);
    };

    const onPointerMove = event => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      rotation.current.vy = dx * 0.0006;
      rotation.current.vx = dy * 0.0006;
    };

    const onPointerUp = event => {
      drag.current.active = false;
      if (container.hasPointerCapture?.(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    };
  }, [reduceMotion]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);

      if (!drag.current.active) {
        // Decay toward the idle spin rather than stopping dead
        rotation.current.vy += (0.0025 - rotation.current.vy) * 0.02;
        rotation.current.vx *= 0.94;
      }

      rotation.current.y += rotation.current.vy;
      rotation.current.x += rotation.current.vx;
      rotation.current.x = Math.max(-0.9, Math.min(0.9, rotation.current.x));

      group.current.rotation.y = rotation.current.y;
      group.current.rotation.x = rotation.current.x;
      wireframe.current.rotation.y = -rotation.current.y * 0.6;

      // Labels facing away fade out so the front stays readable
      for (const sprite of sprites.current) {
        const world = sprite.getWorldPosition(new Vector3());
        const depth = (world.z + RADIUS) / (RADIUS * 2);
        sprite.material.opacity = 0.15 + depth * 0.85;
      }

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport && renderer.current) {
      animate();
    } else if (renderer.current) {
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion, theme]);

  return (
    <div
      className={styles.container}
      data-visible={visible}
      ref={containerRef}
      role="img"
      aria-label={`3D constellation of technologies: ${orbitSkills.join(', ')}`}
      {...props}
    >
      <canvas className={styles.canvas} ref={canvasRef} />
      <span className={styles.hint} aria-hidden>
        drag to rotate
      </span>
    </div>
  );
};
