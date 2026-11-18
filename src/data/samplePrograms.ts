export interface SampleProgram {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate';
  category: 'Basics' | 'Conditionals' | 'Loops' | 'Arrays' | 'Math';
  tags: string[];
  blockState: any;
}

export const SAMPLE_PROGRAMS: SampleProgram[] = [
  // 1. Hello World
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'The classic introductory C program. Prints a welcoming greeting message to the console.',
    difficulty: 'Beginner',
    category: 'Basics',
    tags: ['printf', 'main', 'basics'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_print_text',
                  fields: { TEXT: 'Hello, World! Welcome to C.', NEWLINE: 'TRUE' },
                  next: {
                    block: {
                      type: 'c_print_text',
                      fields: { TEXT: 'Learning C with visual blocks is fun!', NEWLINE: 'TRUE' },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 2. Add Two Numbers
  {
    id: 'add-two-numbers',
    title: 'Add Two Numbers',
    description: 'Prompts the user for two integers using scanf, adds them together, and prints the result.',
    difficulty: 'Beginner',
    category: 'Basics',
    tags: ['scanf', 'printf', 'variables', 'arithmetic'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'a' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 'b' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                      next: {
                        block: {
                          type: 'c_scanf',
                          fields: { TYPE: 'int', VAR: 'a', PROMPT: 'Enter first number: ' },
                          next: {
                            block: {
                              type: 'c_scanf',
                              fields: { TYPE: 'int', VAR: 'b', PROMPT: 'Enter second number: ' },
                              next: {
                                block: {
                                  type: 'c_var_declare',
                                  fields: { TYPE: 'int', VAR: 'sum' },
                                  inputs: {
                                    VALUE: {
                                      block: {
                                        type: 'c_arithmetic',
                                        fields: { OP: 'ADD' },
                                        inputs: {
                                          A: { block: { type: 'c_var_get', fields: { VAR: 'a' } } },
                                          B: { block: { type: 'c_var_get', fields: { VAR: 'b' } } },
                                        },
                                      },
                                    },
                                  },
                                  next: {
                                    block: {
                                      type: 'c_print_formatted',
                                      fields: { FORMAT: 'Result: Sum = %d', NEWLINE: 'TRUE' },
                                      inputs: {
                                        ARG: { block: { type: 'c_var_get', fields: { VAR: 'sum' } } },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 3. Even or Odd
  {
    id: 'even-or-odd',
    title: 'Even or Odd',
    description: 'Uses the modulus operator (%) to check if an entered number is evenly divisible by 2.',
    difficulty: 'Beginner',
    category: 'Conditionals',
    tags: ['if-else', 'modulus', 'conditionals'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'num' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                  next: {
                    block: {
                      type: 'c_scanf',
                      fields: { TYPE: 'int', VAR: 'num', PROMPT: 'Enter an integer: ' },
                      next: {
                        block: {
                          type: 'c_if_else',
                          inputs: {
                            CONDITION: {
                              block: {
                                type: 'c_comparison',
                                fields: { OP: 'EQ' },
                                inputs: {
                                  A: {
                                    block: {
                                      type: 'c_arithmetic',
                                      fields: { OP: 'MOD' },
                                      inputs: {
                                        A: { block: { type: 'c_var_get', fields: { VAR: 'num' } } },
                                        B: { shadow: { type: 'c_number', fields: { NUM: 2 } } },
                                      },
                                    },
                                  },
                                  B: { shadow: { type: 'c_number', fields: { NUM: 0 } } },
                                },
                              },
                            },
                            DO: {
                              block: {
                                type: 'c_print_formatted',
                                fields: { FORMAT: '%d is an EVEN number.', NEWLINE: 'TRUE' },
                                inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'num' } } } },
                              },
                            },
                            ELSE: {
                              block: {
                                type: 'c_print_formatted',
                                fields: { FORMAT: '%d is an ODD number.', NEWLINE: 'TRUE' },
                                inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'num' } } } },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 4. Positive or Negative
  {
    id: 'positive-or-negative',
    title: 'Positive or Negative',
    description: 'Checks whether an entered number is positive, negative, or zero using if / else if / else.',
    difficulty: 'Beginner',
    category: 'Conditionals',
    tags: ['if-elseif-else', 'comparison'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'n' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                  next: {
                    block: {
                      type: 'c_scanf',
                      fields: { TYPE: 'int', VAR: 'n', PROMPT: 'Enter any number: ' },
                      next: {
                        block: {
                          type: 'c_if_elseif_else',
                          inputs: {
                            COND1: {
                              block: {
                                type: 'c_comparison',
                                fields: { OP: 'GT' },
                                inputs: {
                                  A: { block: { type: 'c_var_get', fields: { VAR: 'n' } } },
                                  B: { shadow: { type: 'c_number', fields: { NUM: 0 } } },
                                },
                              },
                            },
                            DO1: {
                              block: {
                                type: 'c_print_text',
                                fields: { TEXT: 'The number is POSITIVE.', NEWLINE: 'TRUE' },
                              },
                            },
                            COND2: {
                              block: {
                                type: 'c_comparison',
                                fields: { OP: 'LT' },
                                inputs: {
                                  A: { block: { type: 'c_var_get', fields: { VAR: 'n' } } },
                                  B: { shadow: { type: 'c_number', fields: { NUM: 0 } } },
                                },
                              },
                            },
                            DO2: {
                              block: {
                                type: 'c_print_text',
                                fields: { TEXT: 'The number is NEGATIVE.', NEWLINE: 'TRUE' },
                              },
                            },
                            ELSE: {
                              block: {
                                type: 'c_print_text',
                                fields: { TEXT: 'The number is ZERO.', NEWLINE: 'TRUE' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 5. Find Largest of Two Numbers
  {
    id: 'largest-two-numbers',
    title: 'Find Largest of Two Numbers',
    description: 'Compares two input values and prints which one is greater.',
    difficulty: 'Beginner',
    category: 'Conditionals',
    tags: ['comparison', 'if-else'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'x' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 'y' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                      next: {
                        block: {
                          type: 'c_scanf',
                          fields: { TYPE: 'int', VAR: 'x', PROMPT: 'Enter first number x: ' },
                          next: {
                            block: {
                              type: 'c_scanf',
                              fields: { TYPE: 'int', VAR: 'y', PROMPT: 'Enter second number y: ' },
                              next: {
                                block: {
                                  type: 'c_if_else',
                                  inputs: {
                                    CONDITION: {
                                      block: {
                                        type: 'c_comparison',
                                        fields: { OP: 'GT' },
                                        inputs: {
                                          A: { block: { type: 'c_var_get', fields: { VAR: 'x' } } },
                                          B: { block: { type: 'c_var_get', fields: { VAR: 'y' } } },
                                        },
                                      },
                                    },
                                    DO: {
                                      block: {
                                        type: 'c_print_formatted',
                                        fields: { FORMAT: '%d is larger than the other number.', NEWLINE: 'TRUE' },
                                        inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'x' } } } },
                                      },
                                    },
                                    ELSE: {
                                      block: {
                                        type: 'c_print_formatted',
                                        fields: { FORMAT: '%d is larger or equal.', NEWLINE: 'TRUE' },
                                        inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'y' } } } },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 6. Find Largest of Three Numbers
  {
    id: 'largest-three-numbers',
    title: 'Find Largest of Three Numbers',
    description: 'Finds the maximum of 3 numbers using logical AND (&&) compound conditions.',
    difficulty: 'Intermediate',
    category: 'Conditionals',
    tags: ['logical-and', 'comparison', 'if-elseif-else'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'a' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 'b' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                      next: {
                        block: {
                          type: 'c_var_declare',
                          fields: { TYPE: 'int', VAR: 'c' },
                          inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                          next: {
                            block: {
                              type: 'c_scanf',
                              fields: { TYPE: 'int', VAR: 'a', PROMPT: 'Enter a: ' },
                              next: {
                                block: {
                                  type: 'c_scanf',
                                  fields: { TYPE: 'int', VAR: 'b', PROMPT: 'Enter b: ' },
                                  next: {
                                    block: {
                                      type: 'c_scanf',
                                      fields: { TYPE: 'int', VAR: 'c', PROMPT: 'Enter c: ' },
                                      next: {
                                        block: {
                                          type: 'c_if_elseif_else',
                                          inputs: {
                                            COND1: {
                                              block: {
                                                type: 'c_logical',
                                                fields: { OP: 'AND' },
                                                inputs: {
                                                  A: {
                                                    block: {
                                                      type: 'c_comparison',
                                                      fields: { OP: 'GTE' },
                                                      inputs: {
                                                        A: { block: { type: 'c_var_get', fields: { VAR: 'a' } } },
                                                        B: { block: { type: 'c_var_get', fields: { VAR: 'b' } } },
                                                      },
                                                    },
                                                  },
                                                  B: {
                                                    block: {
                                                      type: 'c_comparison',
                                                      fields: { OP: 'GTE' },
                                                      inputs: {
                                                        A: { block: { type: 'c_var_get', fields: { VAR: 'a' } } },
                                                        B: { block: { type: 'c_var_get', fields: { VAR: 'c' } } },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                            DO1: {
                                              block: {
                                                type: 'c_print_formatted',
                                                fields: { FORMAT: 'Largest number is a = %d', NEWLINE: 'TRUE' },
                                                inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'a' } } } },
                                              },
                                            },
                                            COND2: {
                                              block: {
                                                type: 'c_comparison',
                                                fields: { OP: 'GTE' },
                                                inputs: {
                                                  A: { block: { type: 'c_var_get', fields: { VAR: 'b' } } },
                                                  B: { block: { type: 'c_var_get', fields: { VAR: 'c' } } },
                                                },
                                              },
                                            },
                                            DO2: {
                                              block: {
                                                type: 'c_print_formatted',
                                                fields: { FORMAT: 'Largest number is b = %d', NEWLINE: 'TRUE' },
                                                inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'b' } } } },
                                              },
                                            },
                                            ELSE: {
                                              block: {
                                                type: 'c_print_formatted',
                                                fields: { FORMAT: 'Largest number is c = %d', NEWLINE: 'TRUE' },
                                                inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'c' } } } },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 7. Print Numbers 1 to 10
  {
    id: 'print-1-to-10',
    title: 'Print Numbers 1 to 10',
    description: 'Uses a for loop counter from 1 to 10 to display consecutive integers.',
    difficulty: 'Beginner',
    category: 'Loops',
    tags: ['for-loop', 'counter', 'loops'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_print_text',
                  fields: { TEXT: 'Counting from 1 to 10:', NEWLINE: 'TRUE' },
                  next: {
                    block: {
                      type: 'c_for_loop',
                      fields: { VAR: 'i', START: 1, END: 10, STEP: 1 },
                      inputs: {
                        DO: {
                          block: {
                            type: 'c_print_value',
                            fields: { NEWLINE: 'TRUE' },
                            inputs: {
                              VALUE: { block: { type: 'c_var_get', fields: { VAR: 'i' } } },
                            },
                          },
                        },
                      },
                      next: {
                        block: {
                          type: 'c_print_text',
                          fields: { TEXT: 'Done counting!', NEWLINE: 'TRUE' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 8. Multiplication Table
  {
    id: 'multiplication-table',
    title: 'Multiplication Table',
    description: 'Generates a full multiplication table from 1 to 10 for any given number.',
    difficulty: 'Beginner',
    category: 'Loops',
    tags: ['for-loop', 'multiplication', 'arithmetic'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'n' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 5 } } } },
                  next: {
                    block: {
                      type: 'c_scanf',
                      fields: { TYPE: 'int', VAR: 'n', PROMPT: 'Enter number for table: ' },
                      next: {
                        block: {
                          type: 'c_for_loop',
                          fields: { VAR: 'i', START: 1, END: 10, STEP: 1 },
                          inputs: {
                            DO: {
                              block: {
                                type: 'c_print_formatted',
                                fields: { FORMAT: '%d', NEWLINE: 'TRUE' },
                                inputs: {
                                  ARG: {
                                    block: {
                                      type: 'c_arithmetic',
                                      fields: { OP: 'MUL' },
                                      inputs: {
                                        A: { block: { type: 'c_var_get', fields: { VAR: 'n' } } },
                                        B: { block: { type: 'c_var_get', fields: { VAR: 'i' } } },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 9. Sum of First N Numbers
  {
    id: 'sum-of-n',
    title: 'Sum of First N Numbers',
    description: 'Calculates the sum of numbers 1 + 2 + ... + N using an accumulator variable.',
    difficulty: 'Beginner',
    category: 'Loops',
    tags: ['accumulator', 'for-loop', 'math'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'n' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 5 } } } },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 'sum' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                      next: {
                        block: {
                          type: 'c_scanf',
                          fields: { TYPE: 'int', VAR: 'n', PROMPT: 'Enter positive integer N: ' },
                          next: {
                            block: {
                              type: 'c_for_loop',
                              fields: { VAR: 'i', START: 1, END: 5, STEP: 1 },
                              inputs: {
                                DO: {
                                  block: {
                                    type: 'c_var_assign',
                                    fields: { VAR: 'sum' },
                                    inputs: {
                                      VALUE: {
                                        block: {
                                          type: 'c_arithmetic',
                                          fields: { OP: 'ADD' },
                                          inputs: {
                                            A: { block: { type: 'c_var_get', fields: { VAR: 'sum' } } },
                                            B: { block: { type: 'c_var_get', fields: { VAR: 'i' } } },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              next: {
                                block: {
                                  type: 'c_print_formatted',
                                  fields: { FORMAT: 'Total sum = %d', NEWLINE: 'TRUE' },
                                  inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'sum' } } } },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 10. Factorial
  {
    id: 'factorial',
    title: 'Factorial of a Number',
    description: 'Computes N! (N factorial = 1 * 2 * ... * N) using iterative multiplication.',
    difficulty: 'Intermediate',
    category: 'Math',
    tags: ['factorial', 'multiplication', 'math'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'fact' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 1 } } } },
                  next: {
                    block: {
                      type: 'c_for_loop',
                      fields: { VAR: 'i', START: 1, END: 5, STEP: 1 },
                      inputs: {
                        DO: {
                          block: {
                            type: 'c_var_assign',
                            fields: { VAR: 'fact' },
                            inputs: {
                              VALUE: {
                                block: {
                                  type: 'c_arithmetic',
                                  fields: { OP: 'MUL' },
                                  inputs: {
                                    A: { block: { type: 'c_var_get', fields: { VAR: 'fact' } } },
                                    B: { block: { type: 'c_var_get', fields: { VAR: 'i' } } },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      next: {
                        block: {
                          type: 'c_print_formatted',
                          fields: { FORMAT: 'Factorial of 5 = %d', NEWLINE: 'TRUE' },
                          inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'fact' } } } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 11. Fibonacci Series
  {
    id: 'fibonacci-series',
    title: 'Fibonacci Series',
    description: 'Generates the Fibonacci sequence (0, 1, 1, 2, 3, 5, 8...) by summing previous terms.',
    difficulty: 'Intermediate',
    category: 'Math',
    tags: ['fibonacci', 'sequence', 'while-loop'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 't1' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 't2' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 1 } } } },
                      next: {
                        block: {
                          type: 'c_var_declare',
                          fields: { TYPE: 'int', VAR: 'nextTerm' },
                          inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                          next: {
                            block: {
                              type: 'c_print_text',
                              fields: { TEXT: 'First 8 Fibonacci terms:', NEWLINE: 'TRUE' },
                              next: {
                                block: {
                                  type: 'c_for_loop',
                                  fields: { VAR: 'i', START: 1, END: 8, STEP: 1 },
                                  inputs: {
                                    DO: {
                                      block: {
                                        type: 'c_print_formatted',
                                        fields: { FORMAT: '%d', NEWLINE: 'TRUE' },
                                        inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 't1' } } } },
                                        next: {
                                          block: {
                                            type: 'c_var_assign',
                                            fields: { VAR: 'nextTerm' },
                                            inputs: {
                                              VALUE: {
                                                block: {
                                                  type: 'c_arithmetic',
                                                  fields: { OP: 'ADD' },
                                                  inputs: {
                                                    A: { block: { type: 'c_var_get', fields: { VAR: 't1' } } },
                                                    B: { block: { type: 'c_var_get', fields: { VAR: 't2' } } },
                                                  },
                                                },
                                              },
                                            },
                                            next: {
                                              block: {
                                                type: 'c_var_assign',
                                                fields: { VAR: 't1' },
                                                inputs: { VALUE: { block: { type: 'c_var_get', fields: { VAR: 't2' } } } },
                                                next: {
                                                  block: {
                                                    type: 'c_var_assign',
                                                    fields: { VAR: 't2' },
                                                    inputs: { VALUE: { block: { type: 'c_var_get', fields: { VAR: 'nextTerm' } } } },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 12. Simple Calculator
  {
    id: 'simple-calculator',
    title: 'Simple Calculator',
    description: 'Performs arithmetic calculation based on user choice (1 for Add, 2 for Subtract, 3 for Multiply).',
    difficulty: 'Intermediate',
    category: 'Conditionals',
    tags: ['calculator', 'menu', 'conditionals'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'num1' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 10 } } } },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 'num2' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 5 } } } },
                      next: {
                        block: {
                          type: 'c_var_declare',
                          fields: { TYPE: 'int', VAR: 'choice' },
                          inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 1 } } } },
                          next: {
                            block: {
                              type: 'c_scanf',
                              fields: { TYPE: 'int', VAR: 'num1', PROMPT: 'Enter first number: ' },
                              next: {
                                block: {
                                  type: 'c_scanf',
                                  fields: { TYPE: 'int', VAR: 'num2', PROMPT: 'Enter second number: ' },
                                  next: {
                                    block: {
                                      type: 'c_scanf',
                                      fields: { TYPE: 'int', VAR: 'choice', PROMPT: 'Choose (1=Add, 2=Sub, 3=Mul): ' },
                                      next: {
                                        block: {
                                          type: 'c_if_elseif_else',
                                          inputs: {
                                            COND1: {
                                              block: {
                                                type: 'c_comparison',
                                                fields: { OP: 'EQ' },
                                                inputs: {
                                                  A: { block: { type: 'c_var_get', fields: { VAR: 'choice' } } },
                                                  B: { shadow: { type: 'c_number', fields: { NUM: 1 } } },
                                                },
                                              },
                                            },
                                            DO1: {
                                              block: {
                                                type: 'c_print_formatted',
                                                fields: { FORMAT: 'Result (Addition) = %d', NEWLINE: 'TRUE' },
                                                inputs: {
                                                  ARG: {
                                                    block: {
                                                      type: 'c_arithmetic',
                                                      fields: { OP: 'ADD' },
                                                      inputs: {
                                                        A: { block: { type: 'c_var_get', fields: { VAR: 'num1' } } },
                                                        B: { block: { type: 'c_var_get', fields: { VAR: 'num2' } } },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                            COND2: {
                                              block: {
                                                type: 'c_comparison',
                                                fields: { OP: 'EQ' },
                                                inputs: {
                                                  A: { block: { type: 'c_var_get', fields: { VAR: 'choice' } } },
                                                  B: { shadow: { type: 'c_number', fields: { NUM: 2 } } },
                                                },
                                              },
                                            },
                                            DO2: {
                                              block: {
                                                type: 'c_print_formatted',
                                                fields: { FORMAT: 'Result (Subtraction) = %d', NEWLINE: 'TRUE' },
                                                inputs: {
                                                  ARG: {
                                                    block: {
                                                      type: 'c_arithmetic',
                                                      fields: { OP: 'SUB' },
                                                      inputs: {
                                                        A: { block: { type: 'c_var_get', fields: { VAR: 'num1' } } },
                                                        B: { block: { type: 'c_var_get', fields: { VAR: 'num2' } } },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                            ELSE: {
                                              block: {
                                                type: 'c_print_formatted',
                                                fields: { FORMAT: 'Result (Multiplication) = %d', NEWLINE: 'TRUE' },
                                                inputs: {
                                                  ARG: {
                                                    block: {
                                                      type: 'c_arithmetic',
                                                      fields: { OP: 'MUL' },
                                                      inputs: {
                                                        A: { block: { type: 'c_var_get', fields: { VAR: 'num1' } } },
                                                        B: { block: { type: 'c_var_get', fields: { VAR: 'num2' } } },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 13. Linear Search in Array
  {
    id: 'linear-search',
    title: 'Linear Search in Array',
    description: 'Searches through an array sequentially to find the index of a target element.',
    difficulty: 'Intermediate',
    category: 'Arrays',
    tags: ['array', 'search', 'break'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_array_declare',
                  fields: { TYPE: 'int', VAR: 'scores', SIZE: 5, VALUES: '10, 25, 40, 55, 70' },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 'target' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 40 } } } },
                      next: {
                        block: {
                          type: 'c_scanf',
                          fields: { TYPE: 'int', VAR: 'target', PROMPT: 'Enter number to search (e.g. 40): ' },
                          next: {
                            block: {
                              type: 'c_var_declare',
                              fields: { TYPE: 'int', VAR: 'foundIndex' },
                              inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: -1 } } } },
                              next: {
                                block: {
                                  type: 'c_for_loop',
                                  fields: { VAR: 'i', START: 0, END: 4, STEP: 1 },
                                  inputs: {
                                    DO: {
                                      block: {
                                        type: 'c_if',
                                        inputs: {
                                          CONDITION: {
                                            block: {
                                              type: 'c_comparison',
                                              fields: { OP: 'EQ' },
                                              inputs: {
                                                A: {
                                                  block: {
                                                    type: 'c_array_get',
                                                    fields: { VAR: 'scores' },
                                                    inputs: { INDEX: { block: { type: 'c_var_get', fields: { VAR: 'i' } } } },
                                                  },
                                                },
                                                B: { block: { type: 'c_var_get', fields: { VAR: 'target' } } },
                                              },
                                            },
                                          },
                                          DO: {
                                            block: {
                                              type: 'c_var_assign',
                                              fields: { VAR: 'foundIndex' },
                                              inputs: { VALUE: { block: { type: 'c_var_get', fields: { VAR: 'i' } } } },
                                              next: { block: { type: 'c_break' } },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  next: {
                                    block: {
                                      type: 'c_if_else',
                                      inputs: {
                                        CONDITION: {
                                          block: {
                                            type: 'c_comparison',
                                            fields: { OP: 'NEQ' },
                                            inputs: {
                                              A: { block: { type: 'c_var_get', fields: { VAR: 'foundIndex' } } },
                                              B: { shadow: { type: 'c_number', fields: { NUM: -1 } } },
                                            },
                                          },
                                        },
                                        DO: {
                                          block: {
                                            type: 'c_print_formatted',
                                            fields: { FORMAT: 'Target found at index: %d', NEWLINE: 'TRUE' },
                                            inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'foundIndex' } } } },
                                          },
                                        },
                                        ELSE: {
                                          block: {
                                            type: 'c_print_text',
                                            fields: { TEXT: 'Target not found in array.', NEWLINE: 'TRUE' },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 14. Reverse a Number
  {
    id: 'reverse-number',
    title: 'Reverse a Number',
    description: 'Reverses the digits of an integer using a while loop and arithmetic (mod 10 and div 10).',
    difficulty: 'Intermediate',
    category: 'Math',
    tags: ['while-loop', 'modulus', 'arithmetic'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'n' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 1234 } } } },
                  next: {
                    block: {
                      type: 'c_var_declare',
                      fields: { TYPE: 'int', VAR: 'rev' },
                      inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 0 } } } },
                      next: {
                        block: {
                          type: 'c_scanf',
                          fields: { TYPE: 'int', VAR: 'n', PROMPT: 'Enter integer to reverse: ' },
                          next: {
                            block: {
                              type: 'c_while_loop',
                              inputs: {
                                CONDITION: {
                                  block: {
                                    type: 'c_comparison',
                                    fields: { OP: 'GT' },
                                    inputs: {
                                      A: { block: { type: 'c_var_get', fields: { VAR: 'n' } } },
                                      B: { shadow: { type: 'c_number', fields: { NUM: 0 } } },
                                    },
                                  },
                                },
                                DO: {
                                  block: {
                                    type: 'c_var_assign',
                                    fields: { VAR: 'rev' },
                                    inputs: {
                                      VALUE: {
                                        block: {
                                          type: 'c_arithmetic',
                                          fields: { OP: 'ADD' },
                                          inputs: {
                                            A: {
                                              block: {
                                                type: 'c_arithmetic',
                                                fields: { OP: 'MUL' },
                                                inputs: {
                                                  A: { block: { type: 'c_var_get', fields: { VAR: 'rev' } } },
                                                  B: { shadow: { type: 'c_number', fields: { NUM: 10 } } },
                                                },
                                              },
                                            },
                                            B: {
                                              block: {
                                                type: 'c_arithmetic',
                                                fields: { OP: 'MOD' },
                                                inputs: {
                                                  A: { block: { type: 'c_var_get', fields: { VAR: 'n' } } },
                                                  B: { shadow: { type: 'c_number', fields: { NUM: 10 } } },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                    next: {
                                      block: {
                                        type: 'c_var_assign',
                                        fields: { VAR: 'n' },
                                        inputs: {
                                          VALUE: {
                                            block: {
                                              type: 'c_arithmetic',
                                              fields: { OP: 'DIV' },
                                              inputs: {
                                                A: { block: { type: 'c_var_get', fields: { VAR: 'n' } } },
                                                B: { shadow: { type: 'c_number', fields: { NUM: 10 } } },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              next: {
                                block: {
                                  type: 'c_print_formatted',
                                  fields: { FORMAT: 'Reversed number = %d', NEWLINE: 'TRUE' },
                                  inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'rev' } } } },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },

  // 15. Introduction to Pointers
  {
    id: 'pointers-intro',
    title: 'Introduction to Pointers',
    description: 'Demonstrates creating a pointer int *ptr = &x, reading its address, and modifying x through *ptr.',
    difficulty: 'Intermediate',
    category: 'Basics',
    tags: ['pointers', 'memory', 'address'],
    blockState: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'c_main',
            x: 60,
            y: 40,
            inputs: {
              STACK: {
                block: {
                  type: 'c_var_declare',
                  fields: { TYPE: 'int', VAR: 'x' },
                  inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 42 } } } },
                  next: {
                    block: {
                      type: 'c_pointer_declare',
                      fields: { TYPE: 'int*', VAR: 'ptr' },
                      inputs: {
                        VALUE: {
                          block: {
                            type: 'c_address_of',
                            fields: { VAR: 'x' },
                          },
                        },
                      },
                      next: {
                        block: {
                          type: 'c_print_formatted',
                          fields: { FORMAT: 'Initial value of x = %d', NEWLINE: 'TRUE' },
                          inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'x' } } } },
                          next: {
                            block: {
                              type: 'c_pointer_assign',
                              fields: { VAR: 'ptr' },
                              inputs: { VALUE: { shadow: { type: 'c_number', fields: { NUM: 100 } } } },
                              next: {
                                block: {
                                  type: 'c_print_formatted',
                                  fields: { FORMAT: 'Modified via pointer: x is now %d!', NEWLINE: 'TRUE' },
                                  inputs: { ARG: { block: { type: 'c_var_get', fields: { VAR: 'x' } } } },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
];
