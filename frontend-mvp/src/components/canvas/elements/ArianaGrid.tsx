import React from 'react';

export const ArianaGrid: React.FC<{
    viewBox: { x: [number, number]; y: [number, number] };
    step: number;
    color?: string;
}> = ({ viewBox, step, color = '#cbd5e1' }) => {
    const minX = viewBox.x[0];
    const maxX = viewBox.x[1];
    const minY = viewBox.y[0];
    const maxY = viewBox.y[1];

    const lines = [];

    // Verticales
    for (let x = Math.ceil(minX/step)*step; x <= maxX; x += step) {
        lines.push(<line key={`v${x}`} x1={x} y1={minY} x2={x} y2={maxY} stroke={color} strokeWidth={1} strokeDasharray="4 4" />);
    }
    // Horizontales
    for (let y = Math.ceil(minY/step)*step; y <= maxY; y += step) {
        lines.push(<line key={`h${y}`} x1={minX} y1={y} x2={maxX} y2={y} stroke={color} strokeWidth={1} strokeDasharray="4 4" />);
    }

    return <g>{lines}</g>;
};