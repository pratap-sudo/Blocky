import React, { useState, useMemo, useRef } from 'react';
import * as Blockly from 'blockly';
import { X, ZoomIn, ZoomOut, Download, GitFork, RotateCcw } from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'io' | 'end';
  label: string;
  subLabel?: string;
  branch?: 'true' | 'false' | 'loop';
}

interface FlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Blockly.WorkspaceSvg | null;
}

export const FlowchartModal: React.FC<FlowchartModalProps> = ({ isOpen, onClose, workspace }) => {
  const [zoom, setZoom] = useState<number>(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Traverse Blockly workspace and generate linear/branching flowchart nodes
  const nodes = useMemo(() => {
    if (!workspace) return [];

    const result: FlowNode[] = [];
    result.push({
      id: 'start',
      type: 'start',
      label: '🏁 Start (main)',
    });

    const topBlocks = workspace.getTopBlocks(true);
    let startBlock: Blockly.Block | null = null;
    for (const b of topBlocks) {
      if (b.type === 'c_main') {
        startBlock = b;
        break;
      }
    }

    const traverse = (current: Blockly.Block | null) => {
      let b = current;
      while (b) {
        switch (b.type) {
          case 'c_print_text': {
            const txt = b.getFieldValue('TEXT') || '';
            result.push({
              id: b.id,
              type: 'io',
              label: `Output text`,
              subLabel: `"${txt.slice(0, 24)}${txt.length > 24 ? '...' : ''}"`,
            });
            break;
          }
          case 'c_print_value': {
            result.push({
              id: b.id,
              type: 'io',
              label: `Output Value`,
              subLabel: `printf(value)`,
            });
            break;
          }
          case 'c_print_formatted': {
            const fmt = b.getFieldValue('FORMAT') || '%d';
            result.push({
              id: b.id,
              type: 'io',
              label: `Formatted Printf`,
              subLabel: `"${fmt}"`,
            });
            break;
          }
          case 'c_scanf': {
            const varName = b.getFieldValue('VAR') || 'x';
            result.push({
              id: b.id,
              type: 'io',
              label: `Input (scanf)`,
              subLabel: `Read into &${varName}`,
            });
            break;
          }
          case 'c_var_declare': {
            const type = b.getFieldValue('TYPE') || 'int';
            const varName = b.getFieldValue('VAR') || 'x';
            result.push({
              id: b.id,
              type: 'process',
              label: `Declare Variable`,
              subLabel: `${type} ${varName}`,
            });
            break;
          }
          case 'c_var_assign': {
            const varName = b.getFieldValue('VAR') || 'x';
            result.push({
              id: b.id,
              type: 'process',
              label: `Assign Variable`,
              subLabel: `${varName} = ...`,
            });
            break;
          }
          case 'c_inc_dec': {
            const varName = b.getFieldValue('VAR') || 'i';
            const op = b.getFieldValue('OP') === 'INC' ? '++' : '--';
            result.push({
              id: b.id,
              type: 'process',
              label: `Step Counter`,
              subLabel: `${varName}${op}`,
            });
            break;
          }
          case 'c_if':
          case 'c_if_else': {
            result.push({
              id: b.id,
              type: 'decision',
              label: `If Condition`,
              subLabel: `Evaluate condition`,
            });
            const doBranch = b.getInputTargetBlock('DO');
            if (doBranch) traverse(doBranch);
            const elseBranch = b.getInputTargetBlock('ELSE');
            if (elseBranch) traverse(elseBranch);
            break;
          }
          case 'c_for_loop': {
            const varName = b.getFieldValue('VAR') || 'i';
            const start = b.getFieldValue('START');
            const end = b.getFieldValue('END');
            result.push({
              id: b.id,
              type: 'decision',
              label: `For Loop`,
              subLabel: `${varName} from ${start} to ${end}`,
            });
            const loopDo = b.getInputTargetBlock('DO');
            if (loopDo) traverse(loopDo);
            break;
          }
          case 'c_while_loop': {
            result.push({
              id: b.id,
              type: 'decision',
              label: `While Loop`,
              subLabel: `Loop while true`,
            });
            const loopDo = b.getInputTargetBlock('DO');
            if (loopDo) traverse(loopDo);
            break;
          }
          case 'c_array_declare': {
            const varName = b.getFieldValue('VAR') || 'arr';
            result.push({
              id: b.id,
              type: 'process',
              label: `Array Declaration`,
              subLabel: `${varName}[] in memory`,
            });
            break;
          }
          case 'c_array_set': {
            const varName = b.getFieldValue('VAR') || 'arr';
            result.push({
              id: b.id,
              type: 'process',
              label: `Set Array Element`,
              subLabel: `${varName}[i] = value`,
            });
            break;
          }
          default:
            break;
        }
        b = b.getNextBlock();
      }
    };

    if (startBlock && startBlock.type === 'c_main') {
      const first = startBlock.getInputTargetBlock('STACK');
      if (first) traverse(first);
    } else {
      for (const b of topBlocks) {
        traverse(b);
      }
    }

    result.push({
      id: 'end',
      type: 'end',
      label: '🏁 Return 0 (End)',
    });

    return result;
  }, [workspace, isOpen]);

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'program-flowchart.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 px-3 sm:px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <span>Flowchart</span>
                <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                  {nodes.length}
                </span>
              </h2>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
              className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
              className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition hidden sm:block"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadSVG}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              title="Download as SVG Image"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save SVG</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagram Area */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-950/70">
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150 flex flex-col items-center space-y-4 py-4"
          >
            <svg
              ref={svgRef}
              width="360"
              height={nodes.length * 85 + 40}
              className="overflow-visible font-mono select-none"
            >
              <defs>
                <marker
                  id="flow-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
              </defs>

              {nodes.map((node, index) => {
                const y = index * 85 + 20;
                const nextY = (index + 1) * 85 + 20;

                return (
                  <g key={node.id}>
                    {/* Connecting line to next node */}
                    {index < nodes.length - 1 && (
                      <line
                        x1="180"
                        y1={y + 36}
                        x2="180"
                        y2={nextY}
                        stroke="#475569"
                        strokeWidth="2"
                        markerEnd="url(#flow-arrow)"
                      />
                    )}

                    {/* Node Shape */}
                    {node.type === 'start' || node.type === 'end' ? (
                      <rect
                        x="70"
                        y={y}
                        width="220"
                        height="36"
                        rx="18"
                        fill="#065f46"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    ) : node.type === 'decision' ? (
                      <polygon
                        points={`180,${y} 280,${y + 18} 180,${y + 36} 80,${y + 18}`}
                        fill="#881337"
                        stroke="#f43f5e"
                        strokeWidth="2"
                      />
                    ) : node.type === 'io' ? (
                      <polygon
                        points={`90,${y} 290,${y} 270,${y + 36} 70,${y + 36}`}
                        fill="#075985"
                        stroke="#38bdf8"
                        strokeWidth="2"
                      />
                    ) : (
                      <rect
                        x="70"
                        y={y}
                        width="220"
                        height="36"
                        rx="6"
                        fill="#1e293b"
                        stroke="#475569"
                        strokeWidth="2"
                      />
                    )}

                    {/* Node Text Label */}
                    <text
                      x="180"
                      y={y + 16}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                    {node.subLabel && (
                      <text
                        x="180"
                        y={y + 28}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                      >
                        {node.subLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
