import { useState } from "react";

export type CodeLine = {
  code: string;
  explanation: string;
  parameters?: { [key: string]: string };
};

export default function ScikitLearnSnippet({ title, lines }: { title: string, lines: CodeLine[] }) {
  const [activeLine, setActiveLine] = useState<number | null>(null);

  return (
    <div className="bg-[#0d1117] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#161b22] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-mono text-slate-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          {title}
        </h3>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* Code Window */}
      <div className="p-4 font-mono text-sm overflow-x-auto flex-1 h-48 overflow-y-auto">
        {lines.map((line, idx) => (
          <div 
            key={idx} 
            className={`cursor-pointer px-2 py-1.5 rounded transition-all duration-200 flex ${activeLine === idx ? 'bg-blue-500/20 border-l-2 border-blue-400' : 'hover:bg-slate-800/50 border-l-2 border-transparent'}`}
            onClick={() => setActiveLine(activeLine === idx ? null : idx)}
          >
            <span className="text-slate-500 mr-4 select-none w-4 inline-block text-right">{idx + 1}</span>
            <span className={line.code.startsWith('import') || line.code.includes(' from ') ? "text-pink-400" : line.code.includes('=') ? "text-blue-300" : "text-emerald-300"}>
              {line.code}
            </span>
          </div>
        ))}
      </div>

      {/* Explanation Panel */}
      <div className={`bg-[#161b22] border-t border-slate-800 transition-all duration-300 overflow-y-auto ${activeLine !== null ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        {activeLine !== null && (
          <div className="p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explanation</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {lines[activeLine].explanation}
            </p>
            
            {lines[activeLine].parameters && Object.keys(lines[activeLine].parameters).length > 0 && (
              <div className="mt-3 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Parameters</h4>
                {Object.entries(lines[activeLine].parameters).map(([key, value]) => (
                  <div key={key} className="text-sm flex gap-2">
                    <span className="text-orange-300 font-mono font-bold">{key}:</span>
                    <span className="text-slate-400">{value as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer hint */}
      {activeLine === null && (
        <div className="bg-[#161b22] px-4 py-2 border-t border-slate-800 text-xs text-slate-500 text-center italic">
          Click on any line of code to see its explanation.
        </div>
      )}
    </div>
  );
}
