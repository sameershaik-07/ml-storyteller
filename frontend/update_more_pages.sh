cat << 'INNER_EOF' > src/app/svm/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import SVMCanvas from "@/components/SVMCanvas";

export default function SVMPage() {
  const points = [{x: 10, y: 40, class_id: 0}, {x: 40, y: 10, class_id: 1}];
  const [story, setStory] = useState("Welcome to SVM! The City Planner is finding the widest street to separate the red and blue data cities.");
  const [step, setStep] = useState(0);

  const [history, setHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/svm/step", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({points, w1:0, w2:0, b:0, learning_rate:0.1, step_number:step}) });
      const data = await res.json();
      setHistory(prev => [...prev, { story, step }]);
      setStory(data.story); setStep(step + 1);
    } catch {
      setStory("Error connecting"); setIsPlaying(false);
    }
    setLoading(false);
  }, [points, story, step]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setStory(last.story); setStep(last.step);
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
        <header className="text-center"><h1 className="text-5xl font-serif font-extrabold text-rose-400">Support Vector Machine</h1><p className="text-xl">The City Planner</p></header>
        <div className="p-6 rounded-3xl bg-white/5"><SVMCanvas points={points} w1={0.2} w2={-0.5} b={10} /></div>
        <div className="p-6 rounded-3xl bg-rose-900/30 border border-rose-500/20"><p>{story}</p></div>
        <div className="flex justify-center gap-4">
          <button onClick={handleBack} disabled={history.length === 0} className="px-6 py-4 font-bold text-white bg-gray-600/20 border border-gray-500/30 rounded-full hover:bg-gray-500/30 disabled:opacity-50">⏮ Back</button>
          <button onClick={fetchNextStep} disabled={loading || isPlaying} className="px-8 py-4 font-bold text-white bg-rose-600/20 border border-rose-500/30 rounded-full hover:bg-rose-500/30 disabled:opacity-50">▶ Build Street</button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-4 font-bold text-white rounded-full border ${isPlaying ? 'bg-red-500/20 border-red-500/30' : 'bg-rose-600/10 border-rose-500/30'}`}>{isPlaying ? "⏸ Pause" : "🍿 Auto-Play"}</button>
        </div>
      </div>
    </main>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/app/decision-tree/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import DTCanvas from "@/components/DTCanvas";

export default function DTPage() {
  const points = [{x: 20, y: 80}, {x: 80, y: 20}];
  const [splits, setSplits] = useState([]);
  const [story, setStory] = useState("Welcome to Decision Trees! The 20-Questions Detective is looking for the best way to slice the data.");
  const [step, setStep] = useState(0);

  const [history, setHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dt/step", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({points, step_number:step, depth:0}) });
      const data = await res.json();
      setHistory(prev => [...prev, { splits, story, step }]);
      setSplits(data.splits); setStory(data.story); setStep(step + 1);
    } catch {
      setStory("Error connecting"); setIsPlaying(false);
    }
    setLoading(false);
  }, [points, splits, story, step]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setSplits(last.splits); setStory(last.story); setStep(last.step);
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
        <header className="text-center"><h1 className="text-5xl font-serif font-extrabold text-amber-400">Decision Tree</h1><p className="text-xl">The 20-Questions Detective</p></header>
        <div className="p-6 rounded-3xl bg-white/5"><DTCanvas points={points} splits={splits} /></div>
        <div className="p-6 rounded-3xl bg-amber-900/30 border border-amber-500/20"><p>{story}</p></div>
        <div className="flex justify-center gap-4">
          <button onClick={handleBack} disabled={history.length === 0} className="px-6 py-4 font-bold text-white bg-gray-600/20 border border-gray-500/30 rounded-full hover:bg-gray-500/30 disabled:opacity-50">⏮ Back</button>
          <button onClick={fetchNextStep} disabled={loading || isPlaying} className="px-8 py-4 font-bold text-white bg-amber-600/20 border border-amber-500/30 rounded-full">▶ Ask Question</button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-4 font-bold text-white rounded-full border ${isPlaying ? 'bg-red-500/20 border-red-500/30' : 'bg-amber-600/10 border-amber-500/30'}`}>{isPlaying ? "⏸ Pause" : "🍿 Auto-Play"}</button>
        </div>
      </div>
    </main>
  );
}
INNER_EOF
