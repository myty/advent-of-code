import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

function parse(input: string) {
  return input.trimEnd().split("\n").filter(Boolean).flatMap((line) =>
    line.split(" ").filter(Boolean)
  );
}

function part1(input: string): number {
  const numberMap = buildNumberMap(parse(input));
  return recursiveCount(numberMap, 25);
}

function part2(input: string): number {
  const numberMap = buildNumberMap(parse(input));
  return recursiveCount(numberMap, 75);
}

if (import.meta.main) {
  runPart(2024, 11, 1, part1);
  runPart(2024, 11, 2, part2);
}

const TEST_INPUT = `125 17`;

Deno.test("part1 - 25", () => {
  assertEquals(part1(TEST_INPUT), 55312);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 65601038650482);
});

function buildNumberMap(numbers: string[]): Map<string, number> {
  const numberMap = new Map<string, number>();

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    numberMap.set(number, (numberMap.get(number) ?? 0) + 1);
  }

  return numberMap;
}

function recursiveCount(
  numbersMap: Map<string, number>,
  iterationsRemaining: number,
): number {
  if (iterationsRemaining === 0) {
    return numbersMap.values().reduce((sum, count) => sum + count, 0);
  }

  const entries = Array.from(
    numbersMap.entries().filter((entry) => {
      const [_, count] = entry;
      return (count !== 0);
    }).map((e) => {
      const [number, count] = e;
      return [number, count] as const;
    }),
  );

  const nextMap = createMapWrapper(new Map<string, number>());

  for (const [number, prevNumberCount] of entries) {
    if (number === "0") {
      nextMap.add("1", prevNumberCount);
      continue;
    }

    if (number.length % 2 === 0) {
      const [nextNumberOne, nextNumberTwo] = split(number);
      nextMap.add(nextNumberOne, prevNumberCount);
      nextMap.add(nextNumberTwo, prevNumberCount);
      continue;
    }

    const nextNumber = `${2024 * parseInt(number)}`;
    nextMap.add(nextNumber, prevNumberCount);
  }

  return recursiveCount(nextMap.toMap(), iterationsRemaining - 1);
}

function createMapWrapper(map: Map<string, number>) {
  return {
    add: (number: string, count: number) => {
      map.set(number, (map.get(number) ?? 0) + count);
    },
    subtract: (number: string, count: number) => {
      const currentCount = map.get(number) ?? 0;
      if (currentCount === 0) {
        throw new Error("Cannot subtract from 0 count");
      }

      map.set(number, currentCount - count);
    },
    toMap: () => {
      return map;
    },
  };
}

function split(number: string): [string, string] {
  if (number.length % 2 !== 0) {
    throw new Error("Number must be even length");
  }

  return [
    number.slice(0, number.length / 2),
    `${parseInt(number.slice(number.length / 2))}`,
  ];
}

Deno.test("split", () => {
  assertEquals(split("1234"), ["12", "34"]);
  assertEquals(split("1234"), ["12", "34"]);
  assertEquals(split("72"), ["7", "2"]);
  assertEquals(split("7200"), ["72", "0"]);
});
