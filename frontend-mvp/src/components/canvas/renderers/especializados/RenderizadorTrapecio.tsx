import { useState } from "react";
import { Mafs, Line, Text, Polygon, Polyline } from "mafs";
import { CONFIG_GEOMETRIA, AJUSTES_TRAPECIO } from "./ConstantesVisuales";

interface EtiquetaVectorial {
  texto: string;
  mx: number;
  my: number;
  nx: number;
  ny: number;
}

interface Props {
  parametros: {
    vertices: [number, number][];
    lineaAltura: { inicio: [number, number]; fin: [number, number] };
    etiquetas: EtiquetaVectorial[];
  };
}

export const RenderizadorTrapecio = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.vertices) return null;
  const { vertices, lineaAltura, etiquetas } = parametros;

  const escalaBase = AJUSTES_TRAPECIO?.escalaFuente || 0.8;
  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto * escalaBase;

  // 🔥 1. MOTOR DE NORMALIZACIÓN (El tamaño no importa, siempre se dibujará a escala 10)
  const xs = vertices.map((v) => v[0]);
  const ys = vertices.map((v) => v[1]);
  const ancho = Math.max(...xs) - Math.min(...xs);
  const alto = Math.max(...ys) - Math.min(...ys);
  const maxDim = Math.max(ancho, alto) || 1;
  const scale = 10 / maxDim;

  const verticesEscalados = vertices.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );
  const inicioAltura = [
    lineaAltura.inicio[0] * scale,
    lineaAltura.inicio[1] * scale,
  ] as [number, number];
  const finAltura = [
    lineaAltura.fin[0] * scale,
    lineaAltura.fin[1] * scale,
  ] as [number, number];

  // 🔥 2. CÁLCULO VECTORIAL DE TEXTOS
  const etiquetasCalculadas = etiquetas.map((eti, i) => {
    const PADDING_DINAMICO = AJUSTES_TRAPECIO?.distanciasTexto?.[i] || 0.6;
    return {
      texto: eti.texto,
      x: eti.mx * scale + eti.nx * PADDING_DINAMICO,
      y: eti.my * scale + eti.ny * PADDING_DINAMICO,
    };
  });

  // 3. CÁMARA INTELIGENTE (Viewbox envolvente)
  const limitesX = [
    ...verticesEscalados.map((v) => v[0]),
    ...etiquetasCalculadas.map((e) => e.x),
  ];
  const limitesY = [
    ...verticesEscalados.map((v) => v[1]),
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

  // Coordenadas para el símbolo de 90° (cuadradito de la altura)
  const ladoCuadro = 0.4;
  const cuadro90 = [
    [finAltura[0] - ladoCuadro, finAltura[1]],
    [finAltura[0] - ladoCuadro, finAltura[1] + ladoCuadro],
    [finAltura[0], finAltura[1] + ladoCuadro],
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

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2 h-[280px]">
        <Mafs height={270} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            {/* Relleno y bordes del Trapecio */}
            <Polygon
              points={verticesEscalados}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              fillOpacity={0.1}
              weight={2.5}
            />

            {/* Línea de Altura y su Símbolo de 90° */}
            <Line.Segment
              point1={inicioAltura}
              point2={finAltura}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
              weight={2}
              style="dashed"
            />
            <Polyline
              points={cuadro90}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
              weight={1.5}
            />

            {/* Textos con Escudo Vectorial Blanco */}
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
