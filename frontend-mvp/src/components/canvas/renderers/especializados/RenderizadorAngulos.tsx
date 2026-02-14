import { Mafs, Text, Point, Vector } from "mafs";
import { ANGULOS_CONFIG } from "./ConstantesVisuales";

const toRad = (deg: number) => (deg * Math.PI) / 180;

// Componente para dibujar un sector circular relleno (el ángulo)
const SectorRelleno = ({
  startAngle,
  endAngle,
  radius,
  color,
  opacity = 0.2,
}: any) => {
  const startRad = toRad(startAngle);
  const endRad = toRad(endAngle);
  const x1 = radius * Math.cos(startRad);
  const y1 = radius * Math.sin(startRad);
  const x2 = radius * Math.cos(endRad);
  const y2 = radius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const pathData = [
    `M 0 0`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `Z`,
  ].join(" ");
  return <path d={pathData} fill={color} fillOpacity={opacity} stroke="none" />;
};

// Componente para dibujar el cuadradito de 90 grados (relleno)
const AnguloRectoRelleno = ({
  angleStart,
  radius = 0.5,
  color,
  opacity,
}: any) => {
  const r = radius;
  const p1 = {
    x: r * Math.cos(toRad(angleStart)),
    y: r * Math.sin(toRad(angleStart)),
  };
  const pCorner = {
    x: r * Math.sqrt(2) * Math.cos(toRad(angleStart + 45)),
    y: r * Math.sqrt(2) * Math.sin(toRad(angleStart + 45)),
  };
  const p2 = {
    x: r * Math.cos(toRad(angleStart + 90)),
    y: r * Math.sin(toRad(angleStart + 90)),
  };
  return (
    <polygon
      points={`0,0 ${p1.x},${p1.y} ${pCorner.x},${pCorner.y} ${p2.x},${p2.y}`}
      fill={color}
      fillOpacity={opacity}
      stroke="none"
    />
  );
};

// Componente para dibujar Arcos SVG (borde del ángulo)
const ArcoSimple = ({
  startAngle,
  endAngle,
  radius,
  color,
  strokeWidth,
}: any) => {
  const startRad = toRad(startAngle);
  const endRad = toRad(endAngle);
  const x1 = radius * Math.cos(startRad);
  const y1 = radius * Math.sin(startRad);
  const x2 = radius * Math.cos(endRad);
  const y2 = radius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    `M ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
  ].join(" ");
  return <path d={d} stroke={color} strokeWidth={strokeWidth} fill="none" />;
};

export const RenderizadorAngulos = ({ parametros }: { parametros: any }) => {
  const { rays, x_value, vertex, total_label } = parametros;

  if (!rays || !Array.isArray(rays) || rays.length === 0) return null;

  const valorX = parseFloat(x_value) || 10;

  // Calcular ángulos reales y acumular
  let anguloActual = 0;
  const dataVisual = rays.map((ray: any) => {
    const coef = parseFloat(ray.coef) || 0;
    const cons = parseFloat(ray.const) || 0;
    const anguloReal = coef * valorX + cons;

    const inicio = anguloActual;
    const fin = anguloActual + anguloReal;
    const medio = (inicio + fin) / 2;

    anguloActual = fin;

    return { ...ray, anguloReal, inicio, fin, medio };
  });

  // Ángulos de los rayos (incluyendo el inicial 0)
  const angulosRayos = [0, ...dataVisual.map((d: any) => d.fin)];
  

  // Calcular rotación dinámica para centrar el arco total hacia arriba
  const inicioTotal = 0;
  const finTotal = dataVisual[dataVisual.length - 1].fin;
  const medioTotal = (inicioTotal + finTotal) / 2;
  const rotacion = 90 - medioTotal; // Rotación para que el punto medio esté en 90° (arriba)

  // Recolectar puntos para viewBox (con rotación aplicada)
  const puntos: { x: number; y: number }[] = [{ x: 0, y: 0 }]; // vértice

  angulosRayos.forEach((deg) => {
    const rad = toRad(deg + rotacion);
    puntos.push({
      x: ANGULOS_CONFIG.RADIO_RAYOS * Math.cos(rad),
      y: ANGULOS_CONFIG.RADIO_RAYOS * Math.sin(rad),
    });
    puntos.push({
      x: ANGULOS_CONFIG.RADIO_LETRAS * Math.cos(rad),
      y: ANGULOS_CONFIG.RADIO_LETRAS * Math.sin(rad),
    });
  });

  dataVisual.forEach((dato) => {
    const radMedio = toRad(dato.medio + rotacion);
    puntos.push({
      x: ANGULOS_CONFIG.RADIO_TEXTO * Math.cos(radMedio),
      y: ANGULOS_CONFIG.RADIO_TEXTO * Math.sin(radMedio),
    });
  });

  // Calcular límites con margen
  let minX = Math.min(...puntos.map((p) => p.x));
  let maxX = Math.max(...puntos.map((p) => p.x));
  let minY = Math.min(...puntos.map((p) => p.y));
  let maxY = Math.max(...puntos.map((p) => p.y));

  const MARGEN = 4.5;
  minX -= MARGEN;
  maxX += MARGEN;
  minY -= MARGEN;
  maxY += MARGEN;

  const esBasico = rays.length === 2; // 2 ángulos
  const radioTexto = esBasico ? 9.0 : ANGULOS_CONFIG.RADIO_TEXTO;


  let viewBox;
  if (esBasico) {
    // Para básico: mantener simetría en X pero usar rango real en Y
    const maxX = Math.max(...puntos.map((p) => Math.abs(p.x))) + MARGEN;
    const minY = Math.min(...puntos.map((p) => p.y)) - MARGEN;
    const maxY = Math.max(...puntos.map((p) => p.y)) + MARGEN;
    viewBox = {
      x: [-maxX, maxX] as [number, number],
      y: [minY, maxY] as [number, number],
      padding: 0,
    };
  } else {
    // Para intermedio/avanzado: centrado simétrico
    const maxDist =
      Math.max(...puntos.map((p) => Math.hypot(p.x, p.y))) + MARGEN;
    viewBox = {
      x: [-maxDist, maxDist] as [number, number],
      y: [-maxDist, maxDist] as [number, number],
      padding: 0,
    };
  }

  // Altura según número de rayos
  const height = rays.length >= 4 ? 400 : 300;

  return (
    <Mafs
      height={height}
      viewBox={viewBox}
      pan={false}
      zoom={false}
      preserveAspectRatio="contain"
    >
      <g>
        {/* Vértice O */}
        {/* <Text
          x={0}
          y={0}
          size={ANGULOS_CONFIG.TAMANO_LETRAS_PUNTOS}
          color={ANGULOS_CONFIG.COLOR_TEXTO}
        >
          {vertex?.label === "0" ? "O" : vertex?.label || "O"}
        </Text> */}

        {/* Sectores rellenos (ángulos) con rotación */}
        {dataVisual.map((dato: any, i: number) => {
          const isRightAngle = Math.abs(dato.anguloReal - 90) < 1.5;
          return isRightAngle ? (
            <AnguloRectoRelleno
              key={`fill-${i}`}
              angleStart={dato.inicio + rotacion}
              radius={ANGULOS_CONFIG.RADIO_ARCO}
              color={ANGULOS_CONFIG.COLOR_RELLENO}
              opacity={ANGULOS_CONFIG.OPACIDAD_RELLENO}
            />
          ) : (
            <SectorRelleno
              key={`fill-${i}`}
              startAngle={dato.inicio + rotacion}
              endAngle={dato.fin + rotacion}
              radius={ANGULOS_CONFIG.RADIO_ARCO}
              color={ANGULOS_CONFIG.COLOR_RELLENO}
              opacity={ANGULOS_CONFIG.OPACIDAD_RELLENO}
            />
          );
        })}

        {/* Arcos (bordes) con rotación */}
        {dataVisual.map((dato: any, i: number) => (
          <ArcoSimple
            key={`arc-${i}`}
            startAngle={dato.inicio + rotacion}
            endAngle={dato.fin + rotacion}
            radius={ANGULOS_CONFIG.RADIO_ARCO}
            color={ANGULOS_CONFIG.COLOR_ARCO}
            strokeWidth={ANGULOS_CONFIG.GROSOR_ARCO}
          />
        ))}

        {/* Rayos con flecha (triángulo) */}
        {angulosRayos.map((deg, i) => {
          const rad = toRad(deg + rotacion);
          const tipX = ANGULOS_CONFIG.RADIO_RAYOS * Math.cos(rad);
          const tipY = ANGULOS_CONFIG.RADIO_RAYOS * Math.sin(rad);
          const rotationDeg = deg + rotacion; // no se usa directamente

          return (
            <g key={`ray-${i}`}>
              {/* Vector de Mafs con cabeza de flecha */}
              <Vector
                tail={[0, 0]}
                tip={[tipX, tipY]}
                color={ANGULOS_CONFIG.COLOR_RAYOS}
                weight={ANGULOS_CONFIG.GROSOR_RAYOS}
              />
              {/* Punto en el extremo (opcional, puedes mantenerlo o quitarlo) */}
              <Point
                x={tipX}
                y={tipY}
                color={ANGULOS_CONFIG.COLOR_PUNTOS}
                svgCircleProps={{ r: ANGULOS_CONFIG.RADIO_PUNTOS }}
              />
            </g>
          );
        })}

        {/* Etiquetas de puntos (A, B, C...) con rotación */}
        {angulosRayos.map((deg, i) => {
          const rad = toRad(deg + rotacion);
          const labelX = ANGULOS_CONFIG.RADIO_LETRAS * Math.cos(rad);
          const labelY = ANGULOS_CONFIG.RADIO_LETRAS * Math.sin(rad);
          const label =
            dataVisual[i]?.pointLabel || String.fromCharCode(65 + i);

            console.log("🎯 [frontend] dataVisual:", dataVisual);
            console.log("🎯 [frontend] angulosRayos:", angulosRayos);
            console.log("🎯 [frontend] rays del backend:", parametros.rays);

          return (
            <Text
              key={`label-${i}`}
              x={labelX}
              y={labelY}
              size={ANGULOS_CONFIG.TAMANO_LETRAS_PUNTOS}
              color={ANGULOS_CONFIG.COLOR_TEXTO}
              svgTextProps={{ fontWeight: "bold" }}
            >
              {label}
            </Text>
          );
        })}

        {/* Etiquetas de valor de los ángulos (ej: 7x, 3x+12) con rotación */}
        {dataVisual.map((dato: any, i: number) => {
          const radMedio = toRad(dato.medio + rotacion);
          const textX = radioTexto * Math.cos(radMedio);
          const textY = radioTexto * Math.sin(radMedio);

          return (
            <Text
              key={`angle-label-${i}`}
              x={textX}
              y={textY}
              size={ANGULOS_CONFIG.TAMANO_LETRAS_ANGULOS}
              color={ANGULOS_CONFIG.COLOR_TEXTO}
            >
              {dato.angleLabel || `${dato.anguloReal}°`}
            </Text>
          );
        })}
      </g>
    </Mafs>
  );
};
