import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface Equation {
  answer: number;
  numbers: number[];
  possiblyCorrect?: boolean;
}

enum Operator {
  Add = 0,
  Multiply = 1,
  Concat = 2,
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
  const equations = parse(input).map((eq) => {
    const variations = variationCount(eq.numbers);

    for (let i = 0; i <= variations; i++) {
      let runningResult = 0;
      const binaryRepresentation = i.toString(2).padStart(
        eq.numbers.length,
        "0",
      );

      for (let j = 0; j < eq.numbers.length; j++) {
        const number = eq.numbers[j];
        const operator = j === 0
          ? Operator.Add
          : parseInt(binaryRepresentation[j]);

        if (operator === Operator.Add) {
          runningResult += number;
        } else {
          runningResult *= number;
        }

        // It's already too big, no need to continue
        if (runningResult > eq.answer) {
          break;
        }
      }

      // We found a correct variation, no need to continue
      if (runningResult === eq.answer) {
        return { ...eq, possiblyCorrect: true };
      }
    }

    // No correct variation found
    return { ...eq, possiblyCorrect: false };
  });

  const total = equations.filter((eq) => eq.possiblyCorrect === true).reduce(
    (acc, eq) => acc + eq.answer,
    0,
  );

  return total;
}

function part2(input: string): number {
  const equations = parse(input).map((eq) => {
    const radix = 3;
    const variations = variationCount(eq.numbers, radix);

    for (let i = 0; i <= variations; i++) {
      let runningResult = 0;
      const binaryRepresentation = i.toString(radix).padStart(
        eq.numbers.length,
        "0",
      );

      for (let j = 0; j < eq.numbers.length; j++) {
        const number = eq.numbers[j];
        const operator = j === 0
          ? Operator.Add
          : parseInt(binaryRepresentation[j]);

        if (operator === Operator.Add) {
          runningResult += number;
        } else if (operator === Operator.Multiply) {
          runningResult *= number;
        } else {
          runningResult = parseInt(`${runningResult}${number}`);
        }

        // It's already too big, no need to continue
        if (runningResult > eq.answer) {
          break;
        }
      }

      // We found a correct variation, no need to continue
      if (runningResult === eq.answer) {
        return { ...eq, possiblyCorrect: true };
      }
    }

    // No correct variation found
    return { ...eq, possiblyCorrect: false };
  });

  const total = equations.filter((eq) => eq.possiblyCorrect === true).reduce(
    (acc, eq) => acc + eq.answer,
    0,
  );

  return total;
}

if (import.meta.main) {
  runPart(2024, 7, 1, part1);
  runPart(2024, 7, 2, part2);
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

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 11387);
});

function variationCount(numbers: number[], radix: 2 | 3 = 2): number {
  const highNumber = radix === 2 ? "1" : "2";
  const variationBitmask = highNumber.repeat(numbers.length - 1);
  const variations = parseInt(variationBitmask, radix);

  return variations;
}
