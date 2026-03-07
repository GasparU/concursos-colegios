import { useState } from "react";
import { Mafs, Line, Text } from "mafs";
import {
  CONFIG_GEOMETRIA,
  CONFIG_PARALELAS_ECUACIONES,
} from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface Linea {
  puntos: [[number, number], [number, number]];
  label?: string;
  tipo?: "horizontal" | "vertical" | "oblicua";
}

interface Angulo {
  centro: [number, number];
  inicio: number;
  fin: number;
  etiqueta: string;
}

interface ParalelasAvanzadoProps {
  // Lo ajustamos para que soporte si viene envuelto en 'parametros' o directo
  parametros?: {
    lineas: Linea[];
    angulos?: Angulo[];
    labelsAdicionales?: { pos: [number, number]; texto: string }[];
  };
  lineas?: Linea[];
  angulos?: Angulo[];
  labelsAdicionales?: { pos: [number, number]; texto: string }[];
}

export const RenderizadorParalelasAvanzado = (
  props: ParalelasAvanzadoProps,
) => {
  // 🔥 Control de Accesibilidad (Minimalista)
  const [escalaTexto, setEscalaTexto] = useState(1);

  // Normalizamos las props por si vienen del enrutador dentro de 'parametros'
  const lineas = props.parametros?.lineas || props.lineas || [];
  const angulos = props.parametros?.angulos || props.angulos || [];
  const labelsAdicionales =
    props.parametros?.labelsAdicionales || props.labelsAdicionales || [];

  if (lineas.length === 0) return null;

  const radioArco = CONFIG_PARALELAS_ECUACIONES?.RADIO_ARCO || 0.6;
  const distanciaEtiqueta =
    radioArco * (CONFIG_PARALELAS_ECUACIONES?.DISTANCIA_ETIQUETA || 1.5);
  const tamanoTextoDinamico = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto;

  // Recolectar puntos para viewBox
  const puntos: [number, number][] = [];
  lineas.forEach((l) => {
    puntos.push(l.puntos[0], l.puntos[1]);
  });
  labelsAdicionales.forEach((l) => puntos.push(l.pos));
  angulos.forEach((a) => puntos.push(a.centro));

  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);

  // Considerar posición de etiquetas de ángulos
  angulos.forEach((a) => {
    const anguloMedio = ((a.inicio + a.fin) / 2) * (Math.PI / 180);
    const textX = a.centro[0] + distanciaEtiqueta * Math.cos(anguloMedio);
    const textY = a.centro[1] + distanciaEtiqueta * Math.sin(anguloMedio);
    minX = Math.min(minX, textX);
    maxX = Math.max(maxX, textX);
    minY = Math.min(minY, textY);
    maxY = Math.max(maxY, textY);
  });

  const margen = CONFIG_PARALELAS_ECUACIONES?.MARGEN_PLANO || 1.5;
  const viewBox = {
    x: [minX - margen, maxX + margen] as [number, number],
    y: [minY - margen, maxY + margen] as [number, number],
  };

  const posicionLabelLinea = (
    linea: Linea,
  ): { x: number; y: number } | null => {
    const [p1, p2] = linea.puntos;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const longitud = Math.hypot(dx, dy);
    if (longitud < 0.1) return null;

    const dirX = dx / longitud;
    const dirY = dy / longitud;
    const perpX = -dirY;
    const perpY = dirX;

    const esHorizontal = Math.abs(dy) < 0.1;
    const esVertical = Math.abs(dx) < 0.1;

    let offsetX = perpX * 0.5;
    let offsetY = perpY * 0.5;

    if (esHorizontal) {
      if (linea.label === "L1") offsetY = -Math.abs(offsetY);
      else if (linea.label === "L2") offsetY = Math.abs(offsetY);
      else {
        const centroY = (minY + maxY) / 2;
        offsetY = p1[1] > centroY ? Math.abs(offsetY) : -Math.abs(offsetY);
      }
    } else if (esVertical) {
      if (linea.label === "L1" || linea.label === "L2")
        offsetX = Math.abs(offsetX);
      else {
        const centroX = (minX + maxX) / 2;
        offsetX = p1[0] > centroX ? Math.abs(offsetX) : -Math.abs(offsetX);
      }
    } else {
      const centro = [(minX + maxX) / 2, (minY + maxY) / 2];
      const desdeCentro = [p1[0] - centro[0], p1[1] - centro[1]];
      if (desdeCentro[0] * perpX + desdeCentro[1] * perpY > 0) {
        offsetX = -offsetX;
        offsetY = -offsetY;
      }
    }
    return { x: p2[0] + offsetX, y: p2[1] + offsetY };
  };

  return (
    <div className="flex flex-col w-full">
      {/* Botones minimalistas de Accesibilidad */}
      <div className="flex justify-end w-full mb-2 gap-2 pr-2">
        <button
          onClick={() => setEscalaTexto((prev) => Math.max(0.7, prev - 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
        >
          A-
        </button>
        <button
          onClick={() => setEscalaTexto((prev) => Math.min(1.5, prev + 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
        >
          A+
        </button>
      </div>

      <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2">
        <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            {lineas.map((linea, i) => {
              const posLabel = posicionLabelLinea(linea);
              return (
                <g key={`linea-${i}`}>
                  <Line.Segment
                    point1={linea.puntos[0]}
                    point2={linea.puntos[1]}
                    color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                    weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                  />
                  {linea.label && posLabel && (
                    <Text
                      x={posLabel.x}
                      y={posLabel.y}
                      size={tamanoTextoDinamico}
                      color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                    >
                      {linea.label}
                    </Text>
                  )}
                </g>
              );
            })}

            {angulos.map((a, i) => {
              const anguloMedio = ((a.inicio + a.fin) / 2) * (Math.PI / 180);
              return (
                <g key={`ang-${i}`}>
                  <ArcoAngulo
                    centro={a.centro}
                    startAngle={a.inicio}
                    endAngle={a.fin}
                    radio={radioArco}
                    colorBorde={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                  />
                  {a.etiqueta && (
                    <Text
                      x={
                        a.centro[0] + distanciaEtiqueta * Math.cos(anguloMedio)
                      }
                      y={
                        a.centro[1] + distanciaEtiqueta * Math.sin(anguloMedio)
                      }
                      size={tamanoTextoDinamico}
                      color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                    >
                      {a.etiqueta}
                    </Text>
                  )}
                </g>
              );
            })}

            {labelsAdicionales.map((l, i) => (
              <Text
                key={`label-${i}`}
                x={l.pos[0]}
                y={l.pos[1]}
                size={tamanoTextoDinamico}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {l.texto}
              </Text>
            ))}
          </g>
        </Mafs>
      </div>
    </div>
  );
};
