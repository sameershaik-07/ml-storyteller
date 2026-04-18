"use client";

import { useState, useEffect, useCallback } from "react";
import KNNCanvas from "@/components/KNNCanvas";
import ScikitLearnSnippet from "@/components/ScikitLearnSnippet";
import Link from "next/link";

// Initial Random Data
const INITIAL_POINTS = [
  { x: 15, y: 20, class_id: 0 }, { x: 20, y: 35, class_id: 0 },
  { x: 25, y: 15, class_id: 0 }, { x: 30, y: 40, class_id: 0 },
  { x: 75, y: 80, class_id: 1 }, { x: 80, y: 90, class_id: 1 },
  { x: 85, y: 75, class_id: 1 }, { x: 90, y: 85, class_id: 1 },
  { x: 80, y: 20, class_id: 1 }, { x: 85, y: 35, class_id: 1 },
  { x: 90, y: 25, class_id: 1 }, { x: 75, y: 40, class_id: 0 },
];

const INITIAL_TARGET = { x: 50, y: 50, class_id: -1 };

const SCIKIT_LEARN_CODE = [
  {
    code: "from sklearn.neighbors import KNeighborsClassifier",
    explanation: "Imports the industry-standard K-Nearest Neighbors class. It lives in the 'neighbors' module. This is a supervised learning algorithm used for classification."
  },
  {
    code: "import numpy as np",
    explanation: "Standard import for handling data arrays."
  },
  {
    code: "X_train = np.array([...])\ny_train = np.array([...])",
    explanation: "X_train holds our features (coordinates of the data points). y_train holds our targets (the colored group each point belongs to)."
  },
  {
    code: "knn = KNeighborsClassifier(n_neighbors=3, weights='distance')",
    explanation: "Initializes our KNN model.",
    parameters: {
      "n_neighbors": "The 'K' in KNN. It specifies how many nearby points we will look at to vote. We set this to 3.",
      "weights": "ADVANCED BEST PRACTICE: We use 'distance' instead of 'uniform'. This means that closer neighbors have a mathematically stronger vote than further neighbors, preventing ties and increasing accuracy against outliers!"
    }
  },
  {
    code: "knn.fit(X_train, y_train)",
    explanation: "Unlike other algorithms, KNN is 'lazy learning'. The `.fit` step doesn't actually calculate any lines or curves! It simply stores X_train and y_train in memory so it can use them later during prediction."
  },
  {
    code: "unknown_point = np.array([[50, 50]])",
    explanation: "A new point (the yellow star) comes to town, and we don't know what class it is (class_id = -1)."
  },
  {
    code: "predicted_class = knn.predict(unknown_point)",
    explanation: "The actual core logic runs here! It calculates the distance between the 'unknown_point' and EVERY single point in X_train. It finds the 3 closest, tallies their y_train classes, and returns the winning class."
  }
];

export default function KNNPage() {
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [target, setTarget] = useState(INITIAL_TARGET);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("start"); 
  const [maxDistance, setMaxDistance] = useState(0);
  const [kValue, setKValue] = useState(3);
  
  const [story, setStory] = useState(
    "Welcome to K-Nearest Neighbors! A yellow star has arrived in town, but it doesn't know which group it belongs to. Click 'Start Classification' to find its Neighborhood."
  );
  
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setTarget(last.target);
    setPhase(last.phase);
    setMaxDistance(last.maxDistance);
    setStory(last.story);
    setStep(last.step);
    setIsPlaying(false);
  };

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/knn/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: points,
          target: target,
          k: kValue,
          step_number: step,
          phase: phase, 
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      
      setHistory(prev => [...prev, { target, phase, maxDistance, story, step }]);

      setTarget(data.target);
      setPhase(data.phase);
      setMaxDistance(data.max_distance);
      setStory(data.story);
      setStep(step + 1);

      if (data.is_converged) {
        setIsPlaying(false);
      }
      
    } catch (error) {
      console.error(error);
      setStory("⚠️ Oops! The frontend couldn't connect to the FastAPI backend.");
      setIsPlaying(false); 
    }
    setLoading(false);
  }, [points, target, kValue, step, phase]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying) {
      timeoutId = setTimeout(() => {
        fetchNextStep();
      }, 1500); 
    }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, step, fetchNextStep]);

  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              K-Nearest Neighbors (KNN)
            </h1>
            <p className="mt-2 text-lg text-neutral-400 font-light">
              The Neighborhood Watch
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur text-sm font-medium transition-all flex items-center gap-2">
            <span>←</span> Back to Hub
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/5">
              <KNNCanvas points={points} target={target} maxDistance={maxDistance} phase={phase} animate={!isPlaying} />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleBack}
                disabled={history.length === 0 || isPlaying}
                className="group relative px-6 py-3 font-bold text-white transition-all bg-white/5 hover:bg-white/10 rounded-full border border-white/10 disabled:opacity-50"
              >
                ⏮ Undo
              </button>
              
              <button
                onClick={fetchNextStep}
                disabled={loading || isPlaying || phase === "done"}
                className="group relative px-6 py-3 font-bold text-white transition-all bg-white/5 hover:bg-emerald-500/20 rounded-full border border-emerald-500/30 hover:border-emerald-400/70 disabled:opacity-50"
              >
                {step === 0 ? "▶ Start Classification" : "▶ Next Action"}
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={phase === "done"}
                className={`group relative px-6 py-3 font-bold text-white transition-all rounded-full border ${
                  isPlaying 
                    ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-200" 
                    : "bg-cyan-600/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-200"
                } disabled:opacity-50`}
              >
                {isPlaying ? "⏸ Pause Timeline" : "🍿 Auto-Play"}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Story */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Storyteller Box */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-[#0a1e28]/60 backdrop-blur-md border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-600" />
              <h2 className="text-xl font-serif font-bold text-cyan-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                The Storyteller
              </h2>
              <p className="text-sm text-cyan-100 leading-relaxed font-light mb-4">
                {story}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-sm text-cyan-200 bg-cyan-950/30 p-2 rounded-lg">
                <div><span className="opacity-50 block mb-1">Step</span><span className="font-semibold">{step}</span></div>
                <div><span className="opacity-50 block mb-1">K</span><span className="font-semibold">{kValue}</span></div>
                <div><span className="opacity-50 block mb-1">Phase</span><span className="font-semibold text-cyan-300">{phase.toUpperCase()}</span></div>
              </div>
            </div>

            {/* Scikit Learn Code */}
            <div className="flex-1 flex flex-col min-h-[300px]">
              <ScikitLearnSnippet title="scikit-learn implementation" lines={SCIKIT_LEARN_CODE} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
