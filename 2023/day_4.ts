import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

type Card = {
  id: number;
  cardNumbers: number[];
  playerNumbers: number[];
  winningNumbers: number[];
};

function parseLine(line: string): Card | undefined {
  if (!line.startsWith("Card")) {
    return undefined;
  }

  const [id, numbers] = line.split(": ");
  const cardNumbers = numbers.split(" | ")[0].split(" ").map(Number).filter(
    (n) => n > 0,
  );
  const playerNumbers = numbers.split(" | ")[1].split(" ").map(Number).filter(
    (n) => n > 0,
  );
  const winningNumbers = cardNumbers.filter((n) => playerNumbers.includes(n));

  return {
    id: Number(id.split(" ")[1]),
    cardNumbers,
    playerNumbers,
    winningNumbers,
  };
}

function byIsNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function parse(input: string) {
  return input.trimEnd().split("\n").map(parseLine).filter(byIsNotUndefined);
}

function part1(input: string): number {
  let winningTotal = 0;

  const cards = parse(input);
  for (const card of cards) {
    let cardPoints = 0;

    if (card.winningNumbers.length > 0) {
      cardPoints = 1;
    }

    if (card.winningNumbers.length > 1) {
      cardPoints = Math.pow(2, card.winningNumbers.length - 1);
    }

    winningTotal += cardPoints;
  }

  return winningTotal;
}

function part2(input: string): number {
  const cardStore = new Map<number, { card: Card; count: number }>();
  const cards = parse(input);
  for (const card of cards) {
    cardStore.set(card.id, { card, count: 1 });
  }

  for (const cardId of cardStore.keys()) {
    const card = cardStore.get(cardId);
    if (!card) {
      continue;
    }

    const { winningNumbers } = card.card;
    for (let c = 0; c < card.count; c++) {
      for (let i = 0; i < winningNumbers.length; i++) {
        const card = cardStore.get(cardId + i + 1);
        if (!card) {
          continue;
        }

        cardStore.set(card.card.id, {
          ...card,
          count: card.count + 1,
        });
      }
    }
  }

  let totalCardCount = 0;
  for (const card of cardStore.values()) {
    totalCardCount += card.count;
  }

  return totalCardCount;
}

if (import.meta.main) {
  runPart(2023, 4, 1, part1);
  runPart(2023, 4, 2, part2);
}

const TEST_INPUT = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 13);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 30);
});
