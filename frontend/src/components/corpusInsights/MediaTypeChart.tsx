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
  audio: "#3b82f6",
  video: "#ef4444",
  text: "#10b981",
  image: "#f59e0b",
  document: "#8b5cf6",
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
      <div className="flex h-80 items-center justify-center text-sm text-gray-400">
        Loading chart...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="mediaType" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="recordings" radius={[6, 6, 0, 0]}>
          <LabelList dataKey="recordings" position="top" />
          {chartData.map((entry) => (
            <Cell
              key={entry.mediaType}
              fill={
                MEDIA_COLORS[entry.mediaType.toLowerCase()] ||
                "#3b82f6"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MediaTypeChart;
