"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface Point {
  x: number;
  y: number;
  class_id?: number;
}

interface LogRegCanvasProps {
  points: Point[];
  w1: number;
  w2: number;
  b: number;
  animate?: boolean;
}

export default function LogRegCanvas({ points, w1, w2, b, animate = true }: LogRegCanvasProps) {
  const class0 = points.filter((p: any) => p.class_id === 0);
  const class1 = points.filter((p: any) => p.class_id === 1);
  
  let boundary = [];
  if (Math.abs(w2) > 0.001) {
      const y0 = -(w1/w2)*0 - (b/w2);
      const y100 = -(w1/w2)*100 - (b/w2);
      boundary = [{x: 0, y: Math.max(0, Math.min(100, y0))}, {x: 100, y: Math.max(0, Math.min(100, y100))}];
  } else {
      boundary = [{x: 50, y: 0}, {x: 50, y: 100}];
  }

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} tick={{ fill: "#64748b" }} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} tick={{ fill: "#64748b" }} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
          
          <Scatter name="Class 0" data={class0} fill="#f43f5e" shape="circle" isAnimationActive={animate} />
          <Scatter name="Class 1" data={class1} fill="#10b981" shape="circle" isAnimationActive={animate} />
          
          {boundary.length === 2 && (
            <ReferenceLine segment={[{x: boundary[0].x, y: boundary[0].y}, {x: boundary[1].x, y: boundary[1].y}]} stroke="#38bdf8" strokeWidth={3} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
