"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export default function SVMCanvas({ points, w1, w2, b }: any) {
  // Simple mock of street boundary + margins
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} />
          <Scatter data={points.filter((p: any) => p.class_id===0)} fill="#f43f5e" />
          <Scatter data={points.filter((p: any) => p.class_id===1)} fill="#3b82f6" />
          <ReferenceLine segment={[{x:20, y:20}, {x:80, y:80}]} stroke="#e11d48" strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine segment={[{x:20, y:40}, {x:80, y:100}]} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine segment={[{x:20, y:30}, {x:80, y:90}]} stroke="#facc15" strokeWidth={4} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
