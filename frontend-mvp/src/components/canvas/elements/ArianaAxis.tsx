import React from 'react';

export const ArianaAxis: React.FC<{
    origin: [number, number];
    color?: string;
    labelX?: string;
    labelY?: string;
    size?: number;
}> = ({ origin, color = '#64748b', labelX = 'x', labelY = 'y', size = 300 }) => {
    return (
        <g>
            {/* Definición del marcador de flecha solo si no existe globalmente */}
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                </marker>
            </defs>

            {/* Eje X */}
            <line 
                x1={origin[0] - size} y1={origin[1]} 
                x2={origin[0] + size} y2={origin[1]} 
                stroke={color} strokeWidth={1.5} 
                markerEnd="url(#arrowhead)" 
            />
            
            {/* Eje Y */}
            <line 
                x1={origin[0]} y1={origin[1] - size} 
                x2={origin[0]} y2={origin[1] + size} 
                stroke={color} strokeWidth={1.5} 
                markerEnd="url(#arrowhead)" 
            />
            
            {/* Etiquetas */}
            <g transform={`translate(${origin[0] + size - 15}, ${origin[1] + 15}) scale(1, -1)`}>
                <text fontSize={14} fill={color} fontWeight="bold">{labelX}</text>
            </g>
            <g transform={`translate(${origin[0] + 10}, ${origin[1] + size - 15}) scale(1, -1)`}>
                <text fontSize={14} fill={color} fontWeight="bold">{labelY}</text>
            </g>
        </g>
    );
};