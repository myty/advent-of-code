import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

type MulOperation = {
  operator: "mul";
  arg1: number;
  arg2: number;
};

type DoOperation = {
  operator: "do";
};

type DontOperation = {
  operator: "don't";
};

type Operation = MulOperation | DoOperation | DontOperation;

function parse(input: string): Operation[] {
  return input.trimEnd().split("\n").filter(Boolean).flatMap((str) => {
    const matches = str.match(
      /(mul)\((\d+),(\d+)\)|(do)\(\)|(don\'t)\(\)/g,
    );
    if (!matches) {
      throw new Error(`Invalid input: ${str}`);
    }

    return matches.map((match): Operation => {
      const [full, _, arg1, arg2] =
        /(mul)\((\d+),(\d+)\)|(do)\(\)|(don\'t)\(\)/.exec(match) ??
          [];

      if (full === "do()") {
        return {
          operator: "do",
        };
      }

      if (full === "don't()") {
        return {
          operator: "don't",
        };
      }

      return {
        operator: "mul",
        arg1: parseInt(arg1),
        arg2: parseInt(arg2),
      };
    });
  });
}

function part1(input: string): number {
  const calculation = parse(input).reduce((acc, item) => {
    if (item.operator !== "mul") {
      return acc;
    }

    return acc + (item.arg1 * item.arg2);
  }, 0);

  return calculation;
}

function part2(input: string): number {
  const calculation = parse(input).reduce((acc, item) => {
    if (item.operator !== "mul") {
      return {
        ...acc,
        enabled: item.operator === "do"
          ? true
          : item.operator === "don't"
          ? false
          : acc.enabled,
      };
    }

    return {
      ...acc,
      total: acc.enabled
        ? acc.total + (item.operator === "mul" ? item.arg1 * item.arg2 : 0)
        : acc.total,
    };
  }, { total: 0, enabled: true });

  return calculation.total;
}

if (import.meta.main) {
  runPart(2024, 3, 1, part1);
  runPart(2024, 3, 2, part2);
}

const TEST_INPUT = `\
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 161);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 48);
});
