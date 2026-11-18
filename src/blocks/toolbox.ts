export const TOOLBOX_DEFINITION = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Program',
      colour: '#10b981',
      contents: [
        { kind: 'block', type: 'c_main' },
        { kind: 'block', type: 'c_comment' },
      ],
    },
    {
      kind: 'category',
      name: 'Input / Output',
      colour: '#0284c7',
      contents: [
        { kind: 'block', type: 'c_print_text' },
        {
          kind: 'block',
          type: 'c_print_value',
          inputs: {
            VALUE: {
              shadow: {
                type: 'c_number',
                fields: { NUM: 10 },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'c_print_formatted',
          inputs: {
            ARG: {
              shadow: {
                type: 'c_var_get',
                fields: { VAR: 'x' },
              },
            },
          },
        },
        { kind: 'block', type: 'c_print_newline' },
        { kind: 'block', type: 'c_scanf' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#f59e0b',
      contents: [
        {
          kind: 'block',
          type: 'c_var_declare',
          inputs: {
            VALUE: {
              shadow: {
                type: 'c_number',
                fields: { NUM: 0 },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'c_var_assign',
          inputs: {
            VALUE: {
              shadow: {
                type: 'c_number',
                fields: { NUM: 1 },
              },
            },
          },
        },
        { kind: 'block', type: 'c_var_get' },
      ],
    },
    {
      kind: 'category',
      name: 'Math & Numbers',
      colour: '#8b5cf6',
      contents: [
        { kind: 'block', type: 'c_number' },
        { kind: 'block', type: 'c_string' },
        { kind: 'block', type: 'c_char' },
        {
          kind: 'block',
          type: 'c_arithmetic',
          inputs: {
            A: { shadow: { type: 'c_number', fields: { NUM: 5 } } },
            B: { shadow: { type: 'c_number', fields: { NUM: 2 } } },
          },
        },
        { kind: 'block', type: 'c_inc_dec' },
        {
          kind: 'block',
          type: 'c_math_func',
          inputs: {
            ARG: { shadow: { type: 'c_number', fields: { NUM: 16 } } },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Logic & Conditions',
      colour: '#ec4899',
      contents: [
        { kind: 'block', type: 'c_boolean' },
        {
          kind: 'block',
          type: 'c_comparison',
          inputs: {
            A: { shadow: { type: 'c_number', fields: { NUM: 5 } } },
            B: { shadow: { type: 'c_number', fields: { NUM: 10 } } },
          },
        },
        {
          kind: 'block',
          type: 'c_logical',
        },
        {
          kind: 'block',
          type: 'c_logical_not',
        },
        { kind: 'block', type: 'c_if' },
        { kind: 'block', type: 'c_if_else' },
        { kind: 'block', type: 'c_if_elseif_else' },
      ],
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '#6366f1',
      contents: [
        { kind: 'block', type: 'c_for_loop' },
        { kind: 'block', type: 'c_while_loop' },
        { kind: 'block', type: 'c_do_while_loop' },
        { kind: 'block', type: 'c_break' },
        { kind: 'block', type: 'c_continue' },
      ],
    },
    {
      kind: 'category',
      name: 'Arrays',
      colour: '#14b8a6',
      contents: [
        { kind: 'block', type: 'c_array_declare' },
        {
          kind: 'block',
          type: 'c_array_get',
          inputs: {
            INDEX: { shadow: { type: 'c_number', fields: { NUM: 0 } } },
          },
        },
        {
          kind: 'block',
          type: 'c_array_set',
          inputs: {
            INDEX: { shadow: { type: 'c_number', fields: { NUM: 0 } } },
            VALUE: { shadow: { type: 'c_number', fields: { NUM: 100 } } },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Pointers & Memory',
      colour: '#0ea5e9',
      contents: [
        {
          kind: 'block',
          type: 'c_pointer_declare',
          inputs: {
            VALUE: {
              block: {
                type: 'c_address_of',
                fields: { VAR: 'x' },
              },
            },
          },
        },
        { kind: 'block', type: 'c_address_of' },
        { kind: 'block', type: 'c_pointer_deref' },
        {
          kind: 'block',
          type: 'c_pointer_assign',
          inputs: {
            VALUE: { shadow: { type: 'c_number', fields: { NUM: 99 } } },
          },
        },
      ],
    },
  ],
};
