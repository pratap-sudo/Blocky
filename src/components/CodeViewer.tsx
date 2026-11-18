import React from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Download, Check, Code2, Terminal } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  isDarkMode: boolean;
  onCopy: () => void;
  isCopied: boolean;
  onDownload: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  isDarkMode,
  onCopy,
  isCopied,
  onDownload,
}) => {
  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800">
      {/* Editor Header Bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800 text-blue-400 text-xs font-mono font-medium">
            <Code2 className="w-3.5 h-3.5" />
            <span>main.c</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {lineCount} lines • {charCount} chars
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition"
            title="Copy C source code"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition"
            title="Download main.c file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full min-h-0">
        <Editor
          height="100%"
          language="c"
          theme={isDarkMode ? 'vs-dark' : 'light'}
          value={code}
          options={{
            readOnly: true,
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            renderWhitespace: 'selection',
            lineNumbers: 'on',
            folding: true,
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-mono">
              Loading C Editor...
            </div>
          }
        />
      </div>

      {/* Footer Info Notice */}
      <div className="h-6 bg-slate-900/90 border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-emerald-400" />
          <span>Real C Code (ISO C99 / C11)</span>
        </span>
        <span className="text-slate-500 hidden sm:inline">Auto-generated from visual blocks</span>
      </div>
    </div>
  );
};
