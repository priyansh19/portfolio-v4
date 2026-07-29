'use client';

import { useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  WebGLRenderer,
  WireframeGeometry,
} from 'three';
import { useTheme } from '@/components/theme-provider';
import { useInViewport } from '@/lib/hooks';
import { throttle } from '@/lib/throttle';
import { cleanRenderer, removeLights } from '@/lib/three-utils';
import styles from './hardware-rig.module.css';

const springConfig = { stiffness: 210, damping: 18, mass: 1 };

/** Signal-orange / amber / Nintendo-red satellite chips orbiting the core. */
const SATELLITE_SPECS = [
  { color: 0xf68d1f, radius: 3.7, speed: 0.014, tilt: 0.2, phase: 0 },
  { color: 0xecab37, radius: 4.05, speed: -0.01, tilt: -0.5, phase: 2.1 },
  { color: 0xe60012, radius: 3.4, speed: 0.02, tilt: 0.9, phase: 4.2 },
];

/**
 * Y2K "console chrome" hero shape — a faceted low-poly chrome core traced by
 * a nav-gold wireframe, a tilted signal-orange gyroscope ring, and three
 * orbiting satellite chips. Sized to its own container (ResizeObserver)
 * rather than the window, since it lives in a partial-width hero panel.
 * Disposes on unmount, pauses off-screen, caps devicePixelRatio, renders one
 * static frame under reduced motion.
 */
export const HardwareRig = props => {
  const { theme } = useTheme();
  const containerRef = useRef();
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef([]);
  const group = useRef();
  const core = useRef();
  const wire = useRef();
  const ring = useRef();
  const satellites = useRef([]);
  const disposables = useRef([]);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(containerRef);
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);
  const [visible, setVisible] = useState(false);

  // Build the scene once. Theme only swaps material colours afterwards, in a
  // separate effect, so geometry is never rebuilt on a theme toggle.
  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const created = [];

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // updateStyle=false: CSS owns the canvas's box, the renderer owns pixels
    renderer.current.setSize(width, height, false);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.current = new PerspectiveCamera(48, width / height, 0.1, 100);
    camera.current.position.z = 11;

    scene.current = new Scene();
    group.current = new Group();
    scene.current.add(group.current);

    const coreGeometry = new IcosahedronGeometry(2.3, 0);
    const coreMaterial = new MeshPhongMaterial({ flatShading: true, shininess: 70 });
    core.current = new Mesh(coreGeometry, coreMaterial);
    group.current.add(core.current);
    created.push(coreGeometry, coreMaterial);

    const wireGeometry = new WireframeGeometry(new IcosahedronGeometry(2.34, 0));
    const wireMaterial = new LineBasicMaterial({
      transparent: true,
      opacity: 0.85,
      blending: AdditiveBlending,
    });
    wire.current = new LineSegments(wireGeometry, wireMaterial);
    group.current.add(wire.current);
    created.push(wireGeometry, wireMaterial);

    const ringGeometry = new TorusGeometry(3.35, 0.035, 8, 72);
    const ringMaterial = new MeshPhongMaterial({ flatShading: true, transparent: true, opacity: 0.9 });
    ring.current = new Mesh(ringGeometry, ringMaterial);
    ring.current.rotation.x = Math.PI / 2.6;
    group.current.add(ring.current);
    created.push(ringGeometry, ringMaterial);

    satellites.current = SATELLITE_SPECS.map(spec => {
      const pivot = new Group();
      pivot.rotation.z = spec.tilt;
      pivot.rotation.y = spec.phase;

      const geometry = new OctahedronGeometry(0.22, 0);
      const material = new MeshPhongMaterial({ color: spec.color, flatShading: true });
      const mesh = new Mesh(geometry, material);
      mesh.position.x = spec.radius;
      pivot.add(mesh);
      group.current.add(pivot);
      created.push(geometry, material);

      return { pivot, mesh, speed: spec.speed };
    });

    disposables.current = created;

    const visibilityTimeout = setTimeout(() => setVisible(true), 120);

    return () => {
      clearTimeout(visibilityTimeout);
      for (const item of disposables.current) item.dispose();
      disposables.current = [];
      cleanRenderer(renderer.current);
    };
  }, []);

  // Theme swap: recolour the chrome core/wire/ring and relight the scene.
  useEffect(() => {
    if (!core.current) return;

    const isLight = theme === 'light';
    core.current.material.color = new Color(isLight ? 0x8ba1d4 : 0x3d4f97);
    core.current.material.specular = new Color(0xffffff);
    wire.current.material.color = new Color(0xe48600);
    ring.current.material.color = new Color(0xf68d1f);
    ring.current.material.emissive = new Color(isLight ? 0x2a1400 : 0x3a1c00);

    const dirLight = new DirectionalLight(0xffffff, isLight ? 1.6 : 2.0);
    const ambientLight = new AmbientLight(0xffffff, isLight ? 1.6 : 0.9);
    dirLight.position.set(4, 6, 8);
    lights.current = [dirLight, ambientLight];
    lights.current.forEach(light => scene.current.add(light));

    renderer.current?.render(scene.current, camera.current);

    return () => {
      removeLights(lights.current);
    };
  }, [theme]);

  // Resize — the container, not the window, since this rig lives in a
  // partial-width panel. Guards against the near-zero readings a
  // ResizeObserver can report mid-layout (e.g. before webfont swap settles).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const apply = (width, height) => {
      if (!renderer.current || width < 20 || height < 20) return;
      renderer.current.setSize(width, height, false);
      camera.current.aspect = width / height;
      camera.current.position.z = width < 480 ? 13.5 : 11;
      camera.current.updateProjectionMatrix();

      if (reduceMotion) {
        renderer.current.render(scene.current, camera.current);
      }
    };

    const resize = () => apply(container.clientWidth, container.clientHeight);

    const observer = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (rect) apply(Math.round(rect.width), Math.round(rect.height));
    });
    observer.observe(container);
    resize();

    // Layout can still settle after webfonts swap in — re-measure once more
    // rather than trust only the very first paint.
    let refreshFrame;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        refreshFrame = requestAnimationFrame(resize);
      });
    }

    return () => {
      observer.disconnect();
      if (refreshFrame) cancelAnimationFrame(refreshFrame);
    };
  }, [reduceMotion]);

  // Pointer parallax — a snappy spring, not an eased drift, to match the
  // mechanical "clicked and snapped" motion brief.
  useEffect(() => {
    const onPointerMove = throttle(event => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      tiltY.set(x * 0.6);
      tiltX.set(y * 0.4);
    }, 60);

    if (!reduceMotion && isInViewport) {
      window.addEventListener('pointermove', onPointerMove);
    }

    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [isInViewport, reduceMotion, tiltX, tiltY]);

  // Animation loop — constant angular velocity (mechanical) plus the pointer
  // tilt layered on top.
  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);

      group.current.rotation.y += 0.0048;
      core.current.rotation.x += 0.0011;
      wire.current.rotation.x = core.current.rotation.x;
      ring.current.rotation.z += 0.0035;

      group.current.rotation.x = tiltX.get();
      group.current.position.y = tiltY.get() * 0.3;

      for (const satellite of satellites.current) {
        satellite.pivot.rotation.y += satellite.speed;
      }

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else if (renderer.current) {
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion, tiltX, tiltY]);

  return (
    <div className={styles.container} data-visible={visible} ref={containerRef}>
      <canvas aria-hidden ref={canvasRef} {...props} />
    </div>
  );
};
