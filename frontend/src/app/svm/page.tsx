"use client";
import { useState, useEffect, useCallback } from "react";
import SVMCanvas from "@/components/SVMCanvas";
import ScikitLearnSnippet from "@/components/ScikitLearnSnippet";
import Link from "next/link";

const SCIKIT_LEARN_CODE = [
  {
    code: "from sklearn.svm import SVC",
    explanation: "Imports the Support Vector Classifier. SVM can also be used for Regression (SVR), but here we are cleanly dividing two classes. This is known as a Maximum Margin Classifier."
  },
  {
    code: "import numpy as np",
    explanation: "Numeric operations."
  },
  {
    code: "X_train = np.array([...])\ny_train = np.array([...])",
    explanation: "Loads our coordinates and binary class labels."
  },
  {
    code: "svm = SVC(kernel='linear', C=1.0)",
    explanation: "Initializes the SVM. We explicitly ask for a 'linear' kernel (a straight straight line).",
    parameters: {
      "kernel": "The mathematical function used to transform data. 'linear' draws straight lines. ADVANCED TIP: If your data is arranged in circles and can't be sliced by a straight line, use the 'rbf' (Radial Basis Function) kernel. It mathematically blasts the 2D data into 3D space, slices it cleanly with a flat plane, and collapses it back down to a perfect curvy circle in 2D!",
      "C": "The regularization parameter. A high C tells the SVM to classify every single training point perfectly, even if it makes the 'street' very narrow. A low C allows some points to be on the wrong side of the street (errors) in exchange for a much wider, more generalized margin."
    }
  },
  {
    code: "svm.fit(X_train, y_train)",
    explanation: "Calculates the support vectors! It identifies the points that lie EXACTLY on the edges of the margin/street. It literally ignores all the other data points behind them, making it highly memory efficient."
  },
  {
    code: "support_vectors = svm.support_vectors_",
    explanation: "We can extract the exact points holding up the boundary. These are the most mathematically critical points in our entire dataset."
  },
  {
    code: "margin_size = 2 / np.linalg.norm(svm.coef_[0])",
    explanation: "We can mathematically calculate the exact width of our 'street'. The SVM algorithm's entire goal is to maximize this exact equation!"
  }
];

export default function SVMPage() {
  const points = [{x: 10, y: 40, class_id: 0}, {x: 40, y: 10, class_id: 1}];
  const [story, setStory] = useState("Welcome to SVM! The City Planner is finding the widest street to separate the red and blue data cities. Click 'Build Street' to watch the math find the maximum margin.");
  const [step, setStep] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <main className="min-h-screen p-4 md:p-8 text-neutral-200 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Support Vector Machine
            </h1>
            <p className="mt-2 text-lg text-neutral-400 font-light">
              The City Planner
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur text-sm font-medium transition-all flex items-center gap-2">
            <span>←</span> Back to Hub
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-rose-500/5">
              <SVMCanvas points={points} w1={0.2} w2={-0.5} b={10} />
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
                className="group relative px-6 py-3 font-bold text-white transition-all bg-rose-500/20 hover:bg-rose-500/30 rounded-full border border-rose-500/30 hover:border-rose-400/70 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] disabled:opacity-50"
              >
                ▶ Build Street
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`group relative px-6 py-3 font-bold text-white transition-all rounded-full border ${
                  isPlaying 
                    ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-200" 
                    : "bg-rose-600/10 border-rose-500/30 hover:bg-rose-500/20 text-rose-200"
                }`}
              >
                {isPlaying ? "⏸ Pause Auto-Play" : "🍿 Auto-Play"}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Story */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Storyteller Box */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-[#1e0a12]/60 backdrop-blur-md border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-600" />
              <h2 className="text-xl font-serif font-bold text-rose-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                The Storyteller
              </h2>
              <p className="text-sm text-rose-100 leading-relaxed font-light mb-4">
                {history.length > 0 ? story : "Welcome to SVM! The City Planner is finding the widest street to separate the red and blue data cities. Click 'Build Street' to watch the math find the maximum margin."}
              </p>
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs text-rose-200 bg-rose-950/30 p-2 rounded-lg">
                <div><span className="opacity-50 block mb-1">Step Number</span><span className="font-semibold">{step}</span></div>
                <div><span className="opacity-50 block mb-1">Goal</span><span className="font-semibold text-rose-300">Maximize Margin</span></div>
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
