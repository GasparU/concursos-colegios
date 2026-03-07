import { useState } from "react";
import { useParametricGenerator } from "../../hooks/useParametricGenerator";
import { StatisticsTable } from "../../components/canvas/renderers/StatisticsTable";
import { MafsGeometryRenderer } from "../../components/canvas/renderers/MafsGeometryRenderer";



// Componente simple para gráfico de barras (ya funciona)
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = 40;
  const chartHeight = 200;
  return (
    <svg
      width="100%"
      height="250"
      viewBox="0 0 500 250"
      preserveAspectRatio="xMidYMid meet"
    >
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = i * (barWidth + 20) + 30;
        const y = chartHeight - barHeight + 20;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#3b82f6"
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 35}
              textAnchor="middle"
              fontSize="10"
            >
              {d.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Componente simple para gráfico circular (corregido)
const PieChart = ({
  data,
}: {
  data: { label: string; value: number; color?: string }[];
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 0;
  const radius = 80;
  const centerX = 120;
  const centerY = 120;
  return (
    <svg width="250" height="250" viewBox="0 0 250 250">
      {data.map((d, i) => {
        const angle = (d.value / total) * 2 * Math.PI;
        const endAngle = startAngle + angle;
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        const largeArcFlag = angle > Math.PI ? 1 : 0;
        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `Z`,
        ].join(" ");
        const element = (
          <path
            key={i}
            d={pathData}
            fill={d.color || `hsl(${i * 60}, 70%, 60%)`}
            stroke="white"
            strokeWidth="1"
          />
        );
        startAngle = endAngle;
        return element;
      })}
    </svg>
  );
};

export default function ParametricTestPage() {
  const { generarProblema, problema, loading } = useParametricGenerator();
  const [plantillaId, setPlantillaId] = useState("geo_pitagoras_fig0_basico");

  const handleGenerate = async () => {
    await generarProblema(plantillaId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generador paramétrico</h1>
      <div className="mb-4 flex gap-2">
        <select
          value={plantillaId}
          onChange={(e) => setPlantillaId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <optgroup label="FAMILIA 1: Triangulos">
            <option value="geo_pitagoras_fig0_basico">figura1 - Básico</option>
            <option value="geo_area_sombreada_experto">figura2 - Básico</option>
            <option value="geo_pitagoras_fig2_basico">figura3 - Básico</option>
            <option value="geo_pitagoras_fig3_basico">figura4 - Básico</option>
            <option value="geo_pitagoras_fig4_basico">figura5 - Básico</option>
            <option value="geo_pitagoras_fig5_inter">
              Figura1 - Intermedio
            </option>
            <option value="geo_pitagoras_fig6_inter">
              Figura2 - Intermedio
            </option>
            <option value="geo_pitagoras_fig7_inter">
              Figura3 - Intermedio
            </option>
            <option value="geo_pitagoras_fig8_inter">
              Figura4 - Intermedio
            </option>
            <option value="geo_pitagoras_fig9_inter">
              Figura5 - Intermedio
            </option>
            <option value="geo_pitagoras_fig10_avan">Figura1 - Avanzado</option>
            <option value="geo_pitagoras_fig11_avan">Figura2 - Avanzado</option>
            <option value="geo_pitagoras_fig12_avan">Figura3 - Avanzado</option>
            <option value="geo_pitagoras_fig13_avan">Figura4 - Avanzado</option>
            <option value="geo_pitagoras_fig14_avan">Figura5 - Avanzado</option>
            <option value="geo_pitagoras_fig15_exp">Figura1 - Experto</option>
            <option value="geo_pitagoras_fig16_exp">Figura2 - Experto</option>
            <option value="geo_pitagoras_fig17_exp">Figura3 - Experto</option>
            <option value="geo_pitagoras_fig18_exp">Figura4 - Experto</option>
            <option value="geo_pitagoras_fig19_exp">Figura5 - Experto</option>
          </optgroup>
        </select>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generando..." : "Generar problema"}
        </button>
      </div>

      {problema && (
        <>
          <p>{problema.enunciado}</p>
          <p>
            Respuesta:{" "}
            {problema.respuesta !== null &&
            typeof problema.respuesta === "object"
              ? `${problema.respuesta.numerador}/${problema.respuesta.denominador}`
              : problema.respuesta !== null
                ? problema.respuesta
                : "Error en generación"}
          </p>
          {problema.visual_data &&
            problema.visual_data.type === "geometry_mafs" && (
              <div className="mt-4">
                <h3 className="font-bold">Figura geométrica:</h3>
                <div style={{ width: "100%", height: "300px" }}>
                  <MafsGeometryRenderer visualData={problema.visual_data} />
                </div>
              </div>
            )}

          {/* Gráfico de barras */}
          {problema.visual_data &&
            problema.visual_data.type === "chart_bar" && (
              <div className="mt-4">
                <h3 className="font-bold">Gráfico de barras:</h3>
                <BarChart data={problema.visual_data.data} />
              </div>
            )}

          {/* Gráfico circular */}
          {problema.visual_data &&
            problema.visual_data.type === "chart_pie" && (
              <div className="mt-4">
                <h3 className="font-bold">Gráfico circular:</h3>
                <PieChart data={problema.visual_data.data} />
              </div>
            )}

          {/* Pictograma (tabla) */}
          {problema.visual_data &&
            problema.visual_data.type === "pictogram_table" && (
              <div className="mt-4">
                <h3 className="font-bold">Pictograma:</h3>
                <table className="border">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Símbolos</th>
                      <th>
                        Libros (cada símbolo ={" "}
                        {problema.visual_data.valorPorSimbolo})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {problema.visual_data.data.map(
                      (
                        item: { nombre: string; simbolos: number },
                        idx: number,
                      ) => (
                        <tr key={idx}>
                          <td>{item.nombre}</td>
                          <td>{item.simbolos}</td>
                          <td>
                            {item.simbolos *
                              problema.visual_data.valorPorSimbolo}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* Probabilidad (tabla) */}
          {problema.visual_data &&
            problema.visual_data.type === "probabilidad_table" && (
              <div className="mt-4">
                <h3 className="font-bold">Composición de la bolsa:</h3>
                <table className="border">
                  <thead>
                    <tr>
                      <th>Color</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problema.visual_data.data.map(
                      (
                        item: { color: string; cantidad: number },
                        idx: number,
                      ) => (
                        <tr key={idx}>
                          <td>{item.color}</td>
                          <td>{item.cantidad}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* Tabla de frecuencias (usando StatisticsTable) */}
          {problema.visual_data &&
            problema.visual_data.type === "frequency_table" && (
              <div className="mt-4">
                <h3 className="font-bold">Tabla de frecuencias:</h3>
                <StatisticsTable
                  data={{
                    headers: ["Edad", "Frecuencia"],
                    rows: problema.visual_data.data.map((item: any) => [
                      item.edad,
                      item.frecuencia,
                    ]),
                    caption: "Distribución de edades",
                  }}
                />
              </div>
            )}

          {/* Geometría (debug) */}
          {problema.visual_data &&
            problema.visual_data.type === "geometria_debug" && (
              <div className="mt-4">
                <h3 className="font-bold">Datos de geometría:</h3>
                <pre>{JSON.stringify(problema.visual_data.data, null, 2)}</pre>
              </div>
            )}
        </>
      )}
    </div>
  );
}
