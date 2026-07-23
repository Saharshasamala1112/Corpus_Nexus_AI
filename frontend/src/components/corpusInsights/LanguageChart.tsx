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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 10,
          right: 40,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis type="number" />

        <YAxis
          type="category"
          dataKey="language"
          width={120}
        />

        <Tooltip />

        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          <LabelList dataKey="count" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LanguageChart;