import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

const cardRankMap: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  ["9"]: 9,
  ["8"]: 8,
  ["7"]: 7,
  ["6"]: 6,
  ["5"]: 5,
  ["4"]: 4,
  ["3"]: 3,
  ["2"]: 2,
  J: 1,
};

type Hand = {
  cards: [number, number, number, number, number];
  bid: number;
  hasPair: number;
  hasTwoPair: number;
  hasThreeOfAKind: number;
  hasFullHouse: number;
  hasFourOfAKind: number;
  hasFiveOfAKind: number;
};

function cardStats(cards: number[], jacksWild = false) {
  const stats = cards.reduce((acc, card) => {
    return {
      ...acc,
      [card]: (acc[card] || 0) + 1,
    };
  }, {} as Record<number, number>);

  if (!jacksWild) {
    return stats;
  }

  const entries = Object.entries(stats);

  const jacks = entries.find(([cardValue]) => cardValue === "1");
  const rest = entries.filter(([cardValue]) => cardValue !== "1");
  const [, count = 0] = jacks ?? [];

  if (count === 0 || rest.length === 0) {
    return stats;
  }

  const [first] = [...rest].sort(([, aCount], [, bCount]) => bCount - aCount);

  const [suit, suitCount] = first ?? [];

  const agg = rest.reduce((acc, [card, count]) => {
    return {
      ...acc,
      [card]: count,
    };
  }, {} as Record<string, number>);

  return { ...agg, [suit]: count + suitCount };
}

function parse(input: string, jacksWild = false): Hand[] {
  return input.trimEnd().split("\n").filter((line) => !!line).map((line) => {
    const [cards, bid] = line.split(" ");
    const cardValues = cards.split("").map((card) => cardRankMap[card]) as [
      number,
      number,
      number,
      number,
      number,
    ];

    const groupedCards = Object.entries(cardStats(cardValues, jacksWild));

    const hasPair = groupedCards.filter(([, count]) =>
      count === 2
    ).length === 1;

    const hasTwoPair = groupedCards.filter(([, count]) => count === 2)
      .length === 2;

    const hasThreeOfAKind = groupedCards.filter(([, count]) => count === 3)
      .length === 1;

    const hasFullHouse = hasPair && hasThreeOfAKind;

    const hasFourOfAKind = groupedCards.filter(([, count]) => count === 4)
      .length === 1;

    const hasFiveOfAKind = groupedCards.filter(([, count]) => count === 5)
      .length === 1;

    return {
      cards: cardValues,
      bid: Number(bid),
      hasPair: hasPair ? 1 : 0,
      hasTwoPair: hasTwoPair ? 1 : 0,
      hasThreeOfAKind: hasThreeOfAKind ? 1 : 0,
      hasFullHouse: hasFullHouse ? 1 : 0,
      hasFourOfAKind: hasFourOfAKind ? 1 : 0,
      hasFiveOfAKind: hasFiveOfAKind ? 1 : 0,
    };
  });
}

function part1(input: string): number {
  const hands = parse(input);

  const sortedHands = [...hands]
    .sort((a, b) => a.cards[4] - b.cards[4])
    .sort((a, b) => a.cards[3] - b.cards[3])
    .sort((a, b) => a.cards[2] - b.cards[2])
    .sort((a, b) => a.cards[1] - b.cards[1])
    .sort((a, b) => a.cards[0] - b.cards[0])
    .sort((a, b) => a.hasPair - b.hasPair)
    .sort((a, b) => a.hasTwoPair - b.hasTwoPair)
    .sort((a, b) => a.hasThreeOfAKind - b.hasThreeOfAKind)
    .sort((a, b) => a.hasFullHouse - b.hasFullHouse)
    .sort((a, b) => a.hasFourOfAKind - b.hasFourOfAKind)
    .sort((a, b) => a.hasFiveOfAKind - b.hasFiveOfAKind);

  let totalWinnings = 0;
  for (let i = 1; i <= sortedHands.length; i++) {
    const hand = sortedHands[i - 1];
    totalWinnings += hand.bid * i;
  }

  return totalWinnings;
}

function part2(input: string): number {
  const hands = parse(input, true);

  const sortedHands = [...hands]
    .sort((a, b) => a.cards[4] - b.cards[4])
    .sort((a, b) => a.cards[3] - b.cards[3])
    .sort((a, b) => a.cards[2] - b.cards[2])
    .sort((a, b) => a.cards[1] - b.cards[1])
    .sort((a, b) => a.cards[0] - b.cards[0])
    .sort((a, b) => a.hasPair - b.hasPair)
    .sort((a, b) => a.hasTwoPair - b.hasTwoPair)
    .sort((a, b) => a.hasThreeOfAKind - b.hasThreeOfAKind)
    .sort((a, b) => a.hasFullHouse - b.hasFullHouse)
    .sort((a, b) => a.hasFourOfAKind - b.hasFourOfAKind)
    .sort((a, b) => a.hasFiveOfAKind - b.hasFiveOfAKind);

  let totalWinnings = 0;
  for (let i = 1; i <= sortedHands.length; i++) {
    const hand = sortedHands[i - 1];
    totalWinnings += hand.bid * i;
  }

  return totalWinnings;
}

if (import.meta.main) {
  runPart(2023, 7, 1, part1);
  runPart(2023, 7, 2, part2);
}

const TEST_INPUT = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 6440);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 5905);
});
