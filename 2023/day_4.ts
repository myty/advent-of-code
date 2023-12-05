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

  const [cardId] = id.split(" ").reverse();

  return {
    id: Number(cardId),
    cardNumbers,
    playerNumbers,
    winningNumbers,
  };
}

function byIsDefined<T>(value: T | undefined | null): value is T {
  return value != null;
}

function parse(input: string) {
  return input.trimEnd().split("\n").map(parseLine).filter(byIsDefined).sort((
    a,
    b,
  ) => a.id - b.id);
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

const cardStore = new Map<number, { card: Card; count: number }>();

function redeemCard(card: Card) {
  const { winningNumbers, id } = card;

  const foundCard = cardStore.get(id) ?? { card, count: 0 };
  cardStore.set(id, {
    ...foundCard,
    count: foundCard.count + 1,
  });

  for (let i = 1; i <= winningNumbers.length; i++) {
    const redeemableCard = cardStore.get(id + i);
    if (!redeemableCard) {
      continue;
    }

    redeemCard(redeemableCard.card);
  }
}

function part2(input: string): number {
  const cards = parse(input).map((card, i) => {
    return {
      ...card,
      id: i + 1,
    };
  }).reverse();
  for (const card of cards) {
    redeemCard(card);
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
