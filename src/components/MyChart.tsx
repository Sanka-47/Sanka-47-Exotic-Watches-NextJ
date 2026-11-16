"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  LinearGradient,
  Stop,
} from "recharts";

// Chart data (same as before)
const chartData = [
  { date: "2025-01-01", desktop: 120, mobile: 800 },
  { date: "2025-02-01", desktop: 150, mobile: 950 },
  { date: "2025-03-01", desktop: 130, mobile: 870 },
];

// Chart config with gradient IDs and labels
const chartConfig = {
  desktop: { gradientId: "desktopGradient", label: "Desktop" },
  mobile: { gradientId: "mobileGradient", label: "Mobile" },
};

const InteractiveBarChart = () => {
  const [activeChart, setActiveChart] = useState("desktop");

  console.log("Chart Data:", chartData); // Debugging log

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Monthly Items Sold
      </h2>

      {/* Buttons to Toggle Chart Type */}
      <div className="flex gap-3 mb-6">
        {Object.keys(chartConfig).map((key) => (
          <button
            key={key}
            onClick={() => setActiveChart(key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeChart === key
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {chartConfig[key].label}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          {/* Define Gradients */}
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
          <XAxis
            dataKey="date"
            tickFormatter={(value) => value}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{ color: "#1f2937" }}
            itemStyle={{ color: "#374151" }}
          />
          <Bar
            dataKey={activeChart}
            fill={`url(#${chartConfig[activeChart].gradientId})`}
            radius={[4, 4, 0, 0]} // Rounded top corners
            barSize={60} // Increased bar thickness
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InteractiveBarChart;