import { useEffect, useState } from "react";

import { getRecords } from "../../services/recordsService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MediaTypeData {
  mediaType: string;
  recordings: number;
}

const MEDIA_COLORS: Record<string, string> = {
  audio: "#3B82F6",
  video: "#8B5CF6",
  text: "#10B981",
  image: "#F59E0B",
  document: "#06B6D4",
};

const MEDIA_LABELS: Record<string, string> = {
  audio: "Audio",
  video: "Video",
  text: "Text",
  image: "Image",
  document: "Document",
};

const MediaTypeChart = () => {
  const [chartData, setChartData] = useState<MediaTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records = await getRecords();

        const counts: Record<string, number> = {};

        for (const record of records) {
          const mt = record.media_type || "Unknown";
          counts[mt] = (counts[mt] || 0) + 1;
        }

        const formattedData = Object.entries(MEDIA_LABELS)
          .map(([key, label]) => ({
            mediaType: label,
            recordings: counts[key] ?? 0,
          }))
          .sort((a, b) => b.recordings - a.recordings);

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
        Loading chart...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="mediaType"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#cbd5e1", fontSize: 12 }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />

        <Tooltip
          cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #334155",
            borderRadius: 12,
            color: "#f8fafc",
          }}
        />

        <Bar dataKey="recordings" radius={[8, 8, 0, 0]}>
          <LabelList dataKey="recordings" position="top" fill="#cbd5e1" fontSize={12} />
          {chartData.map((entry) => (
            <Cell
              key={entry.mediaType}
              fill={MEDIA_COLORS[entry.mediaType.toLowerCase()] || "#3B82F6"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MediaTypeChart;
