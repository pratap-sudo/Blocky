import React, { useRef, useState } from 'react';
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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 md:px-4 select-none shrink-0 z-20 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,.vcproj"
        className="hidden"
      />

      {/* Left: Brand & Gallery buttons */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Visual C Studio" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-md" />
          <div className="flex flex-col">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1">
              Visual C <span className="text-blue-400 font-extrabold">Studio</span>
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden lg:block" />

        {/* Desktop Quick Links */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* Examples */}
          <button
            onClick={onOpenExamples}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
            title="Browse 14 Beginner & Intermediate Example Programs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Examples</span>
          </button>

          {/* Challenges & Auto-Grader */}
          <button
            onClick={onOpenChallenges}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
            title="Interactive Coding Challenges with Auto-Grader"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Challenges</span>
          </button>

          {/* Full Program Flowchart */}
          <button
            onClick={onOpenFlowchart}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-medium transition"
            title="View Full Program Flowchart Diagram"
          >
            <GitFork className="w-3.5 h-3.5 text-purple-400" />
            <span>Flowchart</span>
          </button>

          {/* New Program */}
          <button
            onClick={onNew}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            title="Start fresh new program"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Center: Execution & Stepping Debugger Controls */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Undo / Redo (hidden on mobile, inside drawer or desktop) */}
        <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
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

        {/* Clear Workspace (Desktop) */}
        <button
          onClick={onClear}
          className="hidden sm:block p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
          title="Clear Workspace"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Debugger Stepping Toggle */}
        <button
          onClick={onToggleStepDebugger}
          className={`flex items-center space-x-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium border transition ${
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
            className="flex items-center space-x-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md transition animate-bounce"
            title="Step to Next Block"
          >
            <StepForward className="w-3.5 h-3.5 fill-current" />
            <span>STEP NEXT</span>
          </button>
        )}

        {/* Run ▶ / Stop ⏹ Button - Always visible and prominent */}
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center space-x-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide shadow-md transition animate-pulse"
            title="Stop Execution"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="flex items-center space-x-1 px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-900/30 transition hover:scale-[1.02] active:scale-[0.98]"
            title="Run Program in Browser (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN ▶</span>
          </button>
        )}

        {/* Lint Warnings Badge (desktop) */}
        {lintWarningsCount > 0 && (
          <span
            className="hidden sm:flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 font-medium"
            title={`${lintWarningsCount} beginner suggestion(s) detected in your blocks`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">{lintWarningsCount} tip{lintWarningsCount > 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      {/* Right: Desktop Actions & Mobile Menu Toggle */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-1.5">
          {/* Shareable Link */}
          <button
            onClick={onShareUrl}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            title="Copy shareable project URL"
          >
            {isShared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isShared ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Copy C Code */}
          <button
            onClick={onCopyC}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            title="Copy generated C code"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy C</span>
          </button>

          {/* Download C File */}
          <button
            onClick={onDownloadC}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            title="Download main.c file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.c</span>
          </button>

          {/* Save & Load Project */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
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

          <div className="h-6 w-px bg-slate-800 mx-1" />

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
            <span>Guide</span>
          </button>

          {/* GCC Compiler Guide */}
          <button
            onClick={onOpenGccHelp}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="GCC Compilation Cheat Sheet"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Sound Toggle (always handy) */}
        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title={isSoundEnabled ? 'Audio Effects: Enabled' : 'Audio Effects: Muted'}
        >
          {isSoundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Theme Toggle (always handy) */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-700/70"
          title="Open Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Slide-over Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Visual C" className="w-6 h-6 rounded" />
                <span className="font-bold text-sm text-white">Visual C Studio</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="flex-1 py-4 space-y-4 text-xs">
              {/* Learning & Features Section */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2">
                  Learn & Explore
                </span>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => {
                      onOpenExamples();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 transition text-left"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Sample Programs (15 Gallery)</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenChallenges();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-amber-600/10 hover:bg-amber-600/20 text-amber-300 transition text-left"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Coding Challenges & Grader</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenFlowchart();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-purple-300 hover:text-white transition text-left"
                  >
                    <GitFork className="w-4 h-4 text-purple-400" />
                    <span>View Logic Flowchart</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenGccHelp();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-emerald-300 hover:text-white transition text-left"
                  >
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>GCC Compiler Guide</span>
                  </button>
                </div>
              </div>

              {/* Workspace Operations */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2">
                  Workspace
                </span>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => {
                      onNew();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
                  >
                    <FileCode className="w-4 h-4" />
                    <span>New Program</span>
                  </button>

                  <button
                    onClick={() => {
                      onClear();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 transition text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Workspace</span>
                  </button>

                  <div className="flex gap-1.5 px-1 pt-1">
                    <button
                      onClick={onUndo}
                      disabled={!canUndo}
                      className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                    <button
                      onClick={onRedo}
                      disabled={!canRedo}
                      className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
                    >
                      <Redo2 className="w-3.5 h-3.5" />
                      <span>Redo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Save, Share & Export */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2">
                  Share & Export
                </span>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => {
                      onShareUrl();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
                  >
                    <Share2 className="w-4 h-4 text-sky-400" />
                    <span>{isShared ? 'Link Copied!' : 'Share Project Link'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onCopyC();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
                  >
                    <Copy className="w-4 h-4 text-emerald-400" />
                    <span>{isCopied ? 'Code Copied!' : 'Copy C Source Code'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onDownloadC();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
                  >
                    <Download className="w-4 h-4 text-blue-400" />
                    <span>Download main.c</span>
                  </button>

                  <button
                    onClick={() => {
                      onSaveProject();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Save Project (.vcproj)</span>
                  </button>

                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
                  >
                    <FolderOpen className="w-4 h-4 text-amber-400" />
                    <span>Load Project (.vcproj)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Visual C Studio v1.0</span>
              <span className="text-emerald-500">100% Client-Side</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
