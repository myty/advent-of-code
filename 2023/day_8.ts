import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";
import { lcm } from "npm:mathjs";

type LCM = (...args: number[]) => number;

type Node = {
  key: string;
  left: Node | string;
  right: Node | string;
  isEnd: boolean;
};

function parse(input: string) {
  const [instructions, ...lines] = input.trimEnd().split("\n").filter((
    line,
  ) => !!line);

  const nodeTree: Record<string, Node> = {};
  for (const line of lines) {
    const [key, value] = line.split(" = ");
    const leftKey = value.slice(1, 4);
    const rightKey = value.slice(6, 9);

    nodeTree[key] = {
      key,
      left: nodeTree[leftKey] ?? leftKey,
      right: nodeTree[rightKey] ?? rightKey,
      isEnd: key.endsWith("Z"),
    };

    Object.entries(nodeTree).forEach(([, node]) => {
      if (node.left === key) {
        node.left = nodeTree[key];
      }
      if (node.right === key) {
        node.right = nodeTree[key];
      }
    });
  }

  const instructionKeys: ("left" | "right")[] = [];
  for (const instruction of instructions) {
    if (instruction === "R") {
      instructionKeys.push("right");
      continue;
    }

    if (instruction === "L") {
      instructionKeys.push("left");
      continue;
    }

    throw new Error(`Invalid instruction: ${instruction}`);
  }

  return { instructions: instructionKeys, nodeTree };
}

function iterationCount(
  instructions: ("left" | "right")[],
  currentNode: Node,
  completed: (node: Node) => boolean,
) {
  let i = 0;

  while (!completed(currentNode)) {
    const iteration = i++;
    const instruction = instructions[iteration % instructions.length];
    currentNode = currentNode[instruction] as Node;
  }

  return i;
}

function part1(input: string): number {
  const { instructions, nodeTree } = parse(input);

  return iterationCount(
    instructions,
    nodeTree["AAA"],
    ({ key }) => key === "ZZZ",
  );
}

async function part2(input: string): Promise<number> {
  const { instructions, nodeTree } = parse(input);

  const currentNodes = Object.entries(nodeTree).filter(([key]) =>
    key.endsWith("A")
  ).map(([, value]) => value);

  const calculateInterations = (
    currentNode: Node,
    completionCheck: (node: Node) => boolean,
  ) => iterationCount(instructions, currentNode, completionCheck);

  const results = await Promise.all(
    currentNodes.map((node) =>
      new Promise<number>((resolve) => {
        const iterations = calculateInterations(
          node,
          ({ isEnd }) => isEnd,
        );

        resolve(iterations);
      })
    ),
  );

  return (<LCM> lcm)(...results);
}

if (import.meta.main) {
  runPart(2023, 8, 1, part1);
  runPart(2023, 8, 2, part2);
}

const TEST_INPUT = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`;

const TEST_INPUT_2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`;

const TEST_INPUT_3 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`;

Deno.test("part1.0", () => {
  assertEquals(part1(TEST_INPUT), 2);
});

Deno.test("part1.1", () => {
  assertEquals(part1(TEST_INPUT_2), 6);
});

Deno.test("part2", async () => {
  assertEquals(await part2(TEST_INPUT_3), 6);
});
