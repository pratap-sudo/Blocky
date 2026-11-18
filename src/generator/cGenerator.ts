import * as Blockly from 'blockly';

export const Order = {
  ATOMIC: 0,
  POSTFIX: 1,        // [] () . -> ++ --
  UNARY: 2,          // ! ~ + - ++ -- & *
  MULTIPLICATIVE: 3, // * / %
  ADDITIVE: 4,       // + -
  SHIFT: 5,          // << >>
  RELATIONAL: 6,     // < <= > >=
  EQUALITY: 7,       // == !=
  BITWISE_AND: 8,    // &
  BITWISE_XOR: 9,    // ^
  BITWISE_OR: 10,    // |
  LOGICAL_AND: 11,   // &&
  LOGICAL_OR: 12,    // ||
  CONDITIONAL: 13,   // ?:
  ASSIGNMENT: 14,    // = += -=
  NONE: 99,
};

export const cGenerator = new Blockly.Generator('C');

// Configure indentation
cGenerator.INDENT = '    ';

// Chaining blocks together in sequence
cGenerator.scrub_ = function (block: Blockly.Block, code: string, opt_thisOnly?: boolean): string {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  let nextCode = '';
  if (nextBlock && !opt_thisOnly) {
    const res = this.blockToCode(nextBlock);
    nextCode = typeof res === 'string' ? res : '';
  }
  return code + nextCode;
};

// 1. Program Main
(cGenerator as any).forBlock['c_main'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const statements = generator.statementToCode(block, 'STACK') || '';
  return `int main() {\n${statements}${generator.INDENT}return 0;\n}\n`;
};

// 2. Comment
(cGenerator as any).forBlock['c_comment'] = function (block: Blockly.Block) {
  const comment = block.getFieldValue('COMMENT') || '';
  return `// ${comment}\n`;
};

// 3. Print Text
(cGenerator as any).forBlock['c_print_text'] = function (block: Blockly.Block) {
  const text = block.getFieldValue('TEXT') || '';
  const newline = block.getFieldValue('NEWLINE') === 'TRUE';
  const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `printf("${escaped}${newline ? '\\n' : ''}");\n`;
};

// 4. Print Value (variable or arithmetic expression)
(cGenerator as any).forBlock['c_print_value'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || '0';
  const newline = block.getFieldValue('NEWLINE') === 'TRUE';
  return `printf("%d${newline ? '\\n' : ''}", ${value});\n`;
};

// 5. Print Formatted (printf)
(cGenerator as any).forBlock['c_print_formatted'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const format = block.getFieldValue('FORMAT') || '%d';
  const arg = generator.valueToCode(block, 'ARG', Order.NONE);
  const newline = block.getFieldValue('NEWLINE') === 'TRUE';
  const escaped = format.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (arg) {
    return `printf("${escaped}${newline ? '\\n' : ''}", ${arg});\n`;
  }
  return `printf("${escaped}${newline ? '\\n' : ''}");\n`;
};

// 6. Print Newline
(cGenerator as any).forBlock['c_print_newline'] = function () {
  return `printf("\\n");\n`;
};

// 7. Scanf Input
(cGenerator as any).forBlock['c_scanf'] = function (block: Blockly.Block) {
  const type = block.getFieldValue('TYPE') || 'int';
  const varName = block.getFieldValue('VAR') || 'x';
  const prompt = block.getFieldValue('PROMPT') || '';

  let specifier = '%d';
  if (type === 'float') specifier = '%f';
  else if (type === 'double') specifier = '%lf';
  else if (type === 'char') specifier = ' %c';

  let code = '';
  if (prompt) {
    const escaped = prompt.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    code += `printf("${escaped}");\n`;
  }
  code += `scanf("${specifier}", &${varName});\n`;
  return code;
};

// 8. Variable Declaration
(cGenerator as any).forBlock['c_var_declare'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const type = block.getFieldValue('TYPE') || 'int';
  const varName = block.getFieldValue('VAR') || 'x';
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT);

  if (value) {
    return `${type} ${varName} = ${value};\n`;
  }
  return `${type} ${varName};\n`;
};

// 9. Variable Assignment
(cGenerator as any).forBlock['c_var_assign'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const varName = block.getFieldValue('VAR') || 'x';
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  return `${varName} = ${value};\n`;
};

// 10. Variable Get
(cGenerator as any).forBlock['c_var_get'] = function (block: Blockly.Block) {
  const varName = block.getFieldValue('VAR') || 'x';
  return [varName, Order.ATOMIC];
};

// 11. Number Literal
(cGenerator as any).forBlock['c_number'] = function (block: Blockly.Block) {
  const num = block.getFieldValue('NUM');
  return [String(num), Order.ATOMIC];
};

// 12. String Literal
(cGenerator as any).forBlock['c_string'] = function (block: Blockly.Block) {
  const text = block.getFieldValue('TEXT') || '';
  const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return [`"${escaped}"`, Order.ATOMIC];
};

// 13. Char Literal
(cGenerator as any).forBlock['c_char'] = function (block: Blockly.Block) {
  const ch = block.getFieldValue('CHAR') || 'A';
  const escaped = ch.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return [`'${escaped}'`, Order.ATOMIC];
};

// 14. Boolean Literal
(cGenerator as any).forBlock['c_boolean'] = function (block: Blockly.Block) {
  const val = block.getFieldValue('BOOL') || '1';
  return [val, Order.ATOMIC];
};

// 15. Arithmetic
(cGenerator as any).forBlock['c_arithmetic'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const op = block.getFieldValue('OP');
  let operator = '+';
  let order = Order.ADDITIVE;

  switch (op) {
    case 'ADD': operator = '+'; order = Order.ADDITIVE; break;
    case 'SUB': operator = '-'; order = Order.ADDITIVE; break;
    case 'MUL': operator = '*'; order = Order.MULTIPLICATIVE; break;
    case 'DIV': operator = '/'; order = Order.MULTIPLICATIVE; break;
    case 'MOD': operator = '%'; order = Order.MULTIPLICATIVE; break;
  }

  const a = generator.valueToCode(block, 'A', order) || '0';
  const b = generator.valueToCode(block, 'B', order) || '0';
  return [`${a} ${operator} ${b}`, order];
};

// 16. Comparison
(cGenerator as any).forBlock['c_comparison'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const op = block.getFieldValue('OP');
  let operator = '==';
  let order = Order.EQUALITY;

  switch (op) {
    case 'EQ': operator = '=='; order = Order.EQUALITY; break;
    case 'NEQ': operator = '!='; order = Order.EQUALITY; break;
    case 'LT': operator = '<'; order = Order.RELATIONAL; break;
    case 'LTE': operator = '<='; order = Order.RELATIONAL; break;
    case 'GT': operator = '>'; order = Order.RELATIONAL; break;
    case 'GTE': operator = '>='; order = Order.RELATIONAL; break;
  }

  const a = generator.valueToCode(block, 'A', order) || '0';
  const b = generator.valueToCode(block, 'B', order) || '0';
  return [`${a} ${operator} ${b}`, order];
};

// 17. Logical AND / OR
(cGenerator as any).forBlock['c_logical'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const op = block.getFieldValue('OP');
  const operator = op === 'AND' ? '&&' : '||';
  const order = op === 'AND' ? Order.LOGICAL_AND : Order.LOGICAL_OR;

  const a = generator.valueToCode(block, 'A', order) || '1';
  const b = generator.valueToCode(block, 'B', order) || '1';
  return [`${a} ${operator} ${b}`, order];
};

// 18. Logical NOT
(cGenerator as any).forBlock['c_logical_not'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const val = generator.valueToCode(block, 'BOOL', Order.UNARY) || '1';
  return [`!(${val})`, Order.UNARY];
};

// 19. Increment / Decrement
(cGenerator as any).forBlock['c_inc_dec'] = function (block: Blockly.Block) {
  const varName = block.getFieldValue('VAR') || 'i';
  const op = block.getFieldValue('OP') === 'INC' ? '++' : '--';
  return `${varName}${op};\n`;
};

// 20. If
(cGenerator as any).forBlock['c_if'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || '1';
  const branch = generator.statementToCode(block, 'DO') || '';
  return `if (${condition}) {\n${branch}}\n`;
};

// 21. If / Else
(cGenerator as any).forBlock['c_if_else'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || '1';
  const branchDo = generator.statementToCode(block, 'DO') || '';
  const branchElse = generator.statementToCode(block, 'ELSE') || '';
  return `if (${condition}) {\n${branchDo}} else {\n${branchElse}}\n`;
};

// 22. If / Else-If / Else
(cGenerator as any).forBlock['c_if_elseif_else'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const cond1 = generator.valueToCode(block, 'COND1', Order.NONE) || '1';
  const do1 = generator.statementToCode(block, 'DO1') || '';
  const cond2 = generator.valueToCode(block, 'COND2', Order.NONE) || '1';
  const do2 = generator.statementToCode(block, 'DO2') || '';
  const branchElse = generator.statementToCode(block, 'ELSE') || '';

  return `if (${cond1}) {\n${do1}} else if (${cond2}) {\n${do2}} else {\n${branchElse}}\n`;
};

// 23. For Loop
(cGenerator as any).forBlock['c_for_loop'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const varName = block.getFieldValue('VAR') || 'i';
  const start = Number(block.getFieldValue('START')) || 0;
  const end = Number(block.getFieldValue('END')) || 0;
  const step = Number(block.getFieldValue('STEP')) || 1;
  const branch = generator.statementToCode(block, 'DO') || '';

  const op = start <= end ? '<=' : '>=';
  let inc = '';
  if (step === 1) inc = `${varName}++`;
  else if (step === -1) inc = `${varName}--`;
  else if (step > 0) inc = `${varName} += ${step}`;
  else inc = `${varName} -= ${Math.abs(step)}`;

  return `for (int ${varName} = ${start}; ${varName} ${op} ${end}; ${inc}) {\n${branch}}\n`;
};

// 24. While Loop
(cGenerator as any).forBlock['c_while_loop'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || '1';
  const branch = generator.statementToCode(block, 'DO') || '';
  return `while (${condition}) {\n${branch}}\n`;
};

// 25. Do-While Loop
(cGenerator as any).forBlock['c_do_while_loop'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const branch = generator.statementToCode(block, 'DO') || '';
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || '1';
  return `do {\n${branch}} while (${condition});\n`;
};

// 26. Break
(cGenerator as any).forBlock['c_break'] = function () {
  return `break;\n`;
};

// 27. Continue
(cGenerator as any).forBlock['c_continue'] = function () {
  return `continue;\n`;
};

// 28. Array Declaration
(cGenerator as any).forBlock['c_array_declare'] = function (block: Blockly.Block) {
  const type = block.getFieldValue('TYPE') || 'int';
  const varName = block.getFieldValue('VAR') || 'arr';
  const size = block.getFieldValue('SIZE') || 5;
  const values = block.getFieldValue('VALUES');

  if (values && values.trim()) {
    return `${type} ${varName}[${size}] = {${values}};\n`;
  }
  return `${type} ${varName}[${size}];\n`;
};

// 29. Array Get
(cGenerator as any).forBlock['c_array_get'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const varName = block.getFieldValue('VAR') || 'arr';
  const index = generator.valueToCode(block, 'INDEX', Order.ATOMIC) || '0';
  return [`${varName}[${index}]`, Order.POSTFIX];
};

// 30. Array Set
(cGenerator as any).forBlock['c_array_set'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const varName = block.getFieldValue('VAR') || 'arr';
  const index = generator.valueToCode(block, 'INDEX', Order.ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  return `${varName}[${index}] = ${value};\n`;
};

// 31. Math Function
(cGenerator as any).forBlock['c_math_func'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const func = block.getFieldValue('FUNC') || 'sqrt';
  const arg = generator.valueToCode(block, 'ARG', Order.NONE) || '0';
  return [`${func}(${arg})`, Order.POSTFIX];
};

// 32. Address Of (&var)
(cGenerator as any).forBlock['c_address_of'] = function (block: Blockly.Block) {
  const varName = block.getFieldValue('VAR') || 'x';
  return [`&${varName}`, Order.UNARY];
};

// 33. Pointer Declaration (int *ptr = &x)
(cGenerator as any).forBlock['c_pointer_declare'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const type = block.getFieldValue('TYPE') || 'int*';
  const baseType = type.replace('*', '');
  const varName = block.getFieldValue('VAR') || 'ptr';
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT);

  if (value) {
    return `${baseType} *${varName} = ${value};\n`;
  }
  return `${baseType} *${varName} = NULL;\n`;
};

// 34. Pointer Dereference (*ptr)
(cGenerator as any).forBlock['c_pointer_deref'] = function (block: Blockly.Block) {
  const varName = block.getFieldValue('VAR') || 'ptr';
  return [`*${varName}`, Order.UNARY];
};

// 35. Pointer Assign (*ptr = val)
(cGenerator as any).forBlock['c_pointer_assign'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const varName = block.getFieldValue('VAR') || 'ptr';
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  return `*${varName} = ${value};\n`;
};

// 36. Return Statement
(cGenerator as any).forBlock['c_return'] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const val = generator.valueToCode(block, 'VALUE', Order.NONE);
  if (val) {
    return `return ${val};\n`;
  }
  return `return;\n`;
};

/**
 * Main export function to generate formatted, valid C code from the workspace
 */
export function generateCCode(workspace: Blockly.Workspace): string {
  const topBlocks = workspace.getTopBlocks(true);
  if (topBlocks.length === 0) {
    return `// Visual C Programming Studio
// Workspace is empty. Drag blocks from the toolbox to start creating your C program!
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`;
  }

  let codeBody = '';
  let hasMain = false;

  for (const block of topBlocks) {
    if (block.type === 'c_main') {
      hasMain = true;
      codeBody += cGenerator.blockToCode(block);
    }
  }

  // If there wasn't an explicit c_main block, collect all top-level statements and put them into main
  if (!hasMain) {
    let innerStatements = '';
    for (const block of topBlocks) {
      innerStatements += cGenerator.blockToCode(block);
    }
    // Indent inner statements
    const indented = innerStatements
      .split('\n')
      .map((line) => (line.trim().length > 0 ? `    ${line}` : ''))
      .join('\n');

    codeBody = `int main() {\n${indented}\n    return 0;\n}\n`;
  }

  // Detect which headers are needed
  const includes = ['#include <stdio.h>'];
  if (codeBody.includes('sqrt(') || codeBody.includes('pow(') || codeBody.includes('floor(') || codeBody.includes('ceil(')) {
    includes.push('#include <math.h>');
  }
  if (codeBody.includes('abs(') || codeBody.includes('malloc') || codeBody.includes('exit(')) {
    includes.push('#include <stdlib.h>');
  }
  if (codeBody.includes('bool ') || codeBody.includes('true') || codeBody.includes('false')) {
    includes.push('#include <stdbool.h>');
  }

  return `// Generated by Visual C Programming Studio
${includes.join('\n')}

${codeBody.trim()}\n`;
}
