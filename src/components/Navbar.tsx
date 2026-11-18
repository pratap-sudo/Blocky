import React, { useRef } from 'react';
import {
  Play,
  Square,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Copy,
  FolderOpen,
  Save,
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  FileCode,
  Check,
  Trophy,
  GitFork,
  Share2,
  StepForward,
  Bug,
  AlertTriangle,
  Volume2,
  VolumeX,
  Terminal,
} from 'lucide-react';

interface NavbarProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onNew: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDownloadC: () => void;
  onCopyC: () => void;
  isCopied: boolean;
  onSaveProject: () => void;
  onLoadProject: (jsonString: string) => void;
  onOpenExamples: () => void;
  onOpenFlowchart: () => void;
  onOpenChallenges: () => void;
  onOpenGccHelp: () => void;
  onShareUrl: () => void;
  isShared: boolean;
  showLearning: boolean;
  onToggleLearning: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isStepDebugger: boolean;
  isWaitingForStep: boolean;
  onToggleStepDebugger: () => void;
  onStepNext: () => void;
  lintWarningsCount: number;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isRunning,
  onRun,
  onStop,
  onNew,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDownloadC,
  onCopyC,
  isCopied,
  onSaveProject,
  onLoadProject,
  onOpenExamples,
  onOpenFlowchart,
  onOpenChallenges,
  onOpenGccHelp,
  onShareUrl,
  isShared,
  showLearning,
  onToggleLearning,
  isDarkMode,
  onToggleDarkMode,
  isStepDebugger,
  isWaitingForStep,
  onToggleStepDebugger,
  onStepNext,
  lintWarningsCount,
  isSoundEnabled,
  onToggleSound,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onLoadProject(content);
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 md:px-4 select-none shrink-0 z-20">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,.vcproj"
        className="hidden"
      />

      {/* Left: Brand & Gallery buttons */}
      <div className="flex items-center space-x-2.5">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Visual C Studio" className="w-8 h-8 rounded-lg shadow-md" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              Visual C <span className="text-blue-400 font-extrabold">Studio</span>
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Examples */}
        <button
          onClick={onOpenExamples}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
          title="Browse 14 Beginner & Intermediate Example Programs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Examples</span>
        </button>

        {/* Challenges & Auto-Grader */}
        <button
          onClick={onOpenChallenges}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
          title="Interactive Coding Challenges with Auto-Grader"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Challenges</span>
        </button>

        {/* Full Program Flowchart */}
        <button
          onClick={onOpenFlowchart}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-medium transition"
          title="View Full Program Flowchart Diagram"
        >
          <GitFork className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden lg:inline">Flowchart</span>
        </button>

        {/* New Program */}
        <button
          onClick={onNew}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
          title="Start fresh new program"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">New</span>
        </button>
      </div>

      {/* Center: Execution & Stepping Debugger Controls */}
      <div className="flex items-center space-x-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 hidden sm:flex">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded text-slate-300 hover:text-white disabled:opacity-40 transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded text-slate-300 hover:text-white disabled:opacity-40 transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clear Workspace */}
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
          title="Clear Workspace"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Debugger Stepping Toggle */}
        <button
          onClick={onToggleStepDebugger}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            isStepDebugger
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/30'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title="Step-by-Step Educational Debugger Mode"
        >
          <Bug className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Step Debug</span>
        </button>

        {/* Step Next Button (active during stepping debug) */}
        {isRunning && isStepDebugger && (
          <button
            onClick={onStepNext}
            disabled={!isWaitingForStep}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md transition animate-bounce"
            title="Step to Next Block"
          >
            <StepForward className="w-3.5 h-3.5 fill-current" />
            <span>STEP NEXT ⏭</span>
          </button>
        )}

        {/* Run ▶ / Stop ⏹ Button */}
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide shadow-md transition animate-pulse"
            title="Stop Execution"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-900/30 transition hover:scale-[1.02] active:scale-[0.98]"
            title="Run Program in Browser (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN ▶</span>
          </button>
        )}

        {/* Lint Warnings Badge */}
        {lintWarningsCount > 0 && (
          <span
            className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 font-medium"
            title={`${lintWarningsCount} beginner suggestion(s) detected in your blocks`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">{lintWarningsCount} tip{lintWarningsCount > 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      {/* Right: Share, Download, Learning Guide, Theme */}
      <div className="flex items-center space-x-1.5">
        {/* Shareable Link */}
        <button
          onClick={onShareUrl}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
          title="Copy shareable project URL"
        >
          {isShared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{isShared ? 'Link Copied!' : 'Share'}</span>
        </button>

        {/* Copy C Code */}
        <button
          onClick={onCopyC}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
          title="Copy generated C code"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden xl:inline">Copy C</span>
        </button>

        {/* Download C File */}
        <button
          onClick={onDownloadC}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
          title="Download main.c file"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">.c</span>
        </button>

        {/* Save & Load Project */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 hidden sm:flex">
          <button
            onClick={onSaveProject}
            className="p-1.5 rounded text-slate-300 hover:text-white transition"
            title="Save Project (Export JSON)"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded text-slate-300 hover:text-white transition"
            title="Load Project (Import JSON)"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Learning Assistant Toggle */}
        <button
          onClick={onToggleLearning}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            showLearning
              ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title="Toggle Beginner Learning Guide & Reference Panel"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Guide</span>
        </button>

        {/* GCC Compiler Guide */}
        <button
          onClick={onOpenGccHelp}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title="GCC Compilation Cheat Sheet"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title={isSoundEnabled ? 'Audio Effects: Enabled' : 'Audio Effects: Muted'}
        >
          {isSoundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
