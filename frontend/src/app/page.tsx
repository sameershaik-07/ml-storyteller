import Link from "next/link";

export default function Home() {
  const algorithms = [
    { 
      name: "Linear Regression", 
      persona: "The Predictor",
      desc: "Find the line of best fit to predict continuous values.", 
      path: "/linear-regression", 
      colors: { text: "text-blue-400", borderHover: "hover:border-blue-400/50", shadowHover: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]", gradientFrom: "from-blue-600/10", bgIcon: "bg-blue-500/10", borderIcon: "border-blue-500/30", dot: "bg-blue-400" }
    },
    { 
      name: "K-Means Clustering", 
      persona: "The Matchmaker",
      desc: "Autonomously group similar data points into distinct clusters.", 
      path: "/k-means", 
      colors: { text: "text-purple-400", borderHover: "hover:border-purple-400/50", shadowHover: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]", gradientFrom: "from-purple-600/10", bgIcon: "bg-purple-500/10", borderIcon: "border-purple-500/30", dot: "bg-purple-400" }
    },
    { 
      name: "K-Nearest Neighbors", 
      persona: "The Neighborhood Watch",
      desc: "Classify an unknown point based on the vote of its closest friends.", 
      path: "/knn", 
      colors: { text: "text-cyan-400", borderHover: "hover:border-cyan-400/50", shadowHover: "hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]", gradientFrom: "from-cyan-600/10", bgIcon: "bg-cyan-500/10", borderIcon: "border-cyan-500/30", dot: "bg-cyan-400" }
    },
    { 
      name: "Logistic Regression", 
      persona: "The Banker",
      desc: "Find the optimal probability boundary to separate two distinct classes.", 
      path: "/logistic-regression", 
      colors: { text: "text-emerald-400", borderHover: "hover:border-emerald-400/50", shadowHover: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]", gradientFrom: "from-emerald-600/10", bgIcon: "bg-emerald-500/10", borderIcon: "border-emerald-500/30", dot: "bg-emerald-400" }
    },
    { 
      name: "Support Vector Machine", 
      persona: "The City Planner",
      desc: "Maximize the boundary margin (street) between categories.", 
      path: "/svm", 
      colors: { text: "text-rose-400", borderHover: "hover:border-rose-400/50", shadowHover: "hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]", gradientFrom: "from-rose-600/10", bgIcon: "bg-rose-500/10", borderIcon: "border-rose-500/30", dot: "bg-rose-400" }
    },
    { 
      name: "Decision Tree", 
      persona: "The Detective",
      desc: "Split data repeatedly using simple yes/no rules to classify.", 
      path: "/decision-tree", 
      colors: { text: "text-amber-400", borderHover: "hover:border-amber-400/50", shadowHover: "hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]", gradientFrom: "from-amber-600/10", bgIcon: "bg-amber-500/10", borderIcon: "border-amber-500/30", dot: "bg-amber-400" }
    },
    { 
      name: "PCA", 
      persona: "The Photographer",
      desc: "Find the best angle to flatten data while keeping its variance.", 
      path: "/pca", 
      colors: { text: "text-fuchsia-400", borderHover: "hover:border-fuchsia-400/50", shadowHover: "hover:shadow-[0_0_40px_rgba(217,70,239,0.15)]", gradientFrom: "from-fuchsia-600/10", bgIcon: "bg-fuchsia-500/10", borderIcon: "border-fuchsia-500/30", dot: "bg-fuchsia-400" }
    },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen text-white p-8 md:p-16 overflow-hidden relative selection:bg-purple-500/30">
      
      {/* Decorative background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col items-center mt-10 mb-16">
        <h1 className="text-6xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-400 mb-6 tracking-tight drop-shadow-lg text-center">
          ML Storyteller
        </h1>
        
        <p className="text-xl md:text-2xl max-w-3xl text-center text-slate-300 font-light leading-relaxed">
          Learn Machine Learning algorithms through interactive, animated storytelling. 
          <span className="block mt-3 text-slate-400 text-lg">Watch the math happen under the hood while the AI explains the intuition.</span>
        </p>
      </div>
      
      {/* Algorithms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl relative z-10 pb-20 cursor-default">
        {algorithms.map((algo) => (
          <Link 
            key={algo.path}
            href={algo.path} 
            className={`group relative p-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 ${algo.colors.borderHover} rounded-3xl transition-all duration-500 backdrop-blur-xl shadow-xl ${algo.colors.shadowHover} hover:-translate-y-2 overflow-hidden flex flex-col cursor-pointer`}
          >
            {/* Dynamic Hover Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${algo.colors.gradientFrom} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${algo.colors.bgIcon} border ${algo.colors.borderIcon} flex items-center justify-center`}>
                  <span className={`w-3 h-3 rounded-full ${algo.colors.dot} shadow-[0_0_10px_currentColor] animate-pulse`} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white tracking-wide">{algo.name}</h2>
                  <p className={`text-sm font-semibold ${algo.colors.text} tracking-wider uppercase`}>{algo.persona}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mt-4">
                {algo.desc}
              </p>
            </div>
            
            {/* Bottom Arrow Indicator */}
            <div className="relative z-10 mt-6 flex justify-end">
              <div className={`${algo.colors.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
