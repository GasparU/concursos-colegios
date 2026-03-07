import React from "react";
// 🔥 Solo lo básico. Cero Vector2, cero LaTeX, cero basura.
import { Mafs, Polygon, Line, Text } from "mafs";

export default function RenderizadorTrianguloCompleto({
  vertices = [],
  etiquetas = [],
  lados = [],
  lineasAzulesPunteadas = [],
  trazosRojos = [],
  vectores = [],
}: any) {
  const ESTILO = {
    poligono: { color: "#3b82f6", weight: 2, fillOpacity: 0.1 },
    linea: { color: "#3b82f6", weight: 3 },
    auxiliar: { color: "#ef4444", weight: 2, style: "dashed" as const },
    trazoRojo: { color: "#ef4444", weight: 2 },
    vector: { color: "#ef4444", weight: 2 },
    texto: { size: 22 },
  };

  // 🔥 FUNCIÓN MATEMÁTICA PURA (Sin tipos raros)
  // Calcula un punto empujado hacia afuera de la línea para que el texto no choque.
  const obtenerPosicionFueraDeLinea = (inicio: number[], fin: number[]) => {
    const x1 = inicio[0],
      y1 = inicio[1];
    const x2 = fin[0],
      y2 = fin[1];

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const magnitud = Math.sqrt(dx * dx + dy * dy);

    if (magnitud === 0) return [midX, midY];

    // Calculamos la perpendicular (normal) y la alejamos 0.8 unidades
    const offset = 0.8;
    const offsetX = (-dy / magnitud) * offset;
    const offsetY = (dx / magnitud) * offset;

    // Empujoncito extra para líneas muy horizontales
    const ajusteY = Math.abs(dx) > Math.abs(dy) ? (dy >= 0 ? 0.3 : -0.3) : 0;

    return [midX + offsetX, midY + offsetY + ajusteY];
  };

  return (
    <Mafs
      viewBox={{ x: [-6, 6], y: [-6, 6] }}
      zoom={false}
      pan={false}
      preserveAspectRatio="contain"
    >
      {/* 1. POLÍGONO DE FONDO */}
      {vertices.length > 2 && (
        <Polygon points={vertices} {...ESTILO.poligono} />
      )}

      {/* 2. LADOS NORMALES Y SUS TEXTOS */}
      {lados &&
        lados.map((lado: any, i: number) => {
          // Obtenemos las coordenadas X e Y calculadas matemáticamente
          const posTexto =
            lado.inicio && lado.fin
              ? obtenerPosicionFueraDeLinea(lado.inicio, lado.fin)
              : [0, 0];

          return (
            <React.Fragment key={`lado-${i}`}>
              <Line.Segment
                point1={lado.inicio}
                point2={lado.fin}
                {...ESTILO.linea}
              />

              {lado.etiqueta && (
                <Text
                  x={posTexto[0]} // 🔥 Pasamos X puro
                  y={posTexto[1]} // 🔥 Pasamos Y puro
                  size={ESTILO.texto.size}
                >
                  {lado.etiqueta}
                </Text>
              )}
            </React.Fragment>
          );
        })}

      {/* 3. LÍNEAS AUXILIARES */}
      {lineasAzulesPunteadas &&
        lineasAzulesPunteadas.map((linea: any, i: number) => (
          <Line.Segment
            key={`aux-${i}`}
            point1={linea.inicio}
            point2={linea.fin}
            {...ESTILO.auxiliar}
          />
        ))}

      {/* 4. ETIQUETAS INDEPENDIENTES (A, B, C, x) */}
      {etiquetas &&
        etiquetas.map((etq: any, i: number) => {
          if (typeof etq === "object" && etq.pos) {
            return (
              <Text
                key={`etq-new-${i}`}
                x={etq.pos[0]}
                y={etq.pos[1]}
                size={ESTILO.texto.size}
              >
                {etq.texto}
              </Text>
            );
          }

          if (typeof etq === "string" && vertices[i]) {
            const vx = vertices[i][0];
            const vy = vertices[i][1];
            return (
              <Text
                key={`etq-old-${i}`}
                x={vx > 0 ? vx + 0.6 : vx - 0.6}
                y={vy > 0 ? vy + 0.6 : vy - 0.6}
                size={ESTILO.texto.size}
              >
                {etq}
              </Text>
            );
          }
          return null;
        })}
    </Mafs>
  );
}
