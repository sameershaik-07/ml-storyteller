"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export default function PCACanvas({ points, angle }: any) {
  const m = Math.tan(angle * Math.PI / 180);
  const p1 = {x: 0, y: 50 - 50*m};
  const p2 = {x: 100, y: 50 + 50*m};
  
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} />
          <Scatter data={points} fill="#e879f9" />
          <ReferenceLine segment={[{x:p1.x, y:p1.y}, {x:p2.x, y:p2.y}]} stroke="#d946ef" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
