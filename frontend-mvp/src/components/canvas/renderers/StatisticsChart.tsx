import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React from "react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
];

interface ChartData {
  name: string;
  value: number;
}

interface SectorData {
  name: string;
  value: number;
  color: string;
}

export const StatisticsChart = ({
  type,
  data,
}: {
  type: string;
  data: any;
}) => {
  if (!data) return null;

  // Gráfico de barras
  if (type === "chart_bar") {
    if (
      !data.labels ||
      !data.values ||
      !Array.isArray(data.labels) ||
      !Array.isArray(data.values)
    ) {
      console.warn("Datos de barras incorrectos", data);
      return <div className="text-red-500">Error en datos de barras</div>;
    }

    const chartData: ChartData[] = data.labels.map(
      (label: string, index: number) => ({
        name: label,
        value: data.values[index],
      }),
    );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            label={{ position: "top", fill: "#333", fontSize: 12 }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Gráfico circular
  if (type === "chart_pie") {
    if (!data.sectors || !Array.isArray(data.sectors)) {
      console.warn("Datos de gráfico circular incorrectos", data);
      return <div className="text-red-500">Error en datos circulares</div>;
    }

    const chartData: SectorData[] = data.sectors.map(
      (sector: any, index: number) => ({
        name: sector.label,
        value: sector.value,
        color: sector.color || COLORS[index % COLORS.length],
      }),
    );

    // Función label compatible con Recharts (acepta cualquier objeto y extrae name y value)
    const renderLabel = (entry: any) => {
      if (
        entry &&
        typeof entry === "object" &&
        "name" in entry &&
        "value" in entry
      ) {
        return `${entry.name}: ${entry.value}`;
      }
      return "";
    };

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
};
