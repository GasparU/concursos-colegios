import React from 'react';

const WorldText: React.FC<{
    x: number; y: number; text: string; size?: number; color?: string; weight?: string;
}> = ({ x, y, text, size = 20, color = 'black', weight = 'normal' }) => (
    <g transform={`translate(${x}, ${y}) scale(1, -1)`}>
        <text x={0} y={0} fontSize={size} fill={color} textAnchor="middle" alignmentBaseline="middle" style={{ fontWeight: weight, fontFamily: 'sans-serif' }}>
            {text}
        </text>
    </g>
);

export const ArianaDimension: React.FC<{ start: [number, number]; end: [number, number]; label: string; offset: number; type?: 'distance' | 'angle'; color?: string }> = ({ start, end, label, offset, type = 'distance', color = 'black' }) => {
    if (type === 'angle') {
        const [cx, cy] = start;
        const radius = 40;
        const rad = offset * Math.PI / 180;
        const endX = cx + radius * Math.cos(rad);
        const endY = cy + radius * Math.sin(rad);
        const dArc = `M ${cx + radius} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
        return (
            <g>
                <line x1={cx} y1={cy} x2={cx + radius + 15} y2={cy} stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                <path d={dArc} fill="none" stroke={color} strokeWidth={1.5} />
                <WorldText x={cx + radius + 15} y={cy + 8} text={label} size={16} color={color} />
            </g>
        );
    }
    // Distancia
    const dx = end[0] - start[0]; 
    const dy = end[1] - start[1];
    const angle = Math.atan2(dy, dx);
    const perpX = -Math.sin(angle); 
    const perpY = Math.cos(angle);
    
    const p1 = [start[0] + perpX * offset, start[1] + perpY * offset];
    const p2 = [end[0] + perpX * offset, end[1] + perpY * offset];
    
    return (
        <g>
             <line x1={start[0]} y1={start[1]} x2={p1[0]} y2={p1[1]} stroke="gray" strokeWidth={1} strokeDasharray="4 4" />
             <line x1={end[0]} y1={end[1]} x2={p2[0]} y2={p2[1]} stroke="gray" strokeWidth={1} strokeDasharray="4 4" />
             <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={color} strokeWidth={1} />
             <line x1={p1[0]-0.2} y1={p1[1]-5} x2={p1[0]+0.2} y2={p1[1]+5} stroke={color} strokeWidth={2} />
             <line x1={p2[0]-0.2} y1={p2[1]-5} x2={p2[0]+0.2} y2={p2[1]+5} stroke={color} strokeWidth={2} />
             <WorldText x={(p1[0]+p2[0])/2} y={(p1[1]+p2[1])/2 - 15} text={label} size={16} color={color} />
        </g>
    );
};