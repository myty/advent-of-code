import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

type FileBlock = number;
type EmptyBlock = null;
type Block = FileBlock | EmptyBlock;

type Section = {
  id: Block;
  size: number;
};

function parse(input: string) {
  const lines = input.trimEnd().split("\n").filter(Boolean);
  return lines.flatMap((line) => line.split("").map((n) => parseInt(n, 10)));
}

function part1(input: string): number {
  const disk: Block[] = [];
  const numbers = parse(input);

  let id = 0;
  for (const { n, i } of numbers.map((n, i) => ({ n, i }))) {
    const isFreeSpace = i % 2 !== 0;
    if (isFreeSpace) {
      id++;
    }

    for (let j = 0; j < n; j++) {
      disk.push(isFreeSpace ? null : id);
    }
  }

  for (let i = 0, j = disk.length - 1; i < j; i++) {
    if (disk[i] !== null) {
      continue;
    }

    while (disk[j] === null) {
      j--;
    }

    disk[i] = disk[j];
    disk[j] = null;
  }

  const checksum = disk
    .filter((c) => c !== null)
    .map((f, i) => i * f)
    .reduce((a, b) => a + b, 0);

  return checksum;
}

function part2(input: string): number {
  const sections: Section[] = [];
  const numbers = parse(input);

  let id = 0;
  for (const { n, i } of numbers.map((n, i) => ({ n, i }))) {
    const isFreeSpace = i % 2 !== 0;
    if (isFreeSpace) {
      id++;
    }

    sections.push({
      id: isFreeSpace ? null : id,
      size: n,
    });
  }

  for (let j = sections.length - 1; j > 0; j--) {
    const section = sections[j];
    const { id, size } = section;

    if (id === null) {
      continue;
    }

    const sectionCandidateIndex = sections.findIndex((s, i) =>
      s.id === null && s.size >= size && i < j
    );
    if (sectionCandidateIndex < 0) {
      continue;
    }

    const sectionCandidate = sections[sectionCandidateIndex];

    const newEmptySectionSize = sectionCandidate.size - size;
    if (newEmptySectionSize > 0) {
      sections.splice(sectionCandidateIndex + 1, 0, {
        id: null,
        size: newEmptySectionSize,
      });
    }

    sectionCandidate.id = id;
    sectionCandidate.size = size;
    section.id = null;
  }

  const checksum = sections
    .flatMap((s) => Array.from({ length: s.size }, () => s.id ?? 0))
    .map((f, i) => i * f)
    .reduce((a, b) => a + b, 0);

  return checksum;
}

if (import.meta.main) {
  runPart(2024, 9, 1, part1);
  runPart(2024, 9, 2, part2);
}

const TEST_INPUT = `\
2333133121414131402
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 1928);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 2858);
});
