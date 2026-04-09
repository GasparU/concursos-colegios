import { Mafs, Line, Polygon, Theme, Text } from "mafs";

interface Props {
  parametros: {
    r: number;
    h: number;
    g: number; 
    anguloNotable?: string | null;
  };
}

export const RenderizadorCono = ({ parametros }: Props) => {
  // 🔥 Valores por defecto para evitar colapsos si el backend envía basura
  const { r = 3, h = 4, anguloNotable } = parametros;

  // Proporción para la perspectiva de la base (isometría)
  const isometriaY = r * 0.35;

  // --- 1. CONSTRUCCIÓN DE LA BASE (ELIPSE) ---
  const PASOS = 64;
  const puntosElipse: [number, number][] = Array.from({ length: PASOS + 1 }, (_, i) => {
    const t = (i / PASOS) * Math.PI * 2;
    return [r * Math.cos(t), isometriaY * Math.sin(t)];
  });

  // Dividimos la elipse en frontal (sólida) y trasera (discontinua)
  const puntosTraseros = puntosElipse.slice(0, PASOS / 2 + 1);
  const puntosDelanteros = puntosElipse.slice(PASOS / 2);

  // --- 2. CÁLCULO DE ENCUADRE (VIEWBOX) ---
  // 🔥 Margen quirúrgico para que el cono respire pero no se vea pequeño
  const margen = r * 0.4;
  const viewBox = {
    x: [-r - margen, r + margen] as [number, number],
    y: [-isometriaY - margen, h + margen] as [number, number],
  };

  // Tamaño del indicador de ángulo recto (90°)
  const sq = Math.min(r, h) * 0.12;

  const radioArco = r * 0.22; 
  const puntosArco: [number, number][] = [];

  if (anguloNotable) {
    // Calculamos el ángulo interno del cono en el vértice (r, 0)
    const thetaInterno = Math.atan(h / r);
    const PASOS_ARCO = 20;
    for (let i = 0; i <= PASOS_ARCO; i++) {
      // El arco empieza en 180° (PI) y sube hacia el ángulo interno
      const a = Math.PI - (thetaInterno * (i / PASOS_ARCO));
      puntosArco.push([
        r + radioArco * Math.cos(a),
        radioArco * Math.sin(a)
      ]);
    }
  }

  return (
    <div className="flex justify-center items-center w-full p-2 bg-slate-50 rounded-2xl shadow-inner">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full max-w-md">
        <Mafs 
          height={350} 
          viewBox={viewBox} 
          pan={false} 
          zoom={false} 
          preserveAspectRatio="contain"
        >
          {/* Relleno de la base con opacidad mínima */}
          <Polygon points={puntosElipse} color={Theme.blue} fillOpacity={0.05} weight={0} />

          {/* Línea trasera de la base (punteada para profundidad) */}
          {puntosTraseros.map((_, i) => (
            i < puntosTraseros.length - 1 && (
              <Line.Segment
                key={`back-${i}`}
                point1={puntosTraseros[i]}
                point2={puntosTraseros[i+1]}
                color={Theme.blue}
                style="dashed"
                weight={1}
              />
            )
          ))}

          {/* Línea delantera de la base (sólida) */}
          <Polygon points={puntosDelanteros} color={Theme.blue} fillOpacity={0} weight={2} />

          {/* Generatrices laterales (Contorno del cono) */}
          <Line.Segment point1={[-r, 0]} point2={[0, h]} color={Theme.blue} weight={2} />
          <Line.Segment point1={[r, 0]} point2={[0, h]} color={Theme.blue} weight={2} />

          {/* 🔥 ELEMENTOS CRÍTICOS PARA PITÁGORAS (Sin etiquetas) */}
          
          {/* Altura (h): Verde y punteada */}
          <Line.Segment point1={[0, 0]} point2={[0, h]} color={Theme.green} weight={3} style="dashed" />
          
          {/* Radio (r): Rojo y sólido */}
          <Line.Segment point1={[0, 0]} point2={[r, 0]} color={Theme.red} weight={3} />

          {/* Símbolo de Ángulo Recto (90°) */}
          <Polygon
            points={[[0, 0], [sq, 0], [sq, sq], [0, sq]]}
            color={Theme.green}
            weight={1.5}
            fillOpacity={0.1}
          />
          {anguloNotable && puntosArco.length > 0 && (
            <>
              {/* Arco renderizado como línea Mafs */}
              <Polygon points={puntosArco} color={Theme.blue} fillOpacity={0} weight={2} />
              <Text 
                x={r - radioArco * 1.6} 
                y={radioArco * 0.4} 
                size={16} 
                color={Theme.blue}
              >
                {anguloNotable}
              </Text>
            </>
          )}
        </Mafs>
      </div>
    </div>
  );
};