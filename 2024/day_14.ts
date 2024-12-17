import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";
// import { red } from "jsr:@std/internal@^1.0.4/styles";

type Point = [x: number, y: number];

interface Robot {
  position: Point;
  velocity: Point;
}

function parse(input: string) {
  return input.trimEnd().split("\n").filter(Boolean).map((line): Robot => {
    const [p, v] = line.split(" ");
    const [px, py] = p.slice(2).split(",").map((n) => parseInt(n, 10));
    const [vx, vy] = v.slice(2).split(",").map((n) => parseInt(n, 10));
    return { position: [px, py], velocity: [vx, vy] };
  });
}

function part1(input: string): number {
  const robots = parse(input);
  const gridSize: Point = [101, 103];
  const seconds = 100;

  for (const robot of robots) {
    const { position, velocity } = robot;
    const [px, py] = position;
    const [vx, vy] = velocity;

    let x = (px + (vx * seconds)) % gridSize[0];
    let y = (py + (vy * seconds)) % gridSize[1];

    if (x < 0) {
      x = gridSize[0] + x;
    }

    if (y < 0) {
      y = gridSize[1] + y;
    }

    robot.position = [Math.abs(x), Math.abs(y)];
  }

  const midGridPoint: Point = [
    Math.floor(gridSize[0] / 2),
    Math.floor(gridSize[1] / 2),
  ];

  const quads = robots.reduce((acc, robot) => {
    const [x, y] = robot.position;
    acc.quad_1 += x < midGridPoint[0] && y < midGridPoint[1] ? 1 : 0;
    acc.quad_2 += x > midGridPoint[0] && y < midGridPoint[1] ? 1 : 0;
    acc.quad_3 += x < midGridPoint[0] && y > midGridPoint[1] ? 1 : 0;
    acc.quad_4 += x > midGridPoint[0] && y > midGridPoint[1] ? 1 : 0;
    return acc;
  }, {
    quad_1: 0,
    quad_2: 0,
    quad_3: 0,
    quad_4: 0,
  });

  return quads.quad_1 * quads.quad_2 * quads.quad_3 * quads.quad_4;
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 14, 1, part1);
  // runPart(2024, 14, 2, part2);
}

const TEST_INPUT = `\
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 21);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });

// function display(robots: Robot[], gridSize: Point) {
//   const grid = Array.from(
//     { length: gridSize[1] },
//     () => Array(gridSize[0]).fill("."),
//   );
//   for (const robot of robots) {
//     const [x, y] = robot.position;
//     grid[y][x] = red("X");
//   }

//   console.log(grid.map((row) => row.join("")).join("\n"));
// }
