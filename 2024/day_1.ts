import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

function parse(input: string): [list1: number[], list2: number[]] {
  const parsedlLines = input.trimEnd().split("\n").filter((str) => str).map(
    (str) => {
      const [x, y] = str.split(" ").filter(Boolean).map(Number);
      return [x, y];
    },
  );

  const list1 = parsedlLines.map((line) => line[0]).toSorted();
  const list2 = parsedlLines.map((line) => line[1]).toSorted();

  return [list1, list2];
}

function part1(input: string): number {
  const [list1, list2] = parse(input);

  return list1.reduce((acc, curr, index) => {
    return acc + Math.abs(curr - list2[index]);
  }, 0);
}

function part2(input: string): number {
  const [list1, list2] = parse(input);

  const listTwoOccuranceMap = list2.reduce((acc, curr) => {
    acc.set(curr, (acc.get(curr) ?? 0) + 1);
    return acc;
  }, new Map<number, number>());

  return list1.reduce((acc, curr) => {
    const multiplyer = listTwoOccuranceMap.get(curr) ?? 0;
    return acc + (curr * multiplyer);
  }, 0);
}

if (import.meta.main) {
  runPart(2024, 1, 1, part1);
  runPart(2024, 1, 2, part2);
}

const TEST_INPUT = `\
3   4
4   3
2   5
1   3
3   9
3   3
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 11);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 31);
});
