import { useState } from "react";
import { Mafs, Line, Text } from "mafs";
import {
  CONFIG_GEOMETRIA,
  AJUSTES_PARALELAS_POR_NIVEL,
} from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface LineaParalela {
  puntos: [[number, number], [number, number]];
  label: string;
}

interface AnguloProps {
  centro: [number, number];
  inicio: number;
  fin: number;
  etiqueta: string;
}

interface Props {
  parametros: {
    idPlantilla?: string;
    lineasParalelas: LineaParalela[];
    puntosQuebrada: [number, number][];
    angulos: AnguloProps[];
  };
}

export const RenderizadorParalelasSerrucho = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.lineasParalelas || !parametros.puntosQuebrada)
    return null;

  const { idPlantilla, lineasParalelas, puntosQuebrada, angulos } = parametros;

  // Detección de nivel
  let nivel: "basico" | "intermedio" | "avanzado" | "experto" = "basico";
  if (idPlantilla?.includes("intermedio")) nivel = "intermedio";
  if (idPlantilla?.includes("avanzado")) nivel = "avanzado";
  if (idPlantilla?.includes("experto")) nivel = "experto";

  const ajustesNivel =
    AJUSTES_PARALELAS_POR_NIVEL?.[nivel] ||
    AJUSTES_PARALELAS_POR_NIVEL?.["basico"];

  const radioArco = ajustesNivel?.radioArco || 0.8;
  // 🔥 AUMENTAMOS LA DISTANCIA RADIAL PARA QUE EL TEXTO NO CHOQUE
  const distanciaEtiquetaBase = (ajustesNivel?.distanciaEtiqueta || 1.8) * 1.4;
  const colorTextoEcuacion = "#000000"; // 🔥 TEXTO NEGRO

  // ViewBox Dinámico
  const todosLosPuntos: [number, number][] = [...puntosQuebrada];
  lineasParalelas.forEach((l) => todosLosPuntos.push(l.puntos[0], l.puntos[1]));

  const margenExtra = 2.5;
  const xs = todosLosPuntos.map((p) => p[0]);
  const ys = todosLosPuntos.map((p) => p[1]);
  const minX = Math.min(...xs) - margenExtra;
  const maxX = Math.max(...xs) + margenExtra;
  const minY = Math.min(...ys) - margenExtra;
  const maxY = Math.max(...ys) + margenExtra;

  const viewBox = {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };

  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Controles de Accesibilidad */}
      <div className="flex justify-end w-full mb-2 gap-2 pr-4">
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

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2">
        <Mafs height={340} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            {/* DIBUJO DE PARALELAS L1 y L2 */}
            {lineasParalelas.map((linea, i) => {
              const dx = linea.puntos[1][0] - linea.puntos[0][0];
              const dy = linea.puntos[1][1] - linea.puntos[0][1];
              const anguloLinea = Math.atan2(dy, dx);
              const labelDist = 0.8;
              const labelX =
                linea.puntos[1][0] + labelDist * Math.cos(anguloLinea);
              const labelY =
                linea.puntos[1][1] + labelDist * Math.sin(anguloLinea);

              return (
                <g key={`paralela-${i}`}>
                  <Line.Segment
                    point1={linea.puntos[0]}
                    point2={linea.puntos[1]}
                    color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                    weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                  />
                  <Text
                    x={labelX}
                    y={labelY}
                    size={tamanoBase}
                    color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                  >
                    {linea.label}
                  </Text>
                </g>
              );
            })}

            {/* DIBUJO DEL SERRUCHO */}
            {puntosQuebrada.map((punto, i) => {
              if (i === puntosQuebrada.length - 1) return null;
              return (
                <Line.Segment
                  key={`quebrada-${i}`}
                  point1={punto}
                  point2={puntosQuebrada[i + 1]}
                  color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                  weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                />
              );
            })}

  
            {/* 🔥 DIBUJO DE ÁNGULOS (Detección de 90° Limpia) */}
            {angulos &&
              angulos.map((ang, i) => {
                const anguloMedioRad =
                  ((ang.inicio + ang.fin) / 2) * (Math.PI / 180);
                const ajuste =
                  ajustesNivel?.offsetPolares && ajustesNivel.offsetPolares[i]
                    ? ajustesNivel.offsetPolares[i]
                    : [0, 0];
                const radioFinal = distanciaEtiquetaBase + ajuste[0];
                const anguloTextoRad =
                  anguloMedioRad + (ajuste[1] * Math.PI) / 180;

                const textX =
                  ang.centro[0] + radioFinal * Math.cos(anguloTextoRad);
                const textY =
                  ang.centro[1] + radioFinal * Math.sin(anguloTextoRad);

                // Si es 90, lo ponemos rojo y llamativo
                const esRecto = ang.etiqueta.trim() === "90°";
                const colorFinal = esRecto ? "#ef4444" : colorTextoEcuacion;
                const weightFinal = esRecto ? "bold" : "normal";

                return (
                  <g key={`angulo-serrucho-${i}`}>
                    <ArcoAngulo
                      centro={ang.centro}
                      startAngle={ang.inicio}
                      endAngle={ang.fin}
                      radio={radioArco}
                      colorBorde={
                        esRecto
                          ? "#ef4444"
                          : CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL
                      } // Arco rojo si es 90
                    />
                    <Text
                      x={textX}
                      y={textY}
                      size={tamanoBase}
                      color={colorFinal}
                      svgTextProps={{ fontWeight: weightFinal }}
                    >
                      {ang.etiqueta}
                    </Text>
                  </g>
                );
              })}
          </g>
        </Mafs>
      </div>
    </div>
  );
};
