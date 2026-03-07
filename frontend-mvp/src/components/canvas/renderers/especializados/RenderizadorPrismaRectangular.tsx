import { useState } from "react";
import { Mafs, Line, Text, Polygon } from "mafs";
import { CONFIG_GEOMETRIA, AJUSTES_PRISMA } from "./ConstantesVisuales";

interface Arista {
  inicio: [number, number];
  fin: [number, number];
}

interface EtiquetaVectorial {
  texto: string;
  mx: number;
  my: number;
  nx: number;
  ny: number;
}

interface Props {
  parametros: {
    todosLosPuntos: [number, number][];
    aristasSolidas: Arista[];
    aristasOcultas: Arista[];
    etiquetas: EtiquetaVectorial[];
  };
}

export const RenderizadorPrismaRectangular = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.todosLosPuntos) return null;
  const { todosLosPuntos, aristasSolidas, aristasOcultas, etiquetas } =
    parametros;

  const escalaBase = AJUSTES_PRISMA?.escalaFuente || 0.75;
  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto * escalaBase;

  // 1. MOTOR DE NORMALIZACIÓN (El Prisma siempre medirá 10 unidades de máximo)
  const xs = todosLosPuntos.map((v) => v[0]);
  const ys = todosLosPuntos.map((v) => v[1]);
  const ancho = Math.max(...xs) - Math.min(...xs);
  const alto = Math.max(...ys) - Math.min(...ys);
  const maxDim = Math.max(ancho, alto) || 1;
  const scale = 10 / maxDim;

  const escalarArista = (arista: Arista) => ({
    inicio: [arista.inicio[0] * scale, arista.inicio[1] * scale] as [
      number,
      number,
    ],
    fin: [arista.fin[0] * scale, arista.fin[1] * scale] as [number, number],
  });

  const solidasEscaladas = aristasSolidas.map(escalarArista);
  const ocultasEscaladas = aristasOcultas.map(escalarArista);

  // 🔥 2. EMPUJE VECTORIAL INDEPENDIENTE (Lee el array de ConstantesVisuales)
  const etiquetasCalculadas = etiquetas.map((eti, i) => {
    // Si la constante existe, toma el valor específico para Largo, Alto o Profundidad
    const PADDING_DINAMICO = AJUSTES_PRISMA?.distanciasTexto?.[i] || 0.6;
    return {
      texto: eti.texto,
      x: eti.mx * scale + eti.nx * PADDING_DINAMICO,
      y: eti.my * scale + eti.ny * PADDING_DINAMICO,
    };
  });

  // 3. CÁMARA INTELIGENTE
  const puntosEscalados = todosLosPuntos.map((p) => [
    p[0] * scale,
    p[1] * scale,
  ]);
  const limitesX = [
    ...puntosEscalados.map((v) => v[0]),
    ...etiquetasCalculadas.map((e) => e.x),
  ];
  const limitesY = [
    ...puntosEscalados.map((v) => v[1]),
    ...etiquetasCalculadas.map((e) => e.y),
  ];

  const minX = Math.min(...limitesX);
  const maxX = Math.max(...limitesX);
  const minY = Math.min(...limitesY);
  const maxY = Math.max(...limitesY);

  const MARGEN = 0.8;
  const viewBox = {
    x: [minX - MARGEN, maxX + MARGEN] as [number, number],
    y: [minY - MARGEN, maxY + MARGEN] as [number, number],
  };

  // Coordenadas para rellenar la cara frontal con un azul tenue
  const caraFrontal = [
    puntosEscalados[0],
    puntosEscalados[1],
    puntosEscalados[2],
    puntosEscalados[3],
  ] as [number, number][];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-end w-full mb-2 gap-2 pr-4">
        <button
          onClick={() => setEscalaTexto((p) => Math.max(0.7, p - 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 rounded text-slate-600 font-bold"
        >
          A-
        </button>
        <button
          onClick={() => setEscalaTexto((p) => Math.min(1.5, p + 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 rounded text-slate-600 font-bold"
        >
          A+
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2 h-[340px]">
        <Mafs height={330} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            {/* Relleno sutil para destacar la cara frontal (Z=0) */}
            <Polygon
              points={caraFrontal}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              fillOpacity={0.05}
              weight={0}
            />

            {/* Aristas Ocultas (Punteadas) - ¡Esto da la ilusión 3D real! */}
            {ocultasEscaladas.map((arista, idx) => (
              <Line.Segment
                key={`oculta-${idx}`}
                point1={arista.inicio}
                point2={arista.fin}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
                weight={1.5}
                style="dashed"
              />
            ))}

            {/* Aristas Visibles (Sólidas) */}
            {solidasEscaladas.map((arista, idx) => (
              <Line.Segment
                key={`solida-${idx}`}
                point1={arista.inicio}
                point2={arista.fin}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                weight={2.5}
              />
            ))}

            {/* 🔥 Textos Algebraicos con HALO BLANCO ACTIVO */}
            {etiquetasCalculadas.map((eti, i) => (
              <Text
                key={`eti-${i}`}
                x={eti.x}
                y={eti.y}
                size={tamanoBase}
                color="#000000"
                svgTextProps={{
                  fontWeight: "700",
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                  // EL HALO: Esta línea garantiza que las ecuaciones inmensas corten la línea azul si se cruzan.
                  style: {
                    paintOrder: "stroke",
                    stroke: "#ffffff",
                    strokeWidth: "6px",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  },
                }}
              >
                {eti.texto}
              </Text>
            ))}
          </g>
        </Mafs>
      </div>
    </div>
  );
};
