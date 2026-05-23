import type { Snapshot } from '../../types';

const recordFrame = (
  frames: Snapshot[],
  arrayState: number[],
  activeIndices: number[],
  explanation: string,
  currentLine: number,
) => {
  frames.push({
    step: frames.length,
    arrayState: [...arrayState],
    activeIndices: [...activeIndices],
    sortedIndices: [],
    currentLine,
    explanation,
  });
};

export function generateStackPushPopTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const stack: number[] = [];
  const values = [4, 9, 2, 7];

  recordFrame(frames, stack, [], 'Starting stack push operations.', 1);

  values.forEach((value) => {
    stack.unshift(value);
    recordFrame(frames, stack, [0], `Pushed ${value} onto the stack.`, 2);
  });

  recordFrame(frames, stack, [0], `Peeked at the top element ${stack[0]}.`, 3);

  const popped = stack.shift();
  recordFrame(frames, stack, [0], `Popped ${popped} from the stack.`, 4);

  stack.unshift(13);
  recordFrame(frames, stack, [0], 'Pushed 13 back onto the stack.', 5);

  return frames;
}

export function generateExpressionConversionTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const stack: string[] = [];
  const expression = 'A+B*C';
  const result: string[] = [];

  const record = (active: number[], explanation: string, line: number) => {
    const representation = [...result].map((token) => token.charCodeAt(0));
    recordFrame(frames, representation, active, explanation, line);
  };

  record([], `Converting infix expression ${expression} to postfix.`, 1);
  stack.push('(');
  record([], 'Pushed opening parenthesis onto stack.', 2);
  result.push('A');
  record([], 'Appended operand A to output.', 3);
  stack.push('+');
  record([stack.length - 1], 'Pushed operator + to stack.', 4);
  stack.push('*');
  record([stack.length - 1], 'Pushed operator * to stack.', 5);
  result.push('B');
  record([], 'Appended operand B to output.', 6);
  result.push('C');
  record([], 'Appended operand C to output.', 7);
  record([], 'Final postfix result is A B C * +.', 8);

  return frames;
}

export function generatePostfixEvaluationTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const stack: number[] = [];
  const tokens = ['2', '3', '4', '*', '+'];

  const record = (active: number[], explanation: string, line: number) => recordFrame(frames, stack, active, explanation, line);
  record([], 'Starting postfix evaluation for 2 3 4 * +.', 1);

  tokens.forEach((token, index) => {
    if (/^[0-9]+$/.test(token)) {
      stack.push(Number(token));
      record([stack.length - 1], `Pushed operand ${token} onto stack.`, 2 + index);
      return;
    }

    const right = stack.pop() ?? 0;
    const left = stack.pop() ?? 0;
    const result = token === '*' ? left * right : left + right;
    stack.push(result);
    record([stack.length - 1], `Applied operator ${token} to ${left} and ${right}, result ${result}.`, 2 + index);
  });

  record([], `Final evaluation result is ${stack[0]}.`, 8);
  return frames;
}

export function generatePrefixEvaluationTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const stack: number[] = [];
  const tokens = ['+', '2', '*', '3', '4'];

  const record = (active: number[], explanation: string, line: number) => recordFrame(frames, stack, active, explanation, line);
  record([], 'Starting prefix evaluation for + 2 * 3 4.', 1);

  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index];
    if (/^[0-9]+$/.test(token)) {
      stack.push(Number(token));
      record([stack.length - 1], `Pushed operand ${token}.`, 2 + (tokens.length - 1 - index));
    } else {
      const left = stack.pop() ?? 0;
      const right = stack.pop() ?? 0;
      const result = token === '*' ? left * right : left + right;
      stack.push(result);
      record([stack.length - 1], `Applied operator ${token} to ${left} and ${right}, result ${result}.`, 2 + (tokens.length - 1 - index));
    }
  }

  record([], `Final prefix evaluation result is ${stack[0]}.`, 8);
  return frames;
}

export function generateFactorialRecursionTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];

  const factorial = (n: number, stack: number[]): number => {
    recordFrame(frames, stack, [stack.length - 1], `Entering factorial(${n}).`, 1);
    stack.push(n);
    if (n <= 1) {
      recordFrame(frames, stack, [stack.length - 1], `Base case reached for n=${n}.`, 2);
      stack.pop();
      return 1;
    }
    const result = n * factorial(n - 1, stack);
    recordFrame(frames, stack, [stack.length - 1], `Returning ${result} for factorial(${n}).`, 3);
    stack.pop();
    return result;
  };

  factorial(4, []);
  recordFrame(frames, [4, 3, 2, 1], [], 'Completed factorial recursion trace.', 4);
  return frames;
}

export function generateFibonacciRecursionTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];

  const fibonacci = (n: number, depth: number): number => {
    recordFrame(frames, Array.from({ length: depth }, (_, index) => index + 1), [depth - 1], `Entering fibonacci(${n}).`, 1);
    if (n <= 1) {
      recordFrame(frames, Array.from({ length: depth }, (_, index) => index + 1), [depth - 1], `Base case fibonacci(${n}) = ${n}.`, 2);
      return n;
    }
    const result = fibonacci(n - 1, depth + 1) + fibonacci(n - 2, depth + 1);
    recordFrame(frames, Array.from({ length: depth }, (_, index) => index + 1), [depth - 1], `Returning fibonacci(${n}) = ${result}.`, 3);
    return result;
  };

  fibonacci(5, 1);
  recordFrame(frames, [1, 2, 3, 4, 5], [], 'Completed Fibonacci recursion trace.', 4);
  return frames;
}

export function generateTowerOfHanoiTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const moveStack: string[] = [];

  const move = (count: number, fromRod: string, toRod: string, auxRod: string): void => {
    if (count === 0) {
      return;
    }
    move(count - 1, fromRod, auxRod, toRod);
    moveStack.push(`${count}: ${fromRod} -> ${toRod}`);
    recordFrame(frames, moveStack.map((_, index) => index + 1), [moveStack.length - 1], `Move disk ${count} from ${fromRod} to ${toRod}.`, 1);
    move(count - 1, auxRod, toRod, fromRod);
  };

  move(3, 'A', 'C', 'B');
  recordFrame(frames, [1, 2, 3], [], 'Tower of Hanoi complete.', 2);
  return frames;
}
