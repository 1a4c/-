import React, { useState } from 'react';
import { MotorState, SphericalSystem, PhysicsParams, LeashedBall } from '../types';
import { Sliders, Sun, Gauge, RotateCcw, Plus, Trash2, Shield, Eye, Layers } from 'lucide-react';

interface ControlsPanelProps {
  motor: MotorState;
  setMotor: React.Dispatch<React.SetStateAction<MotorState>>;
  spherical: SphericalSystem;
  setSpherical: React.Dispatch<React.SetStateAction<SphericalSystem>>;
  params: PhysicsParams;
  setParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
  balls: LeashedBall[];
  setBalls: React.Dispatch<React.SetStateAction<LeashedBall[]>>;
  onAddBall: () => void;
  onClearBalls: () => void;
  onResetDefault: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  motor,
  setMotor,
  spherical,
  setSpherical,
  params,
  setParams,
  balls,
  setBalls,
  onAddBall,
  onClearBalls,
  onResetDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'motor' | 'spherical' | 'kinetics' | 'display'>('motor');

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5 text-slate-200">
      {/* Panel Header & Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-sky-400" />
          <h2 className="font-semibold text-slate-100 text-sm tracking-wide">SYSTEM CONTROLS</h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('motor')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'motor' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Motor Core
          </button>
          <button
            onClick={() => setActiveTab('spherical')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'spherical' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Phi/Theta Matrix
          </button>
          <button
            onClick={() => setActiveTab('kinetics')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'kinetics' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Growth & Leash
          </button>
          <button
            onClick={() => setActiveTab('display')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'display' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Display & Opts
          </button>
        </div>
      </div>

      {/* Tab 1: Motor Core Controls */}
      {activeTab === 'motor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Motor Speed RPM */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Central Motor Speed (RPM)</span>
              <span className="font-mono text-sky-400 font-bold">{motor.rpm} RPM</span>
            </div>
            <input
              type="range"
              min="0"
              max="240"
              value={motor.rpm}
              onChange={(e) => setMotor({ ...motor, rpm: Number(e.target.value) })}
              className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-3xs text-slate-500">Drives static central motor rotational torque and tangential propulsion.</p>
          </div>

          {/* Motor Torque */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Motor Pulse Torque</span>
              <span className="font-mono text-rose-400 font-bold">{motor.torque}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={motor.torque}
              onChange={(e) => setMotor({ ...motor, torque: Number(e.target.value) })}
              className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-3xs text-slate-500">Transfers kinetic acceleration to attached leashed balls.</p>
          </div>

          {/* Solar Light Direction & Intensity */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Intensity & Optics
              </span>
              <span className="font-mono text-amber-400 font-bold">{motor.solarIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={motor.solarIntensity}
              onChange={(e) => setMotor({ ...motor, solarIntensity: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-between text-2xs text-slate-400 mt-1">
              <span>Sun Angle: {motor.solarAngle}°</span>
              <button
                onClick={() => setMotor({ ...motor, solarAngle: (motor.solarAngle + 45) % 360 })}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Rotate Solar Ray
              </button>
            </div>
          </div>

          {/* Core Toggles & Pulse Action */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-3 gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={motor.magneticPulse}
                  onChange={(e) => setMotor({ ...motor, magneticPulse: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-rose-500 w-4 h-4"
                />
                Magnetic Pulse Coil
              </label>
            </div>

            <button
              onClick={() => {
                setMotor({ ...motor, isPropelling: true });
                setTimeout(() => setMotor((m) => ({ ...m, isPropelling: false })), 600);
              }}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer active:scale-95"
            >
              ⚡ PROPEL MOTOR IMPULSE
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Spherical Phi / Theta Coordinate System */}
      {activeTab === 'spherical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Azimuth Angle Phi */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Azimuth Angle ($\phi$)</span>
              <span className="font-mono text-purple-400 font-bold">{spherical.phi}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={spherical.phi}
              onChange={(e) => setSpherical({ ...spherical, phi: Number(e.target.value) })}
              className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-3xs text-slate-500">Horizontal rotation of orbital projection plane.</p>
          </div>

          {/* Polar Elevation Angle Theta */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Polar Elevation Angle ($\theta$)</span>
              <span className="font-mono text-emerald-400 font-bold">{spherical.theta}°</span>
            </div>
            <input
              type="range"
              min="-85"
              max="85"
              value={spherical.theta}
              onChange={(e) => setSpherical({ ...spherical, theta: Number(e.target.value) })}
              className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-3xs text-slate-500">Vertical tilt of spherical coordinate frame.</p>
          </div>

          {/* Mirror Processed Symmetry */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Mirror Processed Symmetry</span>
              <span className="font-mono text-sky-400 font-bold">{spherical.mirrorSymmetry}x</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {([1, 2, 4, 8] as const).map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSpherical({ ...spherical, mirrorSymmetry: sym })}
                  className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    spherical.mirrorSymmetry === sym
                      ? 'bg-purple-500 text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sym}x
                </button>
              ))}
            </div>
            <p className="text-3xs text-slate-500">Polar kaleidoscope mirror reflection matrix.</p>
          </div>
        </div>
      )}

      {/* Tab 3: Kinetics, Leash Waves & Gravity Growth */}
      {activeTab === 'kinetics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Sub-Amplified Wave Width */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Sub-Amplified Wave Width</span>
              <span className="font-mono text-sky-400 font-bold">{params.subAmplifiedWidth.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={params.subAmplifiedWidth}
              onChange={(e) => setParams({ ...params, subAmplifiedWidth: Number(e.target.value) })}
              className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-3xs text-slate-500">Amplitude & stroke width of spring leash wave harmonics.</p>
          </div>

          {/* Gravitational Mass Growth ex.Gav_growth() */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Gravitational Growth [ex.Gav_growth]</span>
              <span className="font-mono text-emerald-400 font-bold">{params.gravityGrowth.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.1"
              value={params.gravityGrowth}
              onChange={(e) => setParams({ ...params, gravityGrowth: Number(e.target.value) })}
              className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-3xs text-slate-500">Continuous mass & radius accumulation rate of orbiting bodies.</p>
          </div>

          {/* Logit Chaos Factor */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Logit Chaos Particles</span>
              <span className="font-mono text-amber-400 font-bold">{(params.logitChaos * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={params.logitChaos}
              onChange={(e) => setParams({ ...params, logitChaos: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-3xs text-slate-500">Frequency of code particle emissions into scatter queue.</p>
          </div>
        </div>
      )}

      {/* Tab 4: Display & Quick Actions */}
      {activeTab === 'display' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
            <span className="text-xs font-medium text-slate-300">Visual Overlays</span>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={params.showLabels}
                onChange={(e) => setParams({ ...params, showLabels: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-sky-500 w-4 h-4"
              />
              Show Body Labels
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={params.showTrajectories}
                onChange={(e) => setParams({ ...params, showTrajectories: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-sky-500 w-4 h-4"
              />
              Show Orbital Trails
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={params.showVectors}
                onChange={(e) => setParams({ ...params, showVectors: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-sky-500 w-4 h-4"
              />
              Show Velocity Vectors
            </label>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Plus className="w-4 h-4 text-emerald-400" /> Ball Management
            </div>
            <div className="flex gap-2">
              <button
                onClick={onAddBall}
                className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                + Add Ball
              </button>
              <button
                onClick={onClearBalls}
                className="py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <RotateCcw className="w-4 h-4 text-sky-400" /> Default System Reset
            </div>
            <button
              onClick={onResetDefault}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              Reset All Parameters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
