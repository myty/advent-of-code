import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface Computer {
  a: number;
  b: number;
  c: number;
  instIdx: number;
  program: number[];
  out: number[];
}

function parse(input: string): Computer {
  return input.trimEnd().split("\n").reduce<Computer>((acc, line) => {
    if (!line.trim()) {
      return acc;
    }

    const [key, value] = line.split(": ");

    if (key.startsWith("Register") && key.length === 10) {
      return { ...acc, [key[9].toLowerCase()]: parseInt(value) };
    }

    return { ...acc, program: value.split(",").map((n) => parseInt(n)) };
  }, {
    a: 0,
    b: 0,
    c: 0,
    instIdx: 0,
    program: [],
    out: [],
  });
}

function part1(input: string): string {
  const computer = parse(input);
  return compute(computer).out.join(",");
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 17, 1, part1);
  // runPart(2024, 17, 2, part2);
}

const TEST_INPUT = `\
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), "4,6,3,5,6,3,5,2,1,0");
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });

Deno.test("compute()", async (test) => {
  await test.step("test case 1", () => {
    const state = compute({
      a: 0,
      b: 0,
      c: 9,
      instIdx: 0,
      program: [2, 6],
      out: [],
    });
    assertEquals(state.b, 1);
  });

  await test.step("test case 2", () => {
    const state = compute({
      a: 10,
      b: 0,
      c: 0,
      instIdx: 0,
      program: [5, 0, 5, 1, 5, 4],
      out: [],
    });
    assertEquals(state.out, [0, 1, 2]);
  });

  await test.step("test case 3", () => {
    const state = compute({
      a: 2024,
      b: 0,
      c: 0,
      instIdx: 0,
      program: [0, 1, 5, 4, 3, 0],
      out: [],
    });

    assertEquals(state.out, [4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0]);
    assertEquals(state.a, 0);
  });

  await test.step("test case 4", () => {
    const state = compute({
      a: 0,
      b: 29,
      c: 0,
      instIdx: 0,
      program: [1, 7],
      out: [],
    });

    assertEquals(state.b, 26);
  });

  await test.step("test case 5", () => {
    const state = compute({
      a: 0,
      b: 2024,
      c: 43690,
      instIdx: 0,
      program: [4, 0],
      out: [],
    });

    assertEquals(state.b, 44354);
  });
});

function compute(
  computerState: Computer,
): Computer {
  function comboOperand(operand: number): number {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return computerState.a;
      case 5:
        return computerState.b;
      case 6:
        return computerState.c;
      default:
        throw new Error("combo operand greater than 6");
    }
  }

  function adv(operand: number) {
    computerState.a >>= comboOperand(operand);
    computerState.instIdx += 2;
  }

  function bxl(operand: number) {
    computerState.b ^= operand;
    computerState.instIdx += 2;
  }

  function bst(operand: number) {
    computerState.b = comboOperand(operand) % 8;
    computerState.instIdx += 2;
  }

  function jnz(operand: number) {
    if (computerState.a !== 0) {
      computerState.instIdx = operand;
    } else {
      computerState.instIdx += 2;
    }
  }

  function bxc(_: number) {
    computerState.b ^= computerState.c;
    computerState.instIdx += 2;
  }

  function out(operand: number) {
    computerState.out.push(comboOperand(operand) % 8);
    computerState.instIdx += 2;
  }

  function bdv(operand: number) {
    computerState.b = computerState.a >> comboOperand(operand);
    computerState.instIdx += 2;
  }

  function cdv(operand: number) {
    computerState.c = computerState.a >> comboOperand(operand);
    computerState.instIdx += 2;
  }

  while (computerState.instIdx < computerState.program.length) {
    const operand = computerState.program[computerState.instIdx + 1];
    const opcode = computerState.program[computerState.instIdx];
    switch (opcode) {
      case 0:
        adv(operand);
        break;
      case 1:
        bxl(operand);
        break;
      case 2:
        bst(operand);
        break;
      case 3:
        jnz(operand);
        break;
      case 4:
        bxc(operand);
        break;
      case 5:
        out(operand);
        break;
      case 6:
        bdv(operand);
        break;
      case 7:
        cdv(operand);
        break;
    }
  }

  return computerState;
}
