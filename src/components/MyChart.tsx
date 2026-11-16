"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { date: "Jan", desktop: 120, mobile: 800 },
  { date: "Feb", desktop: 150, mobile: 950 },
  { date: "Mar", desktop: 130, mobile: 870 },
];

const series = {
  desktop: { label: "Desktop", gradientId: "desktopGradient" },
  mobile: { label: "Mobile", gradientId: "mobileGradient" },
} as const;

type SeriesKey = keyof typeof series;

export default function MyChart() {
  const [activeSeries, setActiveSeries] = useState<SeriesKey>("desktop");

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Monthly items sold
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {(Object.keys(series) as SeriesKey[]).map((key) => (
          <Button
            key={key}
            size="small"
            variant={activeSeries === key ? "contained" : "outlined"}
            onClick={() => setActiveSeries(key)}
            sx={{ textTransform: "none" }}
          >
            {series[key].label}
          </Button>
        ))}
      </Box>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="desktopGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B7280" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#4B5563" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="mobileGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip />
            <Bar
              dataKey={activeSeries}
              fill={`url(#${series[activeSeries].gradientId})`}
              radius={[4, 4, 0, 0]}
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
