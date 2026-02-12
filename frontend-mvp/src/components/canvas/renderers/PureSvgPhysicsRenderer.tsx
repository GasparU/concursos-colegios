import React from 'react';
// Asegúrate de que estas rutas coincidan con tu estructura nueva
import { ArianaVector } from '../elements/ArianaVector';
import { ArianaAxis } from '../elements/ArianaAxis';
import { PhysicsBodyRenderer } from '../elements/PhysicsBody'; 
// Si tienes ArianaGrid o ArianaRamp, impórtalos también aquí
// import { ArianaGrid } from '../elements/ArianaGrid';

interface PhysicsProps {
  visualData: any; // El JSON que viene de la IA
}

export const PureSvgPhysicsRenderer: React.FC<PhysicsProps> = ({ visualData }) => {
  // Protección contra datos vacíos
  if (!visualData) return <div className="text-slate-400 text-xs">Sin datos visuales</div>;

  const { viewBox, vectors, bodies, scenery } = visualData;
  
  // 1. Configurar ViewBox (Lienzo)
  // Si la IA no manda viewBox, usamos un default de -10 a 10
  const vbX = viewBox?.x || [-10, 10];
  const vbY = viewBox?.y || [-10, 10];
  const width = vbX[1] - vbX[0];
  const height = vbY[1] - vbY[0];

  // SVG strings
  const svgViewBox = `${vbX[0]} ${vbY[0]} ${width} ${height}`;

  return (
    <div className="w-full h-full bg-white flex items-center justify-center p-4 select-none">
      <svg 
        viewBox={svgViewBox} 
        preserveAspectRatio="xMidYMid meet" 
        className="w-full h-full max-h-[400px] overflow-visible"
        style={{ 
          background: '#ffffff',
          // Opcional: Borde guía para depuración
          // border: '1px dashed #e2e8f0' 
        }} 
      >
        {/* 🔥 TRUCO IMPORTANTE: "scale(1, -1)" 
            SVG por defecto tiene Y hacia abajo.
            Física y Mafs usan Y hacia arriba.
            Este grupo invierte el eje Y para que (0,10) esté ARRIBA, no abajo.
        */}
        <g transform="scale(1, -1)">
          
          {/* 1. ESCENARIO (Grillas, Ejes, Suelos) */}
          {scenery?.map((item: any, i: number) => {
            if (item.type === 'axis') return <ArianaAxis key={`sc-${i}`} origin={item.data.origin} />;
            // Agrega aquí más tipos de escenario si los necesitas (floor, wall)
            return null;
          })}

          {/* 2. CUERPOS (Bloques, Esferas, Partículas) */}
          {bodies?.map((body: any, i: number) => (
             <PhysicsBodyRenderer key={`body-${i}`} body={body} />
          ))}

          {/* 3. VECTORES (Flechas de Fuerza, Velocidad) */}
          {vectors?.map((vec: any, i: number) => (
            <ArianaVector 
              key={`vec-${i}`}
              start={vec.start}
              end={vec.end}
              label={vec.label}
              color={vec.color || '#3b82f6'} // Azul default
              strokeWidth={vec.strokeWidth || 2}
            />
          ))}

        </g>
      </svg>
    </div>
  );
};