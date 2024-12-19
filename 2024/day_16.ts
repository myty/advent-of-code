import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

enum Cell {
  Wall = "#",
  Empty = ".",
  Start = "S",
  End = "E",
  Seat = "O",
}

type Location = [x: number, y: number];
type Movement = [x: number, y: number];

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
  cells: Set<string>;
}

function parse(input: string): Cell[][] {
  return input.trimEnd().split("\n").filter(Boolean).map((line) => {
    return line.split("").map((char) => {
      return char as Cell;
    });
  });
}

function part1(input: string): number {
  const grid = parse(input);
  const { evaluateLowestPathScore } = createMaze(grid);
  return evaluateLowestPathScore();
}

function part2(input: string): number {
  const grid = parse(input);
  const { identifyBestCells } = createMaze(grid);
  return identifyBestCells().length;
}

if (import.meta.main) {
  runPart(2024, 16, 1, part1);
  runPart(2024, 16, 2, part2);
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

// Deno.test("part1a", () => {
//   assertEquals(part1(TEST_INPUT), 7036);
// });

// Deno.test("part1b", () => {
//   assertEquals(part1(TEST_INPUT_2), 11048);
// });

Deno.test("part2a", () => {
  assertEquals(part2(TEST_INPUT), 45);
});

// Deno.test("part2b", () => {
//   assertEquals(part2(TEST_INPUT_2), 64);
// });

function createMaze(grid: Cell[][]) {
  function evaluateLowestPathScore(): number {
    const [startingLocation] = grid
      .map((row, y) =>
        row
          .map((cell, x) => ({ type: cell, location: [x, y] as Location }))
          .filter((c) => c.type === Cell.Start)
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
      cells: new Set<string>(),
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
      const nextQueueItems = getNextQueueItems(
        current.location,
        current.direction,
      );

      for (const nextQueueItem of nextQueueItems) {
        const nextScore = current.score + nextQueueItem.score;

        // Skip if score is already worse than best found
        if (nextScore >= lowestScore) continue;

        // If we reached destination, update lowest score
        if (isDestination(nextQueueItem.location)) {
          lowestScore = nextScore;
          continue;
        }

        // Add next possible path to queue
        queue.push({
          location: nextQueueItem.location,
          direction: nextQueueItem.direction,
          score: nextScore,
          cells: new Set<string>(),
        });
      }
    }

    return lowestScore;
  }

  function isDestination(cell: Location): boolean {
    return grid[cell[1]][cell[0]] === Cell.End;
  }

  function getCellType(location: Location, direction?: Movement): Cell {
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

  function getNextQueueItems(
    currentLocation: Location,
    currentDirection: Movement,
  ): QueueItem[] {
    const availableCells: QueueItem[] = [];

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

      if (getCellType(nextLocation) === Cell.Wall) {
        continue;
      }

      availableCells.push({
        location: nextLocation,
        direction,
        score: getMovementScore(direction, currentDirection),
        cells: new Set<string>(),
      });
    }

    return availableCells;
  }

  function getMovementScore(
    direction: Movement,
    currentDirection: Movement,
  ): number {
    if (isSameDirection(direction, currentDirection)) {
      return 1;
    }

    return 1001;
  }

  function identifyBestCells(showBestCellsOnGrid = false): string[] {
    const [startingLocation] = grid
      .map((row, y) =>
        row
          .map((cell, x) => ({ type: cell, location: [x, y] as Location }))
          .filter((c) => c.type === Cell.Start)
          .map((c) => c.location)
      )
      .flat();

    // Priority queue to store paths (can use array + sort for simplicity)
    const queue: QueueItem[] = [];

    // Track visited states to avoid cycles
    const visited = new Map<
      string,
      { type: Cell; score: number; cells: Set<string> }
    >();

    // Track lowest score found
    let lowestScore = Infinity;

    // Add initial state
    queue.push({
      location: startingLocation,
      direction: Directions.Right,
      score: 0,
      cells: new Set<string>([startingLocation.join(",")]),
    });

    while (queue.length > 0) {
      // Get path with lowest current score
      queue.sort((a, b) => a.score - b.score);
      const current = queue.shift()!;

      // Create unique key for this state
      const stateKey = `${current.location},${current.direction}`;

      // Skip if we've seen this state with a better score
      if (visited.has(stateKey)) {
        const { cells, score } = visited.get(stateKey)!;

        if (current.score > score) {
          continue;
        }

        if (current.score < score) {
          cells.clear();
        }

        current.cells.forEach((cell) => cells.add(cell));

        visited.set(stateKey, {
          type: Cell.Empty,
          score: current.score,
          cells,
        });
        continue;
      }

      visited.set(stateKey, {
        score: current.score,
        cells: new Set(current.cells),
        type: Cell.Empty,
      });

      // Get next possible moves
      const nextQueueItems = getNextQueueItems(
        current.location,
        current.direction,
      );

      for (const nextQueueItem of nextQueueItems) {
        const nextScore = current.score + nextQueueItem.score;
        const nextCellSet = new Set([
          ...current.cells,
          nextQueueItem.location.join(","),
        ]);

        if (nextScore > lowestScore) {
          continue;
        }

        // If we reached destination, update lowest score
        if (isDestination(nextQueueItem.location)) {
          const destinationKey =
            `${nextQueueItem.location},${nextQueueItem.direction}`;

          const { cells } = visited.get(destinationKey) ?? {
            type: Cell.End,
            score: nextScore,
            cells: new Set<string>(),
          };

          lowestScore = nextScore;

          if (nextScore < lowestScore) {
            cells.clear();
          }

          nextCellSet.forEach((cell) => cells.add(cell));

          visited.set(destinationKey, {
            type: Cell.End,
            score: nextScore,
            cells,
          });

          continue;
        }

        // Add next possible path to queue
        queue.push({
          location: nextQueueItem.location,
          direction: nextQueueItem.direction,
          score: nextScore,
          cells: nextCellSet,
        });
      }
    }

    const destinationCellScores = Array
      .from(visited.values().filter((v) => v.type === Cell.End))
      .sort((a, b) => a.score - b.score);

    const bestScore = Math.min(...destinationCellScores.map((v) => v.score));

    const bestPathCells = destinationCellScores
      .filter((v) => v.score === bestScore)
      .map((v) => v.cells)
      .reduce((acc, curr) => {
        curr.forEach((cell) => acc.add(cell));
        return acc;
      }, new Set<string>());

    const bestCellsArray = Array.from(bestPathCells);

    if (showBestCellsOnGrid) {
      displayBestCellsOnGrid(bestCellsArray);
    }

    return bestCellsArray;
  }

  function displayBestCellsOnGrid(bestCells: string[]): void {
    const gridCopy = grid.map((row) => [...row]);

    for (const cell of bestCells) {
      try {
        const [x, y] = cell.split(",").map(Number);
        gridCopy[y][x] = Cell.Seat;
      } catch {
        console.log(cell);
      }
    }

    console.log(gridCopy.map((row) => row.join("")).join("\n"));
  }

  return {
    evaluateLowestPathScore,
    identifyBestCells,
  };
}
