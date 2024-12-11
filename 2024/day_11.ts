import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

function parse(input: string) {
  return input.trimEnd().split("\n").filter(Boolean).flatMap((line) =>
    line.split(" ").filter(Boolean)
  );
}

function part1(input: string): number {
  return parse(input).reduce((acc, number) => {
    return acc + recursiveCount([number], 25);
  }, 0);
}

function part2(input: string): number {
  return parse(input).reduce((acc, number) => {
    return acc + recursiveCount([number], 75);
  }, 0);
}

if (import.meta.main) {
  runPart(2024, 11, 1, part1);
  // runPart(2024, 11, 2, part2);
}

const TEST_INPUT = `125 17`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 55312);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 29115525);
// });

function recursiveCount(
  numbers: string[],
  iterationsRemaining: number,
): number {
  const newNumbers: string[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];

    if (number === "0") {
      newNumbers.push("1");
      continue;
    }

    if (number.length % 2 === 0) {
      const nextNumbers = [
        number.slice(0, number.length / 2),
        `${parseInt(number.slice(number.length / 2))}`,
      ];
      newNumbers.push(...nextNumbers);
      continue;
    }

    const nextNumber = `${2024 * parseInt(number)}`;
    newNumbers.push(nextNumber);
  }

  return iterationsRemaining < 2
    ? newNumbers.length
    : recursiveCount(newNumbers, iterationsRemaining - 1);
}
