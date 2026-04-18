"use client";
import { useState, useEffect, useCallback } from "react";
import DTCanvas from "@/components/DTCanvas";
import ScikitLearnSnippet from "@/components/ScikitLearnSnippet";
import Link from "next/link";

const SCIKIT_LEARN_CODE = [
  {
    code: "from sklearn.tree import DecisionTreeClassifier",
    explanation: "Imports the Decision Tree Classifier. Decision trees can also do regression (DecisionTreeRegressor), but here we are classifying dots into categories."
  },
  {
    code: "import numpy as np",
    explanation: "Numeric operations."
  },
  {
    code: "X_train = np.array([...])\ny_train = np.array([...])",
    explanation: "Loads our coordinates and class labels."
  },
  {
    code: "tree = DecisionTreeClassifier(max_depth=3, criterion='gini')",
    explanation: "Initializes the Decision Tree with important parameters to prevent overfitting.",
    parameters: {
      "max_depth": "ADVANCED BEST PRACTICE: Always set a max_depth! If you don't restrict this, the tree will keep asking Yes/No questions until every single dot has its own leaf node. This is severe overfitting and will perform terribly on new data.",
      "criterion": "The math function used to determine the 'best' question to ask. 'gini' measures impurity (how mixed up the colors are). The algorithm looks for the question that results in the purest (most uniform color) split."
    }
  },
  {
    code: "tree.fit(X_train, y_train)",
    explanation: "Constructs the tree! The algorithm looks at all features, tests every possible split value, calculates the Gini impurity for each split, and permanently selects the single split that separates the classes the best. It repeats this recursively for each branch."
  },
  {
    code: "predicted_classes = tree.predict(X_new)",
    explanation: "Predictions are instant! The new data point just falls through the flowchart of Yes/No questions we built during `.fit()` until it lands in a leaf node."
  },
  {
    code: "feature_importances = tree.feature_importances_",
    explanation: "An incredible feature of Trees! Since the math calculates exactly how much 'impurity' each feature removed, we can print out exactly which feature was the most important for the prediction."
  }
];

export default function DTPage() {
  const points = [{x: 20, y: 80}, {x: 80, y: 20}];
  const [splits, setSplits] = useState([]);
  const [story, setStory] = useState("Welcome to Decision Trees! The 20-Questions Detective is looking for the best way to slice the data.");
  const [step, setStep] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <main className="min-h-screen p-4 md:p-8 text-neutral-200 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Decision Tree
            </h1>
            <p className="mt-2 text-lg text-neutral-400 font-light">
              The 20-Questions Detective
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur text-sm font-medium transition-all flex items-center gap-2">
            <span>←</span> Back to Hub
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-amber-500/5">
              <DTCanvas points={points} splits={splits} />
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
                className="group relative px-6 py-3 font-bold text-white transition-all bg-amber-500/20 hover:bg-amber-500/30 rounded-full border border-amber-500/30 hover:border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] disabled:opacity-50"
              >
                ▶ Ask Question
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`group relative px-6 py-3 font-bold text-white transition-all rounded-full border ${
                  isPlaying 
                    ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-200" 
                    : "bg-amber-600/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-200"
                }`}
              >
                {isPlaying ? "⏸ Pause Auto-Play" : "🍿 Auto-Play"}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Story */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Storyteller Box */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-[#1e150a]/60 backdrop-blur-md border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-yellow-600" />
              <h2 className="text-xl font-serif font-bold text-amber-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                The Storyteller
              </h2>
              <p className="text-sm text-amber-100 leading-relaxed font-light mb-4">
                {story}
              </p>
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs text-amber-200 bg-amber-950/30 p-2 rounded-lg">
                <div><span className="opacity-50 block mb-1">Total Splits</span><span className="font-semibold">{splits.length}</span></div>
                <div><span className="opacity-50 block mb-1">Criterion</span><span className="font-semibold text-amber-300">Gini Impurity</span></div>
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
