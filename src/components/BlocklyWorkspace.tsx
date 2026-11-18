import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as Blockly from 'blockly';
import { registerCBlocks } from '../blocks/cBlocks';
import { TOOLBOX_DEFINITION } from '../blocks/toolbox';
import { generateCCode } from '../generator/cGenerator';

// Register blocks once globally
registerCBlocks();

// Dark Theme Definition
const darkTheme = Blockly.Theme.defineTheme('customDark', {
  name: 'customDark',
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: '#090d16',
    toolboxBackgroundColour: '#0f172a',
    toolboxForegroundColour: '#e2e8f0',
    flyoutBackgroundColour: '#0b1120',
    flyoutForegroundColour: '#cbd5e1',
    flyoutOpacity: 0.95,
    scrollbarColour: '#334155',
    scrollbarOpacity: 0.6,
    insertionMarkerColour: '#38bdf8',
    insertionMarkerOpacity: 0.5,
    cursorColour: '#60a5fa',
  },
  fontStyle: {
    family: 'Inter, sans-serif',
    weight: 'bold',
    size: 12,
  },
});

// Light Theme Definition
const lightTheme = Blockly.Theme.defineTheme('customLight', {
  name: 'customLight',
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: '#f8fafc',
    toolboxBackgroundColour: '#f1f5f9',
    toolboxForegroundColour: '#0f172a',
    flyoutBackgroundColour: '#ffffff',
    flyoutForegroundColour: '#1e293b',
    flyoutOpacity: 0.95,
    scrollbarColour: '#cbd5e1',
    scrollbarOpacity: 0.6,
    insertionMarkerColour: '#0284c7',
    insertionMarkerOpacity: 0.5,
    cursorColour: '#2563eb',
  },
  fontStyle: {
    family: 'Inter, sans-serif',
    weight: 'bold',
    size: 12,
  },
});

export interface BlocklyWorkspaceHandle {
  getWorkspace: () => Blockly.WorkspaceSvg | null;
  resize: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
  loadState: (state: any) => void;
  getState: () => any;
  highlightBlock: (blockId: string | null) => void;
  generateCode: () => string;
}

interface BlocklyWorkspaceProps {
  isDarkMode: boolean;
  onCodeChange: (code: string) => void;
  onSelectBlock: (blockType: string | null) => void;
  onUndoRedoChange: (canUndo: boolean, canRedo: boolean) => void;
}

export const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle, BlocklyWorkspaceProps>(
  ({ isDarkMode, onCodeChange, onSelectBlock, onUndoRedoChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    useImperativeHandle(ref, () => ({
      getWorkspace: () => workspaceRef.current,
      resize: () => {
        if (workspaceRef.current) {
          Blockly.svgResize(workspaceRef.current);
        }
      },
      undo: () => {
        workspaceRef.current?.undo(false);
      },
      redo: () => {
        workspaceRef.current?.undo(true);
      },
      canUndo: () => {
        if (!workspaceRef.current) return false;
        return workspaceRef.current.getUndoStack().length > 0;
      },
      canRedo: () => {
        if (!workspaceRef.current) return false;
        return workspaceRef.current.getRedoStack().length > 0;
      },
      clear: () => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
          const code = generateCCode(workspaceRef.current);
          onCodeChange(code);
        }
      },
      loadState: (state: any) => {
        if (workspaceRef.current && state) {
          try {
            Blockly.serialization.workspaces.load(state, workspaceRef.current);
            const code = generateCCode(workspaceRef.current);
            onCodeChange(code);
          } catch (e) {
            console.error('Failed to load workspace state', e);
          }
        }
      },
      getState: () => {
        if (!workspaceRef.current) return null;
        return Blockly.serialization.workspaces.save(workspaceRef.current);
      },
      highlightBlock: (blockId: string | null) => {
        if (!workspaceRef.current) return;
        workspaceRef.current.highlightBlock(blockId);
      },
      generateCode: () => {
        if (!workspaceRef.current) return '';
        return generateCCode(workspaceRef.current);
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const workspace = Blockly.inject(containerRef.current, {
        toolbox: TOOLBOX_DEFINITION,
        theme: isDarkMode ? darkTheme : lightTheme,
        renderer: 'zelos', // Smooth Scratch-like aesthetic
        grid: {
          spacing: 24,
          length: 4,
          colour: isDarkMode ? '#1e293b' : '#e2e8f0',
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.92,
          maxScale: 2.2,
          minScale: 0.35,
          scaleSpeed: 1.15,
          pinch: true,
        },
        move: {
          scrollbars: {
            horizontal: true,
            vertical: true,
          },
          drag: true,
          wheel: false,
        },
        trashcan: true,
        sounds: true,
      });

      workspaceRef.current = workspace;

      // Restore saved session from localStorage or load default starter program
      const saved = localStorage.getItem('visual_c_studio_project');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.blocks) {
            Blockly.serialization.workspaces.load(parsed, workspace);
          }
        } catch (e) {
          console.warn('Could not restore saved workspace state, using default', e);
        }
      }

      // If workspace is still empty after restore attempt, load starter program
      if (workspace.getAllBlocks(false).length === 0) {
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
                        TEXT: 'Hello from Visual C Programming Studio!',
                        NEWLINE: 'TRUE',
                      },
                    },
                  },
                },
              },
            ],
          },
        };
        Blockly.serialization.workspaces.load(starterState, workspace);
      }

      // Initial code generation
      const initialCode = generateCCode(workspace);
      onCodeChange(initialCode);

      // Event listener for workspace changes
      const changeListener = (e: Blockly.Events.Abstract) => {
        if (!workspace) return;

        // Block selection listener
        if (e.type === Blockly.Events.SELECTED) {
          const selectedEvent = e as Blockly.Events.Selected;
          if (selectedEvent.newElementId) {
            const block = workspace.getBlockById(selectedEvent.newElementId);
            onSelectBlock(block ? block.type : null);
          } else {
            onSelectBlock(null);
          }
        }

        // Only react to code-altering events
        if (
          e.isUiEvent ||
          e.type === Blockly.Events.VIEWPORT_CHANGE ||
          e.type === Blockly.Events.SELECTED
        ) {
          return;
        }

        const updatedCode = generateCCode(workspace);
        onCodeChange(updatedCode);

        // Update undo/redo availability
        onUndoRedoChange(
          workspace.getUndoStack().length > 0,
          workspace.getRedoStack().length > 0
        );

        // Auto-save to localStorage
        try {
          const state = Blockly.serialization.workspaces.save(workspace);
          localStorage.setItem('visual_c_studio_project', JSON.stringify(state));
        } catch (err) {
          // ignore localStorage quota errors
        }
      };

      workspace.addChangeListener(changeListener);

      // Resize observer to keep SVG responsive
      const resizeObserver = new ResizeObserver(() => {
        Blockly.svgResize(workspace);
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
        workspace.dispose();
        workspaceRef.current = null;
      };
    }, []);

    // Theme update effect
    useEffect(() => {
      if (!workspaceRef.current) return;
      workspaceRef.current.setTheme(isDarkMode ? darkTheme : lightTheme);
    }, [isDarkMode]);

    return (
      <div className="relative w-full h-full overflow-hidden select-none">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    );
  }
);
