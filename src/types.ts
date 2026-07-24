export interface LeashedBall {
  id: string;
  label: string;
  x: number; // 3D coordinates relative to center
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  mass: number;
  color: string;
  tetherLength: number;
  stiffness: number;
  growthFactor: number;
  consumedEnergy: number;
  attachedToMotor: boolean;
  history: { x: number; y: number; z: number }[];
}

export interface ScatteredParticle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number; // 0 to 1
  maxLife: number;
  color: string;
  codeSnippet: string;
  size: number;
}

export interface MotorState {
  rpm: number;
  angle: number; // Current rotation angle in radians
  torque: number;
  coreRadius: number;
  solarAngle: number; // Sun directional light angle
  solarIntensity: number;
  magneticPulse: boolean;
  isPropelling: boolean;
}

export interface SphericalSystem {
  phi: number; // Azimuth angle in degrees (0 to 360)
  theta: number; // Polar angle in degrees (-90 to 90)
  depthScale: number;
  mirrorSymmetry: 1 | 2 | 4 | 8; // Mirror processing mode
}

export interface PhysicsParams {
  gravityGrowth: number; // ex.Gav_growth()
  leashStiffness: number;
  subAmplifiedWidth: number; // Wave width/amplitude parameter
  damping: number;
  boundaryRadius: number;
  logitChaos: number;
  batchSpawnRate: number;
  codeScatterQueueSize: number;
  showVectors: boolean;
  showLabels: boolean;
  showTrajectories: boolean;
}

export interface KinematicTip {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  applyPreset: (
    motor: MotorState,
    spherical: SphericalSystem,
    params: PhysicsParams
  ) => { motor: MotorState; spherical: SphericalSystem; params: PhysicsParams };
}

export interface PresetConfig {
  name: string;
  description: string;
  motor: Partial<MotorState>;
  spherical: Partial<SphericalSystem>;
  params: Partial<PhysicsParams>;
}
