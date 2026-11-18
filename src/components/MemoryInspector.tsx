import React from 'react';
import { MemorySnapshot } from '../interpreter/cInterpreter';
import { Cpu, Database, Eye, Sparkles } from 'lucide-react';

interface MemoryInspectorProps {
  memory: MemorySnapshot;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({ memory }) => {
  const varKeys = Object.keys(memory.variables);
  const arrayKeys = Object.keys(memory.arrays);
  const hasData = varKeys.length > 0 || arrayKeys.length > 0;

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 select-text font-mono text-xs overflow-y-auto p-3 space-y-4">
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-6">
          <Database className="w-8 h-8 mb-2 text-slate-600 opacity-60" />
          <p className="font-semibold text-slate-400">RAM / Variable Memory is Empty</p>
          <p className="text-[11px] max-w-sm mt-1 leading-relaxed">
            Run or step through your program to watch variables and arrays allocate in simulated memory with real hexadecimal addresses!
          </p>
        </div>
      ) : (
        <>
          {/* Active Variables Table */}
          {varKeys.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Active Variables (Stack Memory)</span>
                <span className="text-[10px] text-slate-500 lowercase font-normal">
                  ({varKeys.length} {varKeys.length === 1 ? 'variable' : 'variables'})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {varKeys.map((name) => {
                  const rec = memory.variables[name];
                  const isModified = memory.lastModifiedVar === name;

                  return (
                    <div
                      key={name}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isModified
                          ? 'bg-amber-950/40 border-amber-500/80 shadow-md shadow-amber-950/50 scale-[1.02]'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white text-sm flex items-center gap-1">
                          {name}
                          {isModified && (
                            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                          )}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                            rec.type === 'int'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : rec.type === 'float' || rec.type === 'double'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {rec.type}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex justify-between items-center py-0.5">
                        <span className="text-slate-500">&amp;address:</span>
                        <span className="text-slate-400 font-mono">{rec.address}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex justify-between items-center py-0.5 border-t border-slate-800/80 mt-1 pt-1">
                        <span className="text-slate-500">value:</span>
                        <span className="text-emerald-400 font-bold font-mono text-xs">
                          {rec.type === 'char' ? `'${rec.value}'` : String(rec.value)}
                        </span>
                      </div>

                      {rec.pointsTo && (
                        <div className="text-[10px] text-sky-300 bg-sky-950/50 p-1 rounded border border-sky-800/60 mt-1 flex items-center justify-between">
                          <span className="text-slate-400">points to:</span>
                          <span className="font-bold text-sky-400 flex items-center gap-1">
                            &rarr; &amp;{rec.pointsTo}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Arrays Visualizer */}
          {arrayKeys.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>Arrays in Contiguous Memory</span>
              </div>

              <div className="space-y-3">
                {arrayKeys.map((name) => {
                  const arr = memory.arrays[name];
                  const accessed = memory.lastAccessedArray?.name === name ? memory.lastAccessedArray : null;

                  return (
                    <div key={name} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{name}[]</span>
                          <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] uppercase font-semibold">
                            {arr.type}[{arr.values.length}]
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Base Address: <span className="font-mono text-teal-400">{arr.baseAddress}</span>
                        </span>
                      </div>

                      {/* Memory cell tape */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {arr.values.map((val, idx) => {
                          const isAccessed = accessed?.index === idx;
                          const op = accessed?.op;
                          const cellAddress =
                            '0x' + (parseInt(arr.baseAddress, 16) + idx * arr.elementSize).toString(16);

                          return (
                            <div
                              key={idx}
                              className={`flex flex-col items-center min-w-[70px] p-2 rounded-lg border text-center transition-all ${
                                isAccessed
                                  ? op === 'write'
                                    ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                                    : 'bg-sky-950/60 border-sky-400 ring-2 ring-sky-400/50 scale-105'
                                  : 'bg-slate-950 border-slate-800'
                              }`}
                            >
                              <span className="text-[10px] text-slate-500 font-semibold mb-0.5">
                                [{idx}]
                              </span>
                              <span className="text-xs font-bold text-emerald-400 font-mono">
                                {arr.type === 'char' ? `'${val}'` : String(val)}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono mt-1 pt-0.5 border-t border-slate-800 w-full">
                                {cellAddress.slice(-4)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {accessed && (
                        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>
                            Last action: <strong className="text-amber-300">{accessed.op.toUpperCase()}</strong> on{' '}
                            <code className="text-white font-mono">{name}[{accessed.index}]</code>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
