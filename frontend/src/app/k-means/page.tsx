"use client";

import { useState, useEffect, useCallback } from "react";
import KMeansCanvas from "@/components/KMeansCanvas";
import ScikitLearnSnippet from "@/components/ScikitLearnSnippet";
import Link from "next/link";

// Initial Random Data distribution across a grid of 0-100
const INITIAL_POINTS = [
  { x: 15, y: 20, cluster_id: -1 }, { x: 20, y: 35, cluster_id: -1 },
  { x: 25, y: 15, cluster_id: -1 }, { x: 30, y: 40, cluster_id: -1 },
  { x: 75, y: 80, cluster_id: -1 }, { x: 80, y: 90, cluster_id: -1 },
  { x: 85, y: 75, cluster_id: -1 }, { x: 90, y: 85, cluster_id: -1 },
  { x: 80, y: 20, cluster_id: -1 }, { x: 85, y: 35, cluster_id: -1 },
  { x: 90, y: 25, cluster_id: -1 }, { x: 75, y: 40, cluster_id: -1 },
];

const INITIAL_CENTROIDS = [
  { id: 1, x: 50, y: 50 }, // Random middle start
  { id: 2, x: 60, y: 60 },
  { id: 3, x: 40, y: 40 },
];

const SCIKIT_LEARN_CODE = [
  {
    code: "from sklearn.cluster import KMeans",
    explanation: "Imports the KMeans clustering algorithm. It is part of the 'cluster' module because K-Means is a classic unsupervised learning technique used to group unlabeled data."
  },
  {
    code: "import numpy as np",
    explanation: "Imports NumPy for fast array manipulation, the industry standard for handling data shapes."
  },
  {
    code: "X = np.array([...])",
    explanation: "Our dataset feature array. Notice there is no 'y' (target array) because K-Means is unsupervised! We don't know the answers (clusters) beforehand."
  },
  {
    code: "kmeans = KMeans(n_clusters=3, init='k-means++', n_init=10)",
    explanation: "Initializes the KMeans model with industry best practices.",
    parameters: {
      "n_clusters": "The number of distinct groups you want the algorithm to find. (K=3)",
      "init": "BEST PRACTICE: 'k-means++' carefully spreads out the initial centroids instead of placing them purely randomly, heavily speeding up convergence and avoiding bad local minimums.",
      "n_init": "Number of times the algorithm will be run with different centroid seeds. The final results will be the best output out of the 10 consecutive runs."
    }
  },
  {
    code: "kmeans.fit(X)",
    explanation: "Executes the algorithm! Under the hood, this loops through the 'Assign' phase (assigning points to the nearest centroid) and 'Update' phase (moving centroids to the center of their points) until the centroids stop moving."
  },
  {
    code: "labels = kmeans.labels_",
    explanation: "Returns an array assigning each data point to one of our 3 clusters (e.g., [0, 1, 2, 0, ...])."
  },
  {
    code: "centroids = kmeans.cluster_centers_",
    explanation: "Returns the final (X,Y) coordinates for the center of each of the 3 clusters."
  }
];

export default function KMeansPage() {
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [centroids, setCentroids] = useState(INITIAL_CENTROIDS);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("assign"); // "assign" or "update"
  
  const [story, setStory] = useState(
    "Welcome to K-Means! Look at the gray data points scattered around. We just dropped three Star-shaped Centroids randomly onto the map. Click 'Auto-Play' to watch them find their perfect groups."
  );
  
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setPoints(last.points);
    setCentroids(last.centroids);
    setPhase(last.phase);
    setStory(last.story);
    setStep(last.step);
    setIsPlaying(false);
  };

  const fetchNextStep = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/k-means/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: points,
          centroids: centroids,
          step_number: step,
          phase: phase, 
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();

      setHistory(prev => [...prev, { points, centroids, phase, story, step }]);
      
      setPoints(data.points);
      setCentroids(data.centroids);
      setPhase(data.phase);
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
  }, [points, centroids, step, phase, story]);

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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300">
              K-Means Clustering
            </h1>
            <p className="mt-2 text-lg text-neutral-400 font-light">
              The Group Matchmaker
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur text-sm font-medium transition-all flex items-center gap-2">
            <span>←</span> Back to Hub
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/5">
              <KMeansCanvas points={points} centroids={centroids} animate={!isPlaying} />
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
                {step === 0 ? "▶ Start Clustering" : "▶ Next Action"}
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`group relative px-6 py-3 font-bold text-white transition-all rounded-full border ${
                  isPlaying 
                    ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-200" 
                    : "bg-purple-600/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-200"
                }`}
              >
                {isPlaying ? "⏸ Pause Timeline" : "🍿 Auto-Play"}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Story */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Storyteller Box */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-[#1e0a28]/60 backdrop-blur-md border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-fuchsia-600" />
              <h2 className="text-xl font-serif font-bold text-purple-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                The Storyteller
              </h2>
              <p className="text-sm text-purple-100 leading-relaxed font-light mb-4">
                {story}
              </p>
              <div className="grid grid-cols-2 gap-4 text-center font-mono text-sm text-purple-200 bg-purple-950/30 p-2 rounded-lg">
                <div><span className="opacity-50 block mb-1">Step</span><span className="font-semibold">{step}</span></div>
                <div><span className="opacity-50 block mb-1">Phase</span><span className="font-semibold text-purple-300">{phase.toUpperCase()}</span></div>
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
