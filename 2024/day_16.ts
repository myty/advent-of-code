import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

enum CellType {
  Wall = "#",
  Empty = ".",
  Start = "S",
  End = "E",
}

type Location = [x: number, y: number];
type Movement = [x: number, y: number];

interface Cell {
  type: CellType;
  location: Location;
}

const Directions = {
  Up: [0, -1] as Movement,
  Down: [0, 1] as Movement,
  Left: [-1, 0] as Movement,
  Right: [1, 0] as Movement,
} as const;

interface Maze {
  direction: Movement;
  cells: Cell[];
}

function parse(input: string): Maze {
  const cells = input.trimEnd().split("\n").filter(Boolean).map((line, y) => {
    return line.split("").map((char, x): Cell => {
      return {
        type: char as CellType,
        location: [x, y],
      };
    });
  });

  return {
    direction: Directions.Right,
    cells: cells.flat(),
  };
}

function part1(input: string): number {
  const maze = parse(input);
  const start = maze.cells.find((cell) => cell.type === CellType.Start)!;
  const availableCells = maze.cells.filter((cell) =>
    cell.type !== CellType.Wall && cell.type !== CellType.Start
  );

  return Math.min(
    ...calculatePathValues(availableCells, start, Directions.Right, 0),
  );
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 16, 1, part1);
  // runPart(2024, 16, 2, part2);
}

const TEST_INPUT = `\
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`;

const TEST_INPUT_2 = `\
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`;

Deno.test("part1a", () => {
  assertEquals(part1(TEST_INPUT), 7036);
});

Deno.test("part1b", () => {
  assertEquals(part1(TEST_INPUT_2), 11048);
});

function calculatePathValues(
  availableCells: Cell[],
  currentCell: Cell,
  currentDirection: Movement,
  currentScore: number,
): number[] {
  if (currentCell.type === CellType.End) {
    return [currentScore];
  }

  const pathValues: number[] = [];

  for (
    const nextCell of getNextCells(
      availableCells,
      currentCell,
      currentDirection,
    )
  ) {
    const nextAvailableCells = availableCells
      .filter((cell) =>
        cell.location[0] !== nextCell.location[0] ||
        cell.location[1] !== nextCell.location[1]
      );

    pathValues.push(
      ...calculatePathValues(
        nextAvailableCells,
        nextCell,
        nextCell.direction,
        currentScore + nextCell.value,
      ),
    );
  }

  return pathValues;
}

function getNextCells(
  availableCells: Cell[],
  currentCell: Cell,
  currentDirection: Movement,
): Array<Cell & { value: number; direction: Movement }> {
  const nextCells = availableCells
    .map((cell) => cellValue(currentCell, cell, currentDirection))
    .filter(({ value }) => value > 0);

  return nextCells;
}

function cellValue(
  currentCell: Cell,
  otherCell: Cell,
  currentDirection: Movement,
): Cell & { value: number; direction: Movement } {
  const [x1, y1] = currentCell.location;
  const [x2, y2] = otherCell.location;
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  const direction = [xDiff, yDiff] as Movement;

  if (
    xDiff === currentDirection[0] &&
    yDiff === currentDirection[1]
  ) {
    return { ...otherCell, value: 1, direction };
  }

  if (
    Math.abs(xDiff) === Math.abs(currentDirection[1]) &&
    Math.abs(yDiff) === Math.abs(currentDirection[0])
  ) {
    return { ...otherCell, value: 1001, direction };
  }

  return { ...otherCell, value: 0, direction: [0, 0] };
}

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });
