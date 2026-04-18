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
} from "recharts";

type Point = {
  x: number;
  y: number;
  cluster_id: number;
};

type Centroid = {
  id: number;
  x: number;
  y: number;
};

interface KMeansCanvasProps {
  points: Point[];
  centroids: Centroid[];
  animate?: boolean;
}

export default function KMeansCanvas({ points, centroids, animate = true }: KMeansCanvasProps) {
  // Define vibrant colors for the clusters
  const COLORS = ["#f43f5e", "#3b82f6", "#10b981", "#f59e0b"]; // Red, Blue, Emerald, Amber

  // Filter points assigned to specific clusters dynamically
  const getClusterPoints = (clusterId: number) => {
    return points.filter((p) => p.cluster_id === clusterId);
  };
  
  // Points that have not yet been assigned to a cluster
  const unassignedPoints = points.filter((p) => p.cluster_id === -1);

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
            itemStyle={{ color: "#c084fc" }}
          />
          
          {/* Unassigned Points */}
          <Scatter name="Unassigned Data" data={unassignedPoints} fill="#9ca3af" shape="circle" isAnimationActive={animate ?? true} animationDuration={animate ? 0 : 500} />

          {/* Iterate through each possible cluster and plot them */}
          {centroids.map((centroid, index) => (
            <React.Fragment key={`cluster-group-${centroid.id}`}>
              {/* Clustered Points */}
              <Scatter
                name={`Cluster ${centroid.id} Points`}
                data={getClusterPoints(centroid.id)}
                fill={COLORS[index % COLORS.length]}
                shape="circle"
                isAnimationActive={animate ?? true}
                animationDuration={animate ? 0 : 500}
              />

              {/* The Actual Centroid itself (large star/cross) */}
              <Scatter
                name={`Centroid ${centroid.id}`}
                data={[{ x: centroid.x, y: centroid.y }]}
                fill={COLORS[index % COLORS.length]}
                shape="star"
                r={100} // make it big
                isAnimationActive={animate ?? true}
                animationDuration={animate ? 0 : 800}
              />
            </React.Fragment>
          ))}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
