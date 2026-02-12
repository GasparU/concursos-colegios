import React from 'react';

// Define la interfaz aquí para no depender de physics.types.ts si no quieres
export interface PhysicsBodyType {
    type: 'block' | 'sphere' | 'particle';
    position: [number, number];
    label?: string;
    scale?: number;
    color?: string;
    facingRight?: boolean;
}

export const PhysicsBodyRenderer: React.FC<{ body: PhysicsBodyType | any }> = ({ body }) => {
    const { position, color = '#94a3b8', label } = body;
    const [x, y] = position;

    switch (body.type) {
        case 'block':
            const size = 40 * (body.scale || 1);
            return (
                <g transform={`translate(${x}, ${y})`}>
                    <rect x={-size/2} y={0} width={size} height={size} fill={color} stroke="black" strokeWidth={2} />
                    {label && (
                        <text x={0} y={size/2} textAnchor="middle" alignmentBaseline="middle" fill="white" fontWeight="bold" fontSize={12} transform="scale(1, -1)">
                            {label}
                        </text>
                    )}
                </g>
            );

        case 'sphere':
        case 'particle':
            const radius = body.type === 'particle' ? 5 : 20 * (body.scale || 1);
            return (
                <g transform={`translate(${x}, ${y})`}>
                    <circle cx={0} cy={0} r={radius} fill={body.type === 'particle' ? 'black' : color} stroke="black" strokeWidth={body.type === 'particle' ? 0 : 2} />
                    {label && (
                        <text x={0} y={0} textAnchor="middle" alignmentBaseline="middle" fill={body.type === 'particle' ? 'black' : 'white'} fontWeight="bold" fontSize={12} dy={body.type==='particle' ? -10 : 0} transform="scale(1, -1)">
                            {label}
                        </text>
                    )}
                </g>
            );

        default:
            return null;
    }
};