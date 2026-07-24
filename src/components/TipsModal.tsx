import React from 'react';
import { KINEMATIC_TIPS } from '../data/tipsData';
import { MotorState, SphericalSystem, PhysicsParams } from '../types';
import { Sparkles, X, Zap, Activity, Compass, Sun, Copy, TrendingUp, Code, ArrowRight } from 'lucide-react';

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  motor: MotorState;
  setMotor: React.Dispatch<React.SetStateAction<MotorState>>;
  spherical: SphericalSystem;
  setSpherical: React.Dispatch<React.SetStateAction<SphericalSystem>>;
  params: PhysicsParams;
  setParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-5 h-5 text-amber-400" />,
  Activity: <Activity className="w-5 h-5 text-sky-400" />,
  Compass: <Compass className="w-5 h-5 text-purple-400" />,
  Sun: <Sun className="w-5 h-5 text-amber-300" />,
  Copy: <Copy className="w-5 h-5 text-emerald-400" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-rose-400" />,
  Code: <Code className="w-5 h-5 text-indigo-400" />,
};

export const TipsModal: React.FC<TipsModalProps> = ({
  isOpen,
  onClose,
  motor,
  setMotor,
  spherical,
  setSpherical,
  params,
  setParams,
}) => {
  if (!isOpen) return null;

  const handleApplyTip = (tipId: number) => {
    const tip = KINEMATIC_TIPS.find((t) => t.id === tipId);
    if (!tip) return;
    const result = tip.applyPreset(motor, spherical, params);
    setMotor(result.motor);
    setSpherical(result.spherical);
    setParams(result.params);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-6 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">7 KINEMATIC PRO TIPS</h3>
              <p className="text-2xs text-slate-400">Mastering Central Motor & Orbital System Mechanics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tips Cards List */}
        <div className="grid grid-cols-1 gap-3">
          {KINEMATIC_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="bg-slate-950 hover:bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-start justify-between gap-4 transition-all group"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 mt-0.5 shrink-0">
                  {ICON_MAP[tip.iconName] || <Zap className="w-5 h-5 text-sky-400" />}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xs font-mono font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
                      TIP 0{tip.id}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-100">{tip.title}</h4>
                  </div>
                  <p className="text-2xs text-slate-400 leading-relaxed">{tip.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleApplyTip(tip.id)}
                className="shrink-0 px-3 py-2 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer group-hover:shadow-md"
              >
                <span>Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
