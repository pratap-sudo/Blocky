import React from 'react';
import { BLOCK_LEARNING_DATA, BlockLearningInfo } from '../data/learningContent';
import { BookOpen, Lightbulb, Code, GitFork, X, Sparkles, AlertCircle } from 'lucide-react';

interface LearningPanelProps {
  selectedBlockType: string | null;
  onClose: () => void;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({ selectedBlockType, onClose }) => {
  const info: BlockLearningInfo | undefined = selectedBlockType
    ? BLOCK_LEARNING_DATA[selectedBlockType]
    : undefined;

  return (
    <aside className="w-80 md:w-96 h-full bg-slate-900 border-l border-slate-800 flex flex-col select-none overflow-hidden shrink-0">
      {/* Panel Header */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-3.5 shrink-0">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            Beginner Guide & Reference
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs select-text">
        {info ? (
          <>
            {/* Header / Category Badge */}
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                {info.category}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{info.name}</h3>
              <p className="text-slate-400 mt-1 leading-relaxed">{info.summary}</p>
            </div>

            {/* What it does */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>What it does</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{info.explanation}</p>
            </div>

            {/* C Syntax Blueprint */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1.5">
                <Code className="w-3.5 h-3.5 text-blue-400" />
                <span>C Syntax Blueprint</span>
              </div>
              <pre className="p-2.5 rounded bg-slate-900 text-blue-300 font-mono text-[11px] overflow-x-auto border border-slate-800/80">
                {info.cSyntax}
              </pre>
            </div>

            {/* Example of Equivalent C Code */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1.5">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real C Example</span>
              </div>
              <pre className="p-2.5 rounded bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800/80">
                {info.cExample}
              </pre>
            </div>

            {/* Pro / Beginner Tip */}
            {info.beginnerTip && (
              <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/40 text-amber-200/90 leading-relaxed flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300 block mb-0.5">Beginner Tip:</span>
                  <span>{info.beginnerTip}</span>
                </div>
              </div>
            )}

            {/* Flowchart Logic Diagram */}
            {info.flowchartNodes && info.flowchartNodes.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-2.5">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" />
                  <span>Logic Flowchart</span>
                </div>
                <div className="flex flex-col items-center space-y-2 py-1">
                  {info.flowchartNodes.map((node, idx) => (
                    <React.Fragment key={node.id}>
                      <div
                        className={`px-3 py-1.5 rounded-lg text-center font-mono text-[11px] border shadow-sm max-w-[240px] ${
                          node.type === 'start' || node.type === 'end'
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/60 rounded-full'
                            : node.type === 'decision'
                            ? 'bg-rose-950/50 text-rose-300 border-rose-700/60 rotate-0 ring-1 ring-rose-500/30'
                            : node.type === 'io'
                            ? 'bg-sky-950/50 text-sky-300 border-sky-700/60 italic'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        {node.type === 'decision' ? `◇ ${node.label} ?` : node.label}
                      </div>
                      {idx < (info.flowchartNodes?.length ?? 0) - 1 && (
                        <div className="w-0.5 h-3 bg-slate-700 relative">
                          <span className="absolute -bottom-1 -left-[3px] text-[8px] text-slate-500">▼</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Default state when no specific block is selected */
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Select Any Block</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Click any visual block on your workspace to view its C syntax, detailed explanation, beginner tips, and logic flowchart.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
              <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Quick C Programming Tips</span>
              </h5>
              <ul className="space-y-2 text-slate-300 text-[11px] list-disc list-inside">
                <li>
                  <strong className="text-white">int main():</strong> Every C program starts execution from the <code className="text-emerald-400">main()</code> function.
                </li>
                <li>
                  <strong className="text-white">Data Types:</strong> C requires types like <code className="text-amber-400">int</code> (whole numbers), <code className="text-amber-400">float</code> (decimals), and <code className="text-amber-400">char</code> (letters).
                </li>
                <li>
                  <strong className="text-white">Input with scanf:</strong> Always use the <code className="text-sky-400">&amp;</code> address operator before variable names in <code className="text-sky-400">scanf("%d", &amp;x)</code>.
                </li>
                <li>
                  <strong className="text-white">= vs ==:</strong> Single <code className="text-purple-400">=</code> sets a value. Double <code className="text-purple-400">==</code> tests equality.
                </li>
                <li>
                  <strong className="text-white">Arrays start at 0:</strong> In C, the first index of an array is <code className="text-teal-400">arr[0]</code>, not 1!
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
