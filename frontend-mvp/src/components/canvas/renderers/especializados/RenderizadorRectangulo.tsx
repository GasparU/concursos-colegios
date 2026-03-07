import { Mafs, Line, Text, Polygon } from "mafs";
import { CONFIG_GEOMETRIA, CONFIG_RECTANGULO } from "./ConstantesVisuales";

interface RectanguloProps {
  esquina: [number, number];
  ancho: number;
  alto: number;
  labels?: string[];
  etiquetasLados?: {
    posicion: "arriba" | "abajo" | "izquierda" | "derecha";
    texto: string;
  }[];
  color?: string;
}

export const RenderizadorRectangulo = ({
  esquina,
  ancho,
  alto,
  labels,
  etiquetasLados,
  color = CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL,
}: RectanguloProps) => {
  // 🔥 1. MOTOR DE NORMALIZACIÓN VISUAL (Auto-Escalado)
  // Siempre escalamos para que el lado más largo mida exactamente 10 en la pantalla.
  const maxVal = Math.max(ancho, alto);
  const scale = 10 / maxVal;
  const sAncho = ancho * scale;
  const sAlto = alto * scale;
  const [x0, y0] = [esquina[0] * scale, esquina[1] * scale];

  const vertices: [number, number][] = [
    [x0, y0], // A (Abajo Izquierda)
    [x0 + sAncho, y0], // B (Abajo Derecha)
    [x0 + sAncho, y0 + sAlto], // C (Arriba Derecha)
    [x0, y0 + sAlto], // D (Arriba Izquierda)
  ];

  // 🔥 2. FILTRADO INTELIGENTE (Cero backend)
  // El backend manda 4 lados, nosotros solo queremos mostrar "abajo" e "izquierda"
  const ladosMostrar =
    etiquetasLados?.filter(
      (l) => l.posicion === "abajo" || l.posicion === "izquierda",
    ) || [];

  // 🔥 3. SMART BOUNDING BOX (Enfoque de cámara perfecto)
  let minX = x0;
  let maxX = x0 + sAncho;
  let minY = y0;
  let maxY = y0 + sAlto;

  // Escanear los textos de los lados para expandir la cámara
  ladosMostrar.forEach((l) => {
    if (l.posicion === "abajo") {
      minY = Math.min(minY, y0 + CONFIG_RECTANGULO.LADOS.abajo.offset[1] - 1);
    }
    if (l.posicion === "izquierda") {
      minX = Math.min(
        minX,
        x0 + CONFIG_RECTANGULO.LADOS.izquierda.offset[0] - 2,
      );
    }
  });

  // Escanear las etiquetas de los vértices (A, B, C, D)
  labels?.forEach((_, i) => {
    const offset = CONFIG_RECTANGULO.VERTICES[i]?.offset || [0, 0];
    minX = Math.min(minX, vertices[i][0] + offset[0] - 0.5);
    maxX = Math.max(maxX, vertices[i][0] + offset[0] + 0.5);
    minY = Math.min(minY, vertices[i][1] + offset[1] - 0.5);
    maxY = Math.max(maxY, vertices[i][1] + offset[1] + 0.5);
  });

  const padding = CONFIG_RECTANGULO.ZOOM_MARGIN || 1.5;
  const viewBox = {
    x: [minX - padding, maxX + padding] as [number, number],
    y: [minY - padding, maxY + padding] as [number, number],
  };

  // 🔥 4. COORDENADAS PARA LOS ÁNGULOS RECTOS DE 90°
  const rSize = CONFIG_RECTANGULO.ANGULO_RECTO_TAMANO || 0.6;
  const angulosRectos: [number, number][][] = [
    // Esquina A (Abajo Izquierda)
    [
      [x0, y0],
      [x0 + rSize, y0],
      [x0 + rSize, y0 + rSize],
      [x0, y0 + rSize],
    ],
    // Esquina B (Abajo Derecha)
    [
      [x0 + sAncho, y0],
      [x0 + sAncho - rSize, y0],
      [x0 + sAncho - rSize, y0 + rSize],
      [x0 + sAncho, y0 + rSize],
    ],
    // Esquina C (Arriba Derecha)
    [
      [x0 + sAncho, y0 + sAlto],
      [x0 + sAncho - rSize, y0 + sAlto],
      [x0 + sAncho - rSize, y0 + sAlto - rSize],
      [x0 + sAncho, y0 + sAlto - rSize],
    ],
    // Esquina D (Arriba Izquierda)
    [
      [x0, y0 + sAlto],
      [x0 + rSize, y0 + sAlto],
      [x0 + rSize, y0 + sAlto - rSize],
      [x0, y0 + sAlto - rSize],
    ],
  ];

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {/* Símbolos de 90 grados (Esquinas verdes) */}
          {angulosRectos.map((puntos, idx) => (
            <Polygon
              key={`rect-ang-${idx}`}
              points={puntos}
              color={CONFIG_GEOMETRIA.COLOR_BORDE_ANGULO}
              weight={CONFIG_GEOMETRIA.GROSOR_BORDE_ANGULO} // 🔥 Grosor universal
              fillOpacity={CONFIG_GEOMETRIA.OPACIDAD_RELLENO_ANGULO} // 🔥 Opacidad universal
            />
          ))}

          {/* Lados del Rectángulo */}
          {[0, 1, 2, 3].map((i) => (
            <Line.Segment
              key={`linea-${i}`}
              point1={vertices[i]}
              point2={vertices[(i + 1) % 4]}
              color={color}
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            />
          ))}

          {/* Etiquetas de los vértices (A, B, C, D) */}
          {labels &&
            labels.map((label, i) => {
              const offset = CONFIG_RECTANGULO.VERTICES[i]?.offset || [0, 0];
              return (
                <Text
                  key={`label-${i}`}
                  x={vertices[i][0] + offset[0]}
                  y={vertices[i][1] + offset[1]}
                  size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                  color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                >
                  {label}
                </Text>
              );
            })}

          {/* Ecuaciones (Solo abajo e izquierda) */}
          {ladosMostrar.map((l, i) => {
            let x = 0,
              y = 0;
            if (l.posicion === "abajo") {
              x = x0 + sAncho / 2;
              y = y0 + CONFIG_RECTANGULO.LADOS.abajo.offset[1];
            } else if (l.posicion === "izquierda") {
              x = x0 + CONFIG_RECTANGULO.LADOS.izquierda.offset[0];
              y = y0 + sAlto / 2;
            }

            return (
              <Text
                key={`lado-eq-${i}`}
                x={x}
                y={y}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {l.texto}
              </Text>
            );
          })}
        </g>
      </Mafs>
    </div>
  );
};
