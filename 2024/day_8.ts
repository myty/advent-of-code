import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface Cell {
  char: string;
  x: number;
  y: number;
}

function parse(input: string) {
  return input.trimEnd().split("\n").filter(Boolean).flatMap<Cell>((line, y) =>
    line.split("").map((char, x) => ({
      char,
      x,
      y,
    }))
  );
}

function part1(input: string): number {
  const groupedCells = groupCells(parse(input));

  for (const char in groupedCells) {
    const cells = groupedCells[char];

    if (char === "#" || char === ".") {
      continue;
    }

    for (const currentCell of cells) {
      const otherCells = cells.filter((cell) => cell !== currentCell);

      for (const otherCell of otherCells) {
        const antiNodeX = (currentCell.x - otherCell.x) + currentCell.x;
        const antiNodeY = (currentCell.y - otherCell.y) + currentCell.y;

        const antiNodeIndex = groupedCells["."].findIndex((cell) => {
          return cell.x === antiNodeX && cell.y === antiNodeY;
        });

        if (antiNodeIndex !== -1) {
          const [antiNode] = groupedCells["."].splice(antiNodeIndex, 1);
          groupedCells["#"].push(antiNode);
        }
      }
    }
  }

  return groupedCells["#"].length;
}

function groupCells(cells: Cell[]) {
  return cells.reduce((acc, cell) => {
    acc["."] = [...acc["."], cell];
    if (cell.char === ".") {
      return acc;
    }

    if (!acc[cell.char]) acc[cell.char] = [];
    acc[cell.char] = [...acc[cell.char], cell];
    return acc;
  }, { ["#"]: [], ["."]: [] } as Record<string, Cell[]>);
}

function part2(input: string): number {
  const groupedCells = groupCells(parse(input));

  for (const char in groupedCells) {
    const cells = groupedCells[char];

    if (char === "#" || char === ".") {
      continue;
    }

    for (const currentCell of cells) {
      const otherCells = cells.filter((cell) => cell !== currentCell);

      for (const otherCell of otherCells) {
        for (let i = 1; true; i++) {
          const antiNodeX = (i * (currentCell.x - otherCell.x)) + currentCell.x;
          const antiNodeY = (i * (currentCell.y - otherCell.y)) + currentCell.y;

          const antiNodeIndex = groupedCells["."].findIndex((cell) => {
            return cell.x === antiNodeX && cell.y === antiNodeY;
          });

          if (antiNodeIndex !== -1) {
            const [antiNode] = groupedCells["."].splice(antiNodeIndex, 1);
            groupedCells["#"].push(antiNode);
            continue;
          }

          if (
            !groupedCells["#"].some((cell) =>
              cell.x === antiNodeX && cell.y === antiNodeY
            )
          ) {
            // console.log("outside the grid", antiNodeX, antiNodeY);
            break;
          }
        }
      }
    }
  }

  displayGrid(input, groupedCells);

  return groupedCells["#"].length;
}

if (import.meta.main) {
  runPart(2024, 8, 1, part1);
  runPart(2024, 8, 2, part2);
}

const TEST_INPUT = `\
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 14);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 34);
// });

function displayGrid(input: string, groupedCells: Record<string, Cell[]>) {
  console.log("Displaying grid");
  console.log(input);

  const lines = input.split("\n").filter(Boolean);
  for (let y = 0; y < lines.length; y++) {
    const modifiedLine = lines[y].split("").map((char, x) => {
      const cell = groupedCells["#"].find((cell) =>
        cell.x === x && cell.y === y && cell.char === "."
      );
      if (cell) {
        return "#";
      }

      return char;
    });

    console.log(modifiedLine.join(""));
  }
}
