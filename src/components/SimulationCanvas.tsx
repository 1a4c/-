import React, { useRef, useEffect, useState } from 'react';
import { LeashedBall, ScatteredParticle, MotorState, SphericalSystem, PhysicsParams } from '../types';
import { project3D, updatePhysics } from '../utils/physics';

interface SimulationCanvasProps {
  motor: MotorState;
  spherical: SphericalSystem;
  params: PhysicsParams;
  balls: LeashedBall[];
  setBalls: React.Dispatch<React.SetStateAction<LeashedBall[]>>;
  particles: ScatteredParticle[];
  setParticles: React.Dispatch<React.SetStateAction<ScatteredParticle[]>>;
  isPaused: boolean;
  onSelectBall?: (ball: LeashedBall) => void;
  selectedBallId?: string | null;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  motor,
  spherical,
  params,
  balls,
  setBalls,
  particles,
  setParticles,
  isPaused,
  onSelectBall,
  selectedBallId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggedBallRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [fps, setFps] = useState<number>(60);

  // Keep state refs in sync for animation frame loop
  const motorRef = useRef(motor);
  const sphericalRef = useRef(spherical);
  const paramsRef = useRef(params);
  const ballsRef = useRef(balls);
  const particlesRef = useRef(particles);
  const isPausedRef = useRef(isPaused);

  useEffect(() => { motorRef.current = motor; }, [motor]);
  useEffect(() => { sphericalRef.current = spherical; }, [spherical]);
  useEffect(() => { paramsRef.current = params; }, [params]);
  useEffect(() => { ballsRef.current = balls; }, [balls]);
  useEffect(() => { particlesRef.current = particles; }, [particles]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(300, Math.floor(width)),
          height: Math.max(300, Math.floor(height)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsTimer)));
        frameCount = 0;
        fpsTimer = now;
      }

      const curWidth = dimensions.width;
      const curHeight = dimensions.height;
      const centerX = curWidth / 2;
      const centerY = curHeight / 2;

      // Update motor rotation angle
      if (!isPausedRef.current) {
        motorRef.current.angle += ((motorRef.current.rpm * 2 * Math.PI) / 60) * dt;
      }

      // Physics update step
      if (!isPausedRef.current) {
        const { updatedBalls, updatedParticles } = updatePhysics(
          ballsRef.current,
          particlesRef.current,
          motorRef.current,
          paramsRef.current,
          dt,
          curWidth,
          curHeight
        );
        ballsRef.current = updatedBalls;
        particlesRef.current = updatedParticles;
        setBalls(updatedBalls);
        setParticles(updatedParticles);
      }

      // Clear Canvas with subtle dark space grid background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, curWidth, curHeight);

      // Draw faint background coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < curWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, curHeight);
        ctx.stroke();
      }
      for (let y = 0; y < curHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(curWidth, y);
        ctx.stroke();
      }

      // Solar Directional Light Ray Overlay
      if (motorRef.current.solarIntensity > 0) {
        const solarRad = (motorRef.current.solarAngle * Math.PI) / 180;
        const sunX = centerX + Math.cos(solarRad) * (Math.min(curWidth, curHeight) * 0.45);
        const sunY = centerY + Math.sin(solarRad) * (Math.min(curWidth, curHeight) * 0.45);

        const solarGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180);
        solarGlow.addColorStop(0, `rgba(251, 191, 36, ${0.35 * (motorRef.current.solarIntensity / 100)})`);
        solarGlow.addColorStop(0.5, `rgba(245, 158, 11, ${0.1 * (motorRef.current.solarIntensity / 100)})`);
        solarGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = solarGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
        ctx.fill();

        // Sun Core
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 8 + (motorRef.current.solarIntensity / 20), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Helper function to render full system scene
      const drawScene = () => {
        const curSpherical = sphericalRef.current;
        const curParams = paramsRef.current;
        const curMotor = motorRef.current;

        // Project Central Motor Position (0, 0, 0)
        const centerProj = project3D(0, 0, 0, centerX, centerY, curSpherical);

        // Boundary leash ring
        const boundProj = project3D(curParams.boundaryRadius, 0, 0, centerX, centerY, curSpherical);
        const boundRadius = Math.abs(boundProj.sx - centerProj.sx);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(centerProj.sx, centerProj.sy, Math.max(10, boundRadius), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Render Trajectories
        if (curParams.showTrajectories) {
          ballsRef.current.forEach((ball) => {
            if (ball.history.length > 1) {
              ctx.beginPath();
              ctx.strokeStyle = `${ball.color}44`;
              ctx.lineWidth = 1.5;
              for (let i = 0; i < ball.history.length; i++) {
                const pt = ball.history[i];
                const proj = project3D(pt.x, pt.y, pt.z, centerX, centerY, curSpherical);
                if (i === 0) ctx.moveTo(proj.sx, proj.sy);
                else ctx.lineTo(proj.sx, proj.sy);
              }
              ctx.stroke();
            }
          });
        }

        // Render Sub-Amplified Spring Leashes (Motor Core -> Ball)
        ballsRef.current.forEach((ball) => {
          if (!ball.attachedToMotor) return;

          const proj = project3D(ball.x, ball.y, ball.z, centerX, centerY, curSpherical);

          // Calculate sub-amplified width sine wave tether
          const dx = proj.sx - centerProj.sx;
          const dy = proj.sy - centerProj.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const segments = 24;

          const baseWidth = Math.max(1, curParams.subAmplifiedWidth * proj.scale * 0.4);

          ctx.strokeStyle = ball.color;
          ctx.lineWidth = baseWidth;
          ctx.shadowColor = ball.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(centerProj.sx, centerProj.sy);

          const perpX = -dy / (dist || 1);
          const perpY = dx / (dist || 1);

          for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const px = centerProj.sx + dx * t;
            const py = centerProj.sy + dy * t;

            // Sine wave amplitude scaled by subAmplifiedWidth
            const wave = Math.sin(t * Math.PI * 6 - curMotor.angle * 3) * curParams.subAmplifiedWidth * Math.sin(t * Math.PI);
            const wx = px + perpX * wave;
            const wy = py + perpY * wave;

            ctx.lineTo(wx, wy);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        });

        // Render Central Static/Rotational Motor
        const motorRadius = Math.max(15, curMotor.coreRadius * centerProj.scale);

        // Magnetic pulse rings
        if (curMotor.magneticPulse) {
          const pulseRadius = motorRadius + (Math.sin(Date.now() / 150) + 1) * 12;
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerProj.sx, centerProj.sy, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Motor Outer Rotor Gear
        ctx.save();
        ctx.translate(centerProj.sx, centerProj.sy);
        ctx.rotate(curMotor.angle);

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = curMotor.isPropelling ? '#f43f5e' : '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, motorRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Motor Rotor Spokes / Coils
        const spokes = 8;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        for (let i = 0; i < spokes; i++) {
          const spAngle = (i / spokes) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(spAngle) * motorRadius, Math.sin(spAngle) * motorRadius);
          ctx.stroke();
        }
        ctx.restore();

        // Motor Inner Glowing Core
        const coreGradient = ctx.createRadialGradient(
          centerProj.sx,
          centerProj.sy,
          0,
          centerProj.sx,
          centerProj.sy,
          motorRadius * 0.6
        );
        coreGradient.addColorStop(0, curMotor.isPropelling ? '#ffe4e6' : '#e0f2fe');
        coreGradient.addColorStop(0.6, curMotor.isPropelling ? '#f43f5e' : '#0284c7');
        coreGradient.addColorStop(1, '#0f172a');

        ctx.fillStyle = coreGradient;
        ctx.shadowColor = curMotor.isPropelling ? '#f43f5e' : '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(centerProj.sx, centerProj.sy, motorRadius * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Render Scattered Code Particles Queue (codes_scattered()_queue)
        particlesRef.current.forEach((p) => {
          const proj = project3D(p.x, p.y, p.z, centerX, centerY, curSpherical);
          ctx.fillStyle = `${p.color}${Math.floor(p.life * 255).toString(16).padStart(2, '0')}`;
          ctx.font = `${Math.max(9, Math.floor(p.size * proj.scale))}px monospace`;
          ctx.fillText(p.codeSnippet, proj.sx, proj.sy);
        });

        // Render Leashed Rounded Balls (consumed_bounded_leashed_labeled.rounded)
        ballsRef.current.forEach((ball) => {
          const proj = project3D(ball.x, ball.y, ball.z, centerX, centerY, curSpherical);
          const scaledRadius = Math.max(6, ball.radius * proj.scale);

          // Is selected?
          const isSelected = selectedBallId === ball.id;

          // Energy Halo
          if (ball.consumedEnergy > 0) {
            ctx.strokeStyle = `${ball.color}66`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(proj.sx, proj.sy, scaledRadius + 4 + Math.sin(Date.now() / 200) * 2, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Ball Gradient Surface
          const ballGrad = ctx.createRadialGradient(
            proj.sx - scaledRadius * 0.3,
            proj.sy - scaledRadius * 0.3,
            scaledRadius * 0.1,
            proj.sx,
            proj.sy,
            scaledRadius
          );
          ballGrad.addColorStop(0, '#ffffff');
          ballGrad.addColorStop(0.3, ball.color);
          ballGrad.addColorStop(1, '#0f172a');

          ctx.fillStyle = ballGrad;
          ctx.shadowColor = ball.color;
          ctx.shadowBlur = isSelected ? 20 : 10;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, scaledRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (isSelected) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(proj.sx, proj.sy, scaledRadius + 2, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Ball Label Badge
          if (curParams.showLabels) {
            ctx.font = 'bold 11px system-ui, sans-serif';
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';

            // Background pill
            const textWidth = ctx.measureText(ball.label).width;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.fillRect(proj.sx - textWidth / 2 - 4, proj.sy + scaledRadius + 4, textWidth + 8, 16);

            ctx.fillStyle = ball.color;
            ctx.fillText(ball.label, proj.sx, proj.sy + scaledRadius + 16);
          }

          // Vector Arrows
          if (curParams.showVectors) {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(proj.sx, proj.sy);
            ctx.lineTo(proj.sx + ball.vx * 6, proj.sy + ball.vy * 6);
            ctx.stroke();
          }
        });
      };

      // Mirror Processed Symmetry Rendering (mirror_processed())
      const sym = sphericalRef.current.mirrorSymmetry || 1;
      if (sym === 1) {
        drawScene();
      } else {
        ctx.save();
        ctx.translate(centerX, centerY);
        for (let i = 0; i < sym; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI * 2) / sym);
          ctx.translate(-centerX, -centerY);
          drawScene();
          ctx.restore();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  // Mouse Interactivity for Dragging & Launching Balls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Check if clicked central motor
    const motorDist = Math.hypot(mx - centerX, my - centerY);
    if (motorDist < motor.coreRadius + 15) {
      // Trigger motor burst propulsion
      motorRef.current.isPropelling = true;
      setTimeout(() => {
        motorRef.current.isPropelling = false;
      }, 500);
      return;
    }

    // Find clicked ball
    for (const ball of ballsRef.current) {
      const proj = project3D(ball.x, ball.y, ball.z, centerX, centerY, sphericalRef.current);
      const dist = Math.hypot(mx - proj.sx, my - proj.sy);
      if (dist <= ball.radius + 10) {
        draggedBallRef.current = { id: ball.id, offsetX: mx - proj.sx, offsetY: my - proj.sy };
        if (onSelectBall) onSelectBall(ball);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedBallRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Drag ball position in 3D relative to center
    const targetX = mx - centerX;
    const targetY = my - centerY;

    setBalls((prev) =>
      prev.map((b) => {
        if (b.id === draggedBallRef.current?.id) {
          return {
            ...b,
            x: targetX,
            y: targetY,
            vx: 0,
            vy: 0,
          };
        }
        return b;
      })
    );
  };

  const handleMouseUp = () => {
    draggedBallRef.current = null;
  };

  // Double click to spawn new attached ball
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const relX = mx - centerX;
    const relY = my - centerY;
    const dist = Math.hypot(relX, relY);

    const colors = ['#38bdf8', '#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
    const newId = `ball-${Date.now()}`;
    const newBall: LeashedBall = {
      id: newId,
      label: `BALL_${balls.length + 1}`,
      x: relX,
      y: relY,
      z: 0,
      vx: -relY * 0.05,
      vy: relX * 0.05,
      vz: (Math.random() - 0.5) * 2,
      radius: 12 + Math.random() * 4,
      mass: 1.0,
      color: colors[balls.length % colors.length],
      tetherLength: Math.max(60, dist),
      stiffness: 0.1,
      growthFactor: 1.0,
      consumedEnergy: 0,
      attachedToMotor: true,
      history: [],
    };

    setBalls((prev) => [...prev, newBall]);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Canvas Overlay Diagnostics */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1 text-xs font-mono text-slate-400 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 font-semibold text-sky-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          KINEMATIC ENGINE ACTIVE
        </div>
        <div>FPS: <span className="text-slate-200">{fps}</span></div>
        <div>Phi ($\phi$): <span className="text-slate-200">{spherical.phi}°</span> | Theta ($\theta$): <span className="text-slate-200">{spherical.theta}°</span></div>
        <div>Motor RPM: <span className="text-sky-300">{motor.rpm}</span></div>
        <div>Active Balls: <span className="text-amber-300">{balls.length}</span></div>
        <div>Mirror Symmetry: <span className="text-purple-300">{spherical.mirrorSymmetry}x</span></div>
      </div>

      <div className="absolute bottom-4 left-4 pointer-events-none text-3xs font-mono text-slate-500 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800">
        Double click: Spawn Ball | Drag: Stretch Leash | Click Motor: Impulse
      </div>
    </div>
  );
};
