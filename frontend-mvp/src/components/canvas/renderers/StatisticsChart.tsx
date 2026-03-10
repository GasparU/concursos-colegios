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
  LabelList,
  ResponsiveContainer,
  Legend,
} from "recharts";
import React, { useState, useEffect } from "react";

const COLORS = [
  { f: "rgba(255, 99, 132, 0.7)", s: "#FF6384" },
  { f: "rgba(54, 162, 235, 0.7)", s: "#36A2EB" },
  { f: "rgba(255, 206, 86, 0.7)", s: "#FFCE56" },
  { f: "rgba(168, 85, 247, 0.7)", s: "#a855f7" },
  { f: "rgba(34, 197, 94, 0.7)", s: "#22c55e" },
];

const renderPieLabel = (props: any, unit: string) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // 🔥 CAMBIO 2: Forzamos el redondeo y pegamos la unidad (° o %)
  const displayValue = Math.round(value);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[14px] font-black" // Subí a 14px para que se vea mejor
    >
      {`${displayValue}${unit}`}
    </text>
  );
};

export const StatisticsChart: React.FC<{ type: string; data: any }> = ({
  type,
  data,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || !mounted) return <div style={{ height: "280px" }} />;

  const raw = Array.isArray(data) ? data : data.data || [];
  const ticks = data.ticks || [0, 5, 10, 15, 20];
  const unit = data.unit || "";

  // --- GRÁFICO DE BARRAS DOBLES ---
  if (type === "chart_bar_double") {
    return (
      <div
        className="flex justify-center bg-white py-2"
        style={{ height: "280px", width: "100%" }}
      >
        <ResponsiveContainer width="99%" height="100%">
          <BarChart
            data={raw}
            margin={{ top: 30, right: 10, left: -25, bottom: 5 }}
          >
            <CartesianGrid vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              axisLine={{ stroke: "#666" }}
              tick={{ fill: "#333", fontSize: 12, fontWeight: "bold" }}
            />
            <YAxis
              ticks={ticks}
              axisLine={{ stroke: "#666" }}
              tick={{ fill: "#666", fontSize: 11 }}
              domain={[0, Math.max(...ticks)]}
            />
            <Tooltip />
            <Bar
              dataKey="SedeA"
              fill={COLORS[1].f}
              stroke={COLORS[1].s}
              radius={0}
              barSize={40}
            >
              <LabelList
                dataKey="SedeA"
                position="top"
                fill="#000"
                fontSize={11}
                fontWeight="bold"
              />
            </Bar>
            <Bar
              dataKey="SedeB"
              fill={COLORS[0].f}
              stroke={COLORS[0].s}
              radius={0}
              barSize={40}
            >
              <LabelList
                dataKey="SedeB"
                position="top"
                fill="#000"
                fontSize={11}
                fontWeight="bold"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // --- GRÁFICO DE BARRAS SIMPLES ---
  if (type === "chart_bar" || type === "grafico_barras") {
    const chartData = raw.map((item: any) => ({
      name: String(item.label || item.name || "Dato"),
      value: item.value,
    }));

    return (
      <div
        className="flex justify-center bg-white py-2"
        style={{ height: "280px", width: "100%" }}
      >
        <ResponsiveContainer width="99%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 10, left: -25, bottom: 5 }}
          >
            <CartesianGrid vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "#666" }}
              tick={{ fill: "#333", fontSize: 12, fontWeight: "bold" }}
            />
            <YAxis
              ticks={ticks}
              axisLine={{ stroke: "#666" }}
              tick={{ fill: "#666", fontSize: 11 }}
              domain={[0, Math.max(...ticks)]}
            />
            <Bar dataKey="value" barSize={70} radius={0}>
              {chartData.map((entry: any, idx: number) => (
                <Cell
                  key={`b-${idx}`}
                  fill={COLORS[idx % COLORS.length].f}
                  stroke={COLORS[idx % COLORS.length].s}
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fill="#000"
                fontSize={12}
                fontWeight="bold"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "chart_pie" || type === "chart_pie_simple" || type === "grafico_circular") {
    return (
      <div className="flex justify-center bg-white" style={{ height: "280px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={raw}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value" 
              stroke="#fff"
              strokeWidth={2}
              labelLine={false}
              label={false} // 🔥 ESTE ES EL CAMBIO: Apaga los textos, grafica muda y perfecta.
            >
              {raw.map((entry: any, idx: number) => (
                <Cell key={`p-${idx}`} fill={COLORS[idx % COLORS.length].f} stroke={COLORS[idx % COLORS.length].s} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return null;
};
