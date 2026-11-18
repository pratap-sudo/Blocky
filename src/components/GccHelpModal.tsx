import React from 'react';
import { X, Terminal, Copy, Check, Info } from 'lucide-react';

interface GccHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GccHelpModal: React.FC<GccHelpModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 px-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">How to Compile C Code with GCC</h2>
              <p className="text-[11px] text-slate-400">
                Run your downloaded .c files locally in any terminal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono select-text">
          {/* Quick command */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold font-sans flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Standard Compilation Command</span>
              </span>
              <button
                onClick={() => copy('gcc -Wall -O2 main.c -o program && ./program', 'std')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                {copiedCmd === 'std' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'std' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-900 rounded-lg text-emerald-400 overflow-x-auto border border-slate-800">
              gcc -Wall -O2 main.c -o program && ./program
            </pre>
          </div>

          {/* OS-specific instructions */}
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white mb-1">🪟 Windows (CMD / PowerShell)</h4>
              <p className="text-slate-400 text-xs mb-2">
                Install MinGW or GCC via MSYS2 / w64devkit, then compile and run:
              </p>
              <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-sky-300">
                gcc main.c -o program.exe<br/>
                .\program.exe
              </pre>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white mb-1">🍎 macOS (Terminal)</h4>
              <p className="text-slate-400 text-xs mb-2">
                Uses the Apple Clang compiler pre-installed via Xcode Command Line Tools:
              </p>
              <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-sky-300">
                clang main.c -o program<br/>
                ./program
              </pre>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white mb-1">🐧 Linux (Ubuntu, Debian, Fedora, Arch)</h4>
              <p className="text-slate-400 text-xs mb-2">
                Ensure build-essential is installed (`sudo apt install build-essential`):
              </p>
              <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-sky-300">
                gcc main.c -lm -o program<br/>
                ./program
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
