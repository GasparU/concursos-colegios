import React from 'react';

export const ArianaVector: React.FC<{ start: [number, number]; end: [number, number]; label?: string; color?: string; strokeWidth?: number; labelOffset?: [number, number]; isRoot?: boolean }> = ({ start, end, label, color = 'black', strokeWidth = 2, labelOffset = [0, 0], isRoot = false }) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const len = Math.sqrt(dx*dx + dy*dy);
    if (len < 1) return null;

    const arrowLength = 12;
    const arrowWidth = 4;
    
    const unitX = len > 0 ? dx / len : 0;
    const unitY = len > 0 ? dy / len : 0;
    
    const tipMargin = 8;
    const labelX = end[0] + (unitX * tipMargin) + labelOffset[0];
    const labelY = end[1] + (unitY * tipMargin) + labelOffset[1];

    const renderLabel = () => {
        if (!label) return null;

        if (isRoot) {
            const parts = label.split('r'); 
            const prefix = parts[0];
            const inside = parts[1] || '';

            return (
                <g transform={`translate(${labelX}, ${labelY}) scale(1, -1)`}>
                    <text x="-16" y="2" fontSize={14} fill={color} fontFamily="Times New Roman, serif" fontWeight="bold" style={{ textShadow: '2px 2px 0px white' }}>
                        {prefix}
                    </text>
                    <path d="M -8 4 L -4 8 L 0 -8 L 14 -8" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    <text x="3" y="2" fontSize={14} fill={color} fontFamily="Times New Roman, serif" fontWeight="bold" style={{ textShadow: '2px 2px 0px white' }}>
                        {inside}
                    </text>
                </g>
            );
        }

        return (
            <text x={labelX} y={labelY} fill={color} fontSize={14} fontFamily="Times New Roman, serif" fontWeight="bold" fontStyle="italic" textAnchor="middle" alignmentBaseline="middle" style={{ textShadow: '2px 2px 0px white, -2px -2px 0px white' }} transform={`scale(1, -1) translate(0, ${-2 * labelY})`}>
                {label}
            </text>
        );
    };

    return (
        <g>
            <line 
                x1={start[0]} y1={start[1]} 
                x2={end[0]} y2={end[1]} 
                stroke={color} 
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            <g transform={`translate(${end[0]}, ${end[1]}) rotate(${angle})`}>
                <polygon 
                    points={`0,0 -${arrowLength},${arrowWidth} -${arrowLength},-${arrowWidth}`} 
                    fill={color} 
                />
            </g>
            {renderLabel()}
        </g>
    );
};