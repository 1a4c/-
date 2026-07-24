import { KinematicTip, PresetConfig } from '../types';

export const KINEMATIC_TIPS: KinematicTip[] = [
  {
    id: 1,
    title: 'Central Motor Resonance Sync',
    subtitle: '7-Tips: Motor Frequency Calibration',
    description: 'Harmonize central motor RPM with leash spring stiffness to trigger chaotic orbital resonance patterns and maximum torque output.',
    iconName: 'Zap',
    applyPreset: (m, s, p) => ({
      motor: { ...m, rpm: 120, torque: 85, magneticPulse: true },
      spherical: { ...s, phi: 45, theta: 25 },
      params: { ...p, leashStiffness: 0.15, subAmplifiedWidth: 8.5 },
    }),
  },
  {
    id: 2,
    title: 'Sub-Amplified Wave Width Tuning',
    subtitle: '7-Tips: Wave Mechanics & Tether Tension',
    description: 'Increase sub-amplified width parameter to inject high-frequency harmonic sine waves into the spring leashes connecting attached balls.',
    iconName: 'Activity',
    applyPreset: (m, s, p) => ({
      motor: { ...m, rpm: 80, torque: 60 },
      spherical: { ...s, phi: 90, theta: 0 },
      params: { ...p, subAmplifiedWidth: 14.0, leashStiffness: 0.12 },
    }),
  },
  {
    id: 3,
    title: 'Spherical Coordinate Projection (Phi/Theta)',
    subtitle: '7-Tips: 3D Orbital Inclination Matrix',
    description: 'Tilt the primary rotation plane using Azimuth (Phi) and Elevation (Theta) controls to examine 3D gyroscopic force distribution.',
    iconName: 'Compass',
    applyPreset: (m, s, p) => ({
      motor: { ...m, rpm: 95 },
      spherical: { ...s, phi: 135, theta: 45, depthScale: 1.25 },
      params: { ...p, showTrajectories: true, showVectors: true },
    }),
  },
  {
    id: 4,
    title: 'Solar Lighting Radiation Pressure',
    subtitle: '7-Tips: Solar Vector Optics',
    description: 'Activate solar directional illumination to exert photon momentum on consumed bounded bodies and illuminate particle queues.',
    iconName: 'Sun',
    applyPreset: (m, s, p) => ({
      motor: { ...m, solarAngle: 45, solarIntensity: 90 },
      spherical: { ...s, phi: 60, theta: -30 },
      params: { ...p, codeScatterQueueSize: 200, logitChaos: 0.7 },
    }),
  },
  {
    id: 5,
    title: 'Mirror Processed Symmetry Overlay',
    subtitle: '7-Tips: Polar Mirror Matrix',
    description: 'Process motion vectors through a radial mirror matrix (2x, 4x, or 8x reflection symmetry) for kaleidoscope kinetic balance.',
    iconName: 'Copy',
    applyPreset: (m, s, p) => ({
      motor: { ...m, rpm: 110, torque: 75 },
      spherical: { ...s, mirrorSymmetry: 8, phi: 0, theta: 0 },
      params: { ...p, subAmplifiedWidth: 6.0, logitChaos: 0.85 },
    }),
  },
  {
    id: 6,
    title: 'Gravitational Mass Growth Kinetics',
    subtitle: '7-Tips: ex.Gav_growth() Accumulation',
    description: 'Enable mass growth factors to continuously scale ball radii and mass based on velocity energy absorption.',
    iconName: 'TrendingUp',
    applyPreset: (m, s, p) => ({
      motor: { ...m, rpm: 70, isPropelling: true },
      spherical: { ...s, phi: 30, theta: 20 },
      params: { ...p, gravityGrowth: 1.8, leashStiffness: 0.2 },
    }),
  },
  {
    id: 7,
    title: 'Logit Scatter Queue Burst Engine',
    subtitle: '7-Tips: Stochastic Code Queue Emission',
    description: 'Trigger high logit chaos to stream dynamic code particle queues from trailing ball vectors into the orbital void.',
    iconName: 'Code',
    applyPreset: (m, s, p) => ({
      motor: { ...m, rpm: 140, torque: 100 },
      spherical: { ...s, phi: 210, theta: 35 },
      params: { ...p, logitChaos: 1.0, codeScatterQueueSize: 300, batchSpawnRate: 25 },
    }),
  },
];

export const PRESET_CONFIGS: PresetConfig[] = [
  {
    name: 'Solar Motor Default',
    description: 'Balanced rotation with steady tether tension and solar illumination.',
    motor: { rpm: 60, torque: 50, solarAngle: 30, solarIntensity: 60 },
    spherical: { phi: 25, theta: 15, mirrorSymmetry: 1 },
    params: { gravityGrowth: 0.2, leashStiffness: 0.08, subAmplifiedWidth: 5.0, logitChaos: 0.3 },
  },
  {
    name: 'Supercharged Kinetic Storm',
    description: 'High-RPM central motor with maximum propulsion torque and sub-amplified waves.',
    motor: { rpm: 150, torque: 95, isPropelling: true, magneticPulse: true },
    spherical: { phi: 65, theta: 35, mirrorSymmetry: 2 },
    params: { gravityGrowth: 1.5, leashStiffness: 0.18, subAmplifiedWidth: 12.0, logitChaos: 0.8 },
  },
  {
    name: 'Kaleidoscope Polar Mirror',
    description: '8-way radial symmetry processing for hypnotic geometric patterns.',
    motor: { rpm: 90, torque: 70 },
    spherical: { phi: 0, theta: 0, mirrorSymmetry: 8 },
    params: { gravityGrowth: 0.0, leashStiffness: 0.1, subAmplifiedWidth: 7.5, logitChaos: 0.5 },
  },
  {
    name: 'Gravitational Accretion Engine',
    description: 'Massive gravitational growth kinetics causing bodies to grow rapidly as they orbit.',
    motor: { rpm: 45, torque: 40 },
    spherical: { phi: 40, theta: -20, mirrorSymmetry: 1 },
    params: { gravityGrowth: 3.0, leashStiffness: 0.25, subAmplifiedWidth: 4.0, logitChaos: 0.2 },
  },
];
