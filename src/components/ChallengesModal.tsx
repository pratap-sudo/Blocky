import React, { useState } from 'react';
import * as Blockly from 'blockly';
import { CODING_CHALLENGES, Challenge } from '../data/challenges';
import { CInterpreter } from '../interpreter/cInterpreter';
import { triggerConfetti } from '../utils/confetti';
import {
  X,
  Trophy,
  CheckCircle2,
  XCircle,
  Play,
  Lightbulb,
  Award,
  ChevronRight,
} from 'lucide-react';

interface ChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Blockly.WorkspaceSvg | null;
}

export const ChallengesModal: React.FC<ChallengesModalProps> = ({
  isOpen,
  onClose,
  workspace,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CODING_CHALLENGES[0]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }> | null>(
    null
  );
  const [isGrading, setIsGrading] = useState<boolean>(false);

  // Load completed challenge IDs from localStorage
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('visual_c_challenges_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const handleRunTests = async () => {
    if (!workspace) return;
    setIsGrading(true);
    setTestResults(null);

    const results: Array<{ passed: boolean; message: string }> = [];
    let allPassed = true;

    for (const [idx, tc] of selectedChallenge.testCases.entries()) {
      let outputAcc = '';

      const testInterpreter = new CInterpreter({
        onPrint: (text) => {
          outputAcc += text;
        },
        onInputPrompt: () => Promise.resolve('0'),
        testInputs: [...tc.inputs],
        delayMs: 0,
        maxSteps: 50000,
      });

      try {
        await testInterpreter.run(workspace);
        const passed = outputAcc.toLowerCase().includes(tc.expectedOutputSubstring.toLowerCase());
        if (passed) {
          results.push({
            passed: true,
            message: `Test Case ${idx + 1}: Passed! (${tc.description})`,
          });
        } else {
          allPassed = false;
          results.push({
            passed: false,
            message: `Test Case ${idx + 1}: Failed. Expected to find "${tc.expectedOutputSubstring}", but got: "${outputAcc.trim() || '(no output)'}"`,
          });
        }
      } catch (err: any) {
        allPassed = false;
        results.push({
          passed: false,
          message: `Test Case ${idx + 1} Error: ${err.message}`,
        });
      }
    }

    setTestResults(results);
    setIsGrading(false);

    if (allPassed) {
      triggerConfetti();
      if (!completedIds.includes(selectedChallenge.id)) {
        const nextCompleted = [...completedIds, selectedChallenge.id];
        setCompletedIds(nextCompleted);
        localStorage.setItem('visual_c_challenges_completed', JSON.stringify(nextCompleted));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 px-3 sm:px-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Challenges & Auto-Grader</span>
                <span className="text-[10px] font-semibold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {completedIds.length} / {CODING_CHALLENGES.length}
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Challenges List Sidebar */}
          <div className="w-full md:w-72 max-h-36 md:max-h-none bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 overflow-y-auto p-2 sm:p-3 space-y-1.5 shrink-0">
            {CODING_CHALLENGES.map((ch) => {
              const isCompleted = completedIds.includes(ch.id);
              const isSelected = selectedChallenge.id === ch.id;

              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setShowHint(false);
                    setTestResults(null);
                  }}
                  className={`w-full p-2 sm:p-2.5 rounded-xl text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {isCompleted ? (
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-400'}`}
                      />
                    ) : (
                      <Award
                        className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`}
                      />
                    )}
                    <span className="text-xs font-semibold truncate">{ch.title}</span>
                  </div>

                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ml-1 ${
                      ch.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : ch.difficulty === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Challenge Details & Test Runner */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedChallenge.title}</h3>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {selectedChallenge.description}
                  </p>
                </div>

                {completedIds.includes(selectedChallenge.id) && (
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed!</span>
                  </div>
                )}
              </div>

              {/* Hints Box */}
              <div>
                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="flex items-center space-x-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hints' : 'Need a hint?'}</span>
                </button>

                {showHint && (
                  <div className="mt-2 p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200/90 space-y-1">
                    {selectedChallenge.hints.map((hint, i) => (
                      <p key={i} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{hint}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Test Results Output */}
              {testResults && (
                <div className="space-y-2 mt-4">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Test Results:
                  </span>
                  {testResults.map((res, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border text-xs flex items-center space-x-2 font-mono ${
                        res.passed
                          ? 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-900/40 text-rose-300'
                      }`}
                    >
                      {res.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span>{res.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Run Action Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Uses the visual blocks currently in your workspace.
              </span>

              <button
                onClick={handleRunTests}
                disabled={isGrading}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isGrading ? 'Testing Program...' : 'Test & Grade My Program'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
