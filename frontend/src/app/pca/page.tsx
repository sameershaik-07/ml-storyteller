"use client";
import { useState, useCallback, useEffect } from "react";
import PCACanvas from "@/components/PCACanvas";
import ScikitLearnSnippet from "@/components/ScikitLearnSnippet";
import Link from "next/link";

const SCIKIT_LEARN_CODE = [
  {
    code: "from sklearn.decomposition import PCA",
    explanation: "Imports Principal Component Analysis. It lives in the 'decomposition' module because we use it to decompose (break down) massive datasets with hundreds of features into just a few important ones."
  },
  {
    code: "import numpy as np",
    explanation: "Numeric operations."
  },
  {
    code: "X = np.array([...])",
    explanation: "Notice there is no y_train! PCA is an unsupervised algorithm. It doesn't care about the 'answers' or 'labels', it only looks at the raw shape and spread of the data."
  },
  {
    code: "pca = PCA(n_components=2, svd_solver='auto')",
    explanation: "Initializes the PCA model.",
    parameters: {
      "n_components": "The number of dimensions we want to shrink the data down to. For example, compressing 3D data down to a 2D sheet of paper.",
      "svd_solver": "ADVANCED: The math solver used. Singular Value Decomposition (SVD) does the heavy linear algebra. Setting it to 'auto' or 'randomized' is a BEST PRACTICE for massive datasets because it approximates the answer much faster."
    }
  },
  {
    code: "X_reduced = pca.fit_transform(X)",
    explanation: "A two-in-one method! First, `.fit(X)` rotates the axes until it finds the angle where the data is spread out the most (maximum variance). Second, `.transform(X)` permanently drops the less important axes and returns the newly flattened dataset."
  },
  {
    code: "explained_variance = pca.explained_variance_ratio_",
    explanation: "The most important metric in PCA! This returns a percentage of how much original 'information' was kept. For instance, [0.95, 0.04] means our new 2D graph retained 99% of the original dataset's shape, and we threw away the 1% of garbage noise."
  }
];

export default function PCAPage() {
  const points = [{x: 40, y: 40}, {x: 60, y: 60}, {x: 50, y: 50}, {x: 30, y: 35}, {x: 70, y: 65}];
  const [angle, setAngle] = useState(0);
  const [story, setStory] = useState("Welcome to PCA! The Photographer is twisting the camera axis to capture the longest shadow!");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pca/step", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({points, angle, step_number:step+1}) });
      const data = await res.json();
      setHistory(prev => [...prev, { angle, story, step }]);
      setAngle(data.angle); setStory(data.story); setStep(step + 1);
    } catch {
       setStory("Error");
       setIsPlaying(false);
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
    if (isPlaying) {
      timeoutId = setTimeout(() => {
        fetchNextStep();
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, step, fetchNextStep]);
  
  return (
    <main className="min-h-screen p-4 md:p-8 text-neutral-200 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-300">
              Principal Component Analysis
            </h1>
            <p className="mt-2 text-lg text-neutral-400 font-light">
              The Photographer
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur text-sm font-medium transition-all flex items-center gap-2">
            <span>←</span> Back to Hub
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-fuchsia-500/5">
              <PCACanvas points={points} angle={angle} />
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
                disabled={loading || isPlaying}
                className="group relative px-6 py-3 font-bold text-white transition-all bg-fuchsia-500/20 hover:bg-fuchsia-500/30 rounded-full border border-fuchsia-500/30 hover:border-fuchsia-400/70 shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_25px_rgba(217,70,239,0.3)] disabled:opacity-50"
              >
                ▶ Rotate Axis
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`group relative px-6 py-3 font-bold text-white transition-all rounded-full border ${
                  isPlaying 
                    ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-200" 
                    : "bg-fuchsia-600/10 border-fuchsia-500/30 hover:bg-fuchsia-500/20 text-fuchsia-200"
                }`}
              >
                {isPlaying ? "⏸ Pause Auto-Play" : "🍿 Auto-Play"}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Story */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Storyteller Box */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-[#1e0a1b]/60 backdrop-blur-md border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-400 to-purple-600" />
              <h2 className="text-xl font-serif font-bold text-fuchsia-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                The Storyteller
              </h2>
              <p className="text-sm text-fuchsia-100 leading-relaxed font-light mb-4">
                {story}
              </p>
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs text-fuchsia-200 bg-fuchsia-950/30 p-2 rounded-lg">
                <div><span className="opacity-50 block mb-1">Axis Angle</span><span className="font-semibold">{(angle * (180/Math.PI)).toFixed(1)}°</span></div>
                <div><span className="opacity-50 block mb-1">Goal</span><span className="font-semibold text-fuchsia-300">Max Variance</span></div>
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
