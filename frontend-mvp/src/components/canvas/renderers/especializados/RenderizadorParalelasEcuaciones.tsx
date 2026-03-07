import { useState } from "react";
import { Mafs, Line, Text } from "mafs";
import {
  CONFIG_GEOMETRIA,
  AJUSTES_PARALELAS_POR_NIVEL,
} from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface LineaProps {
  puntos: [[number, number], [number, number]];
  label?: string;
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
    lineas: LineaProps[];
    angulos: AnguloProps[];
  };
}

export const RenderizadorParalelasEcuaciones = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.lineas || !parametros.angulos) return null;

  const { idPlantilla, lineas, angulos } = parametros;

  // Detección automática del nivel
  let nivel: "basico" | "intermedio" | "avanzado" = "basico";
  if (idPlantilla?.includes("intermedio")) nivel = "intermedio";
  if (idPlantilla?.includes("avanzado")) nivel = "avanzado";

  const ajustesNivel =
    AJUSTES_PARALELAS_POR_NIVEL?.[nivel] ||
    AJUSTES_PARALELAS_POR_NIVEL?.["basico"];
  const radioArco = ajustesNivel?.radioArco || 0.8;
  const distanciaEtiquetaBase = ajustesNivel?.distanciaEtiqueta || 1.6;
  const colorTextoEcuacion = ajustesNivel?.colorTextoAngulo || "#000000";

  const todosLosPuntos: [number, number][] = [];
  lineas.forEach((l) => todosLosPuntos.push(l.puntos[0], l.puntos[1]));

  const margenExtra = 2.5; // Margen ligeramente mayor para proteger las etiquetas dinámicas
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
        <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            {/* 🔥 DIBUJO DE LÍNEAS CON ETIQUETAS PROYECTADAS (Anti-Colisión) */}
            {lineas.map((linea, i) => {
              // Calculamos el vector de la línea para empujar su etiqueta (L1, L2, T) hacia afuera
              const dx = linea.puntos[1][0] - linea.puntos[0][0];
              const dy = linea.puntos[1][1] - linea.puntos[0][1];
              const anguloLinea = Math.atan2(dy, dx);

              // Empujamos L1, L2 y T exactamente 0.8 unidades siguiendo su propia inclinación
              const labelDist = 0.8;
              const labelX =
                linea.puntos[1][0] + labelDist * Math.cos(anguloLinea);
              const labelY =
                linea.puntos[1][1] + labelDist * Math.sin(anguloLinea);

              return (
                <g key={`linea-grupo-${i}`}>
                  <Line.Segment
                    point1={linea.puntos[0]}
                    point2={linea.puntos[1]}
                    color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                    weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                  />
                  {linea.label && (
                    <Text
                      x={labelX}
                      y={labelY}
                      size={tamanoBase}
                      color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                    >
                      {linea.label}
                    </Text>
                  )}
                </g>
              );
            })}

            {/* 🔥 DIBUJO DE ÁNGULOS CON SISTEMA POLAR ROTATIVO */}
            {angulos.map((ang, i) => {
              // 1. Buscamos si existe un ajuste polar manual [radioExtra, gradosExtra]
              const ajustePolar =
                ajustesNivel?.offsetPolares && ajustesNivel.offsetPolares[i]
                  ? ajustesNivel.offsetPolares[i]
                  : [0, 0];

              // 2. Aplicamos la independencia matemática:
              // Al radio base, le sumamos tu ajuste. A la bisectriz, le sumamos tus grados.
              const radioFinal = distanciaEtiquetaBase + ajustePolar[0];
              const anguloMedioModificadoRad =
                ((ang.inicio + ang.fin) / 2 + ajustePolar[1]) * (Math.PI / 180);

              const textX =
                ang.centro[0] + radioFinal * Math.cos(anguloMedioModificadoRad);
              const textY =
                ang.centro[1] + radioFinal * Math.sin(anguloMedioModificadoRad);

              return (
                <g key={`angulo-grupo-${i}`}>
                  <ArcoAngulo
                    centro={ang.centro}
                    startAngle={ang.inicio}
                    endAngle={ang.fin}
                    radio={radioArco}
                    colorBorde={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                  />
                  <Text
                    x={textX}
                    y={textY}
                    size={tamanoBase}
                    color={colorTextoEcuacion}
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
