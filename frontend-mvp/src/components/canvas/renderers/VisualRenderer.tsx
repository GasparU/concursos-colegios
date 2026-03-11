import { CryptoArithmetic } from "./CryptoArithmetic";
import { CryptoDivision } from "./CryptoDivision";
import { CryptoMultiplication } from "./CryptoMultiplication";
import { GraphicCounting } from "./GraphicCounting";
import { GraphicDistribution } from "./GraphicDistribution";
import { MafsGeometryRenderer } from "./MafsGeometryRenderer";
import { StatisticsChart } from "./StatisticsChart";
import { StatisticsTable } from "./StatisticsTable";

export const VisualRenderer = ({ visualData }: { visualData: any }) => {
  if (!visualData) return null;

  // 🛡️ NORMALIZACIÓN Y BLINDAJE:
  // Extraemos el tipo buscando en ambas opciones y aseguramos que sea un string (aunque sea vacío)
  const renderType = visualData.tipo_render || visualData.type || "";
  const data = visualData.data || visualData;

  // 1. Gráficos de Estadística
  if (
    renderType === "chart_bar" ||
    renderType === "chart_pie" ||
    renderType === "chart_bar_double" ||
    renderType === "chart_combined"
  ) {
    return <StatisticsChart type={renderType} data={data} />;
  }

  // 2. Tablas (Usamos Optional Chaining ?. para evitar el error de 'includes')
  if (renderType?.includes("_table") || renderType === "generic_table") {
    return <StatisticsTable visualData={visualData} />;
  }

  // 3. Distribuciones Gráficas
  if (renderType === "graphic_distribution") {
    return <GraphicDistribution data={data} />;
  }

  // 4. Criptoaritmética
  if (renderType === "crypto_grid") {
    return <CryptoArithmetic data={data} />;
  }
  if (renderType === "crypto_mult") {
    return <CryptoMultiplication data={data} />;
  }
  if (renderType === "crypto_div") {
    return <CryptoDivision data={data} />;
  }

  // 5. Conteo de Figuras (¡AQUÍ FALTABA EL RETURN!)
  if (renderType === "graphic_counting") {
    return <GraphicCounting data={data} />;
  }

  // 6. Geometría Mafs (Triángulos, Rectángulos, etc.)
  if (renderType === "geometry_mafs" || renderType?.includes("geometry")) {
    return <MafsGeometryRenderer data={data} />;
  }

  // 🚩 LOG DE EMERGENCIA: Si nada coincide, te avisa en consola sin romper la app
  console.warn("⚠️ [VisualRenderer] Tipo de render no reconocido:", renderType);
  return null;
};