import * as Blockly from 'blockly';

export interface VariableRecord {
  type: string;
  value: any;
  address: string;
  size: number;
  pointsTo?: string; // target variable name if this is a pointer!
}

export interface ArrayRecord {
  type: 'int' | 'float' | 'char';
  values: any[];
  baseAddress: string;
  elementSize: number;
}

export interface MemorySnapshot {
  variables: Record<string, VariableRecord>;
  arrays: Record<string, ArrayRecord>;
  lastModifiedVar?: string;
  lastAccessedArray?: { name: string; index: number; op: 'read' | 'write' };
}

export interface ExecutionOptions {
  onPrint: (text: string, isError?: boolean) => void;
  onInputPrompt: (prompt: string, type: string) => Promise<string>;
  onHighlightBlock?: (blockId: string | null) => void;
  onMemoryUpdate?: (snapshot: MemorySnapshot) => void;
  onStepWait?: (blockId: string) => void;
  maxSteps?: number;
  delayMs?: number;
  isStepDebugger?: boolean;
  testInputs?: string[];
}

type FlowSignal = { flow: 'break' } | { flow: 'continue' } | null;

export class CInterpreter {
  private variables = new Map<string, VariableRecord>();
  private arrays = new Map<string, ArrayRecord>();
  private stepCount = 0;
  private isAborted = false;
  private options: ExecutionOptions;

  // Memory address simulation
  private nextVarAddress = 0x7ffe1000;
  private nextArrayAddress = 0x7ffe2000;

  // Stepping debugger resolver
  private stepNextResolver: (() => void) | null = null;
  private isWaitingForNextStep = false;
  private testInputIndex = 0;

  constructor(options: ExecutionOptions) {
    this.options = options;
  }

  public abort() {
    this.isAborted = true;
    if (this.stepNextResolver) {
      this.stepNextResolver();
      this.stepNextResolver = null;
    }
  }

  public stepNext() {
    if (this.stepNextResolver) {
      const resolver = this.stepNextResolver;
      this.stepNextResolver = null;
      this.isWaitingForNextStep = false;
      resolver();
    }
  }

  public getIsWaitingForStep(): boolean {
    return this.isWaitingForNextStep;
  }

  private emitMemoryUpdate(
    lastModifiedVar?: string,
    lastAccessedArray?: { name: string; index: number; op: 'read' | 'write' }
  ) {
    if (!this.options.onMemoryUpdate) return;

    const varsObj: Record<string, VariableRecord> = {};
    for (const [k, v] of this.variables.entries()) {
      varsObj[k] = { ...v };
    }

    const arraysObj: Record<string, ArrayRecord> = {};
    for (const [k, v] of this.arrays.entries()) {
      arraysObj[k] = { ...v, values: [...v.values] };
    }

    this.options.onMemoryUpdate({
      variables: varsObj,
      arrays: arraysObj,
      lastModifiedVar,
      lastAccessedArray,
    });
  }

  public async run(workspace: Blockly.Workspace) {
    this.variables.clear();
    this.arrays.clear();
    this.stepCount = 0;
    this.isAborted = false;
    this.nextVarAddress = 0x7ffe1000;
    this.nextArrayAddress = 0x7ffe2000;
    this.testInputIndex = 0;
    this.emitMemoryUpdate();

    const maxSteps = this.options.maxSteps ?? 100000;

    try {
      const topBlocks = workspace.getTopBlocks(true);
      if (topBlocks.length === 0) {
        this.options.onPrint('⚠️ Workspace is empty! Drag blocks from the toolbox to run.', true);
        return;
      }

      // Find main block, or start with first top-level block
      let startBlock: Blockly.Block | null = null;
      for (const block of topBlocks) {
        if (block.type === 'c_main') {
          startBlock = block;
          break;
        }
      }

      if (startBlock && startBlock.type === 'c_main') {
        const firstStatement = startBlock.getInputTargetBlock('STACK');
        if (firstStatement) {
          await this.executeStatementChain(firstStatement, maxSteps);
        }
      } else {
        // Execute all top-level statements in sequence
        for (const block of topBlocks) {
          if (this.isAborted) break;
          await this.executeStatementChain(block, maxSteps);
        }
      }

      if (!this.isAborted) {
        this.options.onHighlightBlock?.(null);
      }
    } catch (err: any) {
      if (this.isAborted) {
        this.options.onPrint('\n[Program execution stopped by user]', true);
      } else {
        this.options.onPrint(`\n[Execution Error]: ${err.message || String(err)}`, true);
      }
    } finally {
      this.options.onHighlightBlock?.(null);
    }
  }

  private async stepDelay(blockId: string) {
    // If Step Debugger mode is active, pause until user clicks "Step Next"
    if (this.options.isStepDebugger) {
      this.isWaitingForNextStep = true;
      this.options.onStepWait?.(blockId);
      await new Promise<void>((resolve) => {
        this.stepNextResolver = resolve;
      });
      return;
    }

    // Normal or slow-motion delay
    if (this.options.delayMs && this.options.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.options.delayMs));
    }
  }

  private checkAborted(maxSteps: number) {
    if (this.isAborted) {
      throw new Error('Execution stopped by user.');
    }
    this.stepCount++;
    if (this.stepCount > maxSteps) {
      throw new Error(
        `Execution limit of ${maxSteps.toLocaleString()} steps reached! Possible infinite loop detected. Loop halted.`
      );
    }
  }

  private async executeStatementChain(block: Blockly.Block | null, maxSteps: number): Promise<FlowSignal> {
    let current: Blockly.Block | null = block;

    while (current && !this.isAborted) {
      this.checkAborted(maxSteps);

      this.options.onHighlightBlock?.(current.id);
      await this.stepDelay(current.id);

      const signal = await this.executeSingleStatement(current, maxSteps);
      if (signal) {
        return signal; // break or continue
      }

      current = current.getNextBlock();
    }

    return null;
  }

  private async executeSingleStatement(block: Blockly.Block, maxSteps: number): Promise<FlowSignal> {
    switch (block.type) {
      case 'c_comment':
        return null;

      case 'c_print_text': {
        const text = block.getFieldValue('TEXT') || '';
        const newline = block.getFieldValue('NEWLINE') === 'TRUE';
        this.options.onPrint(text + (newline ? '\n' : ''));
        return null;
      }

      case 'c_print_value': {
        const val = await this.evaluateValue(block, 'VALUE');
        const newline = block.getFieldValue('NEWLINE') === 'TRUE';
        this.options.onPrint(String(val) + (newline ? '\n' : ''));
        return null;
      }

      case 'c_print_formatted': {
        const format = block.getFieldValue('FORMAT') || '%d';
        const arg = await this.evaluateValue(block, 'ARG');
        const newline = block.getFieldValue('NEWLINE') === 'TRUE';

        let formatted = format;
        if (formatted.includes('%d') || formatted.includes('%i')) {
          formatted = formatted.replace(/%[di]/, String(Math.trunc(Number(arg))));
        } else if (formatted.includes('%f') || formatted.includes('%lf')) {
          const num = Number(arg);
          formatted = formatted.replace(/%(?:lf|f)/, num.toFixed(4));
        } else if (formatted.includes('%c') || formatted.includes('%s')) {
          formatted = formatted.replace(/%[cs]/, String(arg));
        } else {
          formatted = `${formatted} ${arg}`;
        }

        this.options.onPrint(formatted + (newline ? '\n' : ''));
        return null;
      }

      case 'c_print_newline': {
        this.options.onPrint('\n');
        return null;
      }

      case 'c_scanf': {
        const type = (block.getFieldValue('TYPE') || 'int') as 'int' | 'float' | 'double' | 'char';
        const varName = block.getFieldValue('VAR') || 'x';
        const prompt = block.getFieldValue('PROMPT') || '';

        let rawInput = '';
        if (this.options.testInputs && this.testInputIndex < this.options.testInputs.length) {
          // Automated challenge test input
          rawInput = this.options.testInputs[this.testInputIndex++];
          if (prompt) this.options.onPrint(prompt);
          this.options.onPrint(`${rawInput}\n`);
        } else {
          // User interactive console input
          if (prompt) {
            this.options.onPrint(prompt);
          }
          rawInput = await this.options.onInputPrompt(prompt, type);
        }

        let parsedVal: any = 0;
        if (type === 'int') {
          parsedVal = parseInt(rawInput, 10);
          if (isNaN(parsedVal)) parsedVal = 0;
        } else if (type === 'float' || type === 'double') {
          parsedVal = parseFloat(rawInput);
          if (isNaN(parsedVal)) parsedVal = 0.0;
        } else if (type === 'char') {
          parsedVal = rawInput.length > 0 ? rawInput[0] : ' ';
        }

        const size = type === 'char' ? 1 : type === 'double' ? 8 : 4;
        const address =
          this.variables.get(varName)?.address ||
          '0x' + (this.nextVarAddress += size).toString(16);

        this.variables.set(varName, { type, value: parsedVal, address, size });
        this.emitMemoryUpdate(varName);
        return null;
      }

      case 'c_var_declare': {
        const type = (block.getFieldValue('TYPE') || 'int') as 'int' | 'float' | 'double' | 'char';
        const varName = block.getFieldValue('VAR') || 'x';
        let val = await this.evaluateValue(block, 'VALUE');

        if (val === undefined || val === null) {
          val = type === 'char' ? '' : 0;
        } else if (type === 'int') {
          val = Math.trunc(Number(val));
        } else if (type === 'float' || type === 'double') {
          val = Number(val);
        } else if (type === 'char') {
          val = String(val)[0] || '';
        }

        const size = type === 'char' ? 1 : type === 'double' ? 8 : 4;
        const address = '0x' + (this.nextVarAddress += size).toString(16);

        this.variables.set(varName, { type, value: val, address, size });
        this.emitMemoryUpdate(varName);
        return null;
      }

      case 'c_var_assign': {
        const varName = block.getFieldValue('VAR') || 'x';
        let val = await this.evaluateValue(block, 'VALUE');
        const existing = this.variables.get(varName);

        if (existing) {
          if (existing.type === 'int') {
            existing.value = Math.trunc(Number(val));
          } else if (existing.type === 'float' || existing.type === 'double') {
            existing.value = Number(val);
          } else if (existing.type === 'char') {
            existing.value = String(val)[0] || '';
          }
        } else {
          const type = typeof val === 'number' ? 'int' : 'char';
          const size = type === 'char' ? 1 : 4;
          const address = '0x' + (this.nextVarAddress += size).toString(16);

          this.variables.set(varName, {
            type,
            value: typeof val === 'number' ? Math.trunc(val) : String(val),
            address,
            size,
          });
        }
        this.emitMemoryUpdate(varName);
        return null;
      }

      case 'c_inc_dec': {
        const varName = block.getFieldValue('VAR') || 'i';
        const op = block.getFieldValue('OP');
        const existing = this.variables.get(varName);
        const curVal = existing ? Number(existing.value) : 0;
        const nextVal = op === 'INC' ? curVal + 1 : curVal - 1;

        if (existing) {
          existing.value = nextVal;
        } else {
          const address = '0x' + (this.nextVarAddress += 4).toString(16);
          this.variables.set(varName, { type: 'int', value: nextVal, address, size: 4 });
        }
        this.emitMemoryUpdate(varName);
        return null;
      }

      case 'c_if': {
        const condition = await this.evaluateValue(block, 'CONDITION');
        if (Boolean(condition)) {
          const doBranch = block.getInputTargetBlock('DO');
          if (doBranch) {
            const signal = await this.executeStatementChain(doBranch, maxSteps);
            if (signal) return signal;
          }
        }
        return null;
      }

      case 'c_if_else': {
        const condition = await this.evaluateValue(block, 'CONDITION');
        if (Boolean(condition)) {
          const doBranch = block.getInputTargetBlock('DO');
          if (doBranch) {
            const signal = await this.executeStatementChain(doBranch, maxSteps);
            if (signal) return signal;
          }
        } else {
          const elseBranch = block.getInputTargetBlock('ELSE');
          if (elseBranch) {
            const signal = await this.executeStatementChain(elseBranch, maxSteps);
            if (signal) return signal;
          }
        }
        return null;
      }

      case 'c_if_elseif_else': {
        const cond1 = await this.evaluateValue(block, 'COND1');
        if (Boolean(cond1)) {
          const do1 = block.getInputTargetBlock('DO1');
          if (do1) {
            const signal = await this.executeStatementChain(do1, maxSteps);
            if (signal) return signal;
          }
        } else {
          const cond2 = await this.evaluateValue(block, 'COND2');
          if (Boolean(cond2)) {
            const do2 = block.getInputTargetBlock('DO2');
            if (do2) {
              const signal = await this.executeStatementChain(do2, maxSteps);
              if (signal) return signal;
            }
          } else {
            const elseBranch = block.getInputTargetBlock('ELSE');
            if (elseBranch) {
              const signal = await this.executeStatementChain(elseBranch, maxSteps);
              if (signal) return signal;
            }
          }
        }
        return null;
      }

      case 'c_for_loop': {
        const varName = block.getFieldValue('VAR') || 'i';
        const start = Number(block.getFieldValue('START')) || 0;
        const end = Number(block.getFieldValue('END')) || 0;
        const step = Number(block.getFieldValue('STEP')) || 1;
        const doBranch = block.getInputTargetBlock('DO');

        const address =
          this.variables.get(varName)?.address ||
          '0x' + (this.nextVarAddress += 4).toString(16);

        this.variables.set(varName, { type: 'int', value: start, address, size: 4 });
        this.emitMemoryUpdate(varName);

        const isAscending = step > 0;

        while (!this.isAborted) {
          this.checkAborted(maxSteps);
          const currentVal = Number(this.variables.get(varName)?.value ?? 0);

          if (isAscending && currentVal > end) break;
          if (!isAscending && currentVal < end) break;

          if (doBranch) {
            const signal = await this.executeStatementChain(doBranch, maxSteps);
            if (signal?.flow === 'break') break;
          }

          const nextVal = currentVal + step;
          const varRec = this.variables.get(varName);
          if (varRec) varRec.value = nextVal;
          this.emitMemoryUpdate(varName);
        }
        return null;
      }

      case 'c_while_loop': {
        const doBranch = block.getInputTargetBlock('DO');

        while (!this.isAborted) {
          this.checkAborted(maxSteps);
          const condition = await this.evaluateValue(block, 'CONDITION');
          if (!condition) break;

          if (doBranch) {
            const signal = await this.executeStatementChain(doBranch, maxSteps);
            if (signal?.flow === 'break') break;
          }
        }
        return null;
      }

      case 'c_do_while_loop': {
        const doBranch = block.getInputTargetBlock('DO');

        do {
          this.checkAborted(maxSteps);
          if (doBranch) {
            const signal = await this.executeStatementChain(doBranch, maxSteps);
            if (signal?.flow === 'break') break;
          }

          const condition = await this.evaluateValue(block, 'CONDITION');
          if (!condition) break;
        } while (!this.isAborted);

        return null;
      }

      case 'c_break':
        return { flow: 'break' };

      case 'c_continue':
        return { flow: 'continue' };

      case 'c_array_declare': {
        const type = (block.getFieldValue('TYPE') || 'int') as 'int' | 'float' | 'char';
        const varName = block.getFieldValue('VAR') || 'arr';
        const size = Number(block.getFieldValue('SIZE')) || 5;
        const rawValues = block.getFieldValue('VALUES') || '';

        const parsedValues: any[] = [];
        if (rawValues.trim()) {
          const parts = rawValues.split(',');
          for (const part of parts) {
            const trimmed = part.trim();
            if (type === 'char') {
              parsedValues.push(trimmed.replace(/['"]/g, '')[0] || ' ');
            } else if (type === 'float') {
              parsedValues.push(parseFloat(trimmed) || 0.0);
            } else {
              parsedValues.push(parseInt(trimmed, 10) || 0);
            }
          }
        }

        while (parsedValues.length < size) {
          parsedValues.push(type === 'char' ? ' ' : 0);
        }

        const elementSize = type === 'char' ? 1 : 4;
        const baseAddress = '0x' + (this.nextArrayAddress += size * elementSize).toString(16);

        this.arrays.set(varName, { type, values: parsedValues, baseAddress, elementSize });
        this.emitMemoryUpdate();
        return null;
      }

      case 'c_array_set': {
        const varName = block.getFieldValue('VAR') || 'arr';
        const index = Math.trunc(Number(await this.evaluateValue(block, 'INDEX')));
        const val = await this.evaluateValue(block, 'VALUE');

        const arr = this.arrays.get(varName);
        if (!arr) {
          throw new Error(`Array '${varName}' is not declared!`);
        }
        if (index < 0 || index >= arr.values.length) {
          throw new Error(
            `Array index out of bounds! Attempted to access ${varName}[${index}], but array size is ${arr.values.length}.`
          );
        }

        arr.values[index] = arr.type === 'int' ? Math.trunc(Number(val)) : val;
        this.emitMemoryUpdate(undefined, { name: varName, index, op: 'write' });
        return null;
      }

      case 'c_pointer_declare': {
        const type = block.getFieldValue('TYPE') || 'int*';
        const varName = block.getFieldValue('VAR') || 'ptr';
        const val = await this.evaluateValue(block, 'VALUE');

        const address = '0x' + (this.nextVarAddress += 8).toString(16);
        let pointsTo: string | undefined = undefined;
        let storedVal = '0x00000000';

        if (val && typeof val === 'object' && val.isAddressOf) {
          pointsTo = val.targetVar;
          storedVal = val.address;
        } else if (typeof val === 'string') {
          storedVal = val;
        }

        this.variables.set(varName, {
          type,
          value: storedVal,
          address,
          size: 8,
          pointsTo,
        });
        this.emitMemoryUpdate(varName);
        return null;
      }

      case 'c_pointer_assign': {
        const varName = block.getFieldValue('VAR') || 'ptr';
        const val = await this.evaluateValue(block, 'VALUE');
        const ptr = this.variables.get(varName);

        if (!ptr || !ptr.pointsTo) {
          throw new Error(`Invalid pointer dereference on '*${varName}'! Pointer is unassigned.`);
        }

        const target = this.variables.get(ptr.pointsTo);
        if (target) {
          if (target.type === 'int') {
            target.value = Math.trunc(Number(val));
          } else if (target.type === 'float' || target.type === 'double') {
            target.value = Number(val);
          } else if (target.type === 'char') {
            target.value = String(val)[0] || '';
          }
          this.emitMemoryUpdate(ptr.pointsTo);
        }
        return null;
      }

      default:
        return null;
    }
  }

  private async evaluateValue(block: Blockly.Block, inputName: string): Promise<any> {
    const targetBlock = block.getInputTargetBlock(inputName);
    if (!targetBlock) {
      return 0;
    }
    return this.evaluateExpression(targetBlock);
  }

  private async evaluateExpression(block: Blockly.Block): Promise<any> {
    switch (block.type) {
      case 'c_number':
        return Number(block.getFieldValue('NUM')) || 0;

      case 'c_string':
        return String(block.getFieldValue('TEXT') || '');

      case 'c_char': {
        const str = String(block.getFieldValue('CHAR') || 'A');
        return str[0] || '';
      }

      case 'c_boolean':
        return block.getFieldValue('BOOL') === '1' ? 1 : 0;

      case 'c_var_get': {
        const varName = block.getFieldValue('VAR') || 'x';
        const existing = this.variables.get(varName);
        if (existing) {
          return existing.value;
        }
        return 0;
      }

      case 'c_arithmetic': {
        const a = Number(await this.evaluateValue(block, 'A'));
        const b = Number(await this.evaluateValue(block, 'B'));
        const op = block.getFieldValue('OP');

        switch (op) {
          case 'ADD': return a + b;
          case 'SUB': return a - b;
          case 'MUL': return a * b;
          case 'DIV':
            if (b === 0) {
              throw new Error('Runtime Error: Division by zero! In C, dividing by 0 causes undefined behavior.');
            }
            return Math.trunc(a / b);
          case 'MOD':
            if (b === 0) {
              throw new Error('Runtime Error: Modulo by zero (% 0) is invalid in C.');
            }
            return a % b;
          default:
            return 0;
        }
      }

      case 'c_comparison': {
        const a = await this.evaluateValue(block, 'A');
        const b = await this.evaluateValue(block, 'B');
        const op = block.getFieldValue('OP');

        switch (op) {
          case 'EQ': return a == b ? 1 : 0;
          case 'NEQ': return a != b ? 1 : 0;
          case 'LT': return a < b ? 1 : 0;
          case 'LTE': return a <= b ? 1 : 0;
          case 'GT': return a > b ? 1 : 0;
          case 'GTE': return a >= b ? 1 : 0;
          default: return 0;
        }
      }

      case 'c_logical': {
        const a = Boolean(await this.evaluateValue(block, 'A'));
        const b = Boolean(await this.evaluateValue(block, 'B'));
        const op = block.getFieldValue('OP');

        if (op === 'AND') return a && b ? 1 : 0;
        if (op === 'OR') return a || b ? 1 : 0;
        return 0;
      }

      case 'c_logical_not': {
        const val = Boolean(await this.evaluateValue(block, 'BOOL'));
        return !val ? 1 : 0;
      }

      case 'c_array_get': {
        const varName = block.getFieldValue('VAR') || 'arr';
        const index = Math.trunc(Number(await this.evaluateValue(block, 'INDEX')));
        const arr = this.arrays.get(varName);

        if (!arr) {
          throw new Error(`Array '${varName}' is not declared!`);
        }
        if (index < 0 || index >= arr.values.length) {
          throw new Error(
            `Array index out of bounds! Attempted to access ${varName}[${index}], but array size is ${arr.values.length}.`
          );
        }
        this.emitMemoryUpdate(undefined, { name: varName, index, op: 'read' });
        return arr.values[index];
      }

      case 'c_math_func': {
        const func = block.getFieldValue('FUNC');
        const arg = Number(await this.evaluateValue(block, 'ARG'));

        switch (func) {
          case 'sqrt':
            if (arg < 0) throw new Error(`Math error: Square root of negative number ${arg}`);
            return Math.sqrt(arg);
          case 'abs':
            return Math.abs(arg);
          case 'floor':
            return Math.floor(arg);
          case 'ceil':
            return Math.ceil(arg);
          default:
            return arg;
        }
      }

      case 'c_address_of': {
        const varName = block.getFieldValue('VAR') || 'x';
        const target = this.variables.get(varName);
        const address = target?.address || '0x' + (this.nextVarAddress += 4).toString(16);
        return { isAddressOf: true, targetVar: varName, address };
      }

      case 'c_pointer_deref': {
        const varName = block.getFieldValue('VAR') || 'ptr';
        const ptr = this.variables.get(varName);
        if (!ptr || !ptr.pointsTo) {
          throw new Error(`Null pointer dereference on '*${varName}'! Pointer does not point to a valid variable.`);
        }
        const target = this.variables.get(ptr.pointsTo);
        return target ? target.value : 0;
      }

      default:
        return 0;
    }
  }
}
