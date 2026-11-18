import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BlocklyWorkspace, BlocklyWorkspaceHandle } from './components/BlocklyWorkspace';
import { CodeViewer } from './components/CodeViewer';
import { Console, ConsoleEntry } from './components/Console';
import { LearningPanel } from './components/LearningPanel';
import { ExamplesModal } from './components/ExamplesModal';
import { FlowchartModal } from './components/FlowchartModal';
import { ChallengesModal } from './components/ChallengesModal';
import { GccHelpModal } from './components/GccHelpModal';
import { SampleProgram } from './data/samplePrograms';
import { CInterpreter, MemorySnapshot } from './interpreter/cInterpreter';
import { lintWorkspace, LintMessage } from './utils/linter';
import { sounds } from './utils/audio';
import { Blocks, Code2, Terminal, BookOpen } from 'lucide-react';

export type MobileTab = 'blocks' | 'code' | 'console' | 'guide';

export const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [cCode, setCCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState<boolean>(false);
  const [inputPromptText, setInputPromptText] = useState<string>('');
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [selectedBlockType, setSelectedBlockType] = useState<string | null>(null);
  const [showLearning, setShowLearning] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(false);

  // Mobile navigation tab state
  const [mobileTab, setMobileTab] = useState<MobileTab>('blocks');

  // Stepping Debugger State
  const [isStepDebugger, setIsStepDebugger] = useState<boolean>(false);
  const [isWaitingForStep, setIsWaitingForStep] = useState<boolean>(false);

  // Modals
  const [showExamplesModal, setShowExamplesModal] = useState<boolean>(false);
  const [showFlowchartModal, setShowFlowchartModal] = useState<boolean>(false);
  const [showChallengesModal, setShowChallengesModal] = useState<boolean>(false);
  const [showGccHelp, setShowGccHelp] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(sounds.enabled);

  // Live Memory & Variable State
  const [memorySnapshot, setMemorySnapshot] = useState<MemorySnapshot>({
    variables: {},
    arrays: {},
  });

  // Smart Linter Warnings
  const [lintWarnings, setLintWarnings] = useState<LintMessage[]>([]);

  // Panel sizing for desktop
  const [codePanelWidth, setCodePanelWidth] = useState<number>(440); // px
  const [consoleHeight, setConsoleHeight] = useState<number>(220);   // px

  // Resizing state
  const isDraggingHRef = useRef(false);
  const isDraggingVRef = useRef(false);

  // Refs
  const workspaceRef = useRef<BlocklyWorkspaceHandle>(null);
  const activeInterpreterRef = useRef<CInterpreter | null>(null);
  const inputResolverRef = useRef<((val: string) => void) | null>(null);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  // Handle URL share hash on initial load
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#project=')) {
        const encoded = hash.slice(9);
        const json = decodeURIComponent(atob(encoded));
        const parsed = JSON.parse(json);
        if (parsed && workspaceRef.current) {
          workspaceRef.current.loadState(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load project from URL hash', e);
    }
  }, []);

  // Whenever mobileTab switches to 'blocks', resize Blockly workspace
  useEffect(() => {
    if (mobileTab === 'blocks') {
      const timer = setTimeout(() => {
        workspaceRef.current?.resize();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [mobileTab]);

  // Handle console outputs
  const appendConsoleOutput = useCallback((text: string, isError = false) => {
    setConsoleEntries((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        type: isError ? 'error' : 'stdout',
        text,
      },
    ]);
  }, []);

  // Update lint warnings whenever code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCCode(newCode);
    if (workspaceRef.current) {
      const ws = workspaceRef.current.getWorkspace();
      const warnings = lintWorkspace(ws);
      setLintWarnings(warnings);
    }
  }, []);

  // Run execution engine (Normal or Step Debugger)
  const handleRun = async () => {
    if (!workspaceRef.current) return;
    const ws = workspaceRef.current.getWorkspace();
    if (!ws) return;

    // Reset console and memory
    setConsoleEntries([
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'system',
        text: isStepDebugger
          ? `🐞 [Starting Step-by-Step Educational Debugger - Click STEP NEXT to advance]`
          : `🚀 [Starting Visual C Execution Engine]`,
      },
    ]);

    setMemorySnapshot({ variables: {}, arrays: {} });
    setIsRunning(true);
    setIsWaitingForInput(false);
    setIsWaitingForStep(false);
    sounds.run();

    // On mobile, automatically show the console tab so user sees program output
    if (window.innerWidth < 1024) {
      setMobileTab('console');
    }

    const interpreter = new CInterpreter({
      onPrint: (text, isError) => {
        appendConsoleOutput(text, isError);
      },
      onInputPrompt: (promptText) => {
        return new Promise<string>((resolve) => {
          setIsWaitingForInput(true);
          setInputPromptText(promptText);
          inputResolverRef.current = resolve;
          // Switch to console on mobile if scanf prompt arrives
          if (window.innerWidth < 1024) {
            setMobileTab('console');
          }
        });
      },
      onHighlightBlock: (blockId) => {
        workspaceRef.current?.highlightBlock(blockId);
      },
      onMemoryUpdate: (snapshot) => {
        setMemorySnapshot(snapshot);
      },
      onStepWait: () => {
        setIsWaitingForStep(true);
      },
      isStepDebugger: isStepDebugger,
      delayMs: isStepDebugger ? 0 : 30,
      maxSteps: 100000,
    });

    activeInterpreterRef.current = interpreter;

    try {
      await interpreter.run(ws);
      sounds.success();
      setConsoleEntries((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'system',
          text: `\n✨ Process finished with exit code 0`,
        },
      ]);
    } catch (err: any) {
      appendConsoleOutput(`\n[Execution Stopped]: ${err.message || String(err)}`, true);
    } finally {
      setIsRunning(false);
      setIsWaitingForInput(false);
      setIsWaitingForStep(false);
      activeInterpreterRef.current = null;
      inputResolverRef.current = null;
      workspaceRef.current?.highlightBlock(null);
    }
  };

  // Step next block in debugger
  const handleStepNext = () => {
    if (activeInterpreterRef.current) {
      setIsWaitingForStep(false);
      sounds.snap();
      activeInterpreterRef.current.stepNext();
    }
  };

  // Stop running execution
  const handleStop = () => {
    if (activeInterpreterRef.current) {
      activeInterpreterRef.current.abort();
    }
    if (inputResolverRef.current) {
      inputResolverRef.current('0');
      inputResolverRef.current = null;
    }
    setIsRunning(false);
    setIsWaitingForInput(false);
    setIsWaitingForStep(false);
    workspaceRef.current?.highlightBlock(null);
    appendConsoleOutput('\n[Program terminated by user]', true);
  };

  // Submit input for scanf
  const handleSendInput = (val: string) => {
    setConsoleEntries((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'stdin',
        text: val,
      },
    ]);
    setIsWaitingForInput(false);
    if (inputResolverRef.current) {
      inputResolverRef.current(val);
      inputResolverRef.current = null;
    }
  };

  // Clear workspace
  const handleClearWorkspace = () => {
    if (window.confirm('Are you sure you want to clear the entire workspace?')) {
      workspaceRef.current?.clear();
      setConsoleEntries([]);
      setMemorySnapshot({ variables: {}, arrays: {} });
    }
  };

  // New program
  const handleNewProgram = () => {
    if (window.confirm('Start a new program? Current blocks will be reset.')) {
      workspaceRef.current?.clear();
      const starterState = {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'c_main',
              x: 60,
              y: 50,
              inputs: {
                STACK: {
                  block: {
                    type: 'c_print_text',
                    fields: {
                      TEXT: 'Hello, World!',
                      NEWLINE: 'TRUE',
                    },
                  },
                },
              },
            },
          ],
        },
      };
      workspaceRef.current?.loadState(starterState);
      setConsoleEntries([]);
      setMemorySnapshot({ variables: {}, arrays: {} });
    }
  };

  // Copy C code to clipboard
  const handleCopyC = async () => {
    try {
      await navigator.clipboard.writeText(cCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Share URL with state
  const handleShareUrl = async () => {
    const state = workspaceRef.current?.getState();
    if (!state) return;
    try {
      const json = JSON.stringify(state);
      const encoded = btoa(encodeURIComponent(json));
      const shareUrl = `${window.location.origin}${window.location.pathname}#project=${encoded}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2500);
    } catch (e) {
      console.error('Failed to copy share link', e);
    }
  };

  // Download .c file
  const handleDownloadC = () => {
    const blob = new Blob([cCode], { type: 'text/x-c;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.c';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Project (.vcproj JSON)
  const handleSaveProject = () => {
    const state = workspaceRef.current?.getState();
    const projectData = {
      format: 'visual-c-studio-project',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      cCode,
      blocks: state,
    };
    const json = JSON.stringify(projectData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project.vcproj';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import Project (from JSON string)
  const handleLoadProject = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data && data.blocks) {
        workspaceRef.current?.loadState(data.blocks);
      } else if (data && typeof data === 'object') {
        workspaceRef.current?.loadState(data);
      }
    } catch (err: any) {
      alert(`Invalid project file: ${err.message || 'Could not parse JSON'}`);
    }
  };

  // Load sample program
  const handleSelectSample = (sample: SampleProgram) => {
    if (workspaceRef.current && sample.blockState) {
      workspaceRef.current.loadState(sample.blockState);
      setConsoleEntries([]);
      setMemorySnapshot({ variables: {}, arrays: {} });
      // Switch back to blocks on mobile to see it
      if (window.innerWidth < 1024) {
        setMobileTab('blocks');
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) {
          handleRun();
        }
      }
      if ((e.key === 'F10' || (e.code === 'Space' && e.shiftKey)) && isRunning && isWaitingForStep) {
        e.preventDefault();
        handleStepNext();
      }
      if (e.key === 'Escape' && isRunning) {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRunning, isWaitingForStep, cCode]);

  // Horizontal divider drag
  const startDragH = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHRef.current = true;
    document.body.style.cursor = 'col-resize';

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDraggingHRef.current) return;
      const rightMargin = showLearning ? (window.innerWidth >= 768 ? 384 : 320) : 0;
      const newWidth = window.innerWidth - rightMargin - ev.clientX;
      if (newWidth > 260 && newWidth < window.innerWidth - 380) {
        setCodePanelWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      isDraggingHRef.current = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Vertical divider drag (for Console height)
  const startDragV = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVRef.current = true;
    document.body.style.cursor = 'row-resize';

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDraggingVRef.current) return;
      const newHeight = window.innerHeight - ev.clientY;
      if (newHeight >= 100 && newHeight <= window.innerHeight - 150) {
        setConsoleHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      isDraggingVRef.current = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Window width tracking for responsive split sizing
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Top Navbar */}
      <Navbar
        isRunning={isRunning}
        onRun={handleRun}
        onStop={handleStop}
        onNew={handleNewProgram}
        onClear={handleClearWorkspace}
        onUndo={() => workspaceRef.current?.undo()}
        onRedo={() => workspaceRef.current?.redo()}
        canUndo={canUndo}
        canRedo={canRedo}
        onDownloadC={handleDownloadC}
        onCopyC={handleCopyC}
        isCopied={isCopied}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
        onOpenExamples={() => setShowExamplesModal(true)}
        onOpenFlowchart={() => setShowFlowchartModal(true)}
        onOpenChallenges={() => setShowChallengesModal(true)}
        onOpenGccHelp={() => setShowGccHelp(true)}
        onShareUrl={handleShareUrl}
        isShared={isShared}
        showLearning={showLearning}
        onToggleLearning={() => setShowLearning((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        isStepDebugger={isStepDebugger}
        isWaitingForStep={isWaitingForStep}
        onToggleStepDebugger={() => setIsStepDebugger((prev) => !prev)}
        onStepNext={handleStepNext}
        lintWarningsCount={lintWarnings.length}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(sounds.toggle())}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 relative">
        {/* Left / Center Area (Workspace + Bottom Console on Desktop, or Active Tab on Mobile) */}
        <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden ${mobileTab === 'guide' && !isDesktop ? 'hidden' : 'flex'}`}>
          {/* Top Main Workspaces (Blockly + Code Viewer) */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
            {/* Blockly Canvas */}
            <div
              className={`${
                mobileTab === 'blocks' || isDesktop ? 'flex-1 flex flex-col' : 'hidden'
              } h-full min-w-0 lg:min-w-[280px] overflow-hidden relative`}
            >
              <div className="flex-1 w-full h-full relative">
                <BlocklyWorkspace
                  ref={workspaceRef}
                  isDarkMode={isDarkMode}
                  onCodeChange={handleCodeChange}
                  onSelectBlock={(blockType) => setSelectedBlockType(blockType)}
                  onUndoRedoChange={(undo, redo) => {
                    setCanUndo(undo);
                    setCanRedo(redo);
                  }}
                />

                {/* Linter notification bar (if any warnings exist) */}
                {lintWarnings.length > 0 && (
                  <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 z-10 bg-amber-950/80 backdrop-blur-md border border-amber-500/40 rounded-xl p-2 sm:p-2.5 shadow-xl text-xs text-amber-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-bold text-amber-300 shrink-0">💡 Tip:</span>
                      <span className="truncate">{lintWarnings[0].message}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-900/50 shrink-0 ml-2">
                      {lintWarnings.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Resizable Horizontal Separator (Desktop Only) */}
            <div
              onMouseDown={startDragH}
              className="hidden lg:block w-1.5 hover:w-2 bg-slate-800 hover:bg-blue-500 cursor-col-resize transition-colors duration-150 z-10 shrink-0"
              title="Drag to resize code viewer panel"
            />

            {/* Monaco Code Viewer */}
            <div
              className={`${
                mobileTab === 'code' || isDesktop ? 'flex-1 lg:flex-none' : 'hidden'
              } h-full shrink-0 overflow-hidden w-full`}
              style={isDesktop ? { width: `${codePanelWidth}px` } : undefined}
            >
              <CodeViewer
                code={cCode}
                isDarkMode={isDarkMode}
                onCopy={handleCopyC}
                isCopied={isCopied}
                onDownload={handleDownloadC}
              />
            </div>
          </div>

          {/* Resizable Vertical Separator for Console / Memory (Desktop Only) */}
          <div
            onMouseDown={startDragV}
            className="hidden lg:block h-1.5 hover:h-2 bg-slate-800 hover:bg-blue-500 cursor-row-resize transition-colors duration-150 z-10 shrink-0"
            title="Drag to resize execution console / memory watch"
          />

          {/* Bottom Execution Console & Live Memory Inspector */}
          <div
            className={`${
              mobileTab === 'console' || isDesktop ? 'flex-1 lg:flex-none' : 'hidden'
            } w-full shrink-0 overflow-hidden`}
            style={isDesktop ? { height: `${consoleHeight}px` } : undefined}
          >
            <Console
              entries={consoleEntries}
              isRunning={isRunning}
              isWaitingForInput={isWaitingForInput}
              inputPromptText={inputPromptText}
              onSendInput={handleSendInput}
              onClear={() => setConsoleEntries([])}
              onStop={handleStop}
              memory={memorySnapshot}
            />
          </div>
        </div>

        {/* Learning Guide & Flowchart Panel */}
        <div
          className={`${
            mobileTab === 'guide' || (isDesktop && showLearning)
              ? 'flex-1 lg:flex-none w-full lg:w-auto h-full block'
              : 'hidden'
          } shrink-0 overflow-hidden`}
        >
          <LearningPanel
            selectedBlockType={selectedBlockType}
            onClose={() => {
              setShowLearning(false);
              if (!isDesktop) setMobileTab('blocks');
            }}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (lg:hidden) */}
      <nav className="h-14 bg-slate-900 border-t border-slate-800 flex lg:hidden items-center justify-around px-2 shrink-0 z-20 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={() => setMobileTab('blocks')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition ${
            mobileTab === 'blocks'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Blocks className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Blocks</span>
        </button>

        <button
          onClick={() => setMobileTab('code')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition ${
            mobileTab === 'code'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">C Code</span>
        </button>

        <button
          onClick={() => setMobileTab('console')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition relative ${
            mobileTab === 'console'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Terminal className="w-5 h-5 mb-0.5" />
            {isRunning && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <span className="text-[10px] flex items-center gap-1">
            <span>Terminal</span>
            {consoleEntries.length > 0 && (
              <span className="px-1 py-0.2 rounded-full bg-slate-800 text-[9px] text-slate-300">
                {consoleEntries.length}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setMobileTab('guide')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition ${
            mobileTab === 'guide'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Guide</span>
        </button>
      </nav>

      {/* Examples Gallery Modal */}
      <ExamplesModal
        isOpen={showExamplesModal}
        onClose={() => setShowExamplesModal(false)}
        onSelectSample={handleSelectSample}
      />

      {/* Full Program Flowchart Modal */}
      <FlowchartModal
        isOpen={showFlowchartModal}
        onClose={() => setShowFlowchartModal(false)}
        workspace={workspaceRef.current?.getWorkspace() ?? null}
      />

      {/* Coding Challenges Modal */}
      <ChallengesModal
        isOpen={showChallengesModal}
        onClose={() => setShowChallengesModal(false)}
        workspace={workspaceRef.current?.getWorkspace() ?? null}
      />

      {/* GCC Compilation Cheat Sheet Modal */}
      <GccHelpModal
        isOpen={showGccHelp}
        onClose={() => setShowGccHelp(false)}
      />
    </div>
  );
};
