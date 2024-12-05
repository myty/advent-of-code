import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface SleighManual {
  orderingPairs: OrderingPair[];
  updates: number[][];
}

interface OrderingPair {
  first: number;
  second: number;
}

function parse(input: string) {
  return input.trimEnd().split("\n").filter(Boolean).reduce<SleighManual>(
    (acc, line) => {
      if (line.includes(",")) {
        acc.updates.push(line.split(",").filter(Boolean).map(Number));
        return acc;
      }

      const [first, second] = line.split("|").filter(Boolean).map(Number);
      acc.orderingPairs.push({ first, second });
      return acc;
    },
    {
      orderingPairs: [],
      updates: [],
    },
  );
}

function part1(input: string): number {
  const sleighManual = parse(input);

  const goodUpdates: number[][] = [];
  const badUpdates: number[][] = [];

  for (let i = 0; i < sleighManual.updates.length; i++) {
    const update = sleighManual.updates[i];
    let outOfOrder = false;

    for (let j = 0; j < update.length; j++) {
      const prevPages = update.slice(0, j);
      const currentPage = update[j];

      const pageNumbersAfterCurrentPage = sleighManual.orderingPairs.filter(
        (pair) => pair.first === currentPage,
      ).map((pair) => pair.second);

      if (
        prevPages.some((prev) => pageNumbersAfterCurrentPage.includes(prev))
      ) {
        outOfOrder = true;
        break;
      }
    }

    if (outOfOrder) {
      badUpdates.push(update);
      continue;
    }

    goodUpdates.push(update);
  }

  return goodUpdates.reduce<number>((acc, update) => {
    const middleIndex = Math.floor(update.length / 2);
    return acc + update[middleIndex];
  }, 0);
}

function part2(input: string): number {
  const sleighManual = parse(input);

  const goodUpdates: number[][] = [];
  const badUpdates: number[][] = [];

  function badUpdateSorter(a: number, b: number) {
    const numbersBefore = sleighManual.orderingPairs
      .filter((pair) => pair.second === b)
      .map((pair) => pair.first);

    return numbersBefore.includes(a) ? -1 : 1;
  }

  for (let i = 0; i < sleighManual.updates.length; i++) {
    const update = sleighManual.updates[i];
    let outOfOrder = false;

    for (let j = 0; j < update.length; j++) {
      const prevPages = update.slice(0, j);
      const currentPage = update[j];

      const pageNumbersAfterCurrentPage = sleighManual.orderingPairs
        .filter((pair) => pair.first === currentPage)
        .map((pair) => pair.second);

      if (
        prevPages.some((prev) => pageNumbersAfterCurrentPage.includes(prev))
      ) {
        outOfOrder = true;
        break;
      }
    }

    if (outOfOrder) {
      badUpdates.push(update);
      continue;
    }

    goodUpdates.push(update);
  }

  return badUpdates
    .map((update) => update.sort(badUpdateSorter))
    .reduce<number>((acc, update) => {
      const middleIndex = Math.floor(update.length / 2);
      return acc + update[middleIndex];
    }, 0);
}

if (import.meta.main) {
  runPart(2024, 5, 1, part1);
  runPart(2024, 5, 2, part2);
}

const TEST_INPUT = `\
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 143);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 123);
});
