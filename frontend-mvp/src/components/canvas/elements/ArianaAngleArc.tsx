import React from 'react';

export const ArianaAngleArc: React.FC<{
    center: [number, number];
    startAngle: number;
    endAngle: number;
    radius: number;
    label?: string;
    color?: string;
    isRightAngle?: boolean;
}> = ({ center, startAngle, endAngle, radius, label, color = '#3b82f6', isRightAngle }) => {

    if (isRightAngle) {
        const radStart = (startAngle * Math.PI) / 180;
        const r = radius - 5; 
        
        const x1 = center[0] + r * Math.cos(radStart);
        const y1 = center[1] + r * Math.sin(radStart);
        
        const radEnd = ((startAngle + 90) * Math.PI) / 180;
        const x2 = center[0] + r * Math.cos(radEnd);
        const y2 = center[1] + r * Math.sin(radEnd);
        
        const xCorner = center[0] + r * (Math.cos(radStart) + Math.cos(radEnd));
        const yCorner = center[1] + r * (Math.sin(radStart) + Math.sin(radEnd));

        return (
            <g>
                <path d={`M ${x1} ${y1} L ${xCorner} ${yCorner} L ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={1.5} />
                <circle cx={xCorner * 0.4 + center[0] * 0.6} cy={yCorner * 0.4 + center[1] * 0.6} r={1.5} fill={color} />
            </g>
        );
    }

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = center[0] + radius * Math.cos(startRad);
    const y1 = center[1] + radius * Math.sin(startRad);
    const x2 = center[0] + radius * Math.cos(endRad);
    const y2 = center[1] + radius * Math.sin(endRad);
    
    const diff = Math.abs(endAngle - startAngle);
    const largeArcFlag = diff > 180 ? 1 : 0;
    const sweepFlag = endAngle > startAngle ? 1 : 0; 
    
    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;

    const labelR = radius + 22; 
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const lx = center[0] + labelR * Math.cos(midRad);
    const ly = center[1] + radius * Math.sin(midRad); 

    return (
        <g>
            <path d={d} fill="none" stroke={color} strokeWidth={1.5} />
            {label && (
                <text 
                    x={lx} y={ly} 
                    fill={color} 
                    fontSize={11} 
                    fontFamily="Times New Roman, serif"
                    fontWeight="bold" 
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`scale(1, -1) translate(0, ${-2 * ly})`}
                    style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '3px' }}
                >
                    {label}
                </text>
            )}
        </g>
    );
};