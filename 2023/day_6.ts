import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

function parse(input: string, combine = false) {
  const [timeLine, distanceLine] = input.trimEnd().split("\n").filter((line) =>
    !!line
  );

  const [, ...times] = timeLine.split(/\s+/).filter((time) => !!time).map(
    Number,
  );

  const [, ...distances] = distanceLine.split(/\s+/).filter((time) => !!time)
    .map(Number);

  const races = !combine
    ? times.map((time, index) => ({
      raceTime: time,
      bestDistance: distances[index],
      waysToBeat: [] as number[],
    }))
    : [
      {
        raceTime: parseInt(times.reduce((a, b) => a + `${b}`, ""), 10),
        bestDistance: parseInt(distances.reduce((a, b) => a + `${b}`, ""), 10),
        waysToBeat: [] as number[],
      },
    ];

  for (const race of races) {
    for (let mmPerSecond = 0; mmPerSecond <= race.raceTime; mmPerSecond++) {
      const runningTime = race.raceTime - mmPerSecond;
      const distance = mmPerSecond * runningTime;
      if (distance > race.bestDistance) {
        race.waysToBeat.push(mmPerSecond);
      }
    }
  }

  return races;
}

function part1(input: string): number {
  const races = parse(input);

  return races.map((r) => r.waysToBeat.length).reduce((a, b) => a * b, 1);
}

function part2(input: string): number {
  const races = parse(input, true);

  return races.map((r) => r.waysToBeat.length).reduce((a, b) => a * b, 1);
}

if (import.meta.main) {
  runPart(2023, 6, 1, part1);
  runPart(2023, 6, 2, part2);
}

const TEST_INPUT = `
Time:      7  15   30
Distance:  9  40  200
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 288);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 71503);
});
