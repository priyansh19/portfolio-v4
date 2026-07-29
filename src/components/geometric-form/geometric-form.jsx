'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from 'three';
import { useInViewport } from '@/lib/hooks';
import { cleanRenderer } from '@/lib/three-utils';
import styles from './geometric-form.module.css';

const STEEL = '#dfe3e8';
const BLUE = 0x1c69d4;

/** A precise low-poly polyhedron for the "form" the studio is built around. */
function buildSolid(shape) {
  const geometry = (() => {
    switch (shape) {
      case 'torusKnot':
        return new TorusKnotGeometry(2.1, 0.62, 180, 20, 2, 3);
      case 'octahedron':
        return new OctahedronGeometry(2.7, 0);
      case 'dodecahedron':
        return new DodecahedronGeometry(2.35, 0);
      case 'graph':
        return new IcosahedronGeometry(1.5, 0);
      case 'icosahedron':
      default:
        return new IcosahedronGeometry(2.6, 0);
    }
  })();

  const material = new MeshStandardMaterial({
    color: new Color(STEEL),
    metalness: 0.72,
    roughness: 0.28,
    flatShading: shape !== 'torusKnot',
  });

  const mesh = new Mesh(geometry, material);
  const wireframe = new LineSegments(
    new WireframeGeometry(geometry),
    new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 })
  );
  mesh.add(wireframe);

  return { mesh, disposables: [geometry, material, wireframe.geometry, wireframe.material] };
}

/** BlastR's shape: a small knowledge graph — a core node with satellites and edges. */
function buildGraph() {
  const group = new Group();
  const disposables = [];
  const nodeGeometry = new SphereGeometry(0.32, 20, 20);
  const coreMaterial = new MeshStandardMaterial({
    color: new Color(STEEL),
    metalness: 0.6,
    roughness: 0.35,
  });
  const leafMaterial = new MeshStandardMaterial({
    color: new Color(0x9fb8d9),
    metalness: 0.5,
    roughness: 0.4,
  });
  disposables.push(nodeGeometry, coreMaterial, leafMaterial);

  const core = new Mesh(nodeGeometry, coreMaterial);
  core.scale.setScalar(1.6);
  group.add(core);

  const satelliteCount = 8;
  const linePositions = new Float32Array(satelliteCount * 6);
  const satellites = [];

  for (let i = 0; i < satelliteCount; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / satelliteCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 2.5;
    const position = new Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    const leaf = new Mesh(nodeGeometry, leafMaterial);
    leaf.position.copy(position);
    group.add(leaf);
    satellites.push(leaf);

    linePositions[i * 6] = 0;
    linePositions[i * 6 + 1] = 0;
    linePositions[i * 6 + 2] = 0;
    linePositions[i * 6 + 3] = position.x;
    linePositions[i * 6 + 4] = position.y;
    linePositions[i * 6 + 5] = position.z;
  }

  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute('position', new BufferAttribute(linePositions, 3));
  const lineMaterial = new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.55 });
  const edges = new LineSegments(lineGeometry, lineMaterial);
  group.add(edges);
  disposables.push(lineGeometry, lineMaterial);

  return { mesh: group, disposables };
}

/**
 * A precise geometric form turning slowly on a dark studio stage — BMW's
 * "form on a turntable" hero language. Vanilla three.js, following the
 * dispose / pause-off-screen / capped-DPR pattern used across this repo
 * (see displacement-sphere, skill-constellation).
 */
export const GeometricForm = ({ shape = 'icosahedron', className = '' }) => {
  const containerRef = useRef();
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const rig = useRef();
  const base = useRef();
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.current.setSize(width, height, false);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    camera.current = new PerspectiveCamera(38, width / height, 0.1, 100);
    camera.current.position.set(0, 1.1, 9.5);
    camera.current.lookAt(0, 0, 0);

    scene.current = new Scene();

    rig.current = new Group();
    const { mesh, disposables } = shape === 'graph' ? buildGraph() : buildSolid(shape);
    rig.current.add(mesh);
    rig.current.rotation.x = 0.32;
    scene.current.add(rig.current);

    // The turntable disc the form appears to sit on.
    const baseGeometry = new TorusGeometry(3.55, 0.02, 8, 96);
    const baseMaterial = new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.4 });
    base.current = new LineSegments(new WireframeGeometry(baseGeometry), baseMaterial);
    base.current.rotation.x = Math.PI / 2 + 0.32;
    base.current.position.y = -2.4;
    scene.current.add(base.current);

    // Three-point studio lighting with a BMW-blue rim.
    const key = new DirectionalLight(0xffffff, 2.6);
    key.position.set(4, 6, 6);
    const fill = new AmbientLight(0xffffff, 0.55);
    const rimLight = new PointLight(BLUE, 14, 30);
    rimLight.position.set(-5, 2, -4);
    const kicker = new DirectionalLight(0x8fb4e6, 0.5);
    kicker.position.set(-3, -2, 4);

    scene.current.add(key, fill, rimLight, kicker);

    const visibilityTimeout = setTimeout(() => setVisible(true), 120);

    return () => {
      clearTimeout(visibilityTimeout);
      for (const item of disposables) item.dispose();
      baseGeometry.dispose();
      base.current.geometry.dispose();
      baseMaterial.dispose();
      cleanRenderer(renderer.current);
    };
    // shape is provided once by the caller and never swapped at runtime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, []);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);
      rig.current.rotation.y += 0.0028;
      base.current.rotation.z -= 0.0009;
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
    <div className={`${styles.stage} ${className}`} ref={containerRef} aria-hidden data-visible={visible}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};
