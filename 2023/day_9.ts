import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

type Node = {
  value: number;
  leftParent: Node | null;
  rightParent: Node | null;
};
type SequenceRow = Node[];
type Sequence = SequenceRow[];

function generateNextRow(row: SequenceRow): SequenceRow {
  const nextRow: SequenceRow = [];

  for (let i = 0; i < (row.length - 1); i++) {
    const leftParent = row[i];
    const rightParent = row[i + 1];
    const value = rightParent.value - leftParent.value;
    nextRow.push({ value, leftParent, rightParent });
  }

  return nextRow;
}

function addNextValue(sequence: Sequence): void {
  let rowOffset = 0;
  let currentRow = sequence.slice(--rowOffset)[0];
  let currentNode: Node = {
    value: 0,
    leftParent: currentRow.slice(-1)[0].rightParent,
    rightParent: null,
  };

  currentRow.push(currentNode);

  while (currentNode.leftParent) {
    currentRow = sequence.slice(--rowOffset)[0];

    const lastRowNode = currentRow.slice(-1)[0];

    currentNode.rightParent = {
      value: currentNode.value + currentNode.leftParent.value,
      leftParent: lastRowNode.rightParent,
      rightParent: null,
    };

    currentRow.push(currentNode.rightParent);
    currentNode = currentNode.rightParent;
  }
}

function parse(
  input: string,
  process?: (values: number[]) => number[],
): Sequence[] {
  const sequences: Sequence[] = [];

  for (const line of input.trimEnd().split("\n").filter((line) => !!line)) {
    const sequence: Sequence = [];
    let currentRow: SequenceRow = [];

    const values = line.split(/\s+/)
      .filter((n) => !!n)
      .map((n) => parseInt(n, 10));

    for (const value of process ? process(values) : values) {
      currentRow.push({
        value,
        leftParent: null,
        rightParent: null,
      });
    }

    sequence.push(currentRow);

    while (currentRow.some((node) => node.value !== 0)) {
      currentRow = generateNextRow(currentRow);
      sequence.push(currentRow);
    }

    sequences.push(sequence);
  }

  return sequences;
}

function part1(input: string): number {
  const sequences = parse(input);

  for (const sequence of sequences) {
    addNextValue(sequence);
  }

  return sequences
    .map((sequence) => sequence[0].slice(-1)[0].value)
    .reduce((a, b) => a + b, 0);
}

function part2(input: string): number {
  const sequences = parse(input, (values) => [...values].reverse());

  for (const sequence of sequences) {
    addNextValue(sequence);
  }

  return sequences
    .map((sequence) => sequence[0].slice(-1)[0].value)
    .reduce((a, b) => a + b, 0);
}

if (import.meta.main) {
  runPart(2023, 9, 1, part1);
  runPart(2023, 9, 2, part2);
}

const TEST_INPUT = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 114);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 2);
});
