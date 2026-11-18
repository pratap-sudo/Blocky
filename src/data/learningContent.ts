export interface BlockLearningInfo {
  name: string;
  category: string;
  summary: string;
  explanation: string;
  cSyntax: string;
  cExample: string;
  beginnerTip: string;
  flowchartNodes?: { id: string; label: string; type: 'start' | 'process' | 'decision' | 'io' | 'end' }[];
}

export const BLOCK_LEARNING_DATA: Record<string, BlockLearningInfo> = {
  c_main: {
    name: 'Main Function (Entry Point)',
    category: 'Program Structure',
    summary: 'The main starting point where C execution begins.',
    explanation:
      'Every C program must have exactly one main() function. When you compile and run a C program, the operating system invokes main first. Inside, it runs instructions top-to-bottom and exits with return 0 (indicating success).',
    cSyntax: `int main() {
    // Statements go here
    return 0;
}`,
    cExample: `#include <stdio.h>

int main() {
    printf("Visual C Studio!\\n");
    return 0;
}`,
    beginnerTip:
      'Always remember that return 0 at the end signals to the operating system that your program finished without errors.',
    flowchartNodes: [
      { id: '1', label: 'Program Start', type: 'start' },
      { id: '2', label: 'Execute main() statements', type: 'process' },
      { id: '3', label: 'Return 0 (Success)', type: 'end' },
    ],
  },

  c_comment: {
    name: 'Code Comment',
    category: 'Documentation',
    summary: 'Notes written for humans that the C compiler completely ignores.',
    explanation:
      'Comments explain what a piece of code does. In C, single-line comments start with // and multi-line comments are wrapped inside /* ... */.',
    cSyntax: `// This is a single-line comment
/* This is a 
   multi-line comment */`,
    cExample: `// Calculate area of circle
float area = 3.14159 * r * r;`,
    beginnerTip:
      'Writing good comments helps your future self and other programmers understand your logic quickly.',
  },

  c_print_text: {
    name: 'Print Text',
    category: 'Input / Output',
    summary: 'Outputs a text message to the screen / console.',
    explanation:
      'Uses printf() from the <stdio.h> standard library. When the newline checkbox is checked, it appends \\n to move the cursor to the next line.',
    cSyntax: `printf("Text message\\n");`,
    cExample: `printf("Welcome to C Programming!\\n");`,
    beginnerTip:
      'In C strings, \\n is an escape sequence that creates a line break. Without \\n, consecutive prints stay on the exact same line.',
    flowchartNodes: [
      { id: '1', label: 'Send text to console buffer', type: 'io' },
      { id: '2', label: 'Add line break (if \\n)', type: 'process' },
    ],
  },

  c_print_value: {
    name: 'Print Value',
    category: 'Input / Output',
    summary: 'Prints the calculated value of a variable or mathematical expression.',
    explanation:
      'Uses printf() with format specifiers like %d for integers. The value is evaluated first and then substituted into the output string.',
    cSyntax: `printf("%d\\n", value);`,
    cExample: `int score = 95;
printf("%d\\n", score);`,
    beginnerTip:
      'Always match format specifiers to data types: %d for int, %f for float, %c for char, %s for string.',
    flowchartNodes: [
      { id: '1', label: 'Evaluate variable/expression', type: 'process' },
      { id: '2', label: 'Format and display on screen', type: 'io' },
    ],
  },

  c_print_formatted: {
    name: 'Formatted Printf',
    category: 'Input / Output',
    summary: 'Advanced print that lets you embed values directly into custom text using specifiers.',
    explanation:
      'printf stands for "print formatted". It scans format specifiers such as %d (integers) and %f (floats) and replaces them with corresponding arguments.',
    cSyntax: `printf("Format string with %d specifiers", argument);`,
    cExample: `int age = 16;
printf("User is %d years old.\\n", age);`,
    beginnerTip:
      'Ensure the number and types of placeholders (%d, %f, %s) match the arguments passed to printf.',
  },

  c_print_newline: {
    name: 'Print Newline',
    category: 'Input / Output',
    summary: 'Prints a single line break to advance to the next line.',
    explanation: 'Sends the \\n character to the standard output.',
    cSyntax: `printf("\\n");`,
    cExample: `printf("Line 1");
printf("\\n");
printf("Line 2");`,
    beginnerTip: 'Useful for structuring neat output and visual tables.',
  },

  c_scanf: {
    name: 'User Input (scanf)',
    category: 'Input / Output',
    summary: 'Asks the user for input and stores the entered value into a variable.',
    explanation:
      'scanf() reads formatted input from the user keyboard. In C, we must pass the memory address of the variable using the ampersand & operator (e.g. &x) so scanf knows where to store the data.',
    cSyntax: `scanf("%d", &variable);`,
    cExample: `int age;
printf("Enter your age: ");
scanf("%d", &age);`,
    beginnerTip:
      'The #1 beginner bug in C is forgetting the & before variable names in scanf! The & is the "address-of" operator.',
    flowchartNodes: [
      { id: '1', label: 'Prompt user for input', type: 'io' },
      { id: '2', label: 'Wait for keyboard entry', type: 'process' },
      { id: '3', label: 'Store into variable address (&var)', type: 'process' },
    ],
  },

  c_var_declare: {
    name: 'Variable Declaration',
    category: 'Variables',
    summary: 'Reserves memory for a named variable with a specific C data type.',
    explanation:
      'C is a statically-typed language. Every variable must have a declared type: int (whole numbers), float (single-precision decimals), double (high-precision decimals), or char (single characters).',
    cSyntax: `type variable_name = initial_value;`,
    cExample: `int count = 0;
float pi = 3.14159;
char grade = 'A';`,
    beginnerTip:
      'Uninitialized variables in C contain "garbage values" (whatever random bits were left in that memory slot), so always initialize them!',
    flowchartNodes: [
      { id: '1', label: 'Allocate memory block', type: 'process' },
      { id: '2', label: 'Store initial value', type: 'process' },
    ],
  },

  c_var_assign: {
    name: 'Variable Assignment',
    category: 'Variables',
    summary: 'Updates an existing variable with a new value.',
    explanation:
      'In C, the single = sign is the assignment operator. It computes the expression on the right-hand side and saves the result into the variable on the left-hand side.',
    cSyntax: `variable_name = new_value;`,
    cExample: `int total = 10;
total = total + 5; // total is now 15`,
    beginnerTip:
      'Do not confuse = (assign value) with == (check equality). This is one of the most frequent logic mistakes in C!',
  },

  c_var_get: {
    name: 'Variable Getter',
    category: 'Variables',
    summary: 'Retrieves the current value stored in a variable.',
    explanation: 'Plugging this into an expression reads the value held by that variable in memory.',
    cSyntax: `variable_name`,
    cExample: `int result = x * 2;`,
    beginnerTip: 'Variables must be declared before they can be read.',
  },

  c_arithmetic: {
    name: 'Arithmetic Operator',
    category: 'Math & Numbers',
    summary: 'Performs basic math: Addition, Subtraction, Multiplication, Division, and Modulus.',
    explanation:
      'Supports +, -, *, /, and %. In C, integer division truncates decimals (e.g. 5 / 2 equals 2, not 2.5). The modulus operator % returns the remainder after division (e.g. 7 % 3 equals 1).',
    cSyntax: `operand1 operator operand2`,
    cExample: `int quotient = 10 / 3; // 3
int remainder = 10 % 3; // 1`,
    beginnerTip:
      'To get decimal division in C, at least one of the numbers must be a float or double (e.g. 5.0 / 2 = 2.5).',
  },

  c_comparison: {
    name: 'Comparison Operator',
    category: 'Logic & Conditions',
    summary: 'Compares two values and evaluates to 1 (true) or 0 (false).',
    explanation:
      'In C, boolean values are represented as integers: 0 is false, and any non-zero value (typically 1) is true. Operators: ==, !=, <, <=, >, >=.',
    cSyntax: `expression1 == expression2`,
    cExample: `if (score >= 50) {
    printf("Passed!\\n");
}`,
    beginnerTip: 'Remember: == compares equality, while = assigns a value.',
  },

  c_logical: {
    name: 'Logical Operator (AND / OR)',
    category: 'Logic & Conditions',
    summary: 'Combines multiple conditions using AND (&&) or OR (||).',
    explanation:
      '&& requires BOTH conditions to be true. || requires AT LEAST ONE condition to be true. C uses short-circuit evaluation: if the first operand determines the result, the second is not evaluated.',
    cSyntax: `condition1 && condition2
condition1 || condition2`,
    cExample: `if (age >= 18 && hasID == 1) {
    printf("Access granted\\n");
}`,
    beginnerTip: 'Use parentheses to make complex compound conditions clear and unambiguous.',
  },

  c_if: {
    name: 'If Condition',
    category: 'Control Flow',
    summary: 'Executes a block of code only if the specified condition is true.',
    explanation:
      'Checks the condition expression inside parentheses. If it evaluates to non-zero (true), the inner block runs; otherwise, it is skipped.',
    cSyntax: `if (condition) {
    // statements
}`,
    cExample: `if (temperature > 30) {
    printf("It is a hot day!\\n");
}`,
    beginnerTip: 'Do not put a semicolon right after if(condition); as that would make the if body empty!',
    flowchartNodes: [
      { id: '1', label: 'Condition Test', type: 'decision' },
      { id: '2', label: 'Execute DO Block', type: 'process' },
      { id: '3', label: 'Continue Program', type: 'end' },
    ],
  },

  c_if_else: {
    name: 'If / Else Condition',
    category: 'Control Flow',
    summary: 'Executes one block if condition is true, or a different block if false.',
    explanation:
      'Provides two mutually exclusive execution paths. Exactly one branch is guaranteed to execute.',
    cSyntax: `if (condition) {
    // code if true
} else {
    // code if false
}`,
    cExample: `if (number % 2 == 0) {
    printf("Even number\\n");
} else {
    printf("Odd number\\n");
}`,
    beginnerTip: 'Both branches must be valid statements. Use braces { } to enclose multiple lines.',
    flowchartNodes: [
      { id: '1', label: 'Condition True?', type: 'decision' },
      { id: '2', label: 'Execute THEN Block', type: 'process' },
      { id: '3', label: 'Execute ELSE Block', type: 'process' },
      { id: '4', label: 'Merge & Continue', type: 'end' },
    ],
  },

  c_for_loop: {
    name: 'For Loop',
    category: 'Loops',
    summary: 'Repeats a block of code a set number of times with an automatic counter.',
    explanation:
      'A for loop consists of initialization (int i = 1), condition test (i <= 10), and increment (i++). It is ideal when you know in advance how many iterations are needed.',
    cSyntax: `for (int i = 1; i <= 10; i++) {
    // statements to repeat
}`,
    cExample: `for (int i = 1; i <= 5; i++) {
    printf("Count: %d\\n", i);
}`,
    beginnerTip:
      'Make sure your loop condition will eventually become false, otherwise your program will be stuck in an infinite loop!',
    flowchartNodes: [
      { id: '1', label: 'Initialize Counter i', type: 'process' },
      { id: '2', label: 'Is i <= End?', type: 'decision' },
      { id: '3', label: 'Execute Loop Body', type: 'process' },
      { id: '4', label: 'Update Counter (i += step)', type: 'process' },
      { id: '5', label: 'Exit Loop', type: 'end' },
    ],
  },

  c_while_loop: {
    name: 'While Loop',
    category: 'Loops',
    summary: 'Repeats code as long as a condition remains true.',
    explanation:
      'Evaluates the condition before every iteration. If the condition is false right from the start, the loop body will never execute even once.',
    cSyntax: `while (condition) {
    // statements
}`,
    cExample: `int n = 5;
while (n > 0) {
    printf("%d ", n);
    n--;
}`,
    beginnerTip:
      'Always remember to update the condition variable inside the while body so that the loop can terminate.',
    flowchartNodes: [
      { id: '1', label: 'Check Condition', type: 'decision' },
      { id: '2', label: 'Execute Loop Body', type: 'process' },
      { id: '3', label: 'Exit Loop', type: 'end' },
    ],
  },

  c_do_while_loop: {
    name: 'Do-While Loop',
    category: 'Loops',
    summary: 'Executes the loop body first, then checks the condition at the end.',
    explanation:
      'Guarantees that the loop body runs at least once, regardless of whether the condition is true or false initially.',
    cSyntax: `do {
    // statements
} while (condition);`,
    cExample: `int choice;
do {
    printf("Menu: 1. Play 2. Exit\\n");
    scanf("%d", &choice);
} while (choice != 2);`,
    beginnerTip: 'Notice the semicolon ; at the end of the while line in a do-while loop.',
    flowchartNodes: [
      { id: '1', label: 'Execute Loop Body', type: 'process' },
      { id: '2', label: 'Is Condition True?', type: 'decision' },
      { id: '3', label: 'Exit Loop', type: 'end' },
    ],
  },

  c_break: {
    name: 'Break Statement',
    category: 'Loops',
    summary: 'Immediately terminates the nearest enclosing loop or switch statement.',
    explanation:
      'Jumps out of the loop and resumes execution at the first statement following the loop.',
    cSyntax: `break;`,
    cExample: `for (int i = 1; i <= 10; i++) {
    if (i == 5) break;
    printf("%d ", i);
} // prints 1 2 3 4`,
    beginnerTip: 'Use break when you find the target in a search loop to avoid unnecessary iterations.',
  },

  c_continue: {
    name: 'Continue Statement',
    category: 'Loops',
    summary: 'Skips the rest of the current iteration and jumps to the next cycle.',
    explanation:
      'Bypasses the remaining code in the loop body for the current iteration and triggers the loop update/condition check for the next iteration.',
    cSyntax: `continue;`,
    cExample: `for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;
    printf("%d ", i);
} // prints 1 2 4 5`,
    beginnerTip: 'In a while loop, make sure continue does not skip your loop counter update!',
  },

  c_array_declare: {
    name: 'Array Declaration',
    category: 'Arrays',
    summary: 'Declares a contiguous collection of elements of the same type.',
    explanation:
      'An array stores multiple items under a single variable name. Elements are indexed starting from 0 up to size - 1.',
    cSyntax: `int arr[size] = {val1, val2, ...};`,
    cExample: `int numbers[5] = {10, 20, 30, 40, 50};`,
    beginnerTip:
      'C arrays are zero-indexed! An array of size 5 has indexes 0, 1, 2, 3, 4. Accessing arr[5] causes an Out of Bounds error!',
    flowchartNodes: [
      { id: '1', label: 'Allocate contiguous memory for N items', type: 'process' },
      { id: '2', label: 'Initialize element values', type: 'process' },
    ],
  },

  c_array_get: {
    name: 'Array Element Access',
    category: 'Arrays',
    summary: 'Reads the value stored at a specific 0-based index in an array.',
    explanation: 'Uses square bracket notation arr[index]. The index can be any integer variable or expression.',
    cSyntax: `array_name[index]`,
    cExample: `int firstItem = numbers[0];`,
    beginnerTip: 'Check that index is >= 0 and < array size before accessing.',
  },

  c_array_set: {
    name: 'Array Element Assignment',
    category: 'Arrays',
    summary: 'Modifies the value stored at a specific index in an array.',
    explanation: 'Replaces the element at arr[index] with a new value.',
    cSyntax: `array_name[index] = new_value;`,
    cExample: `numbers[0] = 99;`,
    beginnerTip: 'Writing to an index outside bounds can corrupt memory in C.',
  },

  c_inc_dec: {
    name: 'Increment / Decrement',
    category: 'Math & Numbers',
    summary: 'Increases (++) or decreases (--) a variable by 1.',
    explanation:
      'A shorthand operator in C. i++ is equivalent to i = i + 1, and i-- is equivalent to i = i - 1.',
    cSyntax: `variable++;
variable--;`,
    cExample: `int count = 0;
count++; // count is now 1`,
    beginnerTip: 'The ++ operator is why C++ got its name (an increment/upgrade over C)!',
  },

  c_math_func: {
    name: 'Math Library Functions',
    category: 'Math & Numbers',
    summary: 'Performs advanced mathematical functions like sqrt, abs, floor, and ceil.',
    explanation:
      'Functions from the C standard math library <math.h>. sqrt(x) calculates the square root, abs(x) returns the absolute value, floor(x) rounds down, and ceil(x) rounds up.',
    cSyntax: `sqrt(x);
abs(x);`,
    cExample: `#include <math.h>

double root = sqrt(25.0); // 5.0`,
    beginnerTip: 'When compiling standard C with math.h using gcc, the -lm flag is typically required.',
  },

  c_address_of: {
    name: 'Address-Of Operator (&)',
    category: 'Pointers & Memory',
    summary: 'Returns the exact memory address where a variable is stored in RAM.',
    explanation:
      'In C, every variable resides at a physical memory address (like 0x7ffee4). Prefixing a variable with the ampersand & operator evaluates to its memory address.',
    cSyntax: `&variable_name`,
    cExample: `int x = 10;
printf("Address of x is %p\\n", (void*)&x);`,
    beginnerTip: 'This is why scanf requires &x — it needs to know the memory address to write the user input directly into RAM!',
  },

  c_pointer_declare: {
    name: 'Pointer Declaration',
    category: 'Pointers & Memory',
    summary: 'A pointer is a special variable that stores the memory address of another variable.',
    explanation:
      'Instead of holding raw data like 42, a pointer holds the location in memory where another value lives. Declared with an asterisk * before the name (e.g. int *ptr = &x).',
    cSyntax: `type *pointer_name = &variable;`,
    cExample: `int num = 42;
int *ptr = &num; // ptr now points to num`,
    beginnerTip: 'Think of a pointer like a house address written on a piece of paper, rather than the house itself!',
  },

  c_pointer_deref: {
    name: 'Dereference Operator (*ptr)',
    category: 'Pointers & Memory',
    summary: 'Follows the memory address stored in a pointer to read the value held inside.',
    explanation:
      'When you put * in front of an existing pointer variable (*ptr), you "dereference" it. It visits the memory address stored inside ptr and retrieves the actual value.',
    cSyntax: `*pointer_name`,
    cExample: `int val = *ptr; // reads the value ptr points to`,
    beginnerTip: 'Dereferencing a NULL or invalid pointer causes a Segmentation Fault (crash) in real C programs.',
  },

  c_pointer_assign: {
    name: 'Write Through Pointer (*ptr = val)',
    category: 'Pointers & Memory',
    summary: 'Modifies the value of the original variable remotely using its pointer address.',
    explanation:
      'Assigning to *ptr modifies the contents of the memory slot that ptr points to, changing the original variable value without directly referencing its name.',
    cSyntax: `*pointer_name = new_value;`,
    cExample: `int x = 5;
int *ptr = &x;
*ptr = 100; // x is now 100!`,
    beginnerTip: 'This is how C achieves "pass-by-reference" in functions, allowing functions to mutate caller variables.',
  },

  c_return: {
    name: 'Return Statement',
    category: 'Program Structure',
    summary: 'Exits a function and optionally sends a result back to the caller.',
    explanation:
      'In main(), return 0 signals success. In other functions, return value yields the computed output.',
    cSyntax: `return expression;`,
    cExample: `return 0;`,
    beginnerTip: 'Any statements placed after a return statement in the same block will never be executed (unreachable code).',
  },
};
