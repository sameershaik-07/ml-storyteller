"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Point = {
  x: number;
  y: number;
};

interface GraphCanvasProps {
  points: Point[];
  m: number;
  c: number;
  animate?: boolean;
}

export default function GraphCanvas({ points, m, c, animate = true }: GraphCanvasProps) {
  // Generate endpoints for the line of best fit to draw it across the graph
  const minX = 0;
  const maxX = 10;
  const lineData = [
    { x: minX, y: m * minX + c },
    { x: maxX, y: m * maxX + c },
  ];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Distance (km)" 
            domain={[0, 10]} 
            tickCount={11}
            tick={{ fill: "#64748b" }}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Time (min)" 
            domain={[0, 50]} 
            tick={{ fill: "#64748b" }}
            axisLine={{ stroke: "#334155" }}
          />
          <Tooltip 
            cursor={{ stroke: "#334155", strokeDasharray: "3 3" }} 
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#f8fafc" }}
            itemStyle={{ color: "#38bdf8" }}
          />
          
          {/* The Data Points (Mock Pizza Deliveries) */}
          <Scatter
            name="Past Deliveries"
            data={points}
            fill="#f43f5e"
            shape="circle"
            isAnimationActive={animate ?? true}
            animationDuration={animate ? 0 : 500}
          />

          {/* The "Learning" Line of Best Fit - glow effect applied via CSS by adding drop-shadow via stroke */}
          <Line
            type="linear"
            data={lineData}
            dataKey="y"
            stroke="#38bdf8"
            strokeWidth={4}
            dot={false}
            activeDot={false}
            isAnimationActive={animate ?? true}
            animationDuration={animate ? 0 : 500}
            style={{ filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
