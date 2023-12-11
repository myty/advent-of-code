import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

class Galaxy {
  constructor(
    public readonly id: string,
    public readonly row: number,
    public readonly column: number,
  ) {}
}

class Cell {
  constructor(
    public readonly row: number,
    public readonly column: number,
    public readonly value: string,
  ) {}
}

class Universe {
  public readonly galaxies: Galaxy[] = [];

  private constructor(private readonly grid: Cell[][]) {
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      const row = grid[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const cell = row[columnIndex];
        if (cell.value !== ".") {
          this.galaxies.push(new Galaxy(cell.value, cell.row, cell.column));
        }
      }
    }
  }

  public calculateDistances(): {
    from: Galaxy;
    to: Galaxy;
    distance: number;
  }[] {
    const allPaths: { from: Galaxy; to: Galaxy; distance: number }[] = [];
    const shortestPaths: { from: Galaxy; to: Galaxy; distance: number }[] = [];

    for (let i = 0; i < this.galaxies.length - 1; i++) {
      const from = this.galaxies[i];

      for (let j = i + 1; j < this.galaxies.length; j++) {
        const to = this.galaxies[j];

        const distance = Math.abs(from.row - to.row) +
          Math.abs(from.column - to.column);

        allPaths.push({ from, to, distance });
        allPaths.push({ from: to, to: from, distance });
      }
    }

    for (const from of this.galaxies) {
      const pathsFrom = allPaths.filter((path) => path.from === from);
      const shortestPath = pathsFrom.reduce((shortestPath, path) => {
        if (path.distance < shortestPath.distance) {
          return path;
        }

        return shortestPath;
      }, pathsFrom[0]);

      shortestPaths.push(shortestPath);
    }

    return allPaths;
  }

  public toString() {
    return this.grid.map((row) => row.map((cell) => cell.value).join("")).join(
      "\n",
    );
  }

  static parse(input: string, expansionFactor = 1) {
    const rows = input.trimEnd().split("\n").map((line) => line.split(""));

    const cells = this.toCells(
      rows,
      expansionFactor,
    );

    return new Universe(cells);
  }

  static toCells(rows: string[][], expansionFactor: number): Cell[][] {
    const cells: Cell[][] = [];

    const emptyRowIndexes = rows
      .map((value, i) => ({ value, i }))
      .filter((row) => row.value.every((cell) => cell === "."))
      .map(({ i }) => i);

    const emptyColumnIndexes = this
      .flipRowsAndColumns(rows)
      .map((value, i) => ({ value, i }))
      .filter((row) => row.value.every((cell) => cell === "."))
      .map(({ i }) => i);

    let currentGalaxyId = 1;
    let addToRowIndex = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      let addToColumnIndex = 0;
      for (let j = 0; j < row.length; j++) {
        const value = row[j];

        if (!cells[i]) {
          cells[i] = [];
        }

        cells[i][j] = new Cell(
          addToRowIndex + i,
          addToColumnIndex + j,
          value === "#" ? `${currentGalaxyId++}` : value,
        );

        if (emptyColumnIndexes.includes(j)) {
          addToColumnIndex += expansionFactor - 1;
        }
      }

      if (emptyRowIndexes.includes(i)) {
        addToRowIndex += expansionFactor - 1;
      }
    }

    return cells;
  }

  private static flipRowsAndColumns(rows: string[][]): string[][] {
    const columns: string[][] = [];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const cell = row[columnIndex];
        if (!columns[columnIndex]) {
          columns[columnIndex] = [];
        }
        columns[columnIndex][rowIndex] = cell;
      }
    }
    return columns;
  }
}

function part1(input: string): number {
  const universe = Universe.parse(input, 2);

  // console.log(universe.toString());
  // console.log(universe.galaxies);
  // console.log(universe.calculateDistances());

  const sumOfShortestPaths = universe.calculateDistances().reduce(
    (sum, path) => sum + path.distance,
    0,
  );

  return sumOfShortestPaths / 2;
}

function part2(input: string): number {
  const universe = Universe.parse(input, 1000000);

  const sumOfShortestPaths = universe.calculateDistances().reduce(
    (sum, path) => sum + path.distance,
    0,
  );

  return sumOfShortestPaths / 2;
}

if (import.meta.main) {
  runPart(2023, 11, 1, part1);
  runPart(2023, 11, 2, part2);
}

const TEST_INPUT = `\
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 374);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 82000210);
});
