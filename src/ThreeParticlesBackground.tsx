import { useEffect, useRef } from "react";
import * as THREE from "three";

type BlockItem = {
  group: THREE.Group;
  body: THREE.MeshPhysicalMaterial;
  edge: THREE.LineBasicMaterial;
  glow: THREE.MeshBasicMaterial;
  base: THREE.Vector3;
};

type LinkItem = {
  full: THREE.Line;
  fullMaterial: THREE.LineBasicMaterial;
  left: THREE.Line;
  leftMaterial: THREE.LineBasicMaterial;
  right: THREE.Line;
  rightMaterial: THREE.LineBasicMaterial;
  pulse: THREE.Mesh;
  pulseMaterial: THREE.MeshBasicMaterial;
  fault: THREE.Mesh;
  faultMaterial: THREE.MeshBasicMaterial;
  start: THREE.Vector3;
  end: THREE.Vector3;
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const ease = (edge0: number, edge1: number, value: number) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};

const createRoundedBlockGeometry = () => {
  const width = 0.64;
  const height = 0.42;
  const radius = 0.075;
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.20,
    bevelEnabled: true,
    bevelSegments: 6,
    bevelSize: 0.028,
    bevelThickness: 0.038,
    curveSegments: 14,
  });

  geometry.center();
  return geometry;
};

const createLineGeometry = (start: THREE.Vector3, end: THREE.Vector3, points = 80) => {
  const curve = new THREE.CatmullRomCurve3([
    start,
    start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.08, 0.03)),
    end,
  ]);
  const vertices = curve.getPoints(points);
  return new THREE.BufferGeometry().setFromPoints(vertices);
};

const createSegmentGeometry = (start: THREE.Vector3, end: THREE.Vector3) => {
  return new THREE.BufferGeometry().setFromPoints([start, end]);
};

const ThreeParticlesBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 30);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = "h-full w-full";
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xf5e7c8, 0.65);
    const key = new THREE.DirectionalLight(0xf2b84b, 1.9);
    key.position.set(-2, 3, 5);
    const rim = new THREE.DirectionalLight(0x5eead4, 1.35);
    rim.position.set(3, -1, 4);
    scene.add(ambient, key, rim);

    const chain = new THREE.Group();
    scene.add(chain);

    const blockGeometry = createRoundedBlockGeometry();
    const edgeGeometry = new THREE.EdgesGeometry(blockGeometry, 18);
    const glowGeometry = new THREE.PlaneGeometry(0.95, 0.62);
    const pulseGeometry = new THREE.PlaneGeometry(0.20, 0.035);
    const faultGeometry = new THREE.PlaneGeometry(0.38, 0.055);

    const points = [
      [-2.96, 0.92, 0],
      [-1.78, 0.44, 0.04],
      [-0.56, 0.72, -0.03],
      [0.70, 0.10, 0.05],
      [1.92, 0.42, -0.02],
      [3.10, -0.16, 0.03],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

    const blocks: BlockItem[] = points.map((point, index) => {
      const group = new THREE.Group();
      group.position.copy(point);

      const hue = index % 2 === 0 ? 0x5eead4 : 0xf2b84b;
      const body = new THREE.MeshPhysicalMaterial({
        color: 0x14110c,
        emissive: hue,
        emissiveIntensity: 0.075,
        roughness: 0.24,
        metalness: 0.12,
        transmission: 0.25,
        thickness: 0.45,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      });

      const edge = new THREE.LineBasicMaterial({
        color: hue,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });

      const glow = new THREE.MeshBasicMaterial({
        color: hue,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const glowMesh = new THREE.Mesh(glowGeometry, glow);
      glowMesh.position.z = -0.14;
      const mesh = new THREE.Mesh(blockGeometry, body);
      const edges = new THREE.LineSegments(edgeGeometry, edge);

      group.add(glowMesh, mesh, edges);

      for (let row = 0; row < 3; row += 1) {
        const lineMaterial = new THREE.LineBasicMaterial({
          color: row === 0 ? hue : 0xd8c6a8,
          transparent: true,
          opacity: 0.10,
          depthWrite: false,
        });
        const y = 0.10 - row * 0.10;
        const line = new THREE.Line(
          createSegmentGeometry(new THREE.Vector3(-0.20, y, 0.135), new THREE.Vector3(0.22 - row * 0.055, y, 0.135)),
          lineMaterial
        );
        group.add(line);
      }

      chain.add(group);
      return { group, body, edge, glow, base: point.clone() };
    });

    const links: LinkItem[] = points.slice(0, -1).map((point, index) => {
      const next = points[index + 1];
      const start = point.clone().add(new THREE.Vector3(0.38, 0.0, -0.04));
      const end = next.clone().add(new THREE.Vector3(-0.38, 0.0, -0.04));
      const color = index % 2 === 0 ? 0x5eead4 : 0xf2b84b;

      const fullMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
      const full = new THREE.Line(createLineGeometry(start, end), fullMaterial);
      chain.add(full);

      const mid = start.clone().lerp(end, 0.5);
      const leftMaterial = new THREE.LineBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0, depthWrite: false });
      const rightMaterial = new THREE.LineBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0, depthWrite: false });
      const left = new THREE.Line(createSegmentGeometry(start, mid), leftMaterial);
      const right = new THREE.Line(createSegmentGeometry(mid, end), rightMaterial);
      chain.add(left, right);

      const pulseMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      chain.add(pulse);

      const faultMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b35,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const fault = new THREE.Mesh(faultGeometry, faultMaterial);
      fault.position.copy(mid);
      chain.add(fault);

      return { full, fullMaterial, left, leftMaterial, right, rightMaterial, pulse, pulseMaterial, fault, faultMaterial, start, end };
    });

    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const chainBase = new THREE.Vector3();
    let frameId: number | null = null;

    const placeScene = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / Math.max(height, 1);
      const viewHeight = width < 768 ? 4.8 : 3.65;

      camera.left = -viewHeight * aspect;
      camera.right = viewHeight * aspect;
      camera.top = viewHeight;
      camera.bottom = -viewHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      chainBase.set(width >= 1024 ? 0.70 : 0, width >= 1024 ? 0.08 : 0.58, 0);
      chain.position.copy(chainBase);
      chain.rotation.z = width >= 1024 ? -0.045 : -0.10;
      chain.scale.setScalar(width >= 1024 ? 1.0 : 0.74);
    };

    const pointerMove = (event: PointerEvent) => {
      targetPointer.set(
        (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2,
        -(event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2
      );
    };

    const render = () => {
      const elapsed = reducedMotion ? 4.2 : clock.getElapsedTime();
      const cycle = 7.8;
      const local = elapsed % cycle;

      pointer.lerp(targetPointer, 0.035);
      chain.position.set(chainBase.x + pointer.x * 0.10, chainBase.y + pointer.y * 0.05, chainBase.z);

      blocks.forEach((block, index) => {
        const reveal = ease(index * 0.46 - 0.12, index * 0.46 + 0.42, local);
        const reset = 1 - ease(6.8, 7.65, local);
        const active = reveal * reset;
        const failWindow = local > 3.72 && local < 4.72 && index >= 3 ? Math.sin(elapsed * 28 + index) * 0.012 : 0;

        block.group.position.copy(block.base);
        block.group.position.x += failWindow;
        block.group.position.y += Math.sin(elapsed * 0.74 + index) * 0.022 - Math.abs(failWindow) * 0.6;
        block.group.rotation.x = -0.18 + Math.sin(elapsed * 0.30 + index) * 0.035 + pointer.y * 0.015;
        block.group.rotation.y = -0.42 + Math.cos(elapsed * 0.24 + index) * 0.055 + pointer.x * 0.018;
        block.group.scale.setScalar(0.84 + active * 0.16);
        block.body.opacity = 0.03 + active * 0.34;
        block.edge.opacity = 0.05 + active * 0.38;
        block.glow.opacity = active * 0.035 + Math.abs(failWindow) * 1.4;
      });

      links.forEach((link, index) => {
        const build = ease(index * 0.46 + 0.16, index * 0.46 + 0.70, local);
        const breakStart = index === 2 ? 3.60 : 10;
        const breakAmount = ease(breakStart, breakStart + 0.22, local) * (1 - ease(breakStart + 0.58, breakStart + 1.02, local));
        const repair = ease(breakStart + 0.82, breakStart + 1.14, local) * (1 - ease(breakStart + 1.14, breakStart + 1.44, local));

        link.full.geometry.setDrawRange(0, Math.floor(81 * build));
        link.fullMaterial.opacity = build * (0.16 + repair * 0.28) * (1 - breakAmount);

        const direction = link.end.clone().sub(link.start);
        const mid = link.start.clone().lerp(link.end, 0.5);
        const normal = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
        const gap = 0.08 + breakAmount * 0.38;
        const drift = normal.clone().multiplyScalar(breakAmount * 0.075);
        const leftEnd = mid.clone().sub(direction.clone().normalize().multiplyScalar(gap)).add(drift);
        const rightStart = mid.clone().add(direction.clone().normalize().multiplyScalar(gap)).sub(drift);

        (link.left.geometry.attributes.position.array as Float32Array).set([
          link.start.x, link.start.y, link.start.z,
          leftEnd.x, leftEnd.y, leftEnd.z,
        ]);
        (link.right.geometry.attributes.position.array as Float32Array).set([
          rightStart.x, rightStart.y, rightStart.z,
          link.end.x, link.end.y, link.end.z,
        ]);
        link.left.geometry.attributes.position.needsUpdate = true;
        link.right.geometry.attributes.position.needsUpdate = true;
        link.leftMaterial.opacity = breakAmount * 0.62;
        link.rightMaterial.opacity = breakAmount * 0.62;

        const progress = (elapsed * 0.34 + index * 0.18) % 1;
        link.pulse.position.copy(link.start.clone().add(direction.clone().multiplyScalar(progress)));
        link.pulse.rotation.z = Math.atan2(direction.y, direction.x);
        link.pulse.scale.setScalar(1 + repair * 1.6);
        link.pulseMaterial.color.setHex(repair > 0 ? 0x5eead4 : index % 2 === 0 ? 0x5eead4 : 0xf2b84b);
        link.pulseMaterial.opacity = build * (1 - breakAmount) * 0.22 + repair * 0.42;

        link.fault.position.copy(mid);
        link.fault.position.add(normal.multiplyScalar(Math.sin(elapsed * 32) * 0.018));
        link.fault.rotation.z = Math.atan2(direction.y, direction.x) + Math.PI / 2;
        link.fault.scale.set(1 + breakAmount * 2.0, 1 + Math.sin(elapsed * 40) * breakAmount * 0.4, 1);
        link.faultMaterial.opacity = breakAmount * 0.38;
      });

      renderer.render(scene, camera);

      if (!reducedMotion) {
        frameId = requestAnimationFrame(render);
      }
    };

    placeScene();
    window.addEventListener("resize", placeScene);
    window.addEventListener("pointermove", pointerMove, { passive: true });
    render();

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", placeScene);
      window.removeEventListener("pointermove", pointerMove);

      blockGeometry.dispose();
      edgeGeometry.dispose();
      glowGeometry.dispose();
      pulseGeometry.dispose();
      faultGeometry.dispose();

      blocks.forEach((block) => {
        block.body.dispose();
        block.edge.dispose();
        block.glow.dispose();
      });

      links.forEach((link) => {
        link.full.geometry.dispose();
        link.fullMaterial.dispose();
        link.left.geometry.dispose();
        link.leftMaterial.dispose();
        link.right.geometry.dispose();
        link.rightMaterial.dispose();
        link.pulseMaterial.dispose();
        link.faultMaterial.dispose();
      });

      renderer.dispose();
      renderer.forceContextLoss();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
};

export default ThreeParticlesBackground;
