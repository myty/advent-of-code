import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

class Galaxy {
  constructor(
    public readonly id: string,
    public readonly row: number,
    public readonly column: number,
  ) {}
}

class Universe {
  public readonly galaxies: Galaxy[] = [];

  private constructor(public readonly grid: string[][]) {
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      const row = grid[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const cell = row[columnIndex];
        if (cell !== ".") {
          this.galaxies.push(new Galaxy(cell, rowIndex, columnIndex));
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

        const distance = this.calculateDistance(from, to);
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

  calculateDistance(from: Galaxy, to: Galaxy): number {
    const distance = Math.abs(from.row - to.row) +
      Math.abs(from.column - to.column);
    return distance;
  }

  public toString() {
    return this.grid.map((row) => row.join("")).join("\n");
  }

  static parse(input: string, expansionFactor = 2) {
    const rows = input.trimEnd().split("\n").map((line) => line.split(""));
    const numericGalaxiesGrid = this.identifyGalaxyNumbers(
      rows,
    );
    const expandedRowsAndColumns = this.expandRowsAndColumns(
      numericGalaxiesGrid,
      expansionFactor,
    );

    return new Universe(expandedRowsAndColumns);
  }

  private static identifyGalaxyNumbers(grid: string[][]): string[][] {
    const numericGalaxiesGrid: string[][] = [...grid.map((row) => [...row])];

    const galaxies = grid.flatMap((row, rowIndex) => {
      return row
        .map((cell, columnIndex) => {
          if (cell === "#") {
            return { row: rowIndex, column: columnIndex };
          }

          return undefined;
        })
        .filter((cell): cell is { row: number; column: number } =>
          cell !== undefined
        );
    });

    for (let i = 1; i <= galaxies.length; i++) {
      const { row, column } = galaxies[i - 1];
      numericGalaxiesGrid[row][column] = `${i}`;
    }

    return numericGalaxiesGrid;
  }

  private static expandRowsAndColumns(
    rows: string[][],
    expansionFactor: number,
  ): string[][] {
    const expandedRows = this.expandRows(rows, expansionFactor);
    const expandedRowsAndColumns = this.expandColumns(
      expandedRows,
      expansionFactor,
    );
    return expandedRowsAndColumns;
  }

  private static expandRows(
    rows: string[][],
    expansionFactor: number,
  ): string[][] {
    const grid: string[][] = [];

    for (const row of rows) {
      grid.push(row);

      if (row.every((cell) => cell === ".")) {
        Array.from({ length: expansionFactor - 1 }).forEach(() => {
          grid.push(row);
        });
      }
    }

    return grid;
  }

  private static expandColumns(
    rows: string[][],
    expansionFactor: number,
  ): string[][] {
    const flippedRows = this.flipRowsAndColumns(rows);
    const expandedFlippedRows = this.expandRows(flippedRows, expansionFactor);
    return this.flipRowsAndColumns(expandedFlippedRows);
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
  const universe = Universe.parse(input);

  // console.log(universe.toString());
  // console.log(universe.galaxies);
  // console.log(universe.calculateShortestPaths());

  const sumOfShortestPaths = universe.calculateDistances().reduce(
    (sum, path) => sum + path.distance,
    0,
  );

  return sumOfShortestPaths / 2;
}

function part2(input: string): number {
  const universe = Universe.parse(input, 100);

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
  assertEquals(part2(TEST_INPUT), 8410);
});
