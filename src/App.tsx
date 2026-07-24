import React, { useState } from 'react';
import { MotorState, SphericalSystem, PhysicsParams, LeashedBall, ScatteredParticle } from './types';
import { generateInitialBalls } from './utils/physics';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { TipsModal } from './components/TipsModal';
import { X, Sparkles, Layers } from 'lucide-react';

export default function App() {
  // Central Motor State
  const [motor, setMotor] = useState<MotorState>({
    rpm: 60,
    angle: 0,
    torque: 50,
    coreRadius: 36,
    solarAngle: 35,
    solarIntensity: 70,
    magneticPulse: false,
    isPropelling: false,
  });

  // Spherical Coordinate Matrix (elected_system_phi_theta)
  const [spherical, setSpherical] = useState<SphericalSystem>({
    phi: 25,
    theta: 15,
    depthScale: 1.0,
    mirrorSymmetry: 1,
  });

  // Physics & Kinematics Parameters
  const [params, setParams] = useState<PhysicsParams>({
    gravityGrowth: 0.2,
    leashStiffness: 0.08,
    subAmplifiedWidth: 5.0,
    damping: 0.98,
    boundaryRadius: 320,
    logitChaos: 0.35,
    batchSpawnRate: 10,
    codeScatterQueueSize: 150,
    showVectors: false,
    showLabels: true,
    showTrajectories: true,
  });

  // Orbital Bodies & Particle Queue
  const [balls, setBalls] = useState<LeashedBall[]>(generateInitialBalls);
  const [particles, setParticles] = useState<ScatteredParticle[]>([]);

  // App UI State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTipsOpen, setIsTipsOpen] = useState<boolean>(false);
  const [selectedBall, setSelectedBall] = useState<LeashedBall | null>(null);

  const handleAddBall = () => {
    const colors = ['#38bdf8', '#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
    const idx = balls.length + 1;
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 100;

    const newBall: LeashedBall = {
      id: `ball-${Date.now()}`,
      label: `BALL_${idx}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      z: (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      vz: (Math.random() - 0.5) * 1.5,
      radius: 12 + Math.random() * 6,
      mass: 1.0,
      color: colors[idx % colors.length],
      tetherLength: distance,
      stiffness: 0.08,
      growthFactor: 1.0,
      consumedEnergy: 0,
      attachedToMotor: true,
      history: [],
    };

    setBalls((prev) => [...prev, newBall]);
  };

  const handleClearBalls = () => {
    setBalls([]);
    setSelectedBall(null);
  };

  const handleResetDefault = () => {
    setMotor({
      rpm: 60,
      angle: 0,
      torque: 50,
      coreRadius: 36,
      solarAngle: 35,
      solarIntensity: 70,
      magneticPulse: false,
      isPropelling: false,
    });
    setSpherical({
      phi: 25,
      theta: 15,
      depthScale: 1.0,
      mirrorSymmetry: 1,
    });
    setParams({
      gravityGrowth: 0.2,
      leashStiffness: 0.08,
      subAmplifiedWidth: 5.0,
      damping: 0.98,
      boundaryRadius: 320,
      logitChaos: 0.35,
      batchSpawnRate: 10,
      codeScatterQueueSize: 150,
      showVectors: false,
      showLabels: true,
      showTrajectories: true,
    });
    setBalls(generateInitialBalls());
    setParticles([]);
    setSelectedBall(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* App Top Header */}
      <Header
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        onOpenTips={() => setIsTipsOpen(true)}
        onReset={handleResetDefault}
        motor={motor}
        setMotor={setMotor}
        spherical={spherical}
        setSpherical={setSpherical}
        params={params}
        setParams={setParams}
      />

      {/* Main App Workspace */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-5">
        {/* Real-Time Telemetry Bar */}
        <MetricsBar
          motor={motor}
          spherical={spherical}
          params={params}
          balls={balls}
          particles={particles}
        />

        {/* Central Simulation Canvas & Selected Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch min-h-[500px]">
          {/* Main Visualizer Stage */}
          <div className="lg:col-span-3 flex flex-col h-full min-h-[480px]">
            <SimulationCanvas
              motor={motor}
              spherical={spherical}
              params={params}
              balls={balls}
              setBalls={setBalls}
              particles={particles}
              setParticles={setParticles}
              isPaused={isPaused}
              onSelectBall={(b) => setSelectedBall(b)}
              selectedBallId={selectedBall?.id}
            />
          </div>

          {/* Side Inspector Panel (Leashed Ball Properties & Quick Queue) */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>BODY INSPECTOR</span>
                </div>
                {selectedBall && (
                  <button
                    onClick={() => setSelectedBall(null)}
                    className="text-slate-400 hover:text-slate-200 text-3xs"
                  >
                    Deselect
                  </button>
                )}
              </div>

              {selectedBall ? (
                <div className="flex flex-col gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{selectedBall.label}</span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedBall.color }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-2xs font-mono">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <div className="text-slate-500">Radius</div>
                      <div className="text-sky-300">{selectedBall.radius.toFixed(1)} px</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <div className="text-slate-500">Mass</div>
                      <div className="text-emerald-300">{selectedBall.mass.toFixed(2)} kg</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <div className="text-slate-500">Tether L</div>
                      <div className="text-purple-300">{selectedBall.tetherLength.toFixed(0)} px</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <div className="text-slate-500">Consumed</div>
                      <div className="text-amber-300">{selectedBall.consumedEnergy.toFixed(1)} E</div>
                    </div>
                  </div>

                  {/* Detach / Delete */}
                  <button
                    onClick={() => {
                      setBalls((prev) => prev.filter((b) => b.id !== selectedBall.id));
                      setSelectedBall(null);
                    }}
                    className="mt-1 w-full py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-2xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
                  >
                    Detach & Remove Body
                  </button>
                </div>
              ) : (
                <div className="text-2xs text-slate-500 p-4 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                  Click any orbiting ball on canvas to inspect tether dynamics, mass growth, and energy profile.
                </div>
              )}
            </div>

            {/* Quick 7-Tips Banner */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-2xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>7-TIPS KINEMATIC GUIDE</span>
              </div>
              <p className="text-3xs text-slate-400 leading-relaxed">
                Explore wave sub-amplification width, phi-theta spherical angles, and ex.Gav_growth kinetics.
              </p>
              <button
                onClick={() => setIsTipsOpen(true)}
                className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-2xs rounded-lg transition-all cursor-pointer"
              >
                Open 7-Tips Guide
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Interactive Controls Panel */}
        <ControlsPanel
          motor={motor}
          setMotor={setMotor}
          spherical={spherical}
          setSpherical={setSpherical}
          params={params}
          setParams={setParams}
          balls={balls}
          setBalls={setBalls}
          onAddBall={handleAddBall}
          onClearBalls={handleClearBalls}
          onResetDefault={handleResetDefault}
        />
      </main>

      {/* 7 Kinematic Tips Modal */}
      <TipsModal
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
        motor={motor}
        setMotor={setMotor}
        spherical={spherical}
        setSpherical={setSpherical}
        params={params}
        setParams={setParams}
      />
    </div>
  );
}
