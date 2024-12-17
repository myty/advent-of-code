import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

type Position = [x: number, y: number];

const movementMap = {
  "^": [0, -1],
  "v": [0, 1],
  "<": [-1, 0],
  ">": [1, 0],
} satisfies Record<string, Position>;

enum CellType {
  Wall = "#",
  Empty = ".",
  Box = "O",
  Robot = "@",
}

interface Cell {
  position: Position;
  type: CellType;
}

interface Grid {
  cells: Cell[];
  movements: Position[];
}

interface GridAdapter {
  canMoveRobot(): boolean;
  moveRobot(): GridAdapter;
  get boxes(): Cell[];
  displayGrid(): void;
}

function parse(input: string): Grid {
  return input.trimEnd().split("\n").filter(Boolean).reduce((grid, line, y) => {
    return line.split("").reduce((grid, char, x) => {
      if (isMovement(char)) {
        return {
          ...grid,
          movements: [
            ...grid.movements,
            movementMap[char],
          ],
        };
      }

      if (!isCellType(char)) {
        return grid;
      }

      return {
        ...grid,
        cells: [
          ...grid.cells,
          { position: [x, y], type: char },
        ],
      };
    }, grid);
  }, { cells: [], movements: [] } as Grid);
}

function part1(input: string): number {
  let grid = createGridAdapter(parse(input));

  while (grid.canMoveRobot()) {
    grid = grid.moveRobot();
  }

  const total = grid.boxes.reduce((total, box) => {
    return total + (100 * box.position[1] + box.position[0]);
  }, 0);

  return total;
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 15, 1, part1);
  // runPart(2024, 15, 2, part2);
}

const TEST_INPUT = `\
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 2028);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });

function isMovement(char: string): char is keyof typeof movementMap {
  return char === "<" || char === ">" || char === "^" || char === "v";
}

function isCellType(char: string): char is CellType {
  return char === "#" || char === "." || char === "O" || char === "@";
}

function createGridAdapter(grid: Grid): GridAdapter {
  const cloneGrid = (inputGrid: Grid): Grid => {
    return {
      cells: inputGrid.cells.map(cloneCell),
      movements: inputGrid.movements.map((movement) => [...movement]),
    };
  };

  const cloneCell = <TCell extends Cell | undefined>(cell: TCell): TCell => {
    return cell == null ? cell : ({
      ...cell,
      position: [...cell.position],
    });
  };

  return {
    displayGrid(): void {
      const cells = grid.cells.reduce((cells, cell) => {
        const x = cell.position[0];
        const y = cell.position[1];

        if (cells[y] == null) {
          cells[y] = [];
        }

        cells[y][x] = cell.type;

        return cells;
      }, [] as (CellType | undefined)[][]);

      cells.forEach((row) => {
        console.log(row.map((cell) => cell ?? " ").join(""));
      });
    },

    get boxes(): Cell[] {
      return grid.cells.filter((cell) => cell.type === CellType.Box);
    },

    canMoveRobot(): boolean {
      return grid.movements.length > 0;
    },

    moveRobot(): GridAdapter {
      const { cells, movements } = cloneGrid(grid);

      let previousCell = cells.find((cell) => cell.type === CellType.Robot);
      if (previousCell == null) {
        throw new Error("Robot not found");
      }

      const nextMovement = movements.shift();
      if (nextMovement == null) {
        return this;
      }

      for (let i = 0; true; i++) {
        const currentPosition: Position = [
          previousCell.position[0] + nextMovement[0],
          previousCell.position[1] + nextMovement[1],
        ];

        const currentPositionCell = cells.find((cell) =>
          cell.position[0] === currentPosition[0] &&
          cell.position[1] === currentPosition[1]
        );

        if (
          !currentPositionCell || currentPositionCell.type === CellType.Wall
        ) {
          return createGridAdapter({ ...grid, movements });
        }

        const currentCellType = currentPositionCell.type;
        currentPositionCell.type = (i === 0) ? CellType.Robot : CellType.Box;

        if (i === 0) {
          previousCell.type = CellType.Empty;
        }

        if (currentCellType === CellType.Empty) {
          return createGridAdapter({ cells, movements });
        }

        previousCell = currentPositionCell;
      }
    },
  };
}
