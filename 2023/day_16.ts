import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

interface Tile {
  x: number;
  y: number;
  mirror: "." | "|" | "-" | "/" | "\\";
}

type Direction = "up" | "down" | "left" | "right";

interface ChargeTileOptions {
  x: number;
  y: number;
  direction: Direction;
  tileMatrix: Tile[][];
  chargedTiles: Map<Tile, Set<Direction>>;
}

function parse(input: string): Map<Tile, Set<Direction>> {
  const chargedTiles = new Map<Tile, Set<Direction>>();

  const tileMatrix: Tile[][] = input.trimEnd().split("\n").map((t, y) =>
    t.split("").map((c, x): Tile => ({ x, y, mirror: c as Tile["mirror"] }))
  );

  return chargeTile({
    x: 0,
    y: 0,
    direction: "right",
    tileMatrix,
    chargedTiles,
  });
}

function chargeTile(options: ChargeTileOptions): Map<Tile, Set<Direction>> {
  const { x, y, direction, tileMatrix, chargedTiles } = options;
  const tile = tileMatrix[y]?.[x];
  if (!tile) {
    return chargedTiles;
  }

  const tileSet = chargedTiles.get(tile) ?? new Set<Direction>();

  if (tileSet.has(direction)) {
    return chargedTiles;
  }

  tileSet.add(direction);
  chargedTiles.set(tile, tileSet);

  let nextChargedTiles = chargedTiles;
  for (
    const { direction: nextDirection, tile: { x, y } }
      of getNextDirectionAndTile(direction, tile)
  ) {
    nextChargedTiles = chargeTile({
      ...options,
      direction: nextDirection,
      x,
      y,
    });
  }

  return nextChargedTiles ?? chargedTiles;
}

function getNextDirectionAndTile(
  direction: Direction,
  tile: Tile,
): { direction: Direction; tile: Tile }[] {
  const { x, y, mirror } = tile;

  if (mirror === ".") {
    switch (direction) {
      case "up":
        return [{ direction, tile: { ...tile, y: y - 1 } }];
      case "down":
        return [{ direction, tile: { ...tile, y: y + 1 } }];
      case "left":
        return [{ direction, tile: { ...tile, x: x - 1 } }];
      case "right":
        return [{ direction, tile: { ...tile, x: x + 1 } }];
    }
  }

  if (mirror === "|") {
    switch (direction) {
      case "up":
        return [{ direction, tile: { ...tile, y: y - 1 } }];
      case "down":
        return [{ direction, tile: { ...tile, y: y + 1 } }];
      case "left":
      case "right":
        return [
          { direction: "down", tile: { ...tile, y: y + 1 } },
          { direction: "up", tile: { ...tile, y: y - 1 } },
        ];
    }
  }

  if (mirror === "-") {
    switch (direction) {
      case "up":
      case "down":
        return [
          { direction: "left", tile: { ...tile, x: x - 1 } },
          { direction: "right", tile: { ...tile, x: x + 1 } },
        ];
      case "left":
        return [{ direction, tile: { ...tile, x: x - 1 } }];
      case "right":
        return [{ direction, tile: { ...tile, x: x + 1 } }];
    }
  }

  if (mirror === "/") {
    switch (direction) {
      case "up":
        return [{ direction: "right", tile: { ...tile, x: x + 1 } }];
      case "down":
        return [{ direction: "left", tile: { ...tile, x: x - 1 } }];
      case "left":
        return [{ direction: "down", tile: { ...tile, y: y + 1 } }];
      case "right":
        return [{ direction: "up", tile: { ...tile, y: y - 1 } }];
    }
  }

  if (mirror === "\\") {
    switch (direction) {
      case "up":
        return [{ direction: "left", tile: { ...tile, x: x - 1 } }];
      case "down":
        return [{ direction: "right", tile: { ...tile, x: x + 1 } }];
      case "left":
        return [{ direction: "up", tile: { ...tile, y: y - 1 } }];
      case "right":
        return [{ direction: "down", tile: { ...tile, y: y + 1 } }];
    }
  }

  return [];
}

function part1(input: string): number {
  const chargedTiles = parse(input);
  return chargedTiles.size;
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2023, 16, 1, part1);
  // runPart(2023, 16, 2, part2);
}

const TEST_INPUT = `\
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 46);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });
