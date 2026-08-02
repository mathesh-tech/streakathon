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
    const maxNodes = isMobile ? 35 : 85;
    const maxParticles = isMobile ? 25 : 60;
    const maxGlassObjects = isMobile ? 2 : 5;

    // Perspective parameters
    const fov = 400; // Focal length

    // Initialize 3D nodes
    const nodes: Node3D[] = [];
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: Math.random() * 600 - 300,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3
      });
    }

    // Initialize 3D particles
    const particles: Particle3D[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 800,
        z: Math.random() * 800 - 400,
        vx: (Math.random() - 0.5) * 0.15,
        vy: Math.random() * 0.2 + 0.1, // Float upward slowly
        size: Math.random() * 3 + 1.5,
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
        size: Math.random() * 40 + 20,
        type: types[i % 3],
        opacity: Math.random() * 0.08 + 0.04
      });
    }

    // Grid details
    let gridOffsetZ = 0;

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

      // Smooth inertia mouse tracking
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw Layer 1: Background Gradient mesh is handled via wrapper CSS for maximum frame rate efficiency.
      
      // Draw Layer 2: 3D Grid
      ctx.strokeStyle = "rgba(100, 150, 255, 0.04)";
      ctx.lineWidth = 1;
      gridOffsetZ -= 0.5; // slow grid movement forward
      if (gridOffsetZ < -200) gridOffsetZ = 0;

      const gridSize = 120;
      const gridLines = 14;
      for (let i = -gridLines; i <= gridLines; i++) {
        // Vertical lines
        const xStart3D = i * gridSize;
        const xEnd3D = i * gridSize;
        const yStart3D = -400;
        const yEnd3D = 400;

        for (let z = -200; z <= 600; z += 200) {
          const actualZ = z + gridOffsetZ + (mouseX * 40); // Mouse parallax depth
          const scaleStart = fov / (fov + actualZ);
          const pxStart = centerX + (xStart3D + mouseX * 25) * scaleStart;
          const pyStart = centerY + (yStart3D - mouseY * 15) * scaleStart;
          const pxEnd = centerX + (xEnd3D + mouseX * 25) * scaleStart;
          const pyEnd = centerY + (yEnd3D - mouseY * 15) * scaleStart;

          ctx.beginPath();
          ctx.moveTo(pxStart, pyStart);
          ctx.lineTo(pxEnd, pyEnd);
          ctx.stroke();
        }
      }

      // Draw Layer 3: 3D Neural Network
      // Step 1: Update node positions and apply mouse parallax offsets
      const projectedNodes = nodes.map(node => {
        // Physics movement
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Boundaries check
        if (Math.abs(node.x) > 500) node.vx *= -1;
        if (Math.abs(node.y) > 400) node.vy *= -1;
        if (node.z < -300 || node.z > 300) node.vz *= -1;

        // Perspective Projection + mouse Parallax
        const pz = node.z + (mouseX * 50); // z + mouse parallax
        const scale = fov / (fov + pz);
        const px = centerX + (node.x + mouseX * 35) * scale;
        const py = centerY + (node.y - mouseY * 25) * scale;

        return { px, py, scale, z: node.z };
      });

      // Step 2: Draw connections
      ctx.lineWidth = 0.8;
      const connectionDist = 160;
      for (let i = 0; i < projectedNodes.length; i++) {
        const nodeA = nodes[i];
        const projA = projectedNodes[i];

        if (projA.px < 0 || projA.px > canvas.width || projA.py < 0 || projA.py > canvas.height) continue;

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const nodeB = nodes[j];
          const projB = projectedNodes[j];

          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y, nodeA.z - nodeB.z);
          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.15 * (projA.scale * projB.scale);
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
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
        if (proj.px < 0 || proj.px > canvas.width || proj.py < 0 || proj.py > canvas.height) continue;

        const size = Math.max(1, 3 * proj.scale);
        ctx.fillStyle = "rgba(14, 165, 233, 0.6)";
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, size, 0, Math.PI * 2);
        ctx.fill();

        // Node Glow
        ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Layer 4: Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y -= p.vy; // Float up
        p.sparkle += 0.01;

        if (p.y < -500) p.y = 500;
        if (Math.abs(p.x) > 600) p.vx *= -1;

        const pz = p.z + (mouseX * 70); // Stronger parallax for foreground
        const scale = fov / (fov + pz);
        const px = centerX + (p.x + mouseX * 55) * scale;
        const py = centerY + (p.y - mouseY * 35) * scale;

        if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) continue;

        // Sparkle oscillation
        const alpha = (0.05 + Math.abs(Math.sin(p.sparkle)) * 0.15) * scale;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Layer 5: Floating 3D Glass Objects
      for (let i = 0; i < glassObjects.length; i++) {
        const obj = glassObjects[i];
        obj.rx += 0.003;
        obj.ry += 0.002;
        obj.rz += 0.001;

        const pz = obj.z + (mouseX * 110); // Strongest parallax
        const scale = fov / (fov + pz);
        const px = centerX + (obj.x + mouseX * 75) * scale;
        const py = centerY + (obj.y - mouseY * 45) * scale;

        if (px < -100 || px > canvas.width + 100 || py < -100 || py > canvas.height + 100) continue;

        ctx.strokeStyle = `rgba(255, 255, 255, ${obj.opacity})`;
        ctx.lineWidth = 1;

        // Draw hexagon, cube, or ring based on type
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
          
          // Soft fill to create glasspanel effect
          ctx.fillStyle = `rgba(56, 189, 248, ${obj.opacity * 0.25})`;
          ctx.fill();
        } else if (obj.type === "ring") {
          ctx.beginPath();
          ctx.arc(px, py, obj.size * scale, 0, Math.PI * 2);
          ctx.stroke();
        } else if (obj.type === "cube") {
          // Simplistic wireframe 3D cube projection
          const size = obj.size * 0.7 * scale;
          ctx.strokeRect(px - size, py - size, size * 2, size * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${obj.opacity * 0.15})`;
          ctx.fillRect(px - size, py - size, size * 2, size * 2);
        }
      }

      // Draw Light Rays
      ctx.fillStyle = "rgba(14, 165, 233, 0.005)";
      ctx.beginPath();
      ctx.moveTo(-100, -100);
      ctx.lineTo(canvas.width * 0.4, -100);
      ctx.lineTo(canvas.width, canvas.height * 0.8);
      ctx.lineTo(canvas.width, canvas.height + 100);
      ctx.lineTo(-100, canvas.height + 100);
      ctx.closePath();
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dimensions]);

  return (
    <div className="absolute inset-0 z-0 bg-[#060c14] overflow-hidden">
      {/* Slow Moving Blurred Mesh Spheres */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.9, 1],
          x: [0, 80, -50, 0],
          y: [0, -60, 40, 0]
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[550px] h-[550px] bg-slate-900/60 rounded-full blur-[140px] opacity-70 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 0.85, 1.1, 1],
          x: [0, -90, 60, 0],
          y: [0, 50, -40, 0]
        }}
        transition={{ repeat: Infinity, duration: 30, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[15%] right-[15%] w-[450px] h-[450px] bg-sky-950/30 rounded-full blur-[120px] opacity-60 pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
