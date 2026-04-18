"use client";

import { useState, useCallback, useEffect } from "react";
import LogRegCanvas from "@/components/LogRegCanvas";
import ScikitLearnSnippet from "@/components/ScikitLearnSnippet";
import Link from "next/link";

const SCIKIT_LEARN_CODE = [
  {
    code: "from sklearn.linear_model import LogisticRegression",
    explanation: "Imports LogisticRegression. Don't let the name fool you! Even though it has 'Regression' in the name, it is strictly used for classification (predicting categories, not continuous numbers)."
  },
  {
    code: "import numpy as np",
    explanation: "Standard import for numerical operations."
  },
  {
    code: "X_train = np.array([...])\ny_train = np.array([...])",
    explanation: "X_train contains our 2D data points. y_train contains our binary labels (0 or 1)."
  },
  {
    code: "logreg = LogisticRegression(penalty='l2', C=1.0, max_iter=1000)",
    explanation: "Initializes the Logistic Regression model with industry best practices to prevent overfitting.",
    parameters: {
      "penalty": "ADVANCED BEST PRACTICE: Implements L2 regularization (Ridge regression). This mathematical penalty prevents the model's internal weights (w1, w2) from growing too large and memorizing the training data.",
      "C": "Inverse of regularization strength. Smaller values specify stronger regularization.",
      "max_iter": "The maximum number of iterations gradient descent will take to converge. We increase this from the default 100 to ensure the math actually finishes calculating."
    }
  },
  {
    code: "logreg.fit(X_train, y_train)",
    explanation: "The heavy lifting! The algorithm runs Gradient Descent behind the scenes to find the perfect weights (w1, w2) and bias (b) for the Sigmoid curve that best separates the two classes."
  },
  {
    code: "predicted_classes = logreg.predict(X_new)",
    explanation: "Returns hard labels: exactly 0 or 1 for new data points."
  },
  {
    code: "probabilities = logreg.predict_proba(X_new)",
    explanation: "Returns the raw probabilities! For example, it might say a point has a 88% chance of being class 1 and a 12% chance of being class 0. If it's > 50%, it snaps to 1."
  }
];

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
  const [story, setStory] = useState("Welcome to Logistic Regression! The Banker is deciding where to draw the line to separate the two classes (blue vs green).");
  
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setW1(last.w1); setW2(last.w2); setB(last.b); setStory(last.story); setStep(last.step);
    setIsPlaying(false);
  };

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/logistic-regression/step", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points, w1, w2, b, learning_rate: 0.1, step_number: step })
      });
      const data = await response.json();
      setHistory(prev => [...prev, { w1, w2, b, story, step }]);
      setW1(data.w1); setW2(data.w2); setB(data.b); setStory(data.story); setStep(step + 1);
    } catch (e) {
      setStory("⚠️ Oops! The frontend couldn't connect to the backend.");
      setIsPlaying(false);
    }
    setLoading(false);
  }, [points, w1, w2, b, step, story]);

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
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Logistic Regression
            </h1>
            <p className="mt-2 text-lg text-neutral-400 font-light">
              The Banker's Classification Line
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur text-sm font-medium transition-all flex items-center gap-2">
            <span>←</span> Back to Hub
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-500/5">
              <LogRegCanvas points={points} w1={w1} w2={w2} b={b} />
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
                className="group relative px-6 py-3 font-bold text-white transition-all bg-emerald-500/20 hover:bg-emerald-500/30 rounded-full border border-emerald-500/30 hover:border-emerald-400/70 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {step === 0 ? "▶ Start Training" : "▶ Next Step"}
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`group relative px-6 py-3 font-bold text-white transition-all rounded-full border ${
                  isPlaying 
                    ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-200" 
                    : "bg-emerald-600/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-200"
                }`}
              >
                {isPlaying ? "⏸ Pause Auto-Play" : "🍿 Auto-Play"}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Story */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Storyteller Box */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-[#0a1e18]/60 backdrop-blur-md border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-600" />
              <h2 className="text-xl font-serif font-bold text-emerald-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                The Storyteller
              </h2>
              <p className="text-sm text-emerald-100 leading-relaxed font-light mb-4">
                {story}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs text-emerald-200 bg-emerald-950/30 p-2 rounded-lg">
                <div><span className="opacity-50 block mb-1">w1</span><span className="font-semibold">{w1.toFixed(2)}</span></div>
                <div><span className="opacity-50 block mb-1">w2</span><span className="font-semibold">{w2.toFixed(2)}</span></div>
                <div><span className="opacity-50 block mb-1">bias (b)</span><span className="font-semibold">{b.toFixed(2)}</span></div>
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
