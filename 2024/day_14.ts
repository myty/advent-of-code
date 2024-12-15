import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";
import { red } from "jsr:@std/internal@^1.0.4/styles";

type Point = [x: number, y: number];

interface Robot {
  position: Point;
  velocity: Point;
}

class Robots {
  constructor(public robots: Robot[], public gridSize: Point) {}

  move(seconds = 1) {
    for (const robot of this.robots) {
      const { position, velocity } = robot;
      const [px, py] = position;
      const [vx, vy] = velocity;

      let x = (px + (vx * seconds)) % this.gridSize[0];
      let y = (py + (vy * seconds)) % this.gridSize[1];

      if (x < 0) {
        x = this.gridSize[0] + x;
      }

      if (y < 0) {
        y = this.gridSize[1] + y;
      }

      robot.position = [Math.abs(x), Math.abs(y)];
    }
  }

  getTotalUniquePositions() {
    return new Set(this.robots.map((robot) => robot.position.join(","))).size;
  }

  robotGroups(): Robot[][] {
    const pool = [...this.robots];
    const groups: Robot[][] = [];

    while (pool.length) {
      const group: Robot[] = [];
      const [robot] = pool;
      group.push(robot);
      pool.splice(pool.indexOf(robot), 1);

      for (let i = 0; i < group.length; i++) {
        const robot = group[i];
        const neighbors = pool.filter((r) =>
          Math.abs(r.position[0] - robot.position[0]) <= 1 &&
          Math.abs(r.position[1] - robot.position[1]) <= 1
        );
        group.push(...neighbors);
        pool.splice(0, neighbors.length);
      }

      groups.push(group);
    }

    return groups;
  }

  getQuandrantCount() {
    const midGridPoint: Point = [
      Math.floor(this.gridSize[0] / 2),
      Math.floor(this.gridSize[1] / 2),
    ];

    const quads = this.robots.reduce((acc, robot) => {
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

    return quads;
  }

  display() {
    const grid = Array.from(
      { length: this.gridSize[1] },
      () => Array(this.gridSize[0]).fill(" "),
    );
    for (const robot of this.robots) {
      const [x, y] = robot.position;
      grid[y][x] = red("X");
    }

    console.log(grid.map((row) => row.join("")).join("\n"));
  }
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
  const robots = new Robots(parse(input), [101, 103]);
  robots.move(100);

  const quads = robots.getQuandrantCount();

  return quads.quad_1 * quads.quad_2 * quads.quad_3 * quads.quad_4;
}

function part2(input: string): number {
  const robots = new Robots(parse(input), [101, 103]);
  const iterations = 101 * 103;
  let maxNeighborCountIteration = 0;
  let minGroupCount = iterations;

  for (
    ;
    maxNeighborCountIteration <= iterations;
    maxNeighborCountIteration++
  ) {
    robots.move();

    const groups = robots.robotGroups();
    if (minGroupCount > groups.length) {
      minGroupCount = groups.length;
      robots.display();
      console.log("Groups:", minGroupCount);
    }
  }

  return maxNeighborCountIteration;
}

if (import.meta.main) {
  runPart(2024, 14, 1, part1);
  runPart(2024, 14, 2, part2);
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
