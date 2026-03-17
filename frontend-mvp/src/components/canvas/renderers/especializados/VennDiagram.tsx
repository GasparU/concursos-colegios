
import { Circle, Mafs, Polygon, Text } from "mafs";
import React from "react";


interface VennDiagramProps {
  parametros: any;
}

export const VennDiagram: React.FC<VennDiagramProps> = ({ parametros }) => {
  // VARIABLES ANTIGUAS (Cardinalidad - Sin puntito)
  const { soloA1, soloA2, inter, soloB, a, b, c, fuera1, fuera2 } = parametros;

  // 🔥 NUEVAS VARIABLES (Elementos dispersos - CON puntito "•")
  const { eA1, eA2, eA3, eI1, eI2, eB1, eB2, eB3, eU1, eU2 } = parametros;

  const colorA = "#E11D48"; 
  const colorB = "#0891B2"; 
  const colorU = "#3b82f6"; 

  return (
    <div className="w-full flex justify-center py-4 bg-white dark:bg-slate-900 rounded-lg">
      <Mafs viewBox={{ x: [-5, 5], y: [-4, 4] }} pan={false} zoom={false}>
        <Polygon points={[[-4.5, 3.5], [4.5, 3.5], [4.5, -3.5], [-4.5, -3.5]]} color={colorU} weight={2} fillOpacity={0} />
        <Text x={-4} y={3} size={16} color={colorU} svgTextProps={{ fontWeight: "bold" }}>U</Text>

        <Circle center={[-1.2, 0]} radius={2.2} color={colorA} weight={2} fillOpacity={0.06} />
        <Text x={-2.8} y={2.4} size={18} color={colorA} svgTextProps={{ fontWeight: "bold" }}>A</Text>

        <Circle center={[1.2, 0]} radius={2.2} color={colorB} weight={2} fillOpacity={0.06} />
        <Text x={2.8} y={2.4} size={18} color={colorB} svgTextProps={{ fontWeight: "bold" }}>B</Text>

        {/* ========================================== */}
        {/* MODO 1: CARDINALIDAD (Los números grandes centrados) */}
        {/* ========================================== */}
        {soloA1 !== undefined && <Text x={-2} y={0.8} size={18}>{soloA1}</Text>}
        {soloA2 !== undefined && <Text x={-2} y={-0.8} size={18}>{soloA2}</Text>}
        {inter !== undefined && <Text x={0} y={0} size={20}>{inter}</Text>}
        {soloB !== undefined && <Text x={2} y={0} size={20}>{soloB}</Text>}
        {a !== undefined && <Text x={-2} y={0} size={20}>{a}</Text>}
        {b !== undefined && <Text x={0} y={0} size={20}>{b}</Text>}
        {c !== undefined && <Text x={2} y={0} size={20}>{c}</Text>}
        {fuera1 !== undefined && <Text x={3} y={-2.8} size={18}>{fuera1}</Text>}
        {fuera2 !== undefined && <Text x={-3} y={-2.8} size={18}>{fuera2}</Text>}

        {/* ========================================== */}
        {/* 🔥 MODO 2: LLUVIA DE ELEMENTOS (Estilo Libro de Primaria) */}
        {/* ========================================== */}
        {/* Solo A */}
        {eA1 !== undefined && <Text x={-2.2} y={1} size={16}>• {eA1}</Text>}
        {eA2 !== undefined && <Text x={-2.5} y={-0.5} size={16}>• {eA2}</Text>}
        {eA3 !== undefined && <Text x={-1.5} y={-1.2} size={16}>• {eA3}</Text>}
        {/* Intersección */}
        {eI1 !== undefined && <Text x={0} y={0.8} size={16}>• {eI1}</Text>}
        {eI2 !== undefined && <Text x={0} y={-0.8} size={16}>• {eI2}</Text>}
        {/* Solo B */}
        {eB1 !== undefined && <Text x={2.2} y={1} size={16}>• {eB1}</Text>}
        {eB2 !== undefined && <Text x={2.5} y={-0.5} size={16}>• {eB2}</Text>}
        {eB3 !== undefined && <Text x={1.5} y={-1.2} size={16}>• {eB3}</Text>}
        {/* Universo */}
        {eU1 !== undefined && <Text x={3.5} y={2.5} size={16}>• {eU1}</Text>}
        {eU2 !== undefined && <Text x={-3.5} y={-2.5} size={16}>• {eU2}</Text>}
      </Mafs>
    </div>
  );
};