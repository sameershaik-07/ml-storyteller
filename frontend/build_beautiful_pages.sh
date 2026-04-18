# -----------------------------------------------
# 1. Logistic Regression
# -----------------------------------------------
cat << 'INNER_EOF' > src/components/LogRegCanvas.tsx
"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function LogRegCanvas({ points, w1, w2, b, animate = true }) {
  const class0 = points.filter(p => p.class_id === 0);
  const class1 = points.filter(p => p.class_id === 1);
  
  // Calculate two points for the decision boundary line: w1*x + w2*y + b = 0 => y = -(w1/w2)x - (b/w2)
  // If w2 is 0 or very small, just mock it
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
INNER_EOF

cat << 'INNER_EOF' > src/app/logistic-regression/page.tsx
"use client";
import { useState } from "react";
import LogRegCanvas from "@/components/LogRegCanvas";

export default function LogRegPage() {
  const INITIAL_POINTS = [
    { x: 20, y: 20, class_id: 0 }, { x: 25, y: 30, class_id: 0 }, { x: 30, y: 25, class_id: 0 },
    { x: 70, y: 80, class_id: 1 }, { x: 80, y: 70, class_id: 1 }, { x: 75, y: 85, class_id: 1 },
  ];
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [w1, setW1] = useState(-0.1);
  const [w2, setW2] = useState(0.1);
  const [b, setB] = useState(0);
  const [step, setStep] = useState(0);
  const [story, setStory] = useState("Welcome to Logistic Regression! The Banker is deciding where to draw the line to separate the two classes.");

  const fetchNextStep = async () => {
    try {
      const response = await fetch("/api/logistic-regression/step", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points, w1, w2, b, learning_rate: 0.1, step_number: step })
      });
      const data = await response.json();
      setW1(data.w1); setW2(data.w2); setB(data.b); setStory(data.story); setStep(step + 1);
    } catch (e) {
      setStory("⚠️ Oops! The frontend couldn't connect to the backend.");
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] -z-10" />
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Logistic Regression</h1>
          <p className="mt-3 text-xl text-neutral-400 font-light">The Banker</p>
        </header>
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"><LogRegCanvas points={points} w1={w1} w2={w2} b={b} /></div>
        <div className="p-6 rounded-3xl bg-[#0a1e18]/60 backdrop-blur-md border border-emerald-500/20"><p className="text-emerald-100">{story}</p></div>
        <div className="flex justify-center"><button onClick={fetchNextStep} className="px-8 py-4 font-bold text-white bg-emerald-600/20 border border-emerald-500/30 rounded-full hover:bg-emerald-500/30">▶ Next Step</button></div>
      </div>
    </main>
  );
}
INNER_EOF

# -----------------------------------------------
# 2. Support Vector Machine (SVM)
# -----------------------------------------------
cat << 'INNER_EOF' > src/components/SVMCanvas.tsx
"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export default function SVMCanvas({ points, w1, w2, b }) {
  // Simple mock of street boundary + margins
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} />
          <Scatter data={points.filter(p=>p.class_id===0)} fill="#f43f5e" />
          <Scatter data={points.filter(p=>p.class_id===1)} fill="#3b82f6" />
          <ReferenceLine segment={[{x:20, y:20}, {x:80, y:80}]} stroke="#e11d48" strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine segment={[{x:20, y:40}, {x:80, y:100}]} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine segment={[{x:20, y:30}, {x:80, y:90}]} stroke="#facc15" strokeWidth={4} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/app/svm/page.tsx
"use client";
import { useState } from "react";
import SVMCanvas from "@/components/SVMCanvas";

export default function SVMPage() {
  const points = [{x: 10, y: 40, class_id: 0}, {x: 40, y: 10, class_id: 1}];
  const [story, setStory] = useState("Welcome to SVM! The City Planner is finding the widest street to separate the red and blue data cities.");

  const fetchNextStep = async () => {
    const res = await fetch("/api/svm/step", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({points, w1:0, w2:0, b:0, learning_rate:0.1, step_number:1}) });
    const data = await res.json();
    setStory(data.story);
  };
  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center"><h1 className="text-5xl font-serif font-extrabold text-rose-400">Support Vector Machine</h1><p className="text-xl">The City Planner</p></header>
        <div className="p-6 rounded-3xl bg-white/5"><SVMCanvas points={points} w1={0.2} w2={-0.5} b={10} /></div>
        <div className="p-6 rounded-3xl bg-rose-900/30 border border-rose-500/20"><p>{story}</p></div>
        <div className="flex justify-center"><button onClick={fetchNextStep} className="px-8 py-4 font-bold text-white bg-rose-600/20 border border-rose-500/30 rounded-full hover:bg-rose-500/30">▶ Build Street</button></div>
      </div>
    </main>
  );
}
INNER_EOF

# -----------------------------------------------
# 3. Decision Tree
# -----------------------------------------------
cat << 'INNER_EOF' > src/components/DTCanvas.tsx
"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export default function DTCanvas({ points, splits }) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} />
          <Scatter data={points} fill="#fbbf24" />
          {splits.map((s, i) => (
             s.axis === 'x' ? <ReferenceLine key={i} x={s.value} stroke="#f59e0b" strokeWidth={3} /> : <ReferenceLine key={i} y={s.value} stroke="#f59e0b" strokeWidth={3} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/app/decision-tree/page.tsx
"use client";
import { useState } from "react";
import DTCanvas from "@/components/DTCanvas";

export default function DTPage() {
  const points = [{x: 20, y: 80}, {x: 80, y: 20}];
  const [splits, setSplits] = useState([]);
  const [story, setStory] = useState("Welcome to Decision Trees! The 20-Questions Detective is looking for the best way to slice the data.");

  const fetchNextStep = async () => {
    const res = await fetch("/api/dt/step", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({points, step_number:1, depth:0}) });
    const data = await res.json();
    setSplits(data.splits); setStory(data.story);
  };
  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center"><h1 className="text-5xl font-serif font-extrabold text-amber-400">Decision Tree</h1><p className="text-xl">The 20-Questions Detective</p></header>
        <div className="p-6 rounded-3xl bg-white/5"><DTCanvas points={points} splits={splits} /></div>
        <div className="p-6 rounded-3xl bg-amber-900/30 border border-amber-500/20"><p>{story}</p></div>
        <div className="flex justify-center"><button onClick={fetchNextStep} className="px-8 py-4 font-bold text-white bg-amber-600/20 border border-amber-500/30 rounded-full">▶ Ask Question</button></div>
      </div>
    </main>
  );
}
INNER_EOF

# -----------------------------------------------
# 4. PCA
# -----------------------------------------------
cat << 'INNER_EOF' > src/components/PCACanvas.tsx
"use client";
import React from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export default function PCACanvas({ points, angle }) {
  // Mock slope from angle
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
INNER_EOF

cat << 'INNER_EOF' > src/app/pca/page.tsx
"use client";
import { useState } from "react";
import PCACanvas from "@/components/PCACanvas";

export default function PCAPage() {
  const points = [{x: 40, y: 40}, {x: 60, y: 60}, {x: 50, y: 50}];
  const [angle, setAngle] = useState(0);
  const [story, setStory] = useState("Welcome to PCA! The Photographer is twisting the camera axis to capture the longest shadow!");

  const fetchNextStep = async () => {
    const res = await fetch("/api/pca/step", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({points, angle, step_number:1}) });
    const data = await res.json();
    setAngle(data.angle); setStory(data.story);
  };
  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center"><h1 className="text-5xl font-serif font-extrabold text-fuchsia-400">PCA</h1><p className="text-xl">The Photographer</p></header>
        <div className="p-6 rounded-3xl bg-white/5"><PCACanvas points={points} angle={angle} /></div>
        <div className="p-6 rounded-3xl bg-fuchsia-900/30 border border-fuchsia-500/20"><p>{story}</p></div>
        <div className="flex justify-center"><button onClick={fetchNextStep} className="px-8 py-4 font-bold text-white bg-fuchsia-600/20 border border-fuchsia-500/30 rounded-full">▶ Rotate Axis</button></div>
      </div>
    </main>
  );
}
INNER_EOF

