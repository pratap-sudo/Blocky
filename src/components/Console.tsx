import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Square, CornerDownLeft, CircleAlert, CheckCircle2, Cpu } from 'lucide-react';
import { MemorySnapshot } from '../interpreter/cInterpreter';
import { MemoryInspector } from './MemoryInspector';

export interface ConsoleEntry {
  id: string;
  type: 'stdout' | 'stdin' | 'prompt' | 'error' | 'system';
  text: string;
}

interface ConsoleProps {
  entries: ConsoleEntry[];
  isRunning: boolean;
  isWaitingForInput: boolean;
  inputPromptText: string;
  onSendInput: (val: string) => void;
  onClear: () => void;
  onStop: () => void;
  memory: MemorySnapshot;
}

export const Console: React.FC<ConsoleProps> = ({
  entries,
  isRunning,
  isWaitingForInput,
  inputPromptText,
  onSendInput,
  onClear,
  onStop,
  memory,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'memory'>('console');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input field when waiting for user input
  useEffect(() => {
    if (isWaitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWaitingForInput]);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [entries, isWaitingForInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWaitingForInput) return;
    onSendInput(inputValue);
    setInputValue('');
  };

  const varCount = Object.keys(memory.variables).length + Object.keys(memory.arrays).length;

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800 font-mono select-text">
      {/* Console Title Bar / Tabs */}
      <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 shrink-0 select-none">
        <div className="flex items-center space-x-2">
          {/* Tabs */}
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold tracking-wide uppercase transition ${
              activeTab === 'console'
                ? 'bg-slate-800 text-white border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal<span className="hidden sm:inline"> Console</span></span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold tracking-wide uppercase transition ${
              activeTab === 'memory'
                ? 'bg-slate-800 text-amber-300 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Memory<span className="hidden sm:inline"> Watch</span></span>
            {varCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                {varCount}
              </span>
            )}
          </button>

          {/* Status Indicator */}
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              {isWaitingForInput ? 'Waiting for input...' : 'Executing...'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full ml-2 hidden sm:inline-flex">
              Ready
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          {isRunning && (
            <button
              onClick={onStop}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-[11px] font-medium transition"
              title="Stop execution"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          )}

          {activeTab === 'console' && (
            <button
              onClick={onClear}
              className="flex items-center space-x-1 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition"
              title="Clear console output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Body */}
      {activeTab === 'memory' ? (
        <MemoryInspector memory={memory} />
      ) : (
        /* Terminal Output Stream */
        <div
          ref={scrollContainerRef}
          className="flex-1 p-3 overflow-y-auto space-y-1 text-xs leading-relaxed"
        >
          {entries.length === 0 && !isWaitingForInput && (
            <div className="text-slate-600 italic select-none py-2">
              Click <span className="text-emerald-400 font-semibold">RUN ▶</span> to execute your program in the browser.
              Output and interactive scanf inputs will appear here.
            </div>
          )}

          {entries.map((entry) => {
            if (entry.type === 'error') {
              return (
                <div key={entry.id} className="text-rose-400 flex items-start space-x-1.5 bg-rose-950/30 p-2 rounded border border-rose-900/40">
                  <CircleAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="whitespace-pre-wrap">{entry.text}</span>
                </div>
              );
            }
            if (entry.type === 'system') {
              return (
                <div key={entry.id} className="text-slate-500 text-[11px] flex items-center space-x-1 italic py-0.5">
                  <CheckCircle2 className="w-3 h-3 text-slate-600" />
                  <span>{entry.text}</span>
                </div>
              );
            }
            if (entry.type === 'stdin') {
              return (
                <div key={entry.id} className="text-emerald-400 flex items-center space-x-1 font-semibold">
                  <span className="text-emerald-600 select-none">&gt;</span>
                  <span>{entry.text}</span>
                </div>
              );
            }
            if (entry.type === 'prompt') {
              return (
                <span key={entry.id} className="text-sky-300 font-medium">
                  {entry.text}
                </span>
              );
            }
            // Standard stdout
            return (
              <span key={entry.id} className="text-slate-200 whitespace-pre-wrap">
                {entry.text}
              </span>
            );
          })}

          {/* Interactive Input Prompt Bar */}
          {isWaitingForInput && (
            <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-sky-500/50 shadow-lg shadow-sky-950/40">
              <span className="text-sky-400 font-semibold flex items-center gap-1 shrink-0">
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>{inputPromptText || 'Enter input:'}</span>
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type value and press Enter..."
                className="flex-1 bg-slate-950 px-2.5 py-1 text-slate-100 rounded border border-slate-700 focus:outline-none focus:border-sky-400 text-xs font-mono"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium transition shrink-0"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}

      {/* Terminal Engine Footer */}
      <div className="h-5 bg-slate-900/60 border-t border-slate-800/60 px-3 flex items-center justify-between text-[10px] text-slate-500 select-none">
        <span>Visual C Execution Engine • Client-Side Native</span>
        <span>Standard Streams: stdin / stdout</span>
      </div>
    </div>
  );
};
