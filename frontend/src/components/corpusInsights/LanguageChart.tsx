import { useEffect, useState } from "react";

import { getRecords } from "../../services/recordsService";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

interface ChartData {
  language: string;
  count: number;
}

const LanguageChart = () => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchLanguageData = async () => {
      try {
        const records = await getRecords();

        const counts: Record<string, number> = {};

        for (const record of records) {
          const language = record.language || "Unknown";
          counts[language] = (counts[language] || 0) + 1;
        }

        const chartData = Object.entries(counts)
          .map(([language, count]) => ({
            language,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setData(chartData);
      } catch (error) {
        console.error("Failed to load language chart:", error);
      }
    };

    fetchLanguageData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 8,
          right: 24,
          left: 12,
          bottom: 8,
        }}
      >
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />

        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          domain={[0, "dataMax + 2"]}
        />

        <YAxis
          type="category"
          dataKey="language"
          width={110}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#cbd5e1", fontSize: 12 }}
        />

        <Tooltip
          cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #334155",
            borderRadius: 12,
            color: "#f8fafc",
          }}
        />

        <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#8B5CF6">
          <LabelList dataKey="count" position="right" fill="#f8fafc" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LanguageChart;