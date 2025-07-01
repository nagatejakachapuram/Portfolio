import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

const ThreeParticlesBackground = () => {
  // 1. Fix: Specify the type for mountRef.current
  const mountRef = useRef<HTMLDivElement>(null);
  // 2. Fix: Specify the type for animationRef.current (requestAnimationFrame returns a number)
  const animationRef = useRef<number | null>(null); // To store the animation frame ID

  const initThree = useCallback(() => {
    // Ensure mountRef.current is not null before proceeding
    const currentMount = mountRef.current;
    if (!currentMount) {
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 3. Fix: currentMount is now guaranteed to be HTMLDivElement
    currentMount.appendChild(renderer.domElement);

    // Position camera slightly back
    camera.position.z = 5;

    // 2. Create particles
    const particleCount = 1000; // Number of particles
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // x, y, z for each particle
    const velocities = new Float32Array(particleCount * 3); // velocity for each particle
    const colors = new Float32Array(particleCount * 3); // RGB for each particle

    const color1 = new THREE.Color(0x38bdf8); // Sky blue
    const color2 = new THREE.Color(0xc084fc); // Purple
    const color3 = new THREE.Color(0x4ade80); // Green

    for (let i = 0; i < particleCount; i++) {
      // Random positions within a cube
      positions[i * 3] = (Math.random() - 0.5) * 10; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

      // Random velocities for subtle movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

      // Assign random colors
      const selectedColor =
        i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
      colors[i * 3] = selectedColor.r;
      colors[i * 3 + 1] = selectedColor.g;
      colors[i * 3 + 2] = selectedColor.b;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3)); // Add color attribute

    // Particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05, // Size of particles
      vertexColors: true, // Use colors from geometry
      blending: THREE.AdditiveBlending, // For glowing effect
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true, // Particles closer to camera appear larger
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // 3. Animation loop
    const animate = () => {
      // Move particles
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap around effect (if particle goes too far, bring it back)
        if (Math.abs(positions[i * 3]) > 5) positions[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 5) positions[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 5) positions[i * 3 + 2] *= -1;
      }
      particles.attributes.position.needsUpdate = true; // Tell Three.js to update positions

      // Rotate the particle system subtly
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.0005;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate); // Store the ID
    };

    animate();

    // 4. Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 5. Cleanup on unmount
    return () => {
      // 4. Fix: Ensure animationRef.current is a number before passing to cancelAnimationFrame
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current); // Stop animation
      }
      window.removeEventListener("resize", handleResize);
      // 5. Fix: currentMount is already checked to be non-null at the top,
      //    but good to double check renderer.domElement before removing
      if (currentMount.contains(renderer.domElement)) {
        // Use .contains for safer removal
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose(); // Release WebGL resources
      particleMaterial.dispose();
      particles.dispose();
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    initThree();
  }, [initThree]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default ThreeParticlesBackground;
