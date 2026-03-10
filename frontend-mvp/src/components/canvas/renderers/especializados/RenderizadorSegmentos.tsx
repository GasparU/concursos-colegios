import { Point, Line, Text } from "mafs";
import { MeasureDimension } from "./MeasureDimension";
import { Mafs } from "mafs";

const VIEWBOX_SEGMENTOS = {
  x: [-1, 11] as [number, number], // 🔥 AGREGA ESTO
  y: [-3, 3] as [number, number], // 🔥 AGREGA ESTO
  padding: 0.2,
};

// 🔥🔥🔥 TU PANEL DE CONTROL - MODIFICA AQUÍ LOS VALORES 🔥🔥🔥
const CONFIG = {
  // --- COLORES ---
  COLOR_LINEA_PRINCIPAL: "#36a2eb", // Negro pizarra (El eje principal)
  COLOR_PUNTOS: "#36a2eb", // Azul rey (Los puntos A, B, C)
  COLOR_COTAS: "#10B981", // Verde esmeralda (Las medidas)
  COLOR_LETRAS: "#1E293B", // Color de A, B, C

  // --- GROSORES ---
  GROSOR_PRINCIPAL: 3, // Grosor de la línea negra central
  GROSOR_COTAS: 1.5, // Grosor de las líneas verdes
  RADIO_PUNTOS: 3, // Tamaño de los puntos azules

  // --- ALTURAS (Y) - LA PARTE CLAVE ---
  // Coordenada Y=0 es el centro. Positivos hacia arriba, negativos hacia abajo.

  // 1. TEXTO DE PUNTOS (A, B, C)
  Y_LETRAS_PUNTOS: -0.5, // Qué tan abajo de la línea negra aparecen las letras A, B...

  // 2. COTAS SUPERIORES (Las partes pequeñas: 3k, 4k+2)
  Y_COTAS_ARRIBA_LINEA: 0.5, // Altura de la línea verde
  Y_COTAS_ARRIBA_TEXTO: 0.8, // Altura del texto (debe ser mayor que la línea)
  ALTO_PATITAS_ARRIBA: 0.3, // Tamaño de las rayitas verticales

  // 3. COTA INFERIOR (El Total: 204)
  Y_COTA_TOTAL_LINEA: -0.9, // Altura de la línea verde total (debe ser negativa)
  Y_COTA_TOTAL_TEXTO: -1.3, // Altura del texto total (más negativo = más abajo)
  ALTO_PATITAS_ABAJO: 0.4,
};

export const RenderizadorSegmentos = ({ parametros }: { parametros: any }) => {
  const { segments, x_value, total_label } = parametros;

  if (!segments || !Array.isArray(segments)) return null;

  // --- CÁLCULO MATEMÁTICO (No tocar esto, solo escala) ---
  const valorXNum = parseFloat(x_value) || 10;

  let longitudTotalReal = 0;
  segments.forEach((s: any) => {
    const coef = parseFloat(s.coef) || 0;
    const cons = parseFloat(s.const) || 0;
    longitudTotalReal += coef * valorXNum + cons;
  });

  // 2. Definimos que queremos que ocupe SIEMPRE 10 unidades visuales
  const ANCHO_VISUAL_DESEADO = 10;

  // Factor de escala para que quepa en pantalla [-6, 6]
  const factorEscala = ANCHO_VISUAL_DESEADO / longitudTotalReal;

  let xAcumulado = 0;
  const puntosX: number[] = [0];

  segments.forEach((segmento: any) => {
    const coef = parseFloat(segmento.coef) || 0;
    const constante = parseFloat(segmento.const) || 0;
    const longitudReal = coef * valorXNum + constante;
    xAcumulado += longitudReal * factorEscala;
    puntosX.push(xAcumulado);
  });

  const xFinalTotal = puntosX[puntosX.length - 1];

  return (
    <Mafs height={300} viewBox={VIEWBOX_SEGMENTOS} pan={false} zoom={false}>
      <>
        {/* 1. LÍNEA PRINCIPAL (EJE X) */}
        <Line.Segment
          point1={[0, 0]}
          point2={[xFinalTotal, 0]}
          color={CONFIG.COLOR_LINEA_PRINCIPAL}
          weight={CONFIG.GROSOR_PRINCIPAL}
        />

        {/* 2. PUNTOS Y SUS LETRAS (A, B, C...) */}
        {puntosX.map((posX, i) => {
          const letra = String.fromCharCode(65 + i);
          return (
            <g key={`punto-${i}`}>
              {/* Punto Azul */}
              <Point
                x={posX}
                y={0}
                color={CONFIG.COLOR_PUNTOS}
                svgCircleProps={{ r: CONFIG.RADIO_PUNTOS }}
              />

              {/* Letra A, B, C */}
              <Text
                x={posX}
                y={CONFIG.Y_LETRAS_PUNTOS}
                attach="n"
                size={20}
                color={CONFIG.COLOR_LETRAS}
                svgTextProps={{ fontWeight: "bold" }}
              >
                {letra}
              </Text>
            </g>
          );
        })}

        {/* 3. COTAS SUPERIORES (PARTES) */}
        {segments.map((segmento: any, i: number) => (
          <MeasureDimension
            key={`cota-sup-${i}`}
            inicio={[puntosX[i], 0]}
            fin={[puntosX[i + 1], 0]}
            etiqueta={segmento.label}
            // 🔥 AQUÍ SE USAN TUS VARIABLES DE CONTROL
            alturaLinea={CONFIG.Y_COTAS_ARRIBA_LINEA}
            alturaTexto={CONFIG.Y_COTAS_ARRIBA_TEXTO}
            alturaPatitas={CONFIG.ALTO_PATITAS_ARRIBA}
            color={CONFIG.COLOR_COTAS}
            grosor={CONFIG.GROSOR_COTAS}
          />
        ))}

        {/* 4. COTA INFERIOR (TOTAL) */}
        {total_label && (
          <MeasureDimension
            inicio={[0, 0]}
            fin={[xFinalTotal, 0]}
            etiqueta={total_label.toString()}
            // 🔥 AQUÍ SE USAN TUS VARIABLES DE CONTROL
            alturaLinea={CONFIG.Y_COTA_TOTAL_LINEA}
            alturaTexto={CONFIG.Y_COTA_TOTAL_TEXTO}
            alturaPatitas={CONFIG.ALTO_PATITAS_ABAJO}
            color={CONFIG.COLOR_COTAS}
            grosor={CONFIG.GROSOR_COTAS}
          />
        )}
      </>
    </Mafs>
  );
};
