"use client";

import React from "react";
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  AreaChart,
} from "recharts";

type Point = {
  x: number;
  y: number;
  class_id: number;
};

type TargetPoint = {
  x: number;
  y: number;
  class_id: number;
};

interface KNNCanvasProps {
  points: Point[];
  target: TargetPoint;
  maxDistance: number;
  phase: string;
  animate?: boolean;
}

export default function KNNCanvas({ points, target, maxDistance, phase, animate = true }: KNNCanvasProps) {
  // Colors for different classes
  const COLORS = ["#f43f5e", "#3b82f6"]; // Red (Class 0), Blue (Class 1)

  const getClassPoints = (classId: number) => {
    return points.filter((p) => p.class_id === classId);
  };

  // When phase is "k_nearest" or "vote", we want to show a circle around the target
  // Recharts doesn't have a native interactive circle exactly like this on a ComposedChart easily
  // so we'll simulate the "circle" with a very large ReferenceDot or Scatter size based on maxDistance
  // Here we simplify by just showing the target conspicuously 
  
  const targetColor = target.class_id === -1 ? "#facc15" : COLORS[target.class_id % COLORS.length];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" />
          <XAxis type="number" dataKey="x" name="X Value" domain={[0, 100]} tick={{ fill: "#64748b" }} axisLine={{ stroke: "#334155" }} />
          <YAxis type="number" dataKey="y" name="Y Value" domain={[0, 100]} tick={{ fill: "#64748b" }} axisLine={{ stroke: "#334155" }} />
          <Tooltip 
            cursor={{ stroke: "#334155", strokeDasharray: "3 3" }} 
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#f8fafc" }}
          />

          {/* Iterating through classes */}
          {Array(2).fill(0).map((_, index) => (
            <Scatter
              key={`class-${index}`}
              name={`Class ${index}`}
              data={getClassPoints(index)}
              fill={COLORS[index]}
              shape="circle"
              isAnimationActive={animate}
            />
          ))}

          {/* The Unknown / Target Point */}
          <Scatter
            name="Unknown Point"
            data={[{ x: target.x, y: target.y }]}
            fill={targetColor}
            shape={target.class_id === -1 ? "star" : "circle"}
            r={150} // Make the target very large for visibility
            isAnimationActive={animate}
            animationDuration={800}
          />
          
          {/* Mock circle for the neighbor radius using Recharts ReferenceDot */}
          {(phase === "k_nearest" || phase === "vote" || phase === "done") && (
            <ReferenceDot 
              x={target.x} 
              y={target.y} 
              r={maxDistance * 3.5} // Scale for visual representation
              fill="rgba(168, 85, 247, 0.1)" 
              stroke="#a855f7" 
              strokeDasharray="3 3"
            />
          )}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}