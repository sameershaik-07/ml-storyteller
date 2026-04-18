"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export default function DTCanvas({ points, splits }: any) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} />
          <Scatter data={points} fill="#fbbf24" />
          {splits.map((s: any, i: number) => (
             s.axis === 'x' ? <ReferenceLine key={i} x={s.value} stroke="#f59e0b" strokeWidth={3} /> : <ReferenceLine key={i} y={s.value} stroke="#f59e0b" strokeWidth={3} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
