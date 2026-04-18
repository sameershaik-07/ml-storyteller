cat << 'INNER_EOF' > src/app/logistic-regression/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
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
  const [story, setStory] = useState("Welcome to Logistic Regression! The Banker is deciding where to draw the line.");

  const [history, setHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/logistic-regression/step", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points, w1, w2, b, learning_rate: 0.1, step_number: step })
      });
      const data = await response.json();
      setHistory(prev => [...prev, { points, w1, w2, b, story, step }]);
      setW1(data.w1); setW2(data.w2); setB(data.b); setStory(data.story); setStep(step + 1);
    } catch (e) {
      setStory("⚠️ Oops! The frontend couldn't connect.");
      setIsPlaying(false);
    }
    setLoading(false);
  }, [points, w1, w2, b, story, step]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setPoints(last.points); setW1(last.w1); setW2(last.w2); setB(last.b);
    setStory(last.story); setStep(last.step);
    setIsPlaying(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying) timeoutId = setTimeout(() => fetchNextStep(), 1500);
    return () => clearTimeout(timeoutId);
  }, [isPlaying, step, fetchNextStep]);

  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] -z-10" />
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-emerald-400">Logistic Regression</h1>
          <p className="mt-3 text-xl text-neutral-400 font-light">The Banker</p>
        </header>
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"><LogRegCanvas points={points} w1={w1} w2={w2} b={b} /></div>
        <div className="p-6 rounded-3xl bg-[#0a1e18]/60 backdrop-blur-md border border-emerald-500/20"><p className="text-emerald-100">{story}</p></div>
        <div className="flex justify-center gap-4">
          <button onClick={handleBack} disabled={history.length === 0} className="px-6 py-4 font-bold text-white bg-gray-600/20 border border-gray-500/30 rounded-full hover:bg-gray-500/30 disabled:opacity-50">⏮ Back</button>
          <button onClick={fetchNextStep} disabled={loading || isPlaying} className="px-8 py-4 font-bold text-white bg-emerald-600/20 border border-emerald-500/30 rounded-full hover:bg-emerald-500/30 disabled:opacity-50">▶ Next Step</button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-4 font-bold text-white rounded-full border ${isPlaying ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-600/10 border-emerald-500/30'}`}>{isPlaying ? "⏸ Pause" : "🍿 Auto-Play"}</button>
        </div>
      </div>
    </main>
  );
}
INNER_EOF

# Add same for PCA
cat << 'INNER_EOF' > src/app/pca/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import PCACanvas from "@/components/PCACanvas";

export default function PCAPage() {
  const points = [{x: 40, y: 40}, {x: 60, y: 60}, {x: 50, y: 50}];
  const [angle, setAngle] = useState(0);
  const [step, setStep] = useState(0);
  const [story, setStory] = useState("Welcome to PCA! The Photographer is twisting the camera axis to capture the longest shadow!");

  const [history, setHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pca/step", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({points, angle, step_number:step}) });
      const data = await res.json();
      setHistory(prev => [...prev, { angle, story, step }]);
      setAngle(data.angle); setStory(data.story); setStep(step + 1);
    } catch {
       setStory("Error connecting to backend"); setIsPlaying(false);
    }
    setLoading(false);
  }, [points, angle, story, step]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setAngle(last.angle); setStory(last.story); setStep(last.step);
    setIsPlaying(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying) timeoutId = setTimeout(() => fetchNextStep(), 1500);
    return () => clearTimeout(timeoutId);
  }, [isPlaying, step, fetchNextStep]);

  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center"><h1 className="text-5xl font-serif font-extrabold text-fuchsia-400">PCA</h1><p className="text-xl font-light text-neutral-400 mt-2">The Photographer</p></header>
        <div className="p-6 rounded-3xl bg-white/5"><PCACanvas points={points} angle={angle} /></div>
        <div className="p-6 rounded-3xl bg-fuchsia-900/30 border border-fuchsia-500/20"><p className="text-fuchsia-100">{story}</p></div>
        <div className="flex justify-center gap-4">
          <button onClick={handleBack} disabled={history.length === 0} className="px-6 py-4 font-bold text-white bg-gray-600/20 border border-gray-500/30 rounded-full hover:bg-gray-500/30 disabled:opacity-50">⏮ Back</button>
          <button onClick={fetchNextStep} disabled={loading || isPlaying} className="px-8 py-4 font-bold text-white bg-fuchsia-600/20 border border-fuchsia-500/30 rounded-full hover:bg-fuchsia-500/30 disabled:opacity-50">▶ Rotate Axis</button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-4 font-bold text-white rounded-full border ${isPlaying ? 'bg-red-500/20 border-red-500/30' : 'bg-fuchsia-600/10 border-fuchsia-500/30'}`}>{isPlaying ? "⏸ Pause" : "🍿 Auto-Play"}</button>
        </div>
      </div>
    </main>
  );
}
INNER_EOF
