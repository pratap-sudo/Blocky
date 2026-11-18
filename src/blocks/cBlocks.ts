import * as Blockly from 'blockly';

// Block Colors
export const BLOCK_COLORS = {
  PROGRAM: '#10b981',   // Emerald
  IO: '#0284c7',        // Sky Blue
  VARIABLE: '#f59e0b',  // Amber
  MATH: '#8b5cf6',      // Violet
  LOGIC: '#ec4899',     // Pink
  LOOP: '#6366f1',      // Indigo
  ARRAY: '#14b8a6',     // Teal
  COMMENT: '#64748b',   // Slate
};

export function registerCBlocks() {
  // 1. Program Entry: Main Function
  Blockly.Blocks['c_main'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🏁 Program Start (int main)');
      this.appendStatementInput('STACK')
        .setCheck(null);
      this.appendDummyInput()
        .appendField('return 0;');
      this.setColour(BLOCK_COLORS.PROGRAM);
      this.setTooltip('The entry point of every C program. Code inside executes when you run.');
      this.setHelpUrl('');
    },
  };

  // 2. Program Comment
  Blockly.Blocks['c_comment'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('💬 //')
        .appendField(new Blockly.FieldTextInput('Write your comment here...'), 'COMMENT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.COMMENT);
      this.setTooltip('Add a code comment (ignored by compiler).');
    },
  };

  // 3. Print Text / Message
  Blockly.Blocks['c_print_text'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🖨️ print text')
        .appendField(new Blockly.FieldTextInput('Hello, World!'), 'TEXT')
        .appendField('newline')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'NEWLINE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.IO);
      this.setTooltip('Prints text to the console screen. Check newline to move to the next line.');
    },
  };

  // 4. Print Value / Variable / Expression
  Blockly.Blocks['c_print_value'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('🖨️ print value');
      this.appendDummyInput()
        .appendField('newline')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'NEWLINE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.IO);
      this.setTooltip('Prints the result of a variable or mathematical expression.');
    },
  };

  // 5. Print Formatted (printf style: "Value is %d", x)
  Blockly.Blocks['c_print_formatted'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🖨️ printf')
        .appendField(new Blockly.FieldTextInput('Result = %d'), 'FORMAT');
      this.appendValueInput('ARG')
        .setCheck(null)
        .appendField('value');
      this.appendDummyInput()
        .appendField('newline')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'NEWLINE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.IO);
      this.setTooltip('Formatted print using C format specifiers like %d, %f, %c, %s.');
    },
  };

  // 6. Print Newline
  Blockly.Blocks['c_print_newline'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('↵ print new line');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.IO);
      this.setTooltip('Outputs a newline (\\n) to the console.');
    },
  };

  // 7. User Input (scanf with friendly prompt)
  Blockly.Blocks['c_scanf'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('📥 input')
        .appendField(new Blockly.FieldDropdown([
          ['int (integer)', 'int'],
          ['float (decimal)', 'float'],
          ['double (double precision)', 'double'],
          ['char (single character)', 'char'],
        ]), 'TYPE')
        .appendField('into')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR')
        .appendField('prompt:')
        .appendField(new Blockly.FieldTextInput('Enter value: '), 'PROMPT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.IO);
      this.setTooltip('Prompts the user to enter a value and reads it using scanf.');
    },
  };

  // 8. Variable Declaration
  Blockly.Blocks['c_var_declare'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('📦 declare')
        .appendField(new Blockly.FieldDropdown([
          ['int', 'int'],
          ['float', 'float'],
          ['double', 'double'],
          ['char', 'char'],
        ]), 'TYPE')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR')
        .appendField('=');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.VARIABLE);
      this.setTooltip('Declares a new variable in C with an initial value.');
    },
  };

  // 9. Variable Assignment
  Blockly.Blocks['c_var_assign'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR')
        .appendField('=');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.VARIABLE);
      this.setTooltip('Assigns a new value to an existing variable.');
    },
  };

  // 10. Variable Getter (Expression)
  Blockly.Blocks['c_var_get'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('var')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR');
      this.setOutput(true, null);
      this.setColour(BLOCK_COLORS.VARIABLE);
      this.setTooltip('Gets the current value of a variable.');
    },
  };

  // 11. Number Literal
  Blockly.Blocks['c_number'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), 'NUM');
      this.setOutput(true, 'Number');
      this.setColour(BLOCK_COLORS.MATH);
      this.setTooltip('A constant number (integer or floating point).');
    },
  };

  // 12. String Literal
  Blockly.Blocks['c_string'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('“')
        .appendField(new Blockly.FieldTextInput('Hello'), 'TEXT')
        .appendField('”');
      this.setOutput(true, 'String');
      this.setColour(BLOCK_COLORS.MATH);
      this.setTooltip('A text string constant.');
    },
  };

  // 13. Char Literal
  Blockly.Blocks['c_char'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('‘')
        .appendField(new Blockly.FieldTextInput('A'), 'CHAR')
        .appendField('’');
      this.setOutput(true, 'Char');
      this.setColour(BLOCK_COLORS.MATH);
      this.setTooltip('A single character literal.');
    },
  };

  // 14. Boolean Literal
  Blockly.Blocks['c_boolean'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['1 (true)', '1'],
          ['0 (false)', '0'],
        ]), 'BOOL');
      this.setOutput(true, 'Boolean');
      this.setColour(BLOCK_COLORS.LOGIC);
      this.setTooltip('In C, 1 represents true and 0 represents false.');
    },
  };

  // 15. Arithmetic Operator (+, -, *, /, %)
  Blockly.Blocks['c_arithmetic'] = {
    init: function () {
      this.appendValueInput('A')
        .setCheck(null);
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['+', 'ADD'],
          ['-', 'SUB'],
          ['*', 'MUL'],
          ['/', 'DIV'],
          ['%', 'MOD'],
        ]), 'OP');
      this.appendValueInput('B')
        .setCheck(null);
      this.setOutput(true, 'Number');
      this.setColour(BLOCK_COLORS.MATH);
      this.setInputsInline(true);
      this.setTooltip('Performs arithmetic operations (+, -, *, /, %).');
    },
  };

  // 16. Comparison Operator (==, !=, <, <=, >, >=)
  Blockly.Blocks['c_comparison'] = {
    init: function () {
      this.appendValueInput('A')
        .setCheck(null);
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['== (equal)', 'EQ'],
          ['!= (not equal)', 'NEQ'],
          ['< (less)', 'LT'],
          ['<= (less or equal)', 'LTE'],
          ['> (greater)', 'GT'],
          ['>= (greater or equal)', 'GTE'],
        ]), 'OP');
      this.appendValueInput('B')
        .setCheck(null);
      this.setOutput(true, 'Boolean');
      this.setColour(BLOCK_COLORS.LOGIC);
      this.setInputsInline(true);
      this.setTooltip('Compares two values and returns true (1) or false (0).');
    },
  };

  // 17. Logical Operator (&&, ||)
  Blockly.Blocks['c_logical'] = {
    init: function () {
      this.appendValueInput('A')
        .setCheck(null);
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['&& (AND)', 'AND'],
          ['|| (OR)', 'OR'],
        ]), 'OP');
      this.appendValueInput('B')
        .setCheck(null);
      this.setOutput(true, 'Boolean');
      this.setColour(BLOCK_COLORS.LOGIC);
      this.setInputsInline(true);
      this.setTooltip('Logical AND (&&) / Logical OR (||).');
    },
  };

  // 18. Logical NOT (!)
  Blockly.Blocks['c_logical_not'] = {
    init: function () {
      this.appendValueInput('BOOL')
        .setCheck(null)
        .appendField('NOT !');
      this.setOutput(true, 'Boolean');
      this.setColour(BLOCK_COLORS.LOGIC);
      this.setTooltip('Inverts a condition (!true becomes false, !false becomes true).');
    },
  };

  // 19. Increment / Decrement (x++, x--, ++x, --x)
  Blockly.Blocks['c_inc_dec'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('i'), 'VAR')
        .appendField(new Blockly.FieldDropdown([
          ['++ (increment)', 'INC'],
          ['-- (decrement)', 'DEC'],
        ]), 'OP');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.MATH);
      this.setTooltip('Increases or decreases variable by 1 (i++ or i--).');
    },
  };

  // 20. If Statement
  Blockly.Blocks['c_if'] = {
    init: function () {
      this.appendValueInput('CONDITION')
        .setCheck(null)
        .appendField('if');
      this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('then');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.LOGIC);
      this.setTooltip('Executes inner blocks if condition is true.');
    },
  };

  // 21. If / Else Statement
  Blockly.Blocks['c_if_else'] = {
    init: function () {
      this.appendValueInput('CONDITION')
        .setCheck(null)
        .appendField('if');
      this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('then');
      this.appendStatementInput('ELSE')
        .setCheck(null)
        .appendField('else');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.LOGIC);
      this.setTooltip('Executes first block if condition is true, otherwise executes else block.');
    },
  };

  // 22. If / Else-If / Else Statement
  Blockly.Blocks['c_if_elseif_else'] = {
    init: function () {
      this.appendValueInput('COND1')
        .setCheck(null)
        .appendField('if');
      this.appendStatementInput('DO1')
        .setCheck(null)
        .appendField('then');
      this.appendValueInput('COND2')
        .setCheck(null)
        .appendField('else if');
      this.appendStatementInput('DO2')
        .setCheck(null)
        .appendField('then');
      this.appendStatementInput('ELSE')
        .setCheck(null)
        .appendField('else');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.LOGIC);
      this.setTooltip('Checks first condition; if false, checks second condition; else executes default.');
    },
  };

  // 23. For Loop (Beginner & Standard C)
  Blockly.Blocks['c_for_loop'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🔁 for')
        .appendField(new Blockly.FieldTextInput('i'), 'VAR')
        .appendField('=')
        .appendField(new Blockly.FieldNumber(1), 'START')
        .appendField('to')
        .appendField(new Blockly.FieldNumber(10), 'END')
        .appendField('step')
        .appendField(new Blockly.FieldNumber(1), 'STEP');
      this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.LOOP);
      this.setTooltip('Repeats code for variable from start value up to end value.');
    },
  };

  // 24. While Loop
  Blockly.Blocks['c_while_loop'] = {
    init: function () {
      this.appendValueInput('CONDITION')
        .setCheck(null)
        .appendField('🔁 while');
      this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.LOOP);
      this.setTooltip('Repeats code while the condition is true.');
    },
  };

  // 25. Do-While Loop
  Blockly.Blocks['c_do_while_loop'] = {
    init: function () {
      this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('🔁 do');
      this.appendValueInput('CONDITION')
        .setCheck(null)
        .appendField('while');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.LOOP);
      this.setTooltip('Executes code at least once, then repeats while condition is true.');
    },
  };

  // 26. Break Statement
  Blockly.Blocks['c_break'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⏹ break;');
      this.setPreviousStatement(true, null);
      this.setColour(BLOCK_COLORS.LOOP);
      this.setTooltip('Exits the nearest enclosing loop immediately.');
    },
  };

  // 27. Continue Statement
  Blockly.Blocks['c_continue'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⏩ continue;');
      this.setPreviousStatement(true, null);
      this.setColour(BLOCK_COLORS.LOOP);
      this.setTooltip('Skips the rest of current loop iteration and moves to the next.');
    },
  };

  // 28. Array Declaration
  Blockly.Blocks['c_array_declare'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('📊 declare')
        .appendField(new Blockly.FieldDropdown([
          ['int', 'int'],
          ['float', 'float'],
          ['char', 'char'],
        ]), 'TYPE')
        .appendField('array')
        .appendField(new Blockly.FieldTextInput('arr'), 'VAR')
        .appendField('[')
        .appendField(new Blockly.FieldNumber(5, 1, 100), 'SIZE')
        .appendField('] = {')
        .appendField(new Blockly.FieldTextInput('1, 2, 3, 4, 5'), 'VALUES')
        .appendField('}');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLORS.ARRAY);
      this.setTooltip('Declares a 1D C array with specified size and comma-separated initial values.');
    },
  };

  // 29. Array Get Element
  Blockly.Blocks['c_array_get'] = {
    init: function () {
      this.appendValueInput('INDEX')
        .setCheck(null)
        .appendField(new Blockly.FieldTextInput('arr'), 'VAR')
        .appendField('[');
      this.appendDummyInput()
        .appendField(']');
      this.setOutput(true, null);
      this.setInputsInline(true);
      this.setColour(BLOCK_COLORS.ARRAY);
      this.setTooltip('Accesses array element at the specified 0-based index.');
    },
  };

  // 30. Array Set Element
  Blockly.Blocks['c_array_set'] = {
    init: function () {
      this.appendValueInput('INDEX')
        .setCheck(null)
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('arr'), 'VAR')
        .appendField('[');
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('] =');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setInputsInline(true);
      this.setColour(BLOCK_COLORS.ARRAY);
      this.setTooltip('Assigns a value to an array at the given index.');
    },
  };

  // 31. Math Function (sqrt, pow, abs)
  Blockly.Blocks['c_math_func'] = {
    init: function () {
      this.appendValueInput('ARG')
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([
          ['sqrt (square root)', 'sqrt'],
          ['abs (absolute value)', 'abs'],
          ['floor (round down)', 'floor'],
          ['ceil (round up)', 'ceil'],
        ]), 'FUNC')
        .appendField('(');
      this.appendDummyInput()
        .appendField(')');
      this.setOutput(true, 'Number');
      this.setInputsInline(true);
      this.setColour(BLOCK_COLORS.MATH);
      this.setTooltip('Calculates mathematical function (includes <math.h>).');
    },
  };

  // 32. Address Of (&var)
  Blockly.Blocks['c_address_of'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('& address of')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR');
      this.setOutput(true, 'Pointer');
      this.setColour('#0ea5e9');
      this.setTooltip('Gets the memory address (&x) of a variable.');
    },
  };

  // 33. Pointer Declaration (int *ptr = &x)
  Blockly.Blocks['c_pointer_declare'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('📍 declare')
        .appendField(new Blockly.FieldDropdown([
          ['int*', 'int*'],
          ['float*', 'float*'],
          ['char*', 'char*'],
        ]), 'TYPE')
        .appendField('*')
        .appendField(new Blockly.FieldTextInput('ptr'), 'VAR')
        .appendField('=');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0ea5e9');
      this.setTooltip('Declares a pointer variable that stores the memory address of another variable.');
    },
  };

  // 34. Pointer Dereference (*ptr)
  Blockly.Blocks['c_pointer_deref'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('*')
        .appendField(new Blockly.FieldTextInput('ptr'), 'VAR');
      this.setOutput(true, null);
      this.setColour('#0ea5e9');
      this.setTooltip('Dereferences a pointer (*ptr) to read the value stored at that memory address.');
    },
  };

  // 35. Pointer Assignment (*ptr = value)
  Blockly.Blocks['c_pointer_assign'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('set *')
        .appendField(new Blockly.FieldTextInput('ptr'), 'VAR')
        .appendField('=');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0ea5e9');
      this.setTooltip('Writes a value to the memory address pointed to by *ptr.');
    },
  };

  // 36. Return Statement (return value;)
  Blockly.Blocks['c_return'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('return');
      this.setPreviousStatement(true, null);
      this.setColour(BLOCK_COLORS.PROGRAM);
      this.setTooltip('Returns a value from a function.');
    },
  };
}
