import { LeashedBall, ScatteredParticle, SphericalSystem, PhysicsParams, MotorState } from '../types';

export const CODE_SNIPPETS = [
  'phi.rotate()',
  'theta.elevate()',
  'Gav.growth(1.28)',
  'logit.de_gen()',
  'motor.propel()',
  'queue.mirror()',
  'solar.lit_fixed',
  'scatter.codes()',
  'leashed.bound()',
  'sub.amp_width()',
  'system.phi_theta',
  'batch.dispatch()',
  'stock.fixed_7',
];

// Project 3D point (x, y, z) into 2D screen coordinates using spherical angles Phi and Theta
export function project3D(
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number,
  spherical: SphericalSystem
): { sx: number; sy: number; scale: number; alpha: number } {
  // Convert phi and theta to radians
  const radPhi = (spherical.phi * Math.PI) / 180;
  const radTheta = (spherical.theta * Math.PI) / 180;

  // Rotate around Y axis (Phi - Azimuth)
  const cosPhi = Math.cos(radPhi);
  const sinPhi = Math.sin(radPhi);
  const x1 = x * cosPhi + z * sinPhi;
  const z1 = -x * sinPhi + z * cosPhi;

  // Rotate around X axis (Theta - Elevation)
  const cosTheta = Math.cos(radTheta);
  const sinTheta = Math.sin(radTheta);
  const y2 = y * cosTheta - z1 * sinTheta;
  const z2 = y * sinTheta + z1 * cosTheta;

  // Perspective scaling based on depth Z2
  const distance = 600;
  const depthScale = spherical.depthScale || 1;
  const scale = (distance / (distance + z2 * 0.8)) * depthScale;

  const sx = centerX + x1 * scale;
  const sy = centerY + y2 * scale;

  // Opacity fade with depth for realism
  const alpha = Math.max(0.2, Math.min(1, 0.5 + (z2 + 300) / 600));

  return { sx, sy, scale, alpha };
}

// Update simulation physics step
export function updatePhysics(
  balls: LeashedBall[],
  particles: ScatteredParticle[],
  motor: MotorState,
  params: PhysicsParams,
  dt: number,
  width: number,
  height: number
): {
  updatedBalls: LeashedBall[];
  updatedParticles: ScatteredParticle[];
  newParticles: ScatteredParticle[];
} {
  const updatedBalls: LeashedBall[] = [];
  const newParticles: ScatteredParticle[] = [];

  // Central motor rotation update
  const radPerSec = (motor.rpm * 2 * Math.PI) / 60;
  const motorAngleChange = radPerSec * dt;

  // Tangential velocity factor from motor
  const motorTangentialSpeed = (motor.rpm / 60) * (motor.coreRadius * 0.15) * (1 + (motor.torque / 50));

  balls.forEach((ball) => {
    let { x, y, z, vx, vy, vz, radius, mass, tetherLength, stiffness, growthFactor, consumedEnergy, history } = ball;

    // Dist to central motor (0, 0, 0)
    const distToCenter = Math.sqrt(x * x + y * y + z * z);

    // Spring leash force pulling back toward tether length constraint
    if (distToCenter > 0) {
      const springDelta = distToCenter - tetherLength;
      const springForce = springDelta * stiffness * params.leashStiffness;

      // Unit vector toward center
      const nx = x / distToCenter;
      const ny = y / distToCenter;
      const nz = z / distToCenter;

      // Apply spring pull
      vx -= (springForce * nx * dt) / mass;
      vy -= (springForce * ny * dt) / mass;
      vz -= (springForce * nz * dt) / mass;

      // Motor rotational impulse transfer if attached
      if (ball.attachedToMotor) {
        // Tangential vector in XY plane
        const tx = -ny;
        const ty = nx;
        
        // Push ball tangentially according to motor RPM
        const motorImpulse = motorTangentialSpeed * (motor.isPropelling ? 2.5 : 1.0);
        vx += tx * motorImpulse * dt;
        vy += ty * motorImpulse * dt;

        // Solar radiation pressure outward if motor is solar lit
        const solarPush = motor.solarIntensity * 2;
        vx += nx * solarPush * dt;
        vy += ny * solarPush * dt;
        vz += nz * solarPush * dt;
      }
    }

    // Gravitational Growth Kinetics (ex.Gav_growth())
    if (params.gravityGrowth > 0) {
      const growthRate = 0.05 * params.gravityGrowth * dt;
      radius += growthRate;
      mass += growthRate * 0.8;
      growthFactor += growthRate;
      consumedEnergy += Math.sqrt(vx * vx + vy * vy + vz * vz) * dt * 0.1;
    }

    // Apply damping
    vx *= params.damping;
    vy *= params.damping;
    vz *= params.damping;

    // Boundary constraint
    const maxBound = params.boundaryRadius;
    const currentDist = Math.sqrt(x * x + y * y + z * z);
    if (currentDist > maxBound) {
      // Reflect velocity
      const nx = x / currentDist;
      const ny = y / currentDist;
      const nz = z / currentDist;
      const dot = vx * nx + vy * ny + vz * nz;
      
      vx -= 1.8 * dot * nx;
      vy -= 1.8 * dot * ny;
      vz -= 1.8 * dot * nz;

      x = nx * maxBound;
      y = ny * maxBound;
      z = nz * maxBound;
    }

    // Update position
    x += vx * dt * 60;
    y += vy * dt * 60;
    z += vz * dt * 60;

    // Log history for orbital trails
    const newHistory = [...history, { x, y, z }];
    if (newHistory.length > 25) newHistory.shift();

    // Code scatter emission probability based on velocity and logit chaos
    if (Math.random() < 0.15 * params.logitChaos) {
      const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      newParticles.push({
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        z: z + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 4 + vx * 0.2,
        vy: (Math.random() - 0.5) * 4 + vy * 0.2,
        vz: (Math.random() - 0.5) * 4 + vz * 0.2,
        life: 1.0,
        maxLife: 0.8 + Math.random() * 0.6,
        color: ball.color,
        codeSnippet: snippet,
        size: 8 + Math.random() * 6,
      });
    }

    updatedBalls.push({
      ...ball,
      x,
      y,
      z,
      vx,
      vy,
      vz,
      radius,
      mass,
      growthFactor,
      consumedEnergy,
      history: newHistory,
    });
  });

  // Update existing particles in queue
  const updatedParticles: ScatteredParticle[] = [];
  particles.forEach((p) => {
    const lifeLeft = p.life - dt / p.maxLife;
    if (lifeLeft > 0) {
      updatedParticles.push({
        ...p,
        x: p.x + p.vx * dt * 30,
        y: p.y + p.vy * dt * 30,
        z: p.z + p.vz * dt * 30,
        life: lifeLeft,
      });
    }
  });

  // Limit particles queue size
  const combinedParticles = [...updatedParticles, ...newParticles].slice(-params.codeScatterQueueSize);

  return {
    updatedBalls,
    updatedParticles: combinedParticles,
    newParticles,
  };
}

// Generate default set of initial leashed balls
export function generateInitialBalls(): LeashedBall[] {
  const colors = ['#38bdf8', '#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
  const labels = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA', 'ETA'];

  return labels.map((label, index) => {
    const angle = (index / labels.length) * Math.PI * 2;
    const distance = 140 + index * 15;
    return {
      id: `ball-${index + 1}`,
      label,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      z: (Math.random() - 0.5) * 60,
      vx: -Math.sin(angle) * (2 + Math.random() * 2),
      vy: Math.cos(angle) * (2 + Math.random() * 2),
      vz: (Math.random() - 0.5) * 1.5,
      radius: 12 + Math.random() * 6,
      mass: 1.0 + index * 0.2,
      color: colors[index % colors.length],
      tetherLength: distance,
      stiffness: 0.08,
      growthFactor: 1.0,
      consumedEnergy: 0,
      attachedToMotor: true,
      history: [],
    };
  });
}
