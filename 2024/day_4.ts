import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

type Cell = {
  char: "X" | "M" | "A" | "S";
  lineIndex: number;
  charIndex: number;
};

const Directions = {
  EAST: "EAST",
  SOUTHEAST: "SOUTHEAST",
  SOUTH: "SOUTH",
  SOUTHWEST: "SOUTHWEST",
  WEST: "WEST",
  NORTHWEST: "NORTHWEST",
  NORTH: "NORTH",
  NORTHEAST: "NORTHEAST",
} as const;

type Direction = keyof typeof Directions;

function parse(input: string) {
  const cells = input.trimEnd().split("\n").filter(Boolean).flatMap(
    (line, lineIndex) =>
      line.split("").map((char, charIndex): Cell => ({
        char: char as Cell["char"],
        lineIndex,
        charIndex,
      })),
  );

  return { cells };
}

function part1(input: string): number {
  const { cells } = parse(input);
  const checkCell = cellChecker(cells);

  let totalOccurrences = 0;

  for (const cell of cells.filter((cell) => cell.char === "X")) {
    const check = checkCell(cell);

    for (const direction in Directions) {
      if (
        check(direction as Direction, 1, "M") &&
        check(direction as Direction, 2, "A") &&
        check(direction as Direction, 3, "S")
      ) {
        totalOccurrences++;
      }
    }
  }

  return totalOccurrences;
}

function cellChecker(cells: Cell[]) {
  return (cell: Cell) => {
    return (direction: Direction, spaces: number, char: Cell["char"]) => {
      const nextCellPoint = {
        lineIndex: getNextLineIndex(cell.lineIndex, direction, spaces),
        charIndex: getNextCharIndex(cell.charIndex, direction, spaces),
      };

      return cells.findIndex((c) =>
        c.lineIndex === nextCellPoint.lineIndex &&
        c.charIndex === nextCellPoint.charIndex &&
        c.char === char
      ) >= 0;
    };
  };
}

function getNextLineIndex(
  lineIndex: number,
  direction: string,
  spaces: number,
) {
  switch (direction) {
    case Directions.EAST:
      return lineIndex;
    case Directions.SOUTHEAST:
      return lineIndex + spaces;
    case Directions.SOUTH:
      return lineIndex + spaces;
    case Directions.SOUTHWEST:
      return lineIndex + spaces;
    case Directions.WEST:
      return lineIndex;
    case Directions.NORTHWEST:
      return lineIndex - spaces;
    case Directions.NORTH:
      return lineIndex - spaces;
    case Directions.NORTHEAST:
      return lineIndex - spaces;
  }
}

function getNextCharIndex(
  charIndex: number,
  direction: string,
  spaces: number,
) {
  switch (direction) {
    case Directions.EAST:
      return charIndex + spaces;
    case Directions.SOUTHEAST:
      return charIndex + spaces;
    case Directions.SOUTH:
      return charIndex;
    case Directions.SOUTHWEST:
      return charIndex - spaces;
    case Directions.WEST:
      return charIndex - spaces;
    case Directions.NORTHWEST:
      return charIndex - spaces;
    case Directions.NORTH:
      return charIndex;
    case Directions.NORTHEAST:
      return charIndex + spaces;
  }
}

function part2(input: string): number {
  const { cells } = parse(input);
  const checkCell = cellChecker(cells);

  let totalOccurrences = 0;

  for (const cell of cells.filter((cell) => cell.char === "A")) {
    const check = checkCell(cell);

    if (
      check(Directions.NORTHWEST, 1, "M") &&
      check(Directions.SOUTHWEST, 1, "M") &&
      check(Directions.NORTHEAST, 1, "S") &&
      check(Directions.SOUTHEAST, 1, "S")
    ) {
      totalOccurrences++;
      continue;
    }

    if (
      check(Directions.NORTHWEST, 1, "M") &&
      check(Directions.NORTHEAST, 1, "M") &&
      check(Directions.SOUTHWEST, 1, "S") &&
      check(Directions.SOUTHEAST, 1, "S")
    ) {
      totalOccurrences++;
      continue;
    }

    if (
      check(Directions.NORTHWEST, 1, "S") &&
      check(Directions.SOUTHWEST, 1, "S") &&
      check(Directions.NORTHEAST, 1, "M") &&
      check(Directions.SOUTHEAST, 1, "M")
    ) {
      totalOccurrences++;
      continue;
    }

    if (
      check(Directions.NORTHWEST, 1, "S") &&
      check(Directions.NORTHEAST, 1, "S") &&
      check(Directions.SOUTHWEST, 1, "M") &&
      check(Directions.SOUTHEAST, 1, "M")
    ) {
      totalOccurrences++;
      continue;
    }
  }

  return totalOccurrences;
}

if (import.meta.main) {
  runPart(2024, 4, 1, part1);
  runPart(2024, 4, 2, part2);
}

const TEST_INPUT = `\
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 18);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 9);
});
