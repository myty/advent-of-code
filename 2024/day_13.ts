import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface ClawMachine {
  buttonA: { moveX: number; moveY: number };
  buttonB: { moveX: number; moveY: number };
  prizeLocation: { x: number; y: number };
}

function parse(input: string) {
  const clawMachines: ClawMachine[] = [];
  let clawMachine: Partial<ClawMachine> = {};

  for (const line of input.trimEnd().split("\n")) {
    const [type, coords] = line.split(": ");
    if (type === "Button A") {
      const [moveX, moveY] = extractButtonMovement(coords);
      clawMachine.buttonA = { moveX, moveY };
      continue;
    }

    if (type === "Button B") {
      const [moveX, moveY] = extractButtonMovement(coords);
      clawMachine.buttonB = { moveX, moveY };
      continue;
    }

    if (type === "Prize") {
      const { x, y } = extractPrizeLocation(coords);
      clawMachine.prizeLocation = { x, y };
      clawMachines.push(clawMachine as ClawMachine);
      clawMachine = {};
    }
  }

  return clawMachines;
}

function part1(input: string): number {
  const clawMachines = parse(input);
  return calculateTotalTokens(clawMachines);
}

function part2(input: string): number {
  const clawMachines = parse(input).map((clawMachine) => {
    return {
      ...clawMachine,
      prizeLocation: {
        x: clawMachine.prizeLocation.x + 10000000000000,
        y: clawMachine.prizeLocation.y + 10000000000000,
      },
    };
  });

  return calculateTotalTokens(clawMachines);
}

if (import.meta.main) {
  runPart(2024, 13, 1, part1);
  runPart(2024, 13, 2, part2);
}

const TEST_INPUT = `\
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`;

const TEST_INPUT_2 = `\
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=10000000008400, Y=10000000005400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=10000000012748, Y=10000000012176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=10000000007870, Y=10000000006450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=10000000018641, Y=10000000010279
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 480);
});

// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT_2), 12);
// });

function extractButtonMovement(input: string) {
  return input.split(", ").map((m) => {
    const [_, value] = m.split("+");
    return parseInt(value);
  }) as [moveX: number, moveY: number];
}

function extractPrizeLocation(input: string) {
  const [x, y] = input.split(", ").map((m) => {
    const [_, value] = m.split("=");
    return parseInt(value);
  });

  return { x, y };
}

function calculateMaxButtonPresses(
  prizeLocation: { x: number; y: number },
  button: { moveX: number; moveY: number },
) {
  const maxButtonPresses = Math.min(
    Math.ceil(prizeLocation.x / button.moveX),
    Math.ceil(prizeLocation.y / button.moveY),
  );

  return maxButtonPresses;
}

function pressButtonB(
  maxButtonBPresses: number,
  buttonAPressCount: number,
  buttonA: { moveX: number; moveY: number },
  buttonB: { moveX: number; moveY: number },
  prizeLocation: { x: number; y: number },
) {
  const range: [number, number] = [0, maxButtonBPresses];

  while (true) {
    const b = midPoint(range);
    const x = (buttonAPressCount * buttonA.moveX) + (b * buttonB.moveX);
    const y = (buttonAPressCount * buttonA.moveY) + (b * buttonB.moveY);

    if (
      x === prizeLocation.x &&
      y === prizeLocation.y
    ) {
      return (3 * buttonAPressCount) + b;
    }

    if (range[0] >= range[1]) {
      return 0;
    }

    if (x >= prizeLocation.x || y >= prizeLocation.y) {
      range[1] = b - 1;
      continue;
    }

    range[0] = b + 1;
  }
}

function midPoint(range: [number, number]) {
  if (range[0] === range[1]) {
    return range[0];
  }

  return range[0] + Math.round((range[1] - range[0]) / 2);
}

function calculateTotalTokens(clawMachines: ClawMachine[]): number {
  let totalTokens = 0;

  for (const clawMachine of clawMachines) {
    const { buttonA, buttonB, prizeLocation } = clawMachine;

    const maxButtonAPresses = calculateMaxButtonPresses(
      prizeLocation,
      buttonA,
    );

    const maxButtonBPresses = calculateMaxButtonPresses(
      prizeLocation,
      buttonB,
    );

    for (let a = 0; a < maxButtonAPresses; a++) {
      const tokens = pressButtonB(
        maxButtonBPresses,
        a,
        buttonA,
        buttonB,
        prizeLocation,
      );

      if (tokens > 0) {
        totalTokens += tokens;
        break;
      }
    }
  }

  return totalTokens;
}
