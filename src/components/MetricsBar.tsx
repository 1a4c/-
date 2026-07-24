import React from 'react';
import { MotorState, SphericalSystem, PhysicsParams, LeashedBall, ScatteredParticle } from '../types';
import { Activity, Zap, Compass, Waves, Database } from 'lucide-react';

interface MetricsBarProps {
  motor: MotorState;
  spherical: SphericalSystem;
  params: PhysicsParams;
  balls: LeashedBall[];
  particles: ScatteredParticle[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  motor,
  spherical,
  params,
  balls,
  particles,
}) => {
  // Calculate total kinetic energy
  const totalKineticEnergy = balls.reduce((acc, b) => {
    const v2 = b.vx * b.vx + b.vy * b.vy + b.vz * b.vz;
    return acc + 0.5 * b.mass * v2;
  }, 0);

  const totalConsumedEnergy = balls.reduce((acc, b) => acc + b.consumedEnergy, 0);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-lg grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-slate-200">
      {/* Metric 1: Central Motor Status */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-400">
          <Zap className="w-3.5 h-3.5 text-sky-400" /> MOTOR RPM
        </div>
        <div className="text-sm font-mono font-bold text-sky-300">
          {motor.rpm} <span className="text-3xs text-slate-500 font-normal">RPM</span>
        </div>
        <div className="text-3xs text-slate-500 truncate">
          Torque: {motor.torque}%
        </div>
      </div>

      {/* Metric 2: Kinetic Energy */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-400">
          <Activity className="w-3.5 h-3.5 text-rose-400" /> KINETIC $E_k$
        </div>
        <div className="text-sm font-mono font-bold text-rose-300">
          {totalKineticEnergy.toFixed(1)} <span className="text-3xs text-slate-500 font-normal">J</span>
        </div>
        <div className="text-3xs text-slate-500 truncate">
          Consumed: {totalConsumedEnergy.toFixed(0)} E
        </div>
      </div>

      {/* Metric 3: Spherical Coordinates */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-400">
          <Compass className="w-3.5 h-3.5 text-purple-400" /> VECTOR ($\phi, \theta$)
        </div>
        <div className="text-sm font-mono font-bold text-purple-300">
          {spherical.phi}° / {spherical.theta}°
        </div>
        <div className="text-3xs text-slate-500 truncate">
          Symmetry: {spherical.mirrorSymmetry}x
        </div>
      </div>

      {/* Metric 4: Wave Amplification */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-400">
          <Waves className="w-3.5 h-3.5 text-emerald-400" /> SUB-AMP WIDTH
        </div>
        <div className="text-sm font-mono font-bold text-emerald-300">
          {params.subAmplifiedWidth.toFixed(1)} <span className="text-3xs text-slate-500 font-normal">px</span>
        </div>
        <div className="text-3xs text-slate-500 truncate">
          Stiffness: {params.leashStiffness.toFixed(2)}
        </div>
      </div>

      {/* Metric 5: Gravitational Growth */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-400">
          <Database className="w-3.5 h-3.5 text-amber-400" /> GAV GROWTH
        </div>
        <div className="text-sm font-mono font-bold text-amber-300">
          {params.gravityGrowth.toFixed(1)}x
        </div>
        <div className="text-3xs text-slate-500 truncate">
          Bodies: {balls.length}
        </div>
      </div>

      {/* Metric 6: Code Scatter Queue */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-400">
          <Zap className="w-3.5 h-3.5 text-indigo-400" /> SCATTER QUEUE
        </div>
        <div className="text-sm font-mono font-bold text-indigo-300">
          {particles.length} <span className="text-3xs text-slate-500 font-normal">codes</span>
        </div>
        <div className="text-3xs text-slate-500 truncate">
          Chaos: {(params.logitChaos * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
};
