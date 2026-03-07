import { Mafs, Polygon, Text, Plot, Line } from "mafs";
import { useState } from "react";
import {
  CONFIG_GEOMETRIA,
  CONFIG_TRIANGULOS,
  ESTILO_HALO_TRIANGULO,
} from "./ConstantesVisuales";

export const RenderizadorTriangulos = ({ parametros }: any) => {
  const [escala, setEscala] = useState(1);
  if (!parametros) return null;
  const { puntos, arcos = [], lineasExtra = [] } = parametros;

  // Viewbox dinámico: Calcula el centro y añade margen de protección
  const xs = [
    ...puntos.map((p: any) => p[0]),
    ...(lineasExtra?.flatMap((l: any) => l.puntos.map((p: any) => p[0])) || []),
  ];
  const ys = [
    ...puntos.map((p: any) => p[1]),
    ...(lineasExtra?.flatMap((l: any) => l.puntos.map((p: any) => p[1])) || []),
  ];
  const viewBox = {
    x: [Math.min(...xs) - 1.5, Math.max(...xs) + 1.5] as [number, number],
    y: [Math.min(...ys) - 1.5, Math.max(...ys) + 1.5] as [number, number],
  };

  return (
    <div className="flex flex-col items-center w-full bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      {/* Botones de Accesibilidad */}
      <div className="flex justify-end w-full mb-2 gap-2">
        <button
          onClick={() => setEscala((e) => Math.max(0.7, e - 0.1))}
          className="px-2 py-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-100 text-xs"
        >
          A-
        </button>
        <button
          onClick={() => setEscala((e) => Math.min(1.5, e + 0.1))}
          className="px-2 py-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-100 text-xs"
        >
          A+
        </button>
      </div>

      <Mafs height={350} viewBox={viewBox} pan={false} zoom={false}>
        {/* 🔥 DIBUJAR ÁNGULO RECTO SI APLICA */}
        {parametros.esRectangulo && (
          <Polygon
            points={[
              puntos[0],
              [puntos[0][0] + 0.5, puntos[0][1]],
              [puntos[0][0] + 0.5, puntos[0][1] + 0.5],
              [puntos[0][0], puntos[0][1] + 0.5],
            ]}
            color="#ef4444" // red-500
            weight={2}
            fillOpacity={0.1}
          />
        )}

        {/* 🔥 ETIQUETAS DE LADOS (Puntos medios de los segmentos) */}
       {parametros.etiquetasLados?.map((etiq: any, idx: number) => (
          <g key={`etiq-${idx}`}>
            {/* Trazo Blanco Grueso por debajo (El Halo) */}
            <Text
              x={etiq.pos[0]}
              y={etiq.pos[1]}
              size={CONFIG_GEOMETRIA.TAMANO_TEXTO || 16}
              color="white"
              svgTextProps={{ stroke: "white", strokeWidth: 5, strokeLinejoin: "round", strokeLinecap: "round" }}
            >
              {etiq.texto}
            </Text>
            {/* Texto Original por encima */}
            <Text
              x={etiq.pos[0]}
              y={etiq.pos[1]}
              size={CONFIG_GEOMETRIA.TAMANO_TEXTO || 16}
              color="#0f172a" 
            >
              {etiq.texto}
            </Text>
          </g>
        ))}
        {/* Prolongaciones para ángulos exteriores */}
        {lineasExtra?.map((l: any, i: number) => (
          <Line.Segment
            key={`proyeccion-${i}`}
            point1={l.puntos[0]}
            point2={l.puntos[1]}
            color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL} // Mismo tono exacto del triángulo
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA} // Mismo ancho exacto
          />
        ))}

        <Polygon
          points={puntos}
          color={
            parametros.esArea
              ? "#38bdf8"
              : CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL
          }
          weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          fillOpacity={parametros.esArea ? 0.3 : 0.05}
        />

        {arcos.map((arco: any, i: number) => {
          // 🔥 SOLUCIÓN AL ERROR "r": Declaramos r y distEtiq basados en las constantes
          const r = arco.exterior
            ? CONFIG_TRIANGULOS.RADIO_ARCO_EXTERIOR
            : CONFIG_TRIANGULOS.RADIO_ARCO;
          const distEtiq = arco.exterior
            ? CONFIG_TRIANGULOS.DISTANCIA_ETIQUETA_EXTERIOR
            : CONFIG_TRIANGULOS.DISTANCIA_ETIQUETA;

          let inicioAng = arco.inicio;
          let finAng = arco.fin;

          // 🔥 NORMALIZACIÓN VECTORIAL: Evita que el arco se desborde
          if (finAng < inicioAng) finAng += 360;
          if (finAng - inicioAng > 180 && !arco.exterior) {
            const temp = inicioAng;
            inicioAng = finAng;
            finAng = temp + 360;
          }

          const tMedio = ((inicioAng + finAng) / 2) * (Math.PI / 180);
          const colorAngulo =
            CONFIG_TRIANGULOS.COLORES_ANGULOS[arco.colorIdx] || "#3b82f6";

          return (
            <g key={i}>
              <Plot.Parametric
                t={[(inicioAng * Math.PI) / 180, (finAng * Math.PI) / 180]}
                xy={(t) => [
                  arco.centro[0] + r * Math.cos(t),
                  arco.centro[1] + r * Math.sin(t),
                ]}
                color={colorAngulo}
                weight={2.5}
              />

              {/* Etiqueta del Vértice */}
              <Text
                x={arco.centro[0] - Math.cos(tMedio) * 0.9}
                y={arco.centro[1] - Math.sin(tMedio) * 0.9}
                size={14}
                color="#64748b"
              >
                {arco.labelVertice}
              </Text>

              {/* Etiqueta de la Ecuación */}
              {arco.etiqueta && (
                <Text
                  x={arco.centro[0] + (r + distEtiq) * Math.cos(tMedio)}
                  y={arco.centro[1] + (r + distEtiq) * Math.sin(tMedio)}
                  size={16 * escala}
                  svgTextProps={{ style: ESTILO_HALO_TRIANGULO }}
                >
                  {arco.etiqueta}
                </Text>
              )}
            </g>
          );
        })}
      </Mafs>
    </div>
  );
};
