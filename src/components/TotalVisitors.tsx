"use client";

import { Box, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const chartData = [
  { browser: "Chrome", visitors: 275, fill: "#3B82F6" },
  { browser: "Safari", visitors: 200, fill: "#F59E0B" },
  { browser: "Firefox", visitors: 187, fill: "#EF4444" },
  { browser: "Edge", visitors: 173, fill: "#10B981" },
  { browser: "Other", visitors: 90, fill: "#6B7280" },
];

export default function TotalVisitors() {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600}>
        Visitor browsers
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Sample data for the demo analytics view
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="visitors" nameKey="browser" outerRadius={110} paddingAngle={3}>
              {chartData.map((entry) => (
                <Cell key={entry.browser} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
        {chartData.map((entry) => (
          <Box key={entry.browser} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: entry.fill }} />
            <Typography variant="caption" color="text.secondary">
              {entry.browser} ({entry.visitors})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
