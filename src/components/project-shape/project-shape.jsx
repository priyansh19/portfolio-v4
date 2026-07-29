'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  DodecahedronGeometry,
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Scene,
  TorusKnotGeometry,
  WebGLRenderer,
} from 'three';
import { useTheme } from '@/components/theme-provider';
import { useInViewport } from '@/lib/hooks';
import { cleanRenderer, cleanScene } from '@/lib/three-utils';
import styles from './project-shape.module.css';

/** Every project names one of these in its `shape` field. */
const buildGeometry = shape => {
  switch (shape) {
    case 'torusKnot':
      return new TorusKnotGeometry(1.5, 0.45, 160, 20);
    case 'icosahedron':
      return new IcosahedronGeometry(2, 0);
    case 'octahedron':
      return new OctahedronGeometry(2.1, 0);
    case 'dodecahedron':
      return new DodecahedronGeometry(1.9, 0);
    case 'graph':
    default:
      return new IcosahedronGeometry(2, 1);
  }
};

/**
 * A small rotating line-art solid used as the hero illustration on each
 * project's write-up page — real geometry, generated in code, styled to read
 * as a hand-drawn diagram rather than a photorealistic render.
 */
export const ProjectShape = ({ shape = 'icosahedron' }) => {
  const { theme } = useTheme();
  const containerRef = useRef();
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const mesh = useRef();
  const edges = useRef();
  const lights = useRef([]);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const isLight = theme === 'light';

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.current.setSize(width, height, false);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.current = new PerspectiveCamera(42, width / height, 0.1, 100);
    camera.current.position.set(0, 0, 7);

    scene.current = new Scene();

    const dirLight = new DirectionalLight(0xffffff, isLight ? 1.4 : 1.8);
    dirLight.position.set(3, 4, 5);
    const ambientLight = new AmbientLight(0xffffff, isLight ? 1.2 : 0.6);
    lights.current = [dirLight, ambientLight];
    lights.current.forEach(light => scene.current.add(light));

    const geometry = buildGeometry(shape);
    const material = new MeshStandardMaterial({
      color: new Color(isLight ? 0xefe9de : 0x252320),
      roughness: 0.55,
      metalness: 0.05,
    });
    mesh.current = new Mesh(geometry, material);
    scene.current.add(mesh.current);

    const edgeGeometry = new EdgesGeometry(geometry, 1);
    const edgeMaterial = new LineBasicMaterial({
      color: new Color(0xcc785c),
      transparent: true,
      opacity: 0.85,
    });
    edges.current = new LineSegments(edgeGeometry, edgeMaterial);
    mesh.current.add(edges.current);

    const visibilityTimeout = setTimeout(() => setVisible(true), 150);

    return () => {
      clearTimeout(visibilityTimeout);
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, [shape, theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const resize = () => {
      if (!renderer.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.current.setSize(width, height, false);
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
      renderer.current.render(scene.current, camera.current);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    return () => observer.disconnect();
  }, [theme, shape]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);
      if (mesh.current) {
        mesh.current.rotation.y += 0.0035;
        mesh.current.rotation.x += 0.0015;
      }
      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport && renderer.current) {
      animate();
    } else if (renderer.current) {
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion, theme, shape]);

  return (
    <div className={styles.container} data-visible={visible} ref={containerRef} aria-hidden>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};
