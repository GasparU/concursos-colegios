import { Mafs, Line, Text } from "mafs";
import {
  CONFIG_GEOMETRIA,
  CONFIG_TRIANGULO_ECUACIONES,
} from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface TrianguloAngulosProps {
  vertices: [number, number][];
  etiquetasVertices?: string[];
  angulos: {
    centro: [number, number];
    inicio: number;
    fin: number;
    etiqueta?: string;
  }[];
  lados?: {
    inicio: [number, number];
    fin: [number, number];
    etiqueta?: string;
  }[];
}

export const RenderizadorTrianguloAngulos = ({
  vertices,
  etiquetasVertices,
  angulos,
  lados,
}: TrianguloAngulosProps) => {
  if (!vertices || vertices.length !== 3) return null;

  // Calcular viewBox incluyendo vértices y etiquetas de ángulos
  let minX = Math.min(...vertices.map((v) => v[0]));
  let maxX = Math.max(...vertices.map((v) => v[0]));
  let minY = Math.min(...vertices.map((v) => v[1]));
  let maxY = Math.max(...vertices.map((v) => v[1]));

  angulos.forEach((a, i) => {
    const configVertice =
      CONFIG_TRIANGULO_ECUACIONES.VERTICES[i] ||
      CONFIG_TRIANGULO_ECUACIONES.VERTICES[0];
    const radioDelArco = configVertice.radioArco || 1.2;
    const distanciaTexto = radioDelArco * (configVertice.distancia || 1.8);
    const anguloMedio = ((a.inicio + a.fin) / 2) * (Math.PI / 180);

    const textoX =
      a.centro[0] +
      distanciaTexto * Math.cos(anguloMedio) +
      (configVertice.ajusteX || 0);
    const textoY =
      a.centro[1] +
      distanciaTexto * Math.sin(anguloMedio) +
      (configVertice.ajusteY || 0);

    minX = Math.min(minX, textoX);
    maxX = Math.max(maxX, textoX);
    minY = Math.min(minY, textoY);
    maxY = Math.max(maxY, textoY);
  });

  const padding = CONFIG_TRIANGULO_ECUACIONES.MARGEN_PLANO || 2.5;
  const viewBox = {
    x: [minX - padding, maxX + padding] as [number, number],
    y: [minY - padding, maxY + padding] as [number, number],
  };

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {/* Lados */}
          {lados ? (
            lados.map((l, i) => (
              <g key={`lado-${i}`}>
                <Line.Segment
                  point1={l.inicio}
                  point2={l.fin}
                  color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                  weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                />
                {l.etiqueta && (
                  <Text
                    x={(l.inicio[0] + l.fin[0]) / 2}
                    y={(l.inicio[1] + l.fin[1]) / 2 + 0.2}
                    size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                    color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                  >
                    {l.etiqueta}
                  </Text>
                )}
              </g>
            ))
          ) : (
            <>
              <Line.Segment
                point1={vertices[0]}
                point2={vertices[1]}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
              />
              <Line.Segment
                point1={vertices[1]}
                point2={vertices[2]}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
              />
              <Line.Segment
                point1={vertices[2]}
                point2={vertices[0]}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
              />
            </>
          )}

          {/* Etiquetas de vértices */}
          {etiquetasVertices?.map((label, i) => {
            const offset = 1.2;
            let x = vertices[i][0];
            let y = vertices[i][1];
            if (i === 0) y -= offset;
            else if (i === 1) y -= offset;
            else y += offset;
            return (
              <Text
                key={`label-${i}`}
                x={x}
                y={y}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {label}
              </Text>
            );
          })}

          {/* Ángulos y sus etiquetas */}
          {angulos.map((a, i) => {
            const configVertice =
              CONFIG_TRIANGULO_ECUACIONES.VERTICES[i] ||
              CONFIG_TRIANGULO_ECUACIONES.VERTICES[0];
            const radioDelArco = configVertice.radioArco || 1.2;
            const distanciaTexto =
              radioDelArco * (configVertice.distancia || 1.8);
            const anguloMedio = ((a.inicio + a.fin) / 2) * (Math.PI / 180);

            return (
              <g key={`ang-${i}`}>
                <ArcoAngulo
                  centro={a.centro}
                  startAngle={a.inicio}
                  endAngle={a.fin}
                  radio={radioDelArco}
                  colorBorde={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                  colorRelleno={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                />
                {a.etiqueta && (
                  <Text
                    x={
                      a.centro[0] +
                      distanciaTexto * Math.cos(anguloMedio) +
                      (configVertice.ajusteX || 0)
                    }
                    y={
                      a.centro[1] +
                      distanciaTexto * Math.sin(anguloMedio) +
                      (configVertice.ajusteY || 0)
                    }
                    size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                    color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                  >
                    {a.etiqueta}
                  </Text>
                )}
              </g>
            );
          })}
        </g>
      </Mafs>
    </div>
  );
};
