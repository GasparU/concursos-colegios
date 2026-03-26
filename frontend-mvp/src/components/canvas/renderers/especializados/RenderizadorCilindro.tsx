import React from "react";
import { Mafs, Ellipse, Line, Text, Theme } from "mafs";

interface CilindroProps {
  parametros: {
    r?: number | string;
    h?: number | string;
    orientacion?: "vertical" | "horizontal";
  };
}

export const RenderizadorCilindro: React.FC<CilindroProps> = ({ parametros }) => {
  if (!parametros) return null;

  const r = Number(parametros.r) || 3;
  const h = Number(parametros.h) || 6;
  const isHorizontal = parametros.orientacion === "horizontal";

  // 🔥 PROPORCIONALIDAD: Escala dinámica para llenar el canvas
  const maxDim = Math.max(r, h);
  const factor = 6.5 / maxDim; 
  
  const rV = r * factor;
  const hV = h * factor;
  const ryV = rV * 0.35; // Aplanamiento Isométrico

  // Viewbox dinámico para evitar cortes
  const padding = 2.5;
  const xLim = isHorizontal ? (hV / 2 + padding) : (rV + padding);
  const yLim = isHorizontal ? (rV + padding) : (hV / 2 + padding);

  // Estilo 3D Dash Blindado
  const dashStyle: any = { strokeDasharray: "6 6", opacity: 0.5 };

  return (
    <div className="w-full flex flex-col items-center py-6 bg-slate-50 border border-slate-200 rounded-xl shadow-inner my-4">
      <Mafs viewBox={{ x: [-xLim, xLim], y: [-yLim, yLim] }} zoom={false} pan={false} height={320}>
        {isHorizontal ? (
          <>
            {/* CILINDRO ECHADO */}
            {/* Base trasera con dashed 🔥 */}
            <Ellipse center={[-hV/2, 0]} radius={[ryV, rV]} color={Theme.blue} weight={2} {...({ svgAttributes: dashStyle } as any)} />
            <Line.Segment point1={[-hV/2, rV]} point2={[hV/2, rV]} color={Theme.blue} weight={2} />
            <Line.Segment point1={[-hV/2, -rV]} point2={[hV/2, -rV]} color={Theme.blue} weight={2} />
            <Ellipse center={[hV/2, 0]} radius={[ryV, rV]} color={Theme.blue} weight={2} fillOpacity={0.1} />
            
            {/* Acotaciones Verdes */}
            <Line.Segment point1={[hV/2, 0]} point2={[hV/2, -rV]} color={Theme.green} weight={2} {...({ svgAttributes: { strokeDasharray: "3 3" } } as any)} />
            <Text x={hV/2 + 1} y={-rV/2} color={Theme.green} size={20} svgTextProps={{ style: { fontWeight: "900" } }}>{`${r}`}</Text>
            
            <Line.Segment point1={[-hV/2, rV + 1]} point2={[hV/2, rV + 1]} color={Theme.green} weight={1} />
            <Text x={0} y={rV + 1.8} color={Theme.green} size={20} svgTextProps={{ style: { fontWeight: "900" } }}>{`${h}`}</Text>
          </>
        ) : (
          <>
            {/* CILINDRO PARADO */}
            {/* Base inferior trasera con dashed 🔥 */}
            <Ellipse center={[0, -hV/2]} radius={[rV, ryV]} color={Theme.blue} weight={2} {...({ svgAttributes: dashStyle } as any)} />
            <Line.Segment point1={[-rV, -hV/2]} point2={[-rV, hV/2]} color={Theme.blue} weight={2} />
            <Line.Segment point1={[rV, -hV/2]} point2={[rV, hV/2]} color={Theme.blue} weight={2} />
            <Ellipse center={[0, hV/2]} radius={[rV, ryV]} color={Theme.blue} weight={2} fillOpacity={0.1} />
            
            {/* Acotaciones Verdes */}
            <Line.Segment point1={[0, -hV/2]} point2={[rV, -hV/2]} color={Theme.green} weight={2} {...({ svgAttributes: { strokeDasharray: "3 3" } } as any)} />
            <Text x={rV/2} y={-hV/2 - 1.2} color={Theme.green} size={20} svgTextProps={{ style: { fontWeight: "900" } }}>{`${r}`}</Text>
            
            <Line.Segment point1={[rV + 1.2, -hV/2]} point2={[rV + 1.2, hV/2]} color={Theme.green} weight={1} />
            <Text x={rV + 2} y={0} color={Theme.green} size={20} svgTextProps={{ style: { fontWeight: "900" } }}>{`${h}`}</Text>
          </>
        )}
      </Mafs>
    </div>
  );
};