"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  breathOffset: number;
  breathSpeed: number;
  glowTimer: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  sparkle: number;
}

interface GlassObject3D {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  size: number;
  type: "hexagon" | "cube" | "ring";
  opacity: number;
}

export default function Hero3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handle window dimensions
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      mouseRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3D Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let isActive = true;

    // Detect mobile
    const isMobile = dimensions.width < 768;
    const maxNodes = isMobile ? 30 : 70;
    const maxParticles = isMobile ? 20 : 50;
    const maxGlassObjects = isMobile ? 2 : 4;

    // Perspective parameters
    const fov = 400; // Focal length

    // Initialize 3D nodes
    const nodes: Node3D[] = [];
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: Math.random() * 600 - 300,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.25,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.25,
        vz: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.2,
        breathOffset: Math.random() * Math.PI * 2,
        breathSpeed: 0.01 + Math.random() * 0.015,
        glowTimer: Math.random() * 120
      });
    }

    // Initialize 3D particles
    const particles: Particle3D[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 800,
        z: Math.random() * 800 - 400,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.1,
        vy: prefersReducedMotion ? 0 : Math.random() * 0.15 + 0.08, // Float upward slowly
        size: Math.random() * 2.5 + 1.5,
        sparkle: Math.random()
      });
    }

    // Initialize 3D floating glass objects
    const glassObjects: GlassObject3D[] = [];
    const types: ("hexagon" | "cube" | "ring")[] = ["hexagon", "cube", "ring"];
    for (let i = 0; i < maxGlassObjects; i++) {
      glassObjects.push({
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.5) * 500,
        z: Math.random() * 400 - 200,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        size: Math.random() * 30 + 20,
        type: types[i % 3],
        opacity: Math.random() * 0.06 + 0.03
      });
    }

    // Grid details
    let gridOffsetZ = 0;
    let time = 0;
    let pulseTime = 0; // Track neural pulse (every 9 seconds = 540 frames at 60fps)

    const handleVisibilityChange = () => {
      isActive = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Main animation loop
    const animate = () => {
      if (!isActive) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        time += 1;
        pulseTime += 1;
        if (pulseTime > 540) {
          pulseTime = 0;
        }
      }

      // Smooth inertia mouse tracking
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      // Restrict mouse parallax maximum offset to 15px
      const rawMouseX = mouseRef.current.x;
      const rawMouseY = mouseRef.current.y;
      
      // Calculate Layer-Specific Parallax offsets (max 15px)
      // Gradient: least (max 5px)
      const gradParallaxX = rawMouseX * 5;
      const gradParallaxY = rawMouseY * 5;
      
      // Grid: max 8px
      const gridParallaxX = rawMouseX * 8;
      const gridParallaxY = rawMouseY * 8;

      // Network: max 12px
      const netParallaxX = rawMouseX * 12;
      const netParallaxY = rawMouseY * 12;

      // Particles & Glass: max 15px
      const partParallaxX = rawMouseX * 15;
      const partParallaxY = rawMouseY * 15;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Neural pulse radius propagation from center
      // Pulse travels outward from 0px to 1000px over the duration of the cycle
      const pulseRadius = (pulseTime / 540) * 1000;

      // Draw Layer 2: 3D Grid (very subtle tech grid)
      ctx.strokeStyle = "rgba(100, 150, 255, 0.035)";
      ctx.lineWidth = 0.8;
      if (!prefersReducedMotion) {
        gridOffsetZ -= 0.3; // slow grid movement forward
        if (gridOffsetZ < -200) gridOffsetZ = 0;
      }

      const gridSize = 140;
      const gridLines = 10;
      for (let i = -gridLines; i <= gridLines; i++) {
        const xStart3D = i * gridSize;
        const xEnd3D = i * gridSize;
        const yStart3D = -450;
        const yEnd3D = 450;

        for (let z = -200; z <= 600; z += 200) {
          const actualZ = z + gridOffsetZ;
          const scaleStart = fov / (fov + actualZ);
          const pxStart = centerX + (xStart3D + gridParallaxX) * scaleStart;
          const pyStart = centerY + (yStart3D - gridParallaxY) * scaleStart;
          const pxEnd = centerX + (xEnd3D + gridParallaxX) * scaleStart;
          const pyEnd = centerY + (yEnd3D - gridParallaxY) * scaleStart;

          ctx.beginPath();
          ctx.moveTo(pxStart, pyStart);
          ctx.lineTo(pxEnd, pyEnd);
          ctx.stroke();
        }
      }

      // Draw Ambient Glow Layer
      const ambientGlowScale = prefersReducedMotion ? 1 : 0.7 + Math.sin(time * 0.015) * 0.3; // 12-second cycle
      const gradientGlow = ctx.createRadialGradient(
        centerX + gradParallaxX, 
        centerY + gradParallaxY, 
        50, 
        centerX + gradParallaxX, 
        centerY + gradParallaxY, 
        350
      );
      gradientGlow.addColorStop(0, `rgba(14, 165, 233, ${0.11 * ambientGlowScale})`);
      gradientGlow.addColorStop(1, "rgba(14, 165, 233, 0)");
      ctx.fillStyle = gradientGlow;
      ctx.beginPath();
      ctx.arc(centerX + gradParallaxX, centerY + gradParallaxY, 380, 0, Math.PI * 2);
      ctx.fill();

      // Draw Glass Light Rays (Layer 5)
      const rayXOffset = prefersReducedMotion ? 0 : Math.sin(time * 0.001) * 30;
      const rayGlow = ctx.createLinearGradient(
        centerX - 400 + rayXOffset, -100, 
        centerX + 400 + rayXOffset, canvas.height + 100
      );
      rayGlow.addColorStop(0, "rgba(56, 189, 248, 0)");
      rayGlow.addColorStop(0.5, "rgba(56, 189, 248, 0.045)"); // very subtle ray opacity (below 5-8%)
      rayGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = rayGlow;
      ctx.beginPath();
      ctx.moveTo(-300 + rayXOffset + partParallaxX, -100);
      ctx.lineTo(centerX + 50 + rayXOffset + partParallaxX, -100);
      ctx.lineTo(canvas.width + 300 + rayXOffset + partParallaxX, canvas.height + 100);
      ctx.lineTo(centerX - 150 + rayXOffset + partParallaxX, canvas.height + 100);
      ctx.closePath();
      ctx.fill();

      // Draw Layer 3: 3D Neural Network
      // Step 1: Update node positions
      const projectedNodes = nodes.map(node => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          node.z += node.vz;

          // Random glow spark trigger (occurs occasionally for random node)
          node.glowTimer -= 1;
          if (node.glowTimer <= 0) {
            node.glowTimer = 240 + Math.random() * 240; // reset
          }
        }

        // Boundaries check
        if (Math.abs(node.x) > 520) node.vx *= -1;
        if (Math.abs(node.y) > 420) node.vy *= -1;
        if (node.z < -300 || node.z > 300) node.vz *= -1;

        // Perspective Projection + mouse Parallax
        const pz = node.z;
        const scale = fov / (fov + pz);
        const px = centerX + (node.x + netParallaxX) * scale;
        const py = centerY + (node.y - netParallaxY) * scale;

        // Breathing scale evaluation
        const breathScale = prefersReducedMotion 
          ? 1 
          : 1 + Math.sin(time * node.breathSpeed + node.breathOffset) * 0.15; // scale from 1.0 to 1.15

        // Check distance from center for neural pulse wave
        const distFromCenter = Math.hypot(node.x, node.y);
        const distDiff = Math.abs(distFromCenter - pulseRadius);
        let pulseBrightness = 0;
        if (distDiff < 180 && pulseTime > 0) {
          // Pulse wave intensity mapping
          pulseBrightness = (1 - distDiff / 180) * 1.6;
        }

        // Random glow trigger mapping
        let randomGlowBrightness = 0;
        if (node.glowTimer > 180) {
          randomGlowBrightness = Math.sin((node.glowTimer - 180) / 60 * Math.PI) * 0.8;
        }

        return { px, py, scale, z: node.z, breathScale, pulseBrightness, randomGlowBrightness };
      });

      // Step 2: Draw connection lines (Layer 2 & 3 combined)
      const connectionDist = 170;
      for (let i = 0; i < projectedNodes.length; i++) {
        const nodeA = nodes[i];
        const projA = projectedNodes[i];

        if (projA.px < -50 || projA.px > canvas.width + 50 || projA.py < -50 || projA.py > canvas.height + 50) continue;

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const nodeB = nodes[j];
          const projB = projectedNodes[j];

          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y, nodeA.z - nodeB.z);
          if (dist < connectionDist) {
            // Base connection opacity + line breathing pulse (6-10s cycles)
            const linePulse = prefersReducedMotion ? 1 : 0.85 + Math.abs(Math.sin(time * 0.004 + (i + j))) * 0.35;
            
            // Integrate neural wave pulse brightness
            const avgPulseBrightness = (projA.pulseBrightness + projB.pulseBrightness) / 2;
            const avgRandomBrightness = (projA.randomGlowBrightness + projB.randomGlowBrightness) / 2;

            const baseOpacity = (1 - dist / connectionDist) * 0.13 * (projA.scale * projB.scale) * linePulse;
            const finalOpacity = baseOpacity + (avgPulseBrightness * 0.15) + (avgRandomBrightness * 0.08);

            // Pulse traveling color vs normal blue-gray lines
            if (avgPulseBrightness > 0.1) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${finalOpacity * 1.8})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(148, 163, 184, ${finalOpacity})`;
              ctx.lineWidth = 0.7;
            }

            ctx.beginPath();
            ctx.moveTo(projA.px, projA.py);
            ctx.lineTo(projB.px, projB.py);
            ctx.stroke();
          }
        }
      }

      // Step 3: Draw network node points
      for (let i = 0; i < projectedNodes.length; i++) {
        const proj = projectedNodes[i];
        if (proj.px < -50 || proj.px > canvas.width + 50 || proj.py < -50 || proj.py > canvas.height + 50) continue;

        // Size adapts to 3D depth scale and breathing scale
        const baseSize = Math.max(1.2, 3 * proj.scale);
        const finalSize = baseSize * proj.breathScale;

        // Color maps based on neural pulse wave or random spark glow
        const glowFactor = proj.pulseBrightness + proj.randomGlowBrightness;
        
        if (glowFactor > 0.15) {
          ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(1.0, 0.75 + glowFactor * 0.2)})`;
        } else {
          ctx.fillStyle = `rgba(14, 165, 233, ${0.45 * proj.scale})`;
        }

        ctx.beginPath();
        ctx.arc(proj.px, proj.py, finalSize, 0, Math.PI * 2);
        ctx.fill();

        // Node Glow halos
        const haloAlpha = 0.14 + (glowFactor * 0.35);
        ctx.fillStyle = `rgba(56, 189, 248, ${haloAlpha * proj.scale})`;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, finalSize * (2.2 + glowFactor * 1.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Layer 4: Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y -= p.vy; // Float up
          p.sparkle += 0.007;

          if (p.y < -500) p.y = 500;
          if (Math.abs(p.x) > 600) p.vx *= -1;
        }

        const pz = p.z;
        const scale = fov / (fov + pz);
        const px = centerX + (p.x + partParallaxX) * scale;
        const py = centerY + (p.y - partParallaxY) * scale;

        if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) continue;

        // Sparkle oscillation between 10% and 15% opacity
        const alphaScale = prefersReducedMotion ? 1 : 0.7 + Math.abs(Math.sin(p.sparkle)) * 0.3;
        const alpha = 0.11 * alphaScale * scale;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Layer 5: Floating 3D Glass Objects
      for (let i = 0; i < glassObjects.length; i++) {
        const obj = glassObjects[i];
        if (!prefersReducedMotion) {
          obj.rx += 0.0015;
          obj.ry += 0.001;
          obj.rz += 0.0005;
        }

        const pz = obj.z;
        const scale = fov / (fov + pz);
        const px = centerX + (obj.x + partParallaxX) * scale;
        const py = centerY + (obj.y - partParallaxY) * scale;

        if (px < -100 || px > canvas.width + 100 || py < -100 || py > canvas.height + 100) continue;

        ctx.strokeStyle = `rgba(255, 255, 255, ${obj.opacity})`;
        ctx.lineWidth = 0.8;

        if (obj.type === "hexagon") {
          ctx.beginPath();
          const sides = 6;
          for (let j = 0; j < sides; j++) {
            const angle = (j / sides) * Math.PI * 2 + obj.rz;
            const hx = px + Math.cos(angle) * obj.size * scale;
            const hy = py + Math.sin(angle) * obj.size * scale;
            if (j === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = `rgba(56, 189, 248, ${obj.opacity * 0.15})`;
          ctx.fill();
        } else if (obj.type === "ring") {
          ctx.beginPath();
          ctx.arc(px, py, obj.size * scale, 0, Math.PI * 2);
          ctx.stroke();
        } else if (obj.type === "cube") {
          const size = obj.size * 0.65 * scale;
          ctx.strokeRect(px - size, py - size, size * 2, size * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${obj.opacity * 0.1})`;
          ctx.fillRect(px - size, py - size, size * 2, size * 2);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dimensions, prefersReducedMotion]);

  return (
    <div className="absolute inset-0 z-0 bg-[#060c14] overflow-hidden">
      {/* Slow Moving Blurred Mesh Spheres - Layer 1 (Mesh Gradient 30-60s loop) */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.12, 0.93, 1],
          x: [0, 60, -40, 0],
          y: [0, -50, 30, 0]
        }}
        transition={{ repeat: Infinity, duration: 45, ease: "easeInOut" }}
        className="absolute top-[8%] left-[18%] w-[580px] h-[580px] bg-slate-900/60 rounded-full blur-[140px] opacity-75 pointer-events-none"
      />
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 0.88, 1.08, 1],
          x: [0, -70, 50, 0],
          y: [0, 40, -30, 0]
        }}
        transition={{ repeat: Infinity, duration: 55, ease: "easeInOut", delay: 2.5 }}
        className="absolute bottom-[12%] right-[12%] w-[480px] h-[480px] bg-sky-950/25 rounded-full blur-[120px] opacity-65 pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay pointer-events-none"></div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
