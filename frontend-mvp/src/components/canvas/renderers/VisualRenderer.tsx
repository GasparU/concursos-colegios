import { StatisticsChart } from "./StatisticsChart";
import { StatisticsTable } from "./StatisticsTable";

export const VisualRenderer = ({ visualData }: { visualData: any }) => {
  if (!visualData) return null;

  const { type, data } = visualData;

  if (type === "chart_bar" || type === "chart_pie") {
    return <StatisticsChart type={type} data={data} />;
  }

  if (type === "frequency_table") {
    return <StatisticsTable data={data} />;
  }

  // Para problemas que no requieren visual (solo texto)
  if (type === "none") return null;

  // Fallback
  return (
    <div className="text-xs text-slate-400">
      Tipo de visual no soportado: {type}
    </div>
  );
};
