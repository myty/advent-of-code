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

interface CellWithValue {
  location: Location;
  direction: Movement;
  value: number;
}

const Directions = {
  Up: [0, -1] as Movement,
  Down: [0, 1] as Movement,
  Left: [-1, 0] as Movement,
  Right: [1, 0] as Movement,
} as const;

interface QueueItem {
  location: Location;
  direction: Movement;
  score: number;
}

function parse(input: string): CellType[][] {
  return input.trimEnd().split("\n").filter(Boolean).map((line) => {
    return line.split("").map((char) => {
      return char as CellType;
    });
  });
}

function part1(input: string): number {
  const grid = parse(input);
  const { evaluateLowestPathScore } = createMazeWrapper(grid);
  return evaluateLowestPathScore();
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

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });

function createMazeWrapper(grid: CellType[][]) {
  function evaluateLowestPathScore(grid: CellType[][]): number {
    const [startingLocation] = grid
      .map((row, y) =>
        row
          .map((cell, x) => ({ type: cell, location: [x, y] as Location }))
          .filter((c) => c.type === CellType.Start)
          .map((c) => c.location)
      )
      .flat();

    // Priority queue to store paths (can use array + sort for simplicity)
    const queue: QueueItem[] = [];

    // Track visited states to avoid cycles
    const visited = new Set<string>();

    // Track lowest score found
    let lowestScore = Infinity;

    // Add initial state
    queue.push({
      location: startingLocation,
      direction: Directions.Right,
      score: 0,
    });

    while (queue.length > 0) {
      // Get path with lowest current score
      queue.sort((a, b) => a.score - b.score);
      const current = queue.shift()!;

      // Create unique key for this state
      const stateKey = `${current.location[0]},${
        current.location[1]
      },${current.direction}`;

      // Skip if we've seen this state with a better score
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      // Get next possible moves
      const nextCells = getNextAvailableCells(
        current.location,
        current.direction,
      );

      for (const nextCell of nextCells) {
        const nextScore = current.score + nextCell.value;

        // Skip if score is already worse than best found
        if (nextScore >= lowestScore) continue;

        // If we reached destination, update lowest score
        if (isDestination(nextCell.location)) {
          lowestScore = Math.min(lowestScore, nextScore);
          continue;
        }

        // Add next possible path to queue
        queue.push({
          location: nextCell.location,
          direction: nextCell.direction,
          score: nextScore,
        });
      }
    }

    return lowestScore;
  }

  function isDestination(cell: Location): boolean {
    return grid[cell[1]][cell[0]] === CellType.End;
  }

  function getCellType(location: Location, direction?: Movement): CellType {
    if (direction == null) {
      return grid[location[1]][location[0]];
    }

    const [x, y] = location;
    const [dx, dy] = direction;
    const nextLocation = [x + dx, y + dy];

    return grid[nextLocation[1]][nextLocation[0]];
  }

  function isSameDirection(
    direction1: Movement,
    direction2: Movement,
  ): boolean {
    return direction1[0] === direction2[0] && direction1[1] === direction2[1];
  }

  function getNextAvailableCells(
    currentLocation: Location,
    currentDirection: Movement,
  ): CellWithValue[] {
    const availableCells: CellWithValue[] = [];

    for (const direction of Object.values(Directions)) {
      if (
        isSameDirection(direction, Directions.Right) &&
        isSameDirection(currentDirection, Directions.Left)
      ) {
        continue;
      }

      if (
        isSameDirection(direction, Directions.Left) &&
        isSameDirection(currentDirection, Directions.Right)
      ) {
        continue;
      }

      if (
        isSameDirection(direction, Directions.Up) &&
        isSameDirection(currentDirection, Directions.Down)
      ) {
        continue;
      }

      if (
        isSameDirection(direction, Directions.Down) &&
        isSameDirection(currentDirection, Directions.Up)
      ) {
        continue;
      }

      const nextLocation = [
        currentLocation[0] + direction[0],
        currentLocation[1] + direction[1],
      ] as Location;

      if (getCellType(nextLocation) === CellType.Wall) {
        continue;
      }

      availableCells.push({
        location: nextLocation,
        direction,
        value: getCellValue(direction, currentDirection),
      });
    }

    return availableCells;
  }

  function getCellValue(
    direction: Movement,
    currentDirection: Movement,
  ): number {
    if (isSameDirection(direction, currentDirection)) {
      return 1;
    }

    return 1001;
  }

  return {
    evaluateLowestPathScore() {
      return evaluateLowestPathScore(grid);
    },
  };
}
