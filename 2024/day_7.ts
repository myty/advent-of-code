import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface Equation {
  answer: number;
  numbers: number[];
  possiblyCorrect?: boolean;
}

function parse(input: string): Equation[] {
  return input.trimEnd().split("\n").map((line) => {
    const [answer, rest] = line.split(":");
    return {
      answer: parseInt(answer),
      numbers: rest.split(" ").map((n) => n.trim()).filter(Boolean).map((n) =>
        parseInt(n)
      ),
    };
  });
}

function part1(input: string): number {
  const opertators = ["*", "+"];
  const equations = parse(input).map((eq) => {
    let runningResult = 0;

    for (let i = 0; i < eq.numbers.length - 1; i++) {
      for (const o of opertators) {
      }
    }

    return { ...eq };
  });

  const total = equations.filter((eq) => eq.possiblyCorrect === true).reduce(
    (acc, eq) => acc + eq.answer,
    0,
  );

  return total;
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 7, 1, part1);
  // runPart(2024, 7, 2, part2);
}

const TEST_INPUT = `\
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 3749);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });
