import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

const COLOR_MAP = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

type Color = keyof typeof COLOR_MAP;
type Score = Record<Color, number>;
type Game = {
  id: number;
  scores: Score[];
  source: string;
};

function parseScore(input: string): Score {
  const score: Score = { red: 0, green: 0, blue: 0 };

  for (const item of input.split(", ")) {
    const [count, color] = item.split(" ");
    score[color as Color] += Number(count);
  }

  return score;
}

function parseGame(input: string): Game {
  const [id, scores] = input.slice(5).split(": ");

  return {
    id: parseInt(id, 10),
    scores: scores.split("; ").map(parseScore),
    source: input,
  };
}

function parse(input: string): readonly Game[] {
  return input.trimEnd().split("\n").map(parseGame);
}

function isValidScore(score: Score): boolean {
  return (
    score.red <= COLOR_MAP.red &&
    score.green <= COLOR_MAP.green &&
    score.blue <= COLOR_MAP.blue
  );
}

function isValidGame(game: Game): boolean {
  return game.scores.every(isValidScore);
}

function maxPossibleScore(game: Game): Score {
  const maxScore: Score = { red: 0, green: 0, blue: 0 };

  for (const score of game.scores) {
    for (const color of Object.keys(score) as Color[]) {
      maxScore[color] = Math.max(maxScore[color], score[color]);
    }
  }

  return maxScore;
}

function part1(input: string): number {
  const validGames = parse(input).filter(isValidGame);

  // Sum of ids
  return validGames.map((game) => game.id).reduce(
    (a, b) => a + b,
    0,
  );
}

function part2(input: string): number {
  const maxPossibleScores = parse(input).map(maxPossibleScore);

  // Sum of multiplied scores
  return maxPossibleScores.map((score) => score.blue * score.red * score.green)
    .reduce(
      (a, b) => a + b,
      0,
    );
}

if (import.meta.main) {
  runPart(2023, 2, 1, part1);
  runPart(2023, 2, 2, part2);
}

const TEST_INPUT = `\
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 8);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 2286);
});
