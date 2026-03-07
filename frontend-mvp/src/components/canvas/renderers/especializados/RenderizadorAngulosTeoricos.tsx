import { useState } from "react";
import { Mafs, Line, Text } from "mafs";
import {
  CONFIG_GEOMETRIA,
  AJUSTES_ANGULOS_MULTIPLES,
} from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface Props {
  parametros: {
    esComplemento: boolean;
    angulosList: { valor: number; etiqueta: string }[];
  };
}

export const RenderizadorAngulosTeoricos = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.angulosList) return null;
  const { esComplemento, angulosList } = parametros;

  // Viewbox dinámico: Suplemento necesita todo el ancho izquierdo
  const viewBox = {
    x: esComplemento
      ? ([-1, 5] as [number, number])
      : ([-5, 5] as [number, number]),
    y: [-1, 5] as [number, number],
  };

  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto;
  const origen: [number, number] = [0, 0];
  const longitudRayo = 4.5;
  const radioBase = 1.3;
  const distTexto = 2.0;

  // 1. DIBUJAMOS LA BASE (Línea Horizontal)
  const elementosSVG = [];
  elementosSVG.push(
    <Line.Segment
      key="base"
      point1={origen}
      point2={[longitudRayo, 0]}
      color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
      weight={2.5}
    />,
  );

  let startAngle = 0;

  // ... (Importa AJUSTES_ANGULOS_MULTIPLES desde ConstantesVisuales al inicio del archivo) ...

  // 2. ITERAMOS SOBRE CADA ÁNGULO PARA DIBUJAR RAYOS, ARCOS Y TEXTOS
  angulosList.forEach((ang, idx) => {
    const endAngle = startAngle + ang.valor;
    const radEnd = endAngle * (Math.PI / 180);

    // 🔥 LECTURA DE CONSTANTES INDEPENDIENTES (Con fallback seguro si hay más de 3 ángulos)
    const radioDinamicoArco = AJUSTES_ANGULOS_MULTIPLES.radiosArco[idx] || 1.3;
    const distanciaDinamicaTexto =
      AJUSTES_ANGULOS_MULTIPLES.distanciasTexto[idx] || 2.0;
    const offsetGrados = AJUSTES_ANGULOS_MULTIPLES.desfaseGrados[idx] || 0;

    // Calculamos el ángulo medio y le sumamos el offset por si queremos rotar el texto
    const anguloMedioReal = (startAngle + endAngle) / 2 + offsetGrados;
    const radTexto = anguloMedioReal * (Math.PI / 180);

    // Dibujar Rayo (El límite de este ángulo)
    const rayoX = longitudRayo * Math.cos(radEnd);
    const rayoY = longitudRayo * Math.sin(radEnd);

    const esUltimo = idx === angulosList.length - 1;
    elementosSVG.push(
      <Line.Segment
        key={`rayo-${idx}`}
        point1={origen}
        point2={[rayoX, rayoY]}
        color={
          esUltimo
            ? CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL
            : CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA
        }
        weight={esUltimo ? 2.5 : 2}
        style={esUltimo ? "solid" : "dashed"}
      />,
    );

    // Dibujar Arco y Texto independientes
    elementosSVG.push(
      <g key={`grupo-ang-${idx}`}>
        <ArcoAngulo
          centro={origen}
          startAngle={startAngle}
          endAngle={endAngle}
          radio={radioDinamicoArco} // 🔥 Tamaño de arco dictado por la constante
          colorBorde={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
        />
        <Text
          x={distanciaDinamicaTexto * Math.cos(radTexto)} // 🔥 Distancia dictada por la constante
          y={distanciaDinamicaTexto * Math.sin(radTexto)}
          size={tamanoBase}
          color="#000000"
          svgTextProps={{ fontWeight: "600" }}
        >
          {ang.etiqueta}
        </Text>
      </g>,
    );

    startAngle = endAngle; // Avanzamos al siguiente
  });

  // 3. DIBUJO DEL CUADRADITO ROJO GLOBAL (Solo si es Complemento 90°)
  if (esComplemento) {
    const rRecto = 0.5;
    elementosSVG.push(
      <g key="angulo-recto-global">
        <Line.Segment
          point1={[rRecto, 0]}
          point2={[rRecto, rRecto]}
          color="#ef4444"
          weight={2}
        />
        <Line.Segment
          point1={[0, rRecto]}
          point2={[rRecto, rRecto]}
          color="#ef4444"
          weight={2}
        />
      </g>,
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-end w-full mb-2 gap-2 pr-4">
        <button
          onClick={() => setEscalaTexto((p) => Math.max(0.7, p - 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 rounded font-bold"
        >
          A-
        </button>
        <button
          onClick={() => setEscalaTexto((p) => Math.min(1.5, p + 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 rounded font-bold"
        >
          A+
        </button>
      </div>
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2">
        <Mafs height={300} viewBox={viewBox} pan={false} zoom={false}>
          <g>{elementosSVG}</g>
        </Mafs>
      </div>
    </div>
  );
};;;
