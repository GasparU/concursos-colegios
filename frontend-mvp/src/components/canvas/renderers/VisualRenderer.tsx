import { StatisticsChart } from "./StatisticsChart";
import { StatisticsTable } from "./StatisticsTable";

export const VisualRenderer = ({ visualData }: { visualData: any }) => {
  if (!visualData) return null;
  const { type, data } = visualData;

  // 🔥 AÑADIMOS 'chart_bar_double' AQUÍ
  if (
    type === "chart_bar" ||
    type === "chart_pie" ||
    type === "chart_bar_double"
  ) {
    return <StatisticsChart type={type} data={data} />;
  }

  if (type.includes("_table") || type === "generic_table") {
    return <StatisticsTable visualData={visualData} />;
  }

  return null;
};
