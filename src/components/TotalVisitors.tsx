"use client";

import { Pie, PieChart, Cell, Legend, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Updated chart data with modern colors
const chartData = [
  { browser: "Chrome", visitors: 275, fill: "#3B82F6" }, // Modern Blue
  { browser: "Safari", visitors: 200, fill: "#F59E0B" }, // Amber
  { browser: "Firefox", visitors: 187, fill: "#EF4444" }, // Red
  { browser: "Edge", visitors: 173, fill: "#10B981" }, // Emerald Green
  { browser: "Other", visitors: 90, fill: "#6B7280" }, // Cool Gray
];

export default function Component() {
  return (
    <Card className="flex flex-col border border-gray-100 shadow-lg rounded-xl max-w-2xl mx-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Browser Usage
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <div className="w-full flex flex-row items-center justify-center gap-8">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <PieChart width={450} height={400}>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  padding: "8px",
                }}
                labelStyle={{ color: "#1f2937", fontWeight: "500" }}
                itemStyle={{ color: "#374151" }}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                cx="50%"
                cy="50%"
                outerRadius={140}
                strokeWidth={3}
                paddingAngle={3}
                className="transition-all duration-300 hover:scale-105"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  paddingLeft: "30px",
                  fontSize: "14px",
                  color: "#374151",
                }}
                formatter={(value, entry) => (
                  <span>{`${value}: ${entry.payload.visitors}`}</span>
                )}
              />
            </PieChart>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}