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
  type: "hexagon" | "pyramid" | "cube" | "ring";
  opacity: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number;
  b: number;
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
    const maxNodes = isMobile ? 25 : 60;
    const maxParticles = isMobile ? 20 : 45;
    const maxGlassObjects = isMobile ? 2 : 4;

    const fov = 420;

    // 1. Generate Hologram Trophy Vertices and Edges
    const trophyVertices: Point3D[] = [];
    const trophyEdges: Edge[] = [];
    const segments = 10;
    const heights = [
      { y: -130, r: 30 }, // rim
      { y: -110, r: 28 },
      { y: -90, r: 24 },
      { y: -70, r: 14 },  // cup base
      { y: -70, r: 4 },   // stem top
      { y: -35, r: 4 },   // stem base
      { y: -35, r: 12 },  // base top
      { y: -10, r: 22 },  // base bottom
    ];

    let vertexOffset = 0;
    heights.forEach((h, idx) => {
      for (let s = 0; s < segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        trophyVertices.push({
          x: Math.cos(angle) * h.r,
          y: h.y,
          z: Math.sin(angle) * h.r
        });
        
        // Horizontal connection
        trophyEdges.push({
          a: vertexOffset + s,
          b: vertexOffset + ((s + 1) % segments)
        });

        // Vertical connection to previous circle
        if (idx > 0) {
          trophyEdges.push({
            a: vertexOffset + s,
            b: vertexOffset - segments + s
          });
        }
      }
      vertexOffset += segments;
    });

    // Add Handles to Trophy
    const handleSegs = 6;
    const leftHandleStart = trophyVertices.length;
    for (let i = 0; i <= handleSegs; i++) {
      const t = i / handleSegs;
      const cy = -130 + t * 60;
      const cx = -26 - Math.sin(t * Math.PI) * 16;
      trophyVertices.push({ x: cx, y: cy, z: 0 });
      if (i > 0) {
        trophyEdges.push({ a: leftHandleStart + i - 1, b: leftHandleStart + i });
      }
    }
    // Connect handles to cup
    trophyEdges.push({ a: leftHandleStart, b: 0 });
    trophyEdges.push({ a: leftHandleStart + handleSegs, b: 3 * segments });

    const rightHandleStart = trophyVertices.length;
    for (let i = 0; i <= handleSegs; i++) {
      const t = i / handleSegs;
      const cy = -130 + t * 60;
      const cx = 26 + Math.sin(t * Math.PI) * 16;
      trophyVertices.push({ x: cx, y: cy, z: 0 });
      if (i > 0) {
        trophyEdges.push({ a: rightHandleStart + i - 1, b: rightHandleStart + i });
      }
    }
    trophyEdges.push({ a: rightHandleStart, b: segments / 2 });
    trophyEdges.push({ a: rightHandleStart + handleSegs, b: 3 * segments + segments / 2 });

    // Initialize 3D nodes (Layer 3)
    const nodes: Node3D[] = [];
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 500 - 50,
        z: Math.random() * 600 - 300,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.25,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.25,
        vz: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.2,
        breathOffset: Math.random() * Math.PI * 2,
        breathSpeed: 0.008 + Math.random() * 0.012,
        glowTimer: Math.random() * 120
      });
    }

    // Initialize 3D particles (Layer 4)
    const particles: Particle3D[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 800,
        z: Math.random() * 800 - 400,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.08,
        vy: prefersReducedMotion ? 0 : Math.random() * 0.12 + 0.06,
        size: Math.random() * 2 + 1,
        sparkle: Math.random()
      });
    }

    // Initialize 3D floating glass objects (Layer 5)
    const glassObjects: GlassObject3D[] = [];
    const types: ("hexagon" | "pyramid" | "cube" | "ring")[] = ["hexagon", "pyramid", "cube", "ring"];
    for (let i = 0; i < maxGlassObjects; i++) {
      glassObjects.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 400 - 100,
        z: Math.random() * 400 - 200,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        size: Math.random() * 25 + 15,
        type: types[i % 4],
        opacity: Math.random() * 0.05 + 0.03
      });
    }

    let time = 0;
    let pulseTime = 0;

    const handleVisibilityChange = () => {
      isActive = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Main render loop
    const animate = () => {
      if (!isActive) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        time += 1;
        pulseTime += 1;
        if (pulseTime > 540) pulseTime = 0; // 9s loop
      }

      // Parallax calculations
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Parallax offsets (restricted to 15px max)
      const gradParallaxX = mouseX * 5;
      const gradParallaxY = mouseY * 5;
      const gridParallaxX = mouseX * 8;
      const gridParallaxY = mouseY * 8;
      const netParallaxX = mouseX * 12;
      const netParallaxY = mouseY * 12;
      const trophyParallaxX = mouseX * 10;
      const trophyParallaxY = mouseY * 10;
      const partParallaxX = mouseX * 15;
      const partParallaxY = mouseY * 15;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Vertical offset adjustment for pedestal placement
      const pY = centerY + 30;

      // 1. Draw Layer 1: Center Ambient Glow
      const ambientGlowScale = prefersReducedMotion ? 1 : 0.75 + Math.sin(time * 0.015) * 0.25;
      const ambientGlow = ctx.createRadialGradient(
        centerX + gradParallaxX,
        pY + gradParallaxY,
        10,
        centerX + gradParallaxX,
        pY + gradParallaxY,
        280
      );
      ambientGlow.addColorStop(0, `rgba(14, 165, 233, ${0.14 * ambientGlowScale})`);
      ambientGlow.addColorStop(0.5, `rgba(56, 189, 248, ${0.06 * ambientGlowScale})`);
      ambientGlow.addColorStop(1, "rgba(6, 12, 20, 0)");
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(centerX + gradParallaxX, pY + gradParallaxY, 300, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Diagonal Light Rays
      const rayXOffset = prefersReducedMotion ? 0 : Math.sin(time * 0.0008) * 40;
      const rayGradient = ctx.createLinearGradient(
        centerX - 350 + rayXOffset, -100,
        centerX + 350 + rayXOffset, canvas.height + 100
      );
      rayGradient.addColorStop(0, "rgba(56, 189, 248, 0)");
      rayGradient.addColorStop(0.5, "rgba(56, 189, 248, 0.04)");
      rayGradient.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = rayGradient;
      ctx.beginPath();
      ctx.moveTo(-200 + rayXOffset + netParallaxX, -100);
      ctx.lineTo(centerX + 80 + rayXOffset + netParallaxX, -100);
      ctx.lineTo(canvas.width + 200 + rayXOffset + netParallaxX, canvas.height + 100);
      ctx.lineTo(centerX - 100 + rayXOffset + netParallaxX, canvas.height + 100);
      ctx.closePath();
      ctx.fill();

      // 3. Draw Wavy Grid/Landscape at the bottom (Inspired by futuristic wireframe wave)
      if (!isMobile) {
        ctx.strokeStyle = "rgba(100, 150, 255, 0.03)";
        ctx.lineWidth = 0.7;
        const meshRows = 10;
        const meshCols = 16;
        const spacingX = 90;
        const spacingZ = 45;
        const waveBaseY = pY + 120;

        for (let r = 0; r < meshRows; r++) {
          ctx.beginPath();
          for (let c = 0; c < meshCols; c++) {
            const x3d = (c - meshCols / 2) * spacingX;
            const z3d = r * spacingZ + 120;

            // Sine wave height deformation
            const waveAngle = x3d * 0.004 + z3d * 0.005 + (prefersReducedMotion ? 0 : time * 0.015);
            const heightDeform = Math.sin(waveAngle) * 20;

            const scale = fov / (fov + z3d);
            const px = centerX + (x3d + gridParallaxX) * scale;
            const py = waveBaseY + (heightDeform - gridParallaxY) * scale;

            if (c === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // 4. Draw Pedestal / Podium rings under the trophy
      const drawPedestalRings = () => {
        const ringsCount = 4;
        ctx.lineWidth = 1.2;
        
        for (let i = 0; i < ringsCount; i++) {
          const baseRadius = 55 + i * 24;
          const scale = fov / (fov + 100); // fixed relative depth
          
          const rx = baseRadius * scale;
          const ry = (baseRadius * 0.25) * scale; // flatten into perspective ellipse
          const px = centerX + trophyParallaxX;
          const py = pY + 80 + i * 8 - trophyParallaxY;

          // Pulse base ring glow
          const ringPulse = prefersReducedMotion ? 1 : 0.8 + Math.sin(time * 0.03 - i * 0.5) * 0.2;
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * ringPulse * (1 - i / ringsCount)})`;
          
          ctx.beginPath();
          ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Bottom reflection pedestal filled deck
          if (i === 0) {
            ctx.fillStyle = "rgba(12, 25, 40, 0.65)";
            ctx.beginPath();
            ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };
      drawPedestalRings();

      // 5. Draw Orbiting Ring around the trophy
      const drawOrbitRing = () => {
        if (prefersReducedMotion) return;
        ctx.strokeStyle = "rgba(56, 189, 248, 0.07)";
        ctx.lineWidth = 0.8;
        const orbitRadius = 110;
        const scale = fov / (fov + 100);
        
        ctx.beginPath();
        ctx.ellipse(
          centerX + trophyParallaxX,
          pY - 40 - trophyParallaxY,
          orbitRadius * scale,
          (orbitRadius * 0.3) * scale,
          Math.PI / 8 + Math.sin(time * 0.005) * 0.05, // slow tilting angle rotation
          0,
          Math.PI * 2
        );
        ctx.stroke();
      };
      drawOrbitRing();

      // 6. Draw Hologram Trophy in 3D
      const drawTrophy = () => {
        const trophyRotationY = prefersReducedMotion ? 0.3 : time * 0.008; // slow Y axis rotation
        const cosY = Math.cos(trophyRotationY);
        const sinY = Math.sin(trophyRotationY);
        const cosX = Math.cos(0.08); // Slight forward camera tilt
        const sinX = Math.sin(0.08);

        // Project vertices
        const projectedTrophy = trophyVertices.map(v => {
          // Y-rotation
          let x1 = v.x * cosY - v.z * sinY;
          let z1 = v.x * sinY + v.z * cosY;

          // X-tilt
          let y2 = v.y * cosX - z1 * sinX;
          let z2 = v.y * sinX + z1 * cosX;

          // Depth offset
          const pz = z2 + 100;
          const scale = fov / (fov + pz);
          const px = centerX + (x1 + trophyParallaxX) * scale;
          const py = pY + 50 + (y2 - trophyParallaxY) * scale; // anchor to podium height

          return { px, py, scale };
        });

        // Draw Edges
        ctx.lineWidth = 0.6;
        trophyEdges.forEach(edge => {
          const ptA = projectedTrophy[edge.a];
          const ptB = projectedTrophy[edge.b];
          
          // Fade based on z-depth
          const avgScale = (ptA.scale + ptB.scale) / 2;
          const baseOpacity = 0.28 * avgScale;
          
          // Sync with the pulse wave
          const distA = Math.hypot(ptA.px - centerX, ptA.py - pY);
          const distDiff = Math.abs(distA - (pulseTime / 540) * 800);
          let edgeGlow = 0;
          if (distDiff < 140) {
            edgeGlow = (1 - distDiff / 140) * 0.35;
          }

          ctx.strokeStyle = `rgba(56, 189, 248, ${baseOpacity + edgeGlow})`;
          ctx.beginPath();
          ctx.moveTo(ptA.px, ptA.py);
          ctx.lineTo(ptB.px, ptB.py);
          ctx.stroke();
        });

        // Highlight vertex dots
        ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
        projectedTrophy.forEach((v, index) => {
          if (index % 2 === 0) {
            ctx.beginPath();
            ctx.arc(v.px, v.py, 1.2 * v.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      };
      drawTrophy();

      // 7. Draw Layer 3: 3D Neural Network Nodes & Connections
      const pulseRadius = (pulseTime / 540) * 1100;

      const projectedNodes = nodes.map(node => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          node.z += node.vz;

          node.glowTimer -= 1;
          if (node.glowTimer <= 0) {
            node.glowTimer = 200 + Math.random() * 200;
          }
        }

        if (Math.abs(node.x) > 520) node.vx *= -1;
        if (Math.abs(node.y) > 420) node.vy *= -1;
        if (node.z < -300 || node.z > 300) node.vz *= -1;

        const scale = fov / (fov + node.z);
        const px = centerX + (node.x + netParallaxX) * scale;
        const py = centerY - 50 + (node.y - netParallaxY) * scale; // shifted up slightly

        const breathScale = prefersReducedMotion 
          ? 1 
          : 1 + Math.sin(time * node.breathSpeed + node.breathOffset) * 0.15;

        // Neural Pulse distance calculation from center
        const distFromCenter = Math.hypot(node.x, node.y);
        const distDiff = Math.abs(distFromCenter - pulseRadius);
        let pulseBrightness = 0;
        if (distDiff < 160 && pulseTime > 0) {
          pulseBrightness = (1 - distDiff / 160) * 1.5;
        }

        let randomGlowBrightness = 0;
        if (node.glowTimer > 150) {
          randomGlowBrightness = Math.sin((node.glowTimer - 150) / 50 * Math.PI) * 0.7;
        }

        return { px, py, scale, z: node.z, breathScale, pulseBrightness, randomGlowBrightness };
      });

      // Connections lines draw
      const connectionDist = 160;
      for (let i = 0; i < projectedNodes.length; i++) {
        const nodeA = nodes[i];
        const projA = projectedNodes[i];
        if (projA.px < -50 || projA.px > canvas.width + 50 || projA.py < -50 || projA.py > canvas.height + 50) continue;

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const nodeB = nodes[j];
          const projB = projectedNodes[j];

          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y, nodeA.z - nodeB.z);
          if (dist < connectionDist) {
            const linePulse = prefersReducedMotion ? 1 : 0.8 + Math.abs(Math.sin(time * 0.005 + (i + j))) * 0.4;
            const avgPulse = (projA.pulseBrightness + projB.pulseBrightness) / 2;
            const avgRandom = (projA.randomGlowBrightness + projB.randomGlowBrightness) / 2;

            const baseOpacity = (1 - dist / connectionDist) * 0.12 * (projA.scale * projB.scale) * linePulse;
            const finalOpacity = baseOpacity + (avgPulse * 0.16) + (avgRandom * 0.08);

            if (avgPulse > 0.1) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${finalOpacity * 1.6})`;
              ctx.lineWidth = 1.0;
            } else {
              ctx.strokeStyle = `rgba(148, 163, 184, ${finalOpacity})`;
              ctx.lineWidth = 0.6;
            }

            ctx.beginPath();
            ctx.moveTo(projA.px, projA.py);
            ctx.lineTo(projB.px, projB.py);
            ctx.stroke();
          }
        }
      }

      // Nodes draw
      for (let i = 0; i < projectedNodes.length; i++) {
        const proj = projectedNodes[i];
        if (proj.px < -50 || proj.px > canvas.width + 50 || proj.py < -50 || proj.py > canvas.height + 50) continue;

        const baseSize = Math.max(1, 2.5 * proj.scale);
        const finalSize = baseSize * proj.breathScale;

        const glowFactor = proj.pulseBrightness + proj.randomGlowBrightness;

        if (glowFactor > 0.1) {
          ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(1.0, 0.7 + glowFactor * 0.25)})`;
        } else {
          ctx.fillStyle = `rgba(14, 165, 233, ${0.45 * proj.scale})`;
        }

        ctx.beginPath();
        ctx.arc(proj.px, proj.py, finalSize, 0, Math.PI * 2);
        ctx.fill();

        // Glow halos
        const haloAlpha = 0.1 + (glowFactor * 0.3);
        ctx.fillStyle = `rgba(56, 189, 248, ${haloAlpha * proj.scale})`;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, finalSize * (2.0 + glowFactor * 1.2), 0, Math.PI * 2);
        ctx.fill();
      }

      // 8. Draw Layer 4: Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y -= p.vy;
          p.sparkle += 0.007;

          if (p.y < -500) p.y = 500;
          if (Math.abs(p.x) > 600) p.vx *= -1;
        }

        const scale = fov / (fov + p.z);
        const px = centerX + (p.x + partParallaxX) * scale;
        const py = centerY + (p.y - partParallaxY) * scale;

        if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) continue;

        const alphaScale = prefersReducedMotion ? 1 : 0.7 + Math.abs(Math.sin(p.sparkle)) * 0.3;
        const alpha = 0.11 * alphaScale * scale;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // 9. Draw Layer 5: Floating 3D Glass Polygons
      for (let i = 0; i < glassObjects.length; i++) {
        const obj = glassObjects[i];
        if (!prefersReducedMotion) {
          obj.rx += 0.001;
          obj.ry += 0.0008;
          obj.rz += 0.0004;
        }

        const scale = fov / (fov + obj.z);
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
          const size = obj.size * 0.6 * scale;
          ctx.strokeRect(px - size, py - size, size * 2, size * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${obj.opacity * 0.1})`;
          ctx.fillRect(px - size, py - size, size * 2, size * 2);
        } else if (obj.type === "pyramid") {
          // Draw a wireframe tetrahedron (3D pyramid)
          const size = obj.size * scale;
          const h = size * Math.sqrt(3) / 2;
          
          ctx.beginPath();
          // Draw bottom triangle
          ctx.moveTo(px, py - h/2);
          ctx.lineTo(px - size/2, py + h/2);
          ctx.lineTo(px + size/2, py + h/2);
          ctx.closePath();
          ctx.stroke();

          // Connect vertices to top peak rotating offset
          const peakX = px + Math.cos(obj.rx) * 8 * scale;
          const peakY = py - size * 0.8;
          ctx.beginPath();
          ctx.moveTo(px, py - h/2);
          ctx.lineTo(peakX, peakY);
          ctx.lineTo(px - size/2, py + h/2);
          ctx.moveTo(px + size/2, py + h/2);
          ctx.lineTo(peakX, peakY);
          ctx.stroke();
          
          ctx.fillStyle = `rgba(56, 189, 248, ${obj.opacity * 0.12})`;
          ctx.fill();
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
      {/* Mesh Gradient Blurred Vector Spheres */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.15, 0.9, 1],
          x: [0, 80, -50, 0],
          y: [0, -60, 40, 0]
        }}
        transition={{ repeat: Infinity, duration: 40, ease: "easeInOut" }}
        className="absolute top-[8%] left-[18%] w-[600px] h-[600px] bg-slate-900/60 rounded-full blur-[140px] opacity-75 pointer-events-none"
      />
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 0.85, 1.1, 1],
          x: [0, -90, 60, 0],
          y: [0, 50, -40, 0]
        }}
        transition={{ repeat: Infinity, duration: 50, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-sky-950/25 rounded-full blur-[120px] opacity-65 pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay pointer-events-none"></div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
