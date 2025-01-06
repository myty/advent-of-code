import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface Towels {
  patterns: string[];
  designs: string[];
}

interface QueueItem {
  index: number;
  combination: string[];
}

function parse(input: string): Towels {
  return input.trimEnd().split("\n").filter(Boolean)
    .reduce<Towels>((towels, line) => {
      if (line.includes(",")) {
        towels.patterns.push(
          ...line.split(", ").filter(Boolean).map((pattern) => pattern.trim()),
        );
        return towels;
      }

      towels.designs.push(line);
      return towels;
    }, {
      patterns: [],
      designs: [],
    });
}

function part1(input: string): number {
  const { patterns, designs } = parse(input);
  const towelDesignMap = createTowelDesignMap({ patterns, designs });
  return towelDesignMap.size;
}

function part2(input: string): number {
  const { patterns, designs } = parse(input);
  const towelDesignMap = createTowelDesignMap({ patterns, designs });
  return towelDesignMap.values().reduce(
    (total, combinations) => total + combinations.size,
    0,
  );
}

if (import.meta.main) {
  runPart(2024, 19, 1, part1);
  runPart(2024, 19, 2, part2);
}

const TEST_INPUT = `\
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 6);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 16);
});

function createTowelDesignMap(
  { patterns, designs }: Towels,
): Map<string, Set<string>> {
  const possibleDesigns = new Map<string, Set<string>>();
  const badDesigns = new Set<string>();

  for (const design of designs) {
    const addDesignCombination = createdesignCombinationThunk(
      possibleDesigns,
      design,
    );

    const designQueue: QueueItem[] = [{
      index: 0,
      combination: [],
    }];

    while (designQueue.length > 0) {
      designQueue.sort((a, b) => a.index - b.index);

      const queuedItem = designQueue.shift()!;
      const queuedDesign = design.slice(queuedItem.index);

      if (badDesigns.has(queuedDesign)) {
        continue;
      }

      const matchedPatterns = [
        ...patterns
          .filter((pattern) => queuedDesign.startsWith(pattern)),
      ];

      if (matchedPatterns.length === 0) {
        badDesigns.add(queuedDesign);
        continue;
      }

      for (const pattern of matchedPatterns) {
        const nextQueuedItem: QueueItem = {
          index: queuedItem.index + pattern.length,
          combination: [...queuedItem.combination, pattern],
        };

        if (nextQueuedItem.index < design.length) {
          designQueue.push(nextQueuedItem);
          continue;
        }

        addDesignCombination(nextQueuedItem.combination);
      }
    }
  }

  return possibleDesigns;
}

function createdesignCombinationThunk(
  possibleDesigns: Map<string, Set<string>>,
  design: string,
) {
  return function addCombination(
    combination: string[],
  ): void {
    const designCombinations = possibleDesigns.get(design) ?? new Set<string>();
    possibleDesigns.set(design, designCombinations);
    designCombinations.add(combination.join(","));
  };
}
