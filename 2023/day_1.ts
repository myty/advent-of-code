import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

const conversionMap = new Map<string, string>(
  [
    ["oneight", "18"],
    ["twone", "21"],
    ["threeight", "38"],
    ["fiveight", "58"],
    ["eightwo", "82"],
    ["eighthree", "83"],
    ["nineight", "98"],
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"],
  ],
);

function convert(input: string): string {
  conversionMap.forEach((value, key) => {
    input = input.replaceAll(key, value);
  });

  return input;
}

function parse(input: string, shouldConvert = false): number[][] {
  const numberLines: number[][] = [];
  const lines = input.trimEnd().split("\n");

  for (const line of lines) {
    const numbers: number[] = [];
    const processedLine = shouldConvert ? convert(line) : line;

    for (const char of processedLine) {
      const numberChar = parseInt(char, 10);

      if (isNaN(numberChar)) {
        continue;
      }

      numbers.push(numberChar);
    }

    numberLines.push(numbers);
  }

  return numberLines;
}

function part1(input: string): number {
  let total = 0;

  for (const line of parse(input)) {
    const [first] = line;
    const [last] = line.reverse();
    const lineNumber = `${first}${last}`;

    total += parseInt(lineNumber, 10);
  }

  return total;
}

function part2(input: string): number {
  let total = 0;

  for (const line of parse(input, true)) {
    const [first] = line;
    const [last] = line.reverse();
    const lineNumber = `${first}${last}`;

    total += parseInt(lineNumber, 10);
  }

  return total;
}

if (import.meta.main) {
  runPart(2023, 1, 1, part1);
  runPart(2023, 1, 2, part2);
}

const TEST_INPUT = `\
two1nine
eightwothree3
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 242);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 281);
});
