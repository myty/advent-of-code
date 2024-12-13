import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface Region {
  readonly key: string;
  perimeter: number;
  area: number;
  plots: Array<[x: number, y: number]>;
}

class Region implements Region {
  plots: Array<[x: number, y: number]> = [];
  perimeter: number = 0;
  area: number = 0;

  constructor(public readonly key: string) {}

  hasPlot(plot: [x: number, y: number]): boolean {
    return this.plots.findIndex((p) => p[0] === plot[0] && p[1] === plot[1]) >=
      0;
  }

  clearPlots(): void {
    this.plots = [];
    this.perimeter = 0;
    this.area = 0;
  }

  addPlots(...plots: Array<[x: number, y: number]>): void {
    for (const plot of plots) {
      this.addPlot(plot);
    }
  }

  addPlot(plot: [x: number, y: number]): void {
    if (!this.hasPlot(plot)) {
      this.plots.push(plot);
    }

    let perimeter = this.plots.length * 4;

    for (const plot of this.plots) {
      for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        const neighbor: [x: number, y: number] = [plot[0] + dx, plot[1] + dy];
        if (this.hasPlot(neighbor)) {
          perimeter--;
        }
      }
    }

    this.perimeter = perimeter;
    this.area = this.plots.length * this.perimeter;
  }

  isNeighboringPlot(plot: [x: number, y: number]): boolean {
    for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const neighbor: [x: number, y: number] = [plot[0] + dx, plot[1] + dy];
      if (this.hasPlot(neighbor)) {
        return true;
      }
    }

    return false;
  }
}

function parse(input: string) {
  return input.trimEnd().split("\n").filter(Boolean).map((line) =>
    line.split("")
  );
}

function part1(input: string): number {
  const items = parse(input);
  const regionsMap = new Map<string, Region[]>();

  const getRegion = (key: string, plot: [x: number, y: number]) => {
    const regions = regionsMap.get(key) ?? [];

    if (regions.length === 0) {
      const region = new Region(key);
      regions.push(region);
      regionsMap.set(key, regions);
      return region;
    }

    for (const region of regions) {
      for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        const neighbor: [x: number, y: number] = [plot[0] + dx, plot[1] + dy];
        if (region.hasPlot(neighbor)) {
          return region;
        }
      }
    }

    const region = new Region(key);
    regions.push(region);
    regionsMap.set(key, regions);
    return region;
  };

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].length; j++) {
      const key = items[i][j];
      const plot: [x: number, y: number] = [j, i];
      getRegion(key, plot).addPlot(plot);
    }
  }

  let merging = true;
  while (merging) {
    merging = false;
    for (const [key, regions] of regionsMap) {
      if (regions.length <= 1) {
        continue;
      }

      for (const region of regions) {
        const otherRegions = regions.filter((r) => r !== region);
        for (const otherRegion of otherRegions) {
          if (
            region.plots.some((plot) => otherRegion.isNeighboringPlot(plot))
          ) {
            region.addPlots(...otherRegion.plots);
            otherRegion.clearPlots();
            merging = true;
          }
        }
      }

      regionsMap.set(key, regions.filter((r) => r.plots.length > 0));
    }
  }

  return Array.from(regionsMap.values()).flat().reduce((sum, region) => {
    return sum + region.area;
  }, 0);
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 12, 1, part1);
  // runPart(2024, 12, 2, part2);
}

const TEST_INPUT = `\
AAAA
BBCD
BBCC
EEEC
`;

const TEST_INPUT_2 = `\
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`;

const TEST_INPUT_3 = `\
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`;

Deno.test("part1a", () => {
  assertEquals(part1(TEST_INPUT), 140);
});

Deno.test("part1b", () => {
  assertEquals(part1(TEST_INPUT_2), 772);
});

Deno.test("part1c", () => {
  assertEquals(part1(TEST_INPUT_3), 1930);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });
