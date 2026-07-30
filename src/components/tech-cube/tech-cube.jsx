'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { useTheme } from '@/components/theme-provider';
import { useInViewport } from '@/lib/hooks';
import { techLogos } from '@/lib/tech-logos';
import { cleanRenderer } from '@/lib/three-utils';
import styles from './tech-cube.module.css';

const FACE_PX = 256;
/** three orders box faces +X, -X, +Y, -Y, +Z, -Z */
const FACE_NORMALS = [
  new Vector3(1, 0, 0),
  new Vector3(-1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, -1, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1),
];

/**
 * Renders one logo onto a rounded plate. Brand colours are used as-is except
 * where they would vanish into the plate — near-black marks on a dark plate
 * get lifted, which keeps every logo legible without inventing new colours.
 */
function drawFace(logo, isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = FACE_PX;
  canvas.height = FACE_PX;
  const ctx = canvas.getContext('2d');

  const plate = isDark ? '#12161c' : '#ffffff';
  const edge = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';

  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, FACE_PX, FACE_PX);

  ctx.strokeStyle = edge;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, FACE_PX - 6, FACE_PX - 6);

  const brand = new Color(logo.hex);
  // Relative luminance; lift the mark if it would disappear into the plate
  const lum = 0.2126 * brand.r + 0.7152 * brand.g + 0.0722 * brand.b;
  let fill = logo.hex;
  if (isDark && lum < 0.16) fill = '#e8eef7';
  if (!isDark && lum > 0.9) fill = '#3a3f47';

  // simple-icons paths are authored on a 24x24 viewBox
  const scale = (FACE_PX * 0.52) / 24;
  ctx.save();
  ctx.translate(FACE_PX / 2, FACE_PX / 2);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(logo.path));
  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * A tumbling cube of technology logos that drifts across the hero, passing
 * behind the copy. Six faces are visible at a time; a face swaps to the next
 * logo only while it is turned away from the camera, so the change is never
 * seen. That lets a six-sided object cycle through the whole stack.
 */
export const TechCube = ({ className = '', ...rest }) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const renderer = useRef(null);
  const scene = useRef(null);
  const camera = useRef(null);
  const group = useRef(null);
  const cube = useRef(null);
  const textures = useRef([]);
  const nextLogo = useRef(6);
  const faceLogo = useRef([0, 1, 2, 3, 4, 5]);
  const clock = useRef(0);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const isDark = theme === 'dark';

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.current.setSize(width, height, false);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.current = new PerspectiveCamera(42, width / height, 0.1, 100);
    camera.current.position.z = 6.2;

    scene.current = new Scene();
    group.current = new Group();
    scene.current.add(group.current);

    faceLogo.current = [0, 1, 2, 3, 4, 5];
    nextLogo.current = 6 % techLogos.length;

    textures.current = faceLogo.current.map(index =>
      drawFace(techLogos[index % techLogos.length], isDark)
    );

    const geometry = new BoxGeometry(1.55, 1.55, 1.55);
    const materials = textures.current.map(
      map => new MeshLambertMaterial({ map, transparent: true, opacity: 0.97 })
    );

    cube.current = new Mesh(geometry, materials);
    group.current.add(cube.current);

    // Outline gives the form definition that flat logo plates alone would lack
    const edges = new EdgesGeometry(geometry);
    const edgeMaterial = new LineBasicMaterial({
      color: new Color(isDark ? 0x4a5568 : 0x000000),
      transparent: true,
      opacity: isDark ? 0.35 : 0.14,
    });
    const outline = new LineSegments(edges, edgeMaterial);
    cube.current.add(outline);

    scene.current.add(new AmbientLight(0xffffff, 2.1));
    const key = new DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 4, 5);
    scene.current.add(key);

    const timeout = setTimeout(() => setVisible(true), 220);

    return () => {
      clearTimeout(timeout);
      geometry.dispose();
      edges.dispose();
      edgeMaterial.dispose();
      materials.forEach(m => m.dispose());
      textures.current.forEach(t => t.dispose());
      textures.current = [];
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
  }, [theme]);

  useEffect(() => {
    let animation;
    const isDark = theme === 'dark';
    const worldNormal = new Vector3();

    const animate = () => {
      animation = requestAnimationFrame(animate);
      clock.current += 0.016;
      const t = clock.current;

      // Lissajous drift — the ratio keeps the path from repeating too visibly
      group.current.position.x = Math.sin(t * 0.17) * 3.1;
      group.current.position.y = Math.sin(t * 0.23 + 1.2) * 1.5;
      group.current.position.z = Math.sin(t * 0.11) * 1.2;

      cube.current.rotation.x = t * 0.28;
      cube.current.rotation.y = t * 0.36;

      // Swap the logo on any face currently turned away from the camera
      for (let i = 0; i < 6; i++) {
        worldNormal.copy(FACE_NORMALS[i]).applyQuaternion(cube.current.quaternion);
        if (worldNormal.z >= -0.55) continue;

        const candidate = nextLogo.current % techLogos.length;
        if (faceLogo.current.includes(candidate)) continue;

        const old = textures.current[i];
        const fresh = drawFace(techLogos[candidate], isDark);
        cube.current.material[i].map = fresh;
        cube.current.material[i].needsUpdate = true;
        textures.current[i] = fresh;
        faceLogo.current[i] = candidate;
        nextLogo.current = (nextLogo.current + 1) % techLogos.length;
        old.dispose();
      }

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport && renderer.current) {
      animate();
    } else if (renderer.current) {
      cube.current.rotation.set(-0.35, 0.6, 0.12);
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion, theme]);

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
