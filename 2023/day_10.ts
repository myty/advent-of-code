import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

type StartingPipeAccess = {
  top: true;
  right: true;
  bottom: true;
  left: true;
};

type HorizontalPipeAccess = {
  top: false;
  right: true;
  bottom: false;
  left: true;
};

type VerticalPipeAccess = {
  top: true;
  right: false;
  bottom: true;
  left: false;
};

type TopRightPipeAccess = {
  top: true;
  right: true;
  bottom: false;
  left: false;
};

type BottomRightPipeAccess = {
  top: false;
  right: true;
  bottom: true;
  left: false;
};

type BottomLeftPipeAccess = {
  top: false;
  right: false;
  bottom: true;
  left: true;
};

type TopLeftPipeAccess = {
  top: true;
  right: false;
  bottom: false;
  left: true;
};

type NoPipeAccess = {
  top: false;
  right: false;
  bottom: false;
  left: false;
};

type PipeAccess =
  | StartingPipeAccess
  | HorizontalPipeAccess
  | VerticalPipeAccess
  | TopRightPipeAccess
  | BottomRightPipeAccess
  | BottomLeftPipeAccess
  | TopLeftPipeAccess
  | NoPipeAccess;

type Pipe = {
  start: boolean;
  inside?: boolean;
  value: string;
  steps?: number;
  access: PipeAccess;
  connections?: {
    top?: Pipe;
    right?: Pipe;
    bottom?: Pipe;
    left?: Pipe;
  };
  boundaries?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
};

type Tile = {
  pipe: Pipe;
  x: number;
  y: number;
};

type Map = Pipe[][];

function generateMap(input: string): Map {
  const lines = pad(input).trimEnd().split("\n");
  const map: Map = [];
  for (const line of lines) {
    const row: Pipe[] = [];
    for (const char of line) {
      switch (char) {
        case ".":
          row.push({
            start: false,
            value: char,
            access: { top: false, right: false, bottom: false, left: false },
          });
          break;
        case "-":
          row.push({
            start: false,
            value: char,
            access: { top: false, right: true, bottom: false, left: true },
          });
          break;
        case "|":
          row.push({
            start: false,
            value: char,
            access: { top: true, right: false, bottom: true, left: false },
          });
          break;
        case "S":
          row.push({
            start: true,
            value: char,
            steps: 0,
            access: { top: true, right: true, bottom: true, left: true },
          });
          break;
        case "L":
          row.push({
            start: false,
            value: char,
            access: { top: true, right: true, bottom: false, left: false },
          });
          break;
        case "J":
          row.push({
            start: false,
            value: char,
            access: { top: true, right: false, bottom: false, left: true },
          });
          break;
        case "7":
          row.push({
            start: false,
            value: char,
            access: { top: false, right: false, bottom: true, left: true },
          });
          break;
        case "F":
          row.push({
            start: false,
            value: char,
            access: { top: false, right: true, bottom: true, left: false },
          });
          break;
        default:
          throw new Error(`Invalid char: ${char}`);
      }
    }
    map.push(row);
  }

  applyConnections(map);

  return map;
}

function applyConnections(map: Map): void {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const pipe = row[x];

      if (pipe.access.top) {
        const otherPipe = map[y - 1]?.[x];
        if (otherPipe?.access.bottom) {
          pipe.connections = {
            ...pipe.connections,
            top: otherPipe,
          };
        }
      }

      if (pipe.access.right) {
        const otherPipe = row[x + 1];
        if (otherPipe?.access.left) {
          pipe.connections = {
            ...pipe.connections,
            right: otherPipe,
          };
        }
      }

      if (pipe.access.bottom) {
        const otherPipe = map[y + 1]?.[x];
        if (otherPipe?.access.top) {
          pipe.connections = {
            ...pipe.connections,
            bottom: otherPipe,
          };
        }
      }

      if (pipe.access.left) {
        const otherPipe = row[x - 1];
        if (otherPipe?.access.right) {
          pipe.connections = {
            ...pipe.connections,
            left: otherPipe,
          };
        }
      }
    }
  }
}

function indentifyBoundaries(
  map: Map,
): { insideTiles: Tile[]; outsideTiles: Tile[] } {
  let nextLeftTile: Tile | undefined;
  while (nextLeftTile?.pipe.start != true) {
    if (nextLeftTile == null) {
      nextLeftTile = getStartingTile(map);
    }

    const currentTile = nextLeftTile;
    nextLeftTile = findNextLeftTile(map, currentTile);
  }

  for (const row of map) {
    let inside = false;
    for (const pipe of row) {
      if (pipe.steps != null) {
        inside = !inside;
        continue;
      }

      pipe.inside = inside;
    }
  }

  for (const col of mapColumns(map)) {
    let inside = false;
    for (const pipe of col) {
      if (pipe.steps != null) {
        inside = !inside;
        continue;
      }

      pipe.inside = pipe.inside != null ? pipe.inside || inside : inside;
    }
  }

  const tiles = map
    .flatMap((row, y) => row.map((pipe, x) => ({ pipe, x, y })));

  return {
    insideTiles: tiles.filter(({ pipe }) => pipe.inside == true),
    outsideTiles: tiles.filter(({ pipe }) => pipe.inside == false),
  };
}

function mapColumns(map: Map): Map {
  const columns: Map = [];
  for (let x = 0; x < map[0].length; x++) {
    const column: Pipe[] = [];
    for (let y = 0; y < map.length; y++) {
      column.push(map[y][x]);
    }
    columns.push(column);
  }
  return columns;
}

function calculateSteps(map: Map): number {
  let startingTiles = [getStartingTile(map)];
  let steps = 0;
  while (startingTiles.length > 0) {
    steps++;
    startingTiles = findNextTiles(map, startingTiles);
    startingTiles.forEach(({ pipe }) => pipe.steps = steps);
  }

  return steps - 1;
}

function getStartingTile(map: Map): Tile {
  const pipes = map
    .flatMap((row, y) => row.map((pipe, x) => ({ pipe, x, y })));

  const startingTile = pipes.find(({ pipe }) => pipe.start);

  if (startingTile == null) {
    throw new Error("No start pipe found");
  }

  return startingTile;
}

function findNextLeftTile(map: Map, currentTile: Tile): Tile {
  const { pipe, x, y } = currentTile;
  const { top, right, bottom, left } = pipe.access;

  if (top) {
    const nextPipe = map[y - 1][x];
    if (nextPipe.access.bottom && nextPipe.steps != null) {
      return { pipe: nextPipe, x, y: y - 1 };
    }
  }

  if (right) {
    const nextPipe = map[y][x + 1];
    if (nextPipe.access.left && nextPipe.steps == null) {
      return { pipe: nextPipe, x: x + 1, y };
    }
  }

  if (bottom) {
    const nextPipe = map[y + 1][x];
    if (nextPipe.access.top && nextPipe.steps == null) {
      return { pipe: nextPipe, x, y: y + 1 };
    }
  }

  if (left) {
    const nextPipe = map[y][x - 1];
    if (nextPipe.access.right && nextPipe.steps == null) {
      return { pipe: nextPipe, x: x - 1, y };
    }
  }

  throw new Error("No next left tile found");
}

function findNextTiles(
  map: Map,
  startingTiles: Tile[],
): Tile[] {
  const nextTiles: Tile[] = [];

  for (const { pipe, x, y } of startingTiles) {
    const { top, right, bottom, left } = pipe.access;

    if (top) {
      const nextPipe = map[y - 1][x];
      if (nextPipe.access.bottom && nextPipe.steps == null) {
        nextTiles.push({ pipe: nextPipe, x, y: y - 1 });
      }
    }

    if (right) {
      const nextPipe = map[y][x + 1];
      if (nextPipe.access.left && nextPipe.steps == null) {
        nextTiles.push({ pipe: nextPipe, x: x + 1, y });
      }
    }

    if (bottom) {
      const nextPipe = map[y + 1][x];
      if (nextPipe.access.top && nextPipe.steps == null) {
        nextTiles.push({ pipe: nextPipe, x, y: y + 1 });
      }
    }

    if (left) {
      const nextPipe = map[y][x - 1];
      if (nextPipe.access.right && nextPipe.steps == null) {
        nextTiles.push({ pipe: nextPipe, x: x - 1, y });
      }
    }
  }

  return nextTiles;
}

function pad(input: string) {
  const lines = input.trimEnd().split("\n");
  const width = Math.max(...lines.map((line) => line.length)) + 2;
  const paddedLines = ["".padEnd(width, ".")];
  for (const line of lines) {
    paddedLines.push(`.${line}.`);
  }
  paddedLines.push("".padEnd(width, "."));
  return paddedLines.join("\n");
}

function parse(input: string): Map {
  return generateMap(input);
}

function part1(input: string): number {
  const map = parse(input);
  const steps = calculateSteps(map);

  return steps;
}

function part2(input: string): number {
  const map = parse(input);
  calculateSteps(map);
  const { insideTiles } = indentifyBoundaries(map);

  return insideTiles.length;
}

if (import.meta.main) {
  runPart(2023, 10, 1, part1);
  runPart(2023, 10, 2, part2);
}

const TEST_INPUT_1 = `\
.....
.S-7.
.|.|.
.L-J.
.....
`;

const TEST_INPUT_2 = `\
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`;

// deno-lint-ignore no-unused-vars
const TEST_INPUT_3 = `\
..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
`;

// deno-lint-ignore no-unused-vars
const TEST_INPUT_4 = `\
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`;

// deno-lint-ignore no-unused-vars
const TEST_INPUT_5 = `\
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT_1), 4);
  assertEquals(part1(TEST_INPUT_2), 8);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT_3), 4);
//   assertEquals(part2(TEST_INPUT_4), 8);
//   assertEquals(part2(TEST_INPUT_5), 10);
// });

// deno-lint-ignore no-unused-vars
function visualize(map: Map) {
  console.log(
    map.map((row) => row.map((pipe) => pipe.steps ?? pipe.value).join(" "))
      .join("\n"),
  );
}
