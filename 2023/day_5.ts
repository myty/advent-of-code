import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

type PlantingAttribute =
  | "seed"
  | "soil"
  | "fertilizer"
  | "water"
  | "light"
  | "temperature"
  | "humidity"
  | "location";

class SourceDestinationMapper {
  private readonly maps: [
    destinationStart: number,
    sourceStart: number,
    range: number,
  ][] = [];

  constructor(
    private readonly sourceAttribute: PlantingAttribute,
    private readonly destinationAttribute: PlantingAttribute,
  ) {}

  addRange(destinationStart: number, sourceStart: number, range: number): void {
    this.maps.push([destinationStart, sourceStart, range]);
  }

  getDestination(
    sourceAttrinute: PlantingAttribute,
    source: number,
  ) {
    if (sourceAttrinute !== this.sourceAttribute) {
      return {};
    }

    const map = this.maps.find(([, sourceStart, range]) =>
      (source >= sourceStart) && (source < sourceStart + range)
    );

    if (map == null) {
      return { id: source, attribute: this.destinationAttribute };
    }

    const [destinationStart, sourceStart] = map;
    const offset = source - sourceStart;

    return {
      id: destinationStart + offset,
      attribute: this.destinationAttribute,
    };
  }
}

const seedLine: number[] = [];
const sourceDestinationMappers: SourceDestinationMapper[] = [];

function getSeedMap(
  attribute: PlantingAttribute,
  id: number,
): Partial<Record<PlantingAttribute, number>> {
  const sourceDestinationMap = sourceDestinationMappers
    .map((m) => m.getDestination(attribute, id))
    .reduce((acc, result) => {
      const { id, attribute } = result;

      if (!attribute || Object.keys(acc).includes(attribute)) {
        return acc;
      }

      return { ...acc, [attribute]: id, ...getSeedMap(attribute, id) };
    }, {} as Partial<Record<PlantingAttribute, number>>);

  return sourceDestinationMap;
}

function parse(input: string) {
  let currentSourceMappper: SourceDestinationMapper | undefined;

  for (const line of input.trimEnd().split("\n")) {
    if (!line.trim()) {
      continue;
    }

    if (line.startsWith("seeds:")) {
      seedLine.push(...line.split(":")[1].trim().split(" ").map(Number));
      continue;
    }

    if (line.includes("-to-")) {
      const [from, remaining] = line.split("-to-");
      const [to] = remaining.split(" ");

      currentSourceMappper = new SourceDestinationMapper(
        from.trim() as PlantingAttribute,
        to.trim() as PlantingAttribute,
      );

      sourceDestinationMappers.push(currentSourceMappper);

      continue;
    }

    const [destination, source, range] = line.split(" ").filter((s) => !!s).map(
      Number,
    );

    if (destination == null || source == null || range == null) {
      continue;
    }

    currentSourceMappper?.addRange(destination, source, range);
  }
}

function part1(input: string): number {
  parse(input);

  let lowestLocation = Infinity;

  for (const id of seedLine) {
    const { location } = getSeedMap("seed", id);

    if (location == null) {
      continue;
    }

    if (location < lowestLocation) {
      lowestLocation = location;
    }
  }

  return lowestLocation;
}

function part2(input: string): number {
  parse(input);

  let lowestLocation = Infinity;

  for (let i = 0; i < seedLine.length; i = i + 2) {
    const start = seedLine[i];
    const range = seedLine[i + 1];

    for (let j = 0; j < range; j++) {
      const { location } = getSeedMap("seed", start + j);

      if (location == null) {
        continue;
      }

      if (location < lowestLocation) {
        lowestLocation = location;
      }
    }
  }

  return lowestLocation;
}

if (import.meta.main) {
  runPart(2023, 5, 1, part1);
  runPart(2023, 5, 2, part2);
}

const TEST_INPUT = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 35);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 46);
});
