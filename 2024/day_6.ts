import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

type Pair = [x: number, y: number];

function parse(input: string) {
  const grid = input.trimEnd().split("\n").filter(Boolean).map((line) => {
    return line.split("");
  });

  return { grid };
}

function part1(input: string): number {
  const { grid } = parse(input);
  const positions = createPositionsFromGrid(grid);
  return processPositions(positions);
}

function part2(input: string): number {
  const { grid } = parse(input);
  const positions = createPositionsFromGrid(grid);
  const positionsWithoutObstacles = positions.filter((cell) =>
    !cell.obstacle && !cell.guard
  );

  const potentialObstableLoopPositions = positionsWithoutObstacles.filter(
    (cell) => {
      const result = processPositions(positions.map((p) => {
        if (p.x === cell.x && p.y === cell.y) {
          return {
            ...p,
            obstacle: true,
          };
        }

        return p;
      }));

      const isALoop = result === Infinity;

      return isALoop;
    },
  );

  return potentialObstableLoopPositions.length;
}

if (import.meta.main) {
  runPart(2024, 6, 1, part1);
  runPart(2024, 6, 2, part2);
}

const TEST_INPUT = `\
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 41);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 6);
});

function createPositionsFromGrid(grid: string[][]) {
  return grid.flatMap((row, y) => {
    return row.map((cell, x) => {
      return {
        x,
        y,
        obstacle: cell === "#",
        guard: cell === "^"
          ? {
            direction: Direction.Up,
          }
          : null,
      };
    });
  });
}

function processPositions(positions: {
  x: number;
  y: number;
  obstacle: boolean;
  guard: {
    direction: Direction;
  } | null;
}[]) {
  const { x = 0, y = 0, guard } =
    positions.find((cell) => cell.guard != null) ?? {};

  let currentDirection = guard?.direction ?? Direction.Up;
  let currentPosition: Pair = [x, y];
  const visited: Array<Pair> = [currentPosition];
  let iterationCount = 0;

  while (true) {
    if (iterationCount++ > positions.length) {
      return Infinity;
    }

    const [x, y] = currentPosition;
    const nextPosition = {
      [Direction.Up]: [x, y - 1] as Pair,
      [Direction.Right]: [x + 1, y] as Pair,
      [Direction.Down]: [x, y + 1] as Pair,
      [Direction.Left]: [x - 1, y] as Pair,
    }[currentDirection];

    const [nextX, nextY] = nextPosition;
    const nextCell = positions.find((p) => p.x === nextX && p.y === nextY);

    if (nextCell == null) {
      break;
    }

    if (nextCell.obstacle) {
      currentDirection = (currentDirection + 1) % 4;
    } else {
      currentPosition = nextPosition;

      if (
        !visited.some((position) =>
          position[0] === currentPosition[0] &&
          position[1] === currentPosition[1]
        )
      ) {
        visited.push(currentPosition);
      }
    }
  }

  return visited.length;
}
