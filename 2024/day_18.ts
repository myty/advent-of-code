import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

enum MemorySpace {
  Corrupt = "#",
  Empty = ".",
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
  // direction: Movement;
  score: number;
}

function parse(input: string): Location[] {
  return input.trimEnd().split("\n").map((line) => {
    return line.split(",").map((n) => parseInt(n)) as Location;
  });
}

function createPart1(gridSize: number, corruptSpaceSize: number) {
  return function part1(input: string): number {
    const corruptSpaces = parse(input);

    const grid = createGrid(
      gridSize,
      corruptSpaces.filter((_, i) => i < corruptSpaceSize),
    );

    const maze = createMaze(grid);
    const score = maze.evaluateLowestPathScore();
    return score;
  };
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 18, 1, createPart1(71, 1024));
  // runPart(2024, 18, 2, part2);
}

const TEST_INPUT = `\
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`;

Deno.test("part1", () => {
  assertEquals(createPart1(7, 12)(TEST_INPUT), 22);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });

function createGrid(
  gridSize: number,
  corruptSpaces: Location[],
): MemorySpace[][] {
  return Array.from(
    { length: gridSize },
    (_, y) =>
      Array.from(
        { length: gridSize },
        (_, x) =>
          corruptSpaces.some(([cx, cy]) => cx === x && cy === y)
            ? MemorySpace.Corrupt
            : MemorySpace.Empty,
      ),
  );
}

function createMaze(grid: MemorySpace[][]) {
  function evaluateLowestPathScore(): number {
    const [startingLocation] = grid
      .map((row, y) =>
        row
          .map((cell, x) => ({ type: cell, location: [x, y] as Location }))
          .filter((c) =>
            c.type != MemorySpace.Corrupt && c.location[0] === 0 &&
            c.location[1] === 0
          )
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
      // direction: Directions.Right,
      score: 0,
    });

    while (queue.length > 0) {
      // Get path with lowest current score
      queue.sort((a, b) => a.score - b.score);
      const current = queue.shift()!;

      // Create unique key for this state
      const stateKey = `${current.location}`;

      // Skip if we've seen this state with a better score
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      // Get next possible moves
      const nextQueueItems = getNextQueueItems(
        current.location,
      );

      for (const nextQueueItem of nextQueueItems) {
        const nextScore = current.score + nextQueueItem.score;

        // Skip if score is already worse than best found
        if (nextScore >= lowestScore) continue;

        // If we reached destination, update lowest score
        if (isDestination(nextQueueItem.location)) {
          lowestScore = Math.min(lowestScore, nextScore);
          continue;
        }

        // Add next possible path to queue
        queue.push({
          location: nextQueueItem.location,
          // direction: nextQueueItem.direction,
          score: nextScore,
        });
      }
    }

    return lowestScore;
  }

  function isDestination(cell: Location): boolean {
    const width = grid[0].length;
    const height = grid.length;

    if ((cell[0] + 1) === width && (cell[1] + 1) === height) {
      return true;
    }

    return false;
  }

  function getCellType(
    location: Location,
    direction?: Movement,
  ): MemorySpace | undefined {
    const getValue = (valueLocation: Location): MemorySpace | undefined => {
      const [x, y] = valueLocation;

      if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
        return undefined;
      }

      return grid[y][x];
    };

    if (direction == null) {
      return getValue(location);
    }

    const [x, y] = location;
    const [dx, dy] = direction;

    return getValue([x + dx, y + dy]);
  }

  // function isSameDirection(
  //   direction1: Movement,
  //   direction2: Movement,
  // ): boolean {
  //   return direction1[0] === direction2[0] && direction1[1] === direction2[1];
  // }

  function getNextQueueItems(
    currentLocation: Location,
    // currentDirection: Movement,
  ): QueueItem[] {
    const availableCells: QueueItem[] = [];

    for (const direction of Object.values(Directions)) {
      // if (
      //   isSameDirection(direction, Directions.Right) &&
      //   isSameDirection(currentDirection, Directions.Left)
      // ) {
      //   continue;
      // }

      // if (
      //   isSameDirection(direction, Directions.Left) &&
      //   isSameDirection(currentDirection, Directions.Right)
      // ) {
      //   continue;
      // }

      // if (
      //   isSameDirection(direction, Directions.Up) &&
      //   isSameDirection(currentDirection, Directions.Down)
      // ) {
      //   continue;
      // }

      // if (
      //   isSameDirection(direction, Directions.Down) &&
      //   isSameDirection(currentDirection, Directions.Up)
      // ) {
      //   continue;
      // }

      const nextLocation: Location = [
        currentLocation[0] + direction[0],
        currentLocation[1] + direction[1],
      ];

      if (getCellType(nextLocation) !== MemorySpace.Empty) {
        continue;
      }

      availableCells.push({
        location: nextLocation,
        // direction,
        score: 1,
      });
    }

    return availableCells;
  }

  return {
    evaluateLowestPathScore,
    display() {
      for (const row of grid) {
        console.log(
          row.map((cell) => cell === MemorySpace.Corrupt ? "#" : ".").join(""),
        );
      }
    },
  };
}
