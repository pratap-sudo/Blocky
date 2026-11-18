import * as Blockly from 'blockly';

export interface LintMessage {
  id: string;
  type: 'warning' | 'info';
  message: string;
}

export function lintWorkspace(workspace: Blockly.WorkspaceSvg | null): LintMessage[] {
  if (!workspace) return [];

  const messages: LintMessage[] = [];
  const allBlocks = workspace.getAllBlocks(false);

  // Collect declared variables and arrays
  const declaredVars = new Set<string>();
  const declaredArrays = new Set<string>();

  for (const b of allBlocks) {
    if (b.type === 'c_var_declare') {
      const v = b.getFieldValue('VAR');
      if (v) declaredVars.add(v);
    }
    if (b.type === 'c_for_loop') {
      const v = b.getFieldValue('VAR');
      if (v) declaredVars.add(v);
    }
    if (b.type === 'c_array_declare') {
      const v = b.getFieldValue('VAR');
      if (v) declaredArrays.add(v);
    }
  }

  // Scan for common beginner mistakes
  for (const b of allBlocks) {
    // 1. Used variable without declaration
    if (b.type === 'c_var_get') {
      const v = b.getFieldValue('VAR');
      if (v && !declaredVars.has(v)) {
        messages.push({
          id: b.id,
          type: 'warning',
          message: `Variable '${v}' is used without being declared. In C, all variables must be declared (e.g. 'declare int ${v}').`,
        });
      }
    }

    // 2. Infinite loop check: for loop step == 0
    if (b.type === 'c_for_loop') {
      const step = Number(b.getFieldValue('STEP'));
      if (step === 0) {
        messages.push({
          id: b.id,
          type: 'warning',
          message: `For loop step is 0! This will run forever and freeze. Change step to 1 or -1.`,
        });
      }
    }

    // 3. Array accessed without declaration
    if (b.type === 'c_array_get' || b.type === 'c_array_set') {
      const arr = b.getFieldValue('VAR');
      if (arr && !declaredArrays.has(arr)) {
        messages.push({
          id: b.id,
          type: 'warning',
          message: `Array '${arr}' is accessed but not declared with a 'declare array' block.`,
        });
      }
    }
  }

  return messages;
}
