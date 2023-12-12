import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

class SpringCombination {
  constructor(
    readonly startingCombination: string,
    readonly lastRecord: number[],
    readonly possibleCombinations: string[] = [],
  ) {
    this.possibleCombinations = this.calculatePossibleCombinations();
  }

  calculatePossibleCombinations(): string[] {
    const combinations: string[] = [];

    const questionCount =
      this.startingCombination.split("").filter((char) => char === "?").length;

    const binaryCombinations = [...Array(2 ** questionCount).keys()].map((i) =>
      i.toString(2).padStart(questionCount, "0")
    );

    for (const binaryCombination of binaryCombinations) {
      let binaryIndex = 0;
      let combination = "";

      for (const char of this.startingCombination) {
        if (char === "?") {
          combination += binaryCombination[binaryIndex++] === "1" ? "#" : ".";
        } else {
          combination += char;
        }
      }

      if (this.isPossibleCombination(combination)) {
        combinations.push(combination);
      }
    }

    return combinations;
  }

  get possibleCombinationCount() {
    return this.possibleCombinations.length;
  }

  public isPossibleCombination(combination: string) {
    if (combination.includes("?")) {
      return false;
    }

    let recordIndex = 0;
    for (const combinationPart of combination.split(".")) {
      if (!combinationPart) {
        continue;
      }

      if (combinationPart.length !== this.lastRecord[recordIndex++]) {
        return false;
      }
    }

    return recordIndex === this.lastRecord.length;
  }
}

function parse(input: string, wasFolded = false) {
  const springCombinations = input.trimEnd().split("\n").map((line, i) => {
    let [combination, lastRecord] = line.split(" ");

    if (wasFolded) {
      combination = Array.from({ length: 5 }, () => combination).join("?");
      lastRecord = Array.from({ length: 5 }, () => lastRecord).join(",");
    }

    console.log(`processing line: ${i}`);

    return new SpringCombination(
      combination,
      lastRecord.split(",").map(Number),
    );
  });

  return springCombinations;
}

function part1(input: string): number {
  const springCombinations = parse(input);

  return springCombinations.reduce((acc, springCombination) => {
    return acc + springCombination.possibleCombinationCount;
  }, 0);
}

function part2(input: string): number {
  const springCombinations = parse(input, true);

  return springCombinations.reduce((acc, springCombination) => {
    return acc + springCombination.possibleCombinationCount;
  }, 0);
}

if (import.meta.main) {
  runPart(2023, 12, 1, part1);
  runPart(2023, 12, 2, part2);
}

const TEST_INPUT = `\
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 21);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 525152);
// });
