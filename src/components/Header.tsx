import React from 'react';
import { Play, Pause, RotateCcw, Sparkles, Sun, Cpu } from 'lucide-react';
import { PRESET_CONFIGS } from '../data/tipsData';
import { MotorState, SphericalSystem, PhysicsParams } from '../types';

interface HeaderProps {
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenTips: () => void;
  onReset: () => void;
  motor: MotorState;
  setMotor: React.Dispatch<React.SetStateAction<MotorState>>;
  spherical: SphericalSystem;
  setSpherical: React.Dispatch<React.SetStateAction<SphericalSystem>>;
  params: PhysicsParams;
  setParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
}

export const Header: React.FC<HeaderProps> = ({
  isPaused,
  setIsPaused,
  onOpenTips,
  onReset,
  motor,
  setMotor,
  spherical,
  setSpherical,
  params,
  setParams,
}) => {
  const handleSelectPreset = (presetName: string) => {
    const preset = PRESET_CONFIGS.find((p) => p.name === presetName);
    if (!preset) return;
    if (preset.motor) setMotor((m) => ({ ...m, ...preset.motor }));
    if (preset.spherical) setSpherical((s) => ({ ...s, ...preset.spherical }));
    if (preset.params) setParams((p) => ({ ...p, ...preset.params }));
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between flex-wrap gap-4 shadow-md text-slate-100">
      {/* App Branding */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20 text-slate-950 font-bold">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-wide text-slate-100">
              SOLAR KINETIC CENTRAL MOTOR
            </h1>
            <span className="text-3xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
              v2.8
            </span>
          </div>
          <p className="text-2xs text-slate-400 font-mono">
            desoluted_static_central_motor :: phi_theta.logit_de-gen
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <Sun className="w-4 h-4 text-amber-400 ml-1" />
          <select
            onChange={(e) => handleSelectPreset(e.target.value)}
            defaultValue=""
            className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer pr-2"
          >
            <option value="" disabled>Select Preset Scene...</option>
            {PRESET_CONFIGS.map((p) => (
              <option key={p.name} value={p.name} className="bg-slate-900 text-slate-200">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* 7 Tips Button */}
        <button
          onClick={onOpenTips}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-sky-500/20 hover:from-amber-500/30 hover:to-sky-500/30 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>7-Tips Guide</span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow ${
            isPaused
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-all cursor-pointer"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
