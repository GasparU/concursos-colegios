// --- 1. DEFINICIÓN NUEVA (Resortes) ---
export interface SpringData {
    start: [number, number];
    end: [number, number];
    width?: number;
    coils?: number;
}

// --- 2. INTERFACES PRINCIPALES ---
export interface GeneratedQuestion {
    questionText: string;
    correctAnswer: string;
    explanation: string;
    options?: string[];
    visual_data?: VisualData;
}

export interface VisualData {
    type: 'physics_ariana';
    viewBox: { x: [number, number]; y: [number, number] };
    scenery?: PhysicsScenery[];
    bodies?: PhysicsBody[];
    vectors?: PhysicsVector[];
    measurements?: PhysicsMeasurement[];
    trajectories?: Trajectory[];
    graphs?: PhysicsGraph[];
    customSVG?: string;
    springs?: SpringData[];
}

// --- 3. ESCENARIOS ---
export type PhysicsScenery =
    | { type: 'floor'; data: { xRange: [number, number]; yPosition: number; isRough?: boolean } }
    | { type: 'wall'; data: { x: number; yRange: [number, number]; facingLeft: boolean } }
    | { type: 'ramp'; data: { start: [number, number]; width: number; angle: number; isRough?: boolean } }
    | { type: 'tunnel'; data: { position: [number, number]; length: number; height: number } }
    | { type: 'circular_track'; data: { center: [number, number]; radius: number } }
    | { type: 'inclined_plane'; data: { start?: [number, number]; base: number; height: number; angle: number; isRough?: boolean } }
    | { type: 'river'; data: { width: number; flowDirection: 'left' | 'right' } }
    | { type: 'pulley'; data: { position: [number, number]; radius: number } }
    | { type: 'curved_track'; data: { start: [number, number]; width: number; height: number } }
    | { type: 'beam'; data: { start: [number, number]; length: number; angle: number } }
    | { type: 'pivot'; data: { position: [number, number] } }
    | { type: 'pendulum'; data: { pivot: [number, number]; length: number; angle: number } }
    | { type: 'wave'; data: { start: [number, number]; width: number; amplitude: number; wavelength: number; color?: string } }
    | { type: 'hydraulic_press'; data: { position: [number, number]; widthLeft: number; widthRight: number; heightLeft: number; heightRight: number } }
    | { type: 'thermometer'; data: { position: [number, number]; height: number; percent: number; label: string; color?: string } }
    | { type: 'magnetic_field'; data: { position: [number, number]; width: number; height: number; direction: 'in' | 'out'; label?: string } }
    | { type: 'mirror'; data: { start: [number, number]; length: number; angle: number } }
    | { type: 'photoelectric_effect'; data: { position: [number, number]; workFunction?: string; lightColor?: string; electronSpeed?: string } }
    | { type: 'grid'; data: { step: number; color?: string } }
    | { type: 'axis'; data: { origin: [number, number]; color?: string; labelX?: string; labelY?: string } }
    | { type: 'circle'; data: { center: [number, number]; radius: number; color?: string; isDashed?: boolean; strokeWidth?: number } };

// --- 4. CUERPOS ---
export type PhysicsBody = {
    id: string;
    type: 'car' | 'sphere' | 'block' | 'particle' | 'projectile' | 'train' | 'bus' | 'plane' | 'airplane' | 'motorcycle' | 'bicycle' | 'person' | 'point' | 'charge' | 'resistor' | 'battery';
    position: [number, number];
    label?: string;
    scale?: number;
    facingRight?: boolean;
    surfaceAngle?: number;
    color?: string;
    qValue?: number; // Para carga
};

// --- 5. OTROS COMPONENTES ---
export interface PhysicsVector {
    start: [number, number];
    end: [number, number];
    label?: string;
    color?: string;
    style?: 'solid' | 'dashed';
    strokeWidth?: number;
    labelOffset?: [number, number];
    isRoot?: boolean;
    isDashed?: boolean;
}

export interface PhysicsMeasurement {
    start: [number, number];
    end?: [number, number];
    label: string;
    offset: number;
    type?: 'distance' | 'angle' | 'right_angle' | 'angle_arc' | 'parallel_marker';
    color?: string;
    angle?: number;
    angleStart?: number;
    angleEnd?: number;
}

export interface Trajectory {
    type: 'parabolic' | 'circular' | 'linear';
    points: [number, number][];
    color?: string;
    style?: 'solid' | 'dashed';
}

export interface PhysicsGraph {
    type: 'x-t' | 'v-t' | 'a-t';
    dataPoints: { t: number; value: number }[];
    slope?: number;
    intercept?: number;
}
