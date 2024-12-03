import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface Report {
  levels: number[];
}

function parse(input: string): Array<Report> {
  return input.trimEnd().split("\n").filter(Boolean).map((report) => {
    const levels = report.split(" ").map(Number);
    return { levels };
  });
}

function isSafeReport({ levels }: Report): boolean {
  let incrementMultiplier: number | null = null;

  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1];
    const curr = levels[i];

    if (incrementMultiplier === null) {
      incrementMultiplier = prev < curr ? 1 : -1;
    }

    const increment = (curr - prev) * incrementMultiplier;

    // At least one
    if (increment < 1) {
      return false;
    }

    // At most three
    if (increment > 3) {
      return false;
    }
  }

  return true;
}

function isSafeReportV2({ levels }: Report): boolean {
  if (isSafeReport({ levels })) {
    return true;
  }

  for (let i = 0; i < levels.length; i++) {
    const filteredLevels = [
      ...levels.slice(0, i),
      ...levels.slice(i + 1),
    ];

    const isSafe = isSafeReport({
      levels: filteredLevels,
    });

    if (isSafe) {
      return true;
    }
  }

  return false;
}

function part1(input: string): number {
  const reports = parse(input).filter(isSafeReport);
  return reports.length;
}

function part2(input: string): number {
  const reports = parse(input).filter(isSafeReportV2);
  return reports.length;
}

if (import.meta.main) {
  runPart(2024, 2, 1, part1);
  runPart(2024, 2, 2, part2);
}

const TEST_INPUT = `\
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
1 2 3 4 9
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 2);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 5);
});
