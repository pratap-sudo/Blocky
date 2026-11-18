export interface TestCase {
  inputs: string[];
  expectedOutputSubstring: string;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  hints: string[];
  testCases: TestCase[];
}

export const CODING_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1-hello',
    title: '1. Hello C Coder',
    difficulty: 'Easy',
    description: 'Create a visual program that prints "Hello, C!" to the console.',
    hints: ['Use the "print text" block inside "Program Start".', 'Make sure "newline" is checked.'],
    testCases: [
      {
        inputs: [],
        expectedOutputSubstring: 'Hello, C!',
        description: 'Outputs "Hello, C!"',
      },
    ],
  },
  {
    id: 'ch-2-sum',
    title: '2. Add Two Numbers',
    difficulty: 'Easy',
    description: 'Ask the user to enter two integers using input (scanf), add them together, and print their sum.',
    hints: [
      'Declare two variables: a and b.',
      'Use two "input int into variable" blocks.',
      'Use arithmetic addition (+) and print the result.',
    ],
    testCases: [
      {
        inputs: ['10', '20'],
        expectedOutputSubstring: '30',
        description: 'Input: 10 and 20 => Output: 30',
      },
      {
        inputs: ['7', '8'],
        expectedOutputSubstring: '15',
        description: 'Input: 7 and 8 => Output: 15',
      },
    ],
  },
  {
    id: 'ch-3-even-odd',
    title: '3. Even or Odd',
    difficulty: 'Easy',
    description: 'Read an integer from the user. If it is evenly divisible by 2, print "Even", otherwise print "Odd".',
    hints: [
      'Use the modulus operator (%) to calculate remainder.',
      'If num % 2 == 0, print "Even", else print "Odd".',
    ],
    testCases: [
      {
        inputs: ['4'],
        expectedOutputSubstring: 'Even',
        description: 'Input: 4 => Output: Even',
      },
      {
        inputs: ['9'],
        expectedOutputSubstring: 'Odd',
        description: 'Input: 9 => Output: Odd',
      },
    ],
  },
  {
    id: 'ch-4-largest-two',
    title: '4. Maximum of Two',
    difficulty: 'Easy',
    description: 'Ask the user for two integers x and y, and print whichever number is larger.',
    hints: ['Compare if x > y. If true, print x; else print y.'],
    testCases: [
      {
        inputs: ['15', '8'],
        expectedOutputSubstring: '15',
        description: 'Input: 15 and 8 => Output: 15',
      },
      {
        inputs: ['4', '99'],
        expectedOutputSubstring: '99',
        description: 'Input: 4 and 99 => Output: 99',
      },
    ],
  },
  {
    id: 'ch-5-loop-count',
    title: '5. Loop Count 1 to 5',
    difficulty: 'Medium',
    description: 'Use a for loop to print consecutive numbers from 1 to 5.',
    hints: [
      'Use the "for i = 1 to 5 step 1" block.',
      'Inside the loop, use "print value" with variable i.',
    ],
    testCases: [
      {
        inputs: [],
        expectedOutputSubstring: '5',
        description: 'Must loop and reach number 5',
      },
    ],
  },
  {
    id: 'ch-6-factorial',
    title: '6. Factorial of N',
    difficulty: 'Medium',
    description: 'Read an integer N, calculate its factorial (N! = 1 * 2 * ... * N), and print the result.',
    hints: [
      'Initialize variable fact = 1.',
      'Loop i from 1 to N, updating fact = fact * i.',
      'After the loop, print fact.',
    ],
    testCases: [
      {
        inputs: ['4'],
        expectedOutputSubstring: '24',
        description: 'Input: 4 => 4! = 24',
      },
      {
        inputs: ['5'],
        expectedOutputSubstring: '120',
        description: 'Input: 5 => 5! = 120',
      },
    ],
  },
  {
    id: 'ch-7-mult-table',
    title: '7. Multiplication Table',
    difficulty: 'Medium',
    description: 'Read a number N and print its first 3 multiples (N*1, N*2, N*3).',
    hints: ['Loop from 1 to 3 and print N * i.'],
    testCases: [
      {
        inputs: ['5'],
        expectedOutputSubstring: '15',
        description: 'Input: 5 => Multiples up to 15 (5, 10, 15)',
      },
      {
        inputs: ['7'],
        expectedOutputSubstring: '21',
        description: 'Input: 7 => Multiples up to 21 (7, 14, 21)',
      },
    ],
  },
  {
    id: 'ch-8-array-search',
    title: '8. Search in Array',
    difficulty: 'Hard',
    description: 'Declare an array with {10, 20, 30, 40, 50}. Ask the user for a number to search, and if found, print "Found".',
    hints: [
      'Declare array numbers[5] = {10, 20, 30, 40, 50}.',
      'Loop i from 0 to 4. If numbers[i] == target, print "Found" and break.',
    ],
    testCases: [
      {
        inputs: ['30'],
        expectedOutputSubstring: 'Found',
        description: 'Search 30 in array => prints "Found"',
      },
    ],
  },
];
