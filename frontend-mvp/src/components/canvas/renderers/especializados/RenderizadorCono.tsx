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
  const { r = 3, h = 4, anguloNotable = null } = parametros;

  const isometriaY = r * 0.35;
  const PASOS = 64;
  const puntosElipse: [number, number][] = Array.from(
    { length: PASOS + 1 },
    (_, i) => {
      const t = (i / PASOS) * Math.PI * 2;
      return [r * Math.cos(t), isometriaY * Math.sin(t)];
    },
  );

  const puntosTraseros = puntosElipse.slice(0, PASOS / 2 + 1);
  const puntosDelanteros = puntosElipse.slice(PASOS / 2);

  const margen = r * 0.4;
  const viewBox = {
    x: [-r - margen, r + margen] as [number, number],
    y: [-isometriaY - margen, h + margen] as [number, number],
  };

  const sq = Math.min(r, h) * 0.12;

  // --- 🔥 LÓGICA DEL ARCO (Polyline segura) ---
  const radioArco = r * 0.25;
  const puntosArco: [number, number][] = [];
  if (anguloNotable) {
    const thetaInterno = Math.atan(h / r);
    const PASOS_ARCO = 15;
    for (let i = 0; i <= PASOS_ARCO; i++) {
      const a = Math.PI - thetaInterno * (i / PASOS_ARCO);
      puntosArco.push([r + radioArco * Math.cos(a), radioArco * Math.sin(a)]);
    }
  }

  return (
    <div className="flex justify-center items-center w-full p-2 bg-slate-50 rounded-2xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full max-w-md">
        <Mafs
          height={350}
          viewBox={viewBox}
          pan={false}
          zoom={false}
          preserveAspectRatio="contain"
        >
          <Polygon
            points={puntosElipse}
            color={Theme.blue}
            fillOpacity={0.05}
            weight={0}
          />

          {/* Base Trasera */}
          {puntosTraseros.map(
            (_, i) =>
              i < puntosTraseros.length - 1 && (
                <Line.Segment
                  key={`b-${i}`}
                  point1={puntosTraseros[i]}
                  point2={puntosTraseros[i + 1]}
                  color={Theme.blue}
                  style="dashed"
                  weight={1}
                />
              ),
          )}

          <Polygon
            points={puntosDelanteros}
            color={Theme.blue}
            fillOpacity={0}
            weight={2}
          />

          {/* Contorno lateral */}
          <Line.Segment
            point1={[-r, 0]}
            point2={[0, h]}
            color={Theme.blue}
            weight={2}
          />
          <Line.Segment
            point1={[r, 0]}
            point2={[0, h]}
            color={Theme.blue}
            weight={2}
          />

          {/* Altura (h) y Radio (r) */}
          <Line.Segment
            point1={[0, 0]}
            point2={[0, h]}
            color={Theme.green}
            weight={3}
            style="dashed"
          />
          <Line.Segment
            point1={[0, 0]}
            point2={[r, 0]}
            color={Theme.red}
            weight={3}
          />

          {/* Ángulo Recto */}
          <Polygon
            points={[
              [0, 0],
              [sq, 0],
              [sq, sq],
              [0, sq],
            ]}
            color={Theme.green}
            weight={1.5}
            fillOpacity={0.1}
          />

          {/* 🔥 DIBUJO DEL ÁNGULO (Segmentos para evitar errores de Polygon abierto) */}
          {anguloNotable && puntosArco.length > 1 && (
            <>
              {puntosArco.map(
                (_, i) =>
                  i < puntosArco.length - 1 && (
                    <Line.Segment
                      key={`arc-${i}`}
                      point1={puntosArco[i]}
                      point2={puntosArco[i + 1]}
                      color={Theme.blue}
                      weight={2}
                    />
                  ),
              )}
              <Text
                x={r - radioArco * 1.3}
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
