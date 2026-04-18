"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GraphCanvas from "@/components/GraphCanvas";
import ScikitLearnSnippet from "@/components/ScikitLearnSnippet";
import Link from "next/link";

// Mock Pizza Delivery Data: Reduced data points so the algorithm converges faster
const INITIAL_POINTS = [
  { x: 2, y: 20 },
  { x: 4, y: 30 },
  { x: 6, y: 38 },
  { x: 8, y: 45 },
];

const SCIKIT_LEARN_CODE = [
  {
    code: "from sklearn.linear_model import LinearRegression",
    explanation: "Imports the LinearRegression class from scikit-learn's linear_model module. This class implements ordinary least squares linear regression."
  },
  {
    code: "import numpy as np",
    explanation: "Imports NumPy, a helpful library for numerical operations and array reshaping."
  },
  {
    code: "X = np.array([2, 4, 6, 8]).reshape(-1, 1)",
    explanation: "Prepares our input features (e.g., number of pizzas). Scikit-learn requires 2D arrays for features, hence the reshape(-1, 1).",
    parameters: {
      "-1": "Tells numpy to automatically infer the number of rows based on the data length.",
      "1": "Forces the array to have exactly 1 column."
    }
  },
  {
    code: "y = np.array([20, 30, 38, 45])",
    explanation: "Prepares our target values (e.g., delivery times). This can remain a 1D array."
  },
  {
    code: "model = LinearRegression()",
    explanation: "Creates an instance (or object) of the LinearRegression model, ready to be trained."
  },
  {
    code: "model.fit(X, y)",
    explanation: "This is where the magic happens! The model calculates the optimal slope and intercept to minimize the squared error between its predictions and the actual 'y' values."
  },
  {
    code: "slope = model.coef_[0]",
    explanation: "Extracts the calculated slope (m) of the best-fit line after training."
  },
  {
    code: "intercept = model.intercept_",
    explanation: "Extracts the calculated y-intercept (c) of the best-fit line after training."
  }
];

export default function LinearRegressionPage() {
  const [points] = useState(INITIAL_POINTS);
  const [m, setM] = useState(2.0);
  const [c, setC] = useState(10.0);
  const [step, setStep] = useState(0);
  const [cost, setCost] = useState<number | null>(null);

  const [story, setStory] = useState(
    "Welcome! To respect the user's golden time, we've reduced the data points. Click Auto-Play to watch Gradient Descent learn natively with larger steps!"
  );

  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setM(last.m);
    setC(last.c);
    setCost(last.cost);
    setStory(last.story);
    setStep(last.step);
    setIsPlaying(false);
  };

  const requestInFlightRef = useRef(false);

  const fetchNextStep = useCallback(async () => {
    if (requestInFlightRef.current) return;
    requestInFlightRef.current = true;

    setLoading(true);
    try {
      const response = await fetch("/api/linear-regression/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: points,
          m: m,
          c: c,
          learning_rate: 0.025,
          step_number: step,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      
      setHistory(prev => [...prev, { m, c, cost, story, step }]);

      if (cost !== null && Math.abs(cost - data.cost) < 0.05) {
        setStory("🎉 Natural Convergence! The AI found the perfect line. The error (cost) practically stopped moving, so we don't need any more steps!");
        setM(data.m);
        setC(data.c);
        setCost(data.cost);
        setIsPlaying(false);
        setLoading(false);
        requestInFlightRef.current = false;
        return;
      }

      setM(data.m);
      setC(data.c);
      setCost(data.cost);
      setStory(data.story);
      setStep(step + 1);
    } catch (error) {
      console.error(error);
      setStory("⚠️ Oops! The frontend couldn't connect to the backend.");
      setIsPlaying(false);
    }
    setLoading(false);
    requestInFlightRef.current = false;
  }, [points, m, c, step, cost, story]);

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
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Linear Regression
            </h1>
            <p className="mt-2 text-lg text-neutral-400 font-light">
              The Pizza Delivery Predictor
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur text-sm font-medium transition-all flex items-center gap-2">
            <span>←</span> Back to Hub
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-blue-500/5">
              <GraphCanvas points={points} m={m} c={c} animate={!isPlaying} />
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
                className="group relative px-6 py-3 font-bold text-white transition-all bg-white/5 hover:bg-emerald-500/20 rounded-full border border-emerald-500/30 hover:border-emerald-400/70 disabled:opacity-50"
              >
                {step === 0 ? "▶ Start Training" : "▶ Step-by-Step"}
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`group relative px-6 py-3 font-bold text-white transition-all rounded-full border ${
                  isPlaying 
                    ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-200" 
                    : "bg-blue-600/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-200"
                }`}
              >
                {isPlaying ? "⏸ Pause Auto-Play" : "🍿 Auto-Play"}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Story */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Storyteller Box */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-[#0a1128]/60 backdrop-blur-md border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-600" />
              <h2 className="text-xl font-serif font-bold text-blue-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                The Storyteller
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed font-light mb-4">
                {story}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs text-blue-200 bg-blue-950/30 p-2 rounded-lg">
                <div><span className="opacity-50 block mb-1">Slope (m)</span><span className="font-semibold">{m.toFixed(2)}</span></div>
                <div><span className="opacity-50 block mb-1">Intercept (c)</span><span className="font-semibold">{c.toFixed(2)}</span></div>
                <div><span className="opacity-50 block mb-1">Cost</span><span className="font-semibold text-blue-300">{cost !== null ? cost.toFixed(2) : "???"}</span></div>
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
