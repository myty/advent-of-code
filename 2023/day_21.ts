import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

type GardenPlot = {
  value: string;
  x: number;
  y: number;
};

class GardenPlots {
  private constructor(
    private readonly plots: GardenPlot[],
  ) {}

  static parse(input: string): GardenPlots {
    const gardenPlots = input.trimEnd().split("\n").flatMap((s, y) =>
      s.split("").map((
        value,
        x,
      ): GardenPlot => ({
        value,
        x,
        y,
      }))
    );

    return new GardenPlots(gardenPlots);
  }

  calculateGardenPlotsReached(stepGoal: number, display: boolean): number {
    const gardenPlots = [...this.plots.filter((p) => p.value !== "#")];
    const startingPlots = new Set(this.plots.filter((p) => p.value === "S"));

    for (let step = 0; step < stepGoal; step++) {
      const nextStartingPlots = new Set<GardenPlot>();

      for (const plot of startingPlots) {
        const adjacentPlots = this.getAdjacentPlots(
          plot,
          gardenPlots,
        );

        for (const adjacentPlot of adjacentPlots) {
          nextStartingPlots.add(adjacentPlot);
        }
      }

      startingPlots.clear();
      for (const plot of nextStartingPlots) {
        startingPlots.add(plot);
      }
    }

    if (display) {
      this.display(startingPlots);
    }

    return startingPlots.size;
  }

  private display(touchedPlots: Set<GardenPlot>) {
    let currentLineNo = 0;
    let line = "";

    for (const plot of this.plots) {
      if (plot.y !== currentLineNo) {
        console.log(line);
        line = touchedPlots.has(plot) ? "0" : plot.value;
        currentLineNo = plot.y;
        continue;
      }

      line += touchedPlots.has(plot) ? "0" : plot.value;
    }

    console.log(line);
  }

  private getAdjacentPlots(
    currentPlot: GardenPlot,
    nextPlots: GardenPlot[],
  ): GardenPlot[] {
    return nextPlots.filter((nextPlot) =>
      nextPlot !== currentPlot &&
      this.isAdjacent(currentPlot, nextPlot)
    );
  }

  private isAdjacent(plot: GardenPlot, nextPlot: GardenPlot) {
    if (
      plot.y === nextPlot.y && plot.x > nextPlot.x - 2 &&
      plot.x < nextPlot.x + 2
    ) {
      return true;
    }

    if (
      plot.x === nextPlot.x && plot.y > nextPlot.y - 2 &&
      plot.y < nextPlot.y + 2
    ) {
      return true;
    }

    return false;
  }
}

function part1(input: string, stepGoal: number): number {
  return GardenPlots.parse(input).calculateGardenPlotsReached(stepGoal, false);
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2023, 21, 1, (input: string) => part1(input, 64));
  // runPart(2023, 21, 2, part2);
}

const TEST_INPUT = `\
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT, 6), 16);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });
