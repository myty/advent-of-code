import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { runPart } from "https://deno.land/x/aocd@v1.5.1/mod.ts";

type BaseToken = {
  type: "number" | "symbol";
  value: number | string;
  line: number;
  start: number;
  end: number;
};

type NumberToken = BaseToken & {
  type: "number";
  value: number;
};

type SymbolToken = BaseToken & {
  type: "symbol";
  value: string;
};

type Token = NumberToken | SymbolToken;

function isNumber(char: string): boolean {
  return char != null && !isNaN(Number(char));
}

function isNumberToken(token?: Token | null): token is NumberToken {
  return token?.type === "number";
}

function isSymbolToken(token?: Token | null): token is SymbolToken {
  return token?.type === "symbol";
}

function createNumberToken(
  token: NumberToken | null,
  char: string,
  line: number,
  col: number,
): NumberToken {
  if (token == null) {
    return {
      type: "number",
      value: Number(char),
      line: line,
      start: col,
      end: col,
    };
  }

  return {
    ...token,
    value: token.value * 10 + Number(char),
    end: col,
  };
}

function tokenizeLine(line: number, value: string): Token[] {
  const tokens: Token[] = [];

  let currentNumberToken: NumberToken | null = null;

  for (const [i, char] of `.${value}.`.split("").entries()) {
    if (isNumber(char)) {
      currentNumberToken = createNumberToken(
        currentNumberToken,
        char,
        line,
        i,
      );
      continue;
    }

    if (currentNumberToken != null) {
      tokens.push(currentNumberToken);
      currentNumberToken = null;
    }

    if (char === ".") {
      continue;
    }

    tokens.push({
      type: "symbol",
      value: char,
      line: line,
      start: i,
      end: i,
    });
  }

  return tokens;
}

function parse(input: string) {
  return input.trimEnd().split("\n").flatMap((value, i) =>
    tokenizeLine(i + 1, value)
  );
}

const EngineValidator = function (all: Token[]) {
  const lineSymbolTokens = (tokens: Token[], line: number): SymbolToken[] => {
    return tokens.filter((t) => t.line === line).filter(isSymbolToken);
  };

  const adjacentSymbolsWithinRange = (
    lineSymbolTokens: SymbolToken[],
    start: number,
    end: number,
  ): SymbolToken[] => {
    return lineSymbolTokens.filter((t) => t.end >= start && t.start <= end);
  };

  const hasSymbolTokenWithinRange = (
    lineSymbolTokens: SymbolToken[],
    start: number,
    end: number,
  ): boolean => {
    return adjacentSymbolsWithinRange(lineSymbolTokens, start, end).length > 0;
  };

  const hasPreviousLineAdjacentSymbolToken = (token: NumberToken) =>
    hasSymbolTokenWithinRange(
      lineSymbolTokens(all, token.line - 1),
      token.start - 1,
      token.end + 1,
    );

  const hasSameLineAdjacentSymbolToken = (token: NumberToken) =>
    hasSymbolTokenWithinRange(
      lineSymbolTokens(all, token.line),
      token.start - 1,
      token.end + 1,
    );
  const hasNextLineAdjacentSymbolToken = (token: NumberToken) =>
    hasSymbolTokenWithinRange(
      lineSymbolTokens(all, token.line + 1),
      token.start - 1,
      token.end + 1,
    );

  return {
    adjacentSymbols: (token: NumberToken, symbol?: string) => {
      const filterBySymbol = (t: Token) => symbol == null || t.value === symbol;
      const allFiltered = all.filter(filterBySymbol);

      return [
        ...adjacentSymbolsWithinRange(
          lineSymbolTokens(allFiltered, token.line - 1),
          token.start - 1,
          token.end + 1,
        ),
        ...adjacentSymbolsWithinRange(
          lineSymbolTokens(allFiltered, token.line),
          token.start - 1,
          token.end + 1,
        ),
        ...adjacentSymbolsWithinRange(
          lineSymbolTokens(allFiltered, token.line + 1),
          token.start - 1,
          token.end + 1,
        ),
      ];
    },
    isEnginePart: (token: Token) => {
      if (!isNumberToken(token)) {
        return false;
      }

      return (
        hasPreviousLineAdjacentSymbolToken(token) ||
        hasSameLineAdjacentSymbolToken(token) ||
        hasNextLineAdjacentSymbolToken(token)
      );
    },
  };
};

function part1(input: string): number {
  const engineParts: Token[] = [];
  const tokens = parse(input);
  const { isEnginePart } = EngineValidator(tokens);

  tokens.forEach((token) => {
    if (isNumberToken(token) && isEnginePart(token)) {
      engineParts.push(token);
    }
  });

  return engineParts.filter(isNumberToken).reduce((acc, token) => {
    return acc + token.value;
  }, 0);
}

function part2(input: string): number {
  const gearMap = new Map<SymbolToken, Set<NumberToken>>();
  const tokens = parse(input);
  const { adjacentSymbols } = EngineValidator(tokens);

  tokens.forEach((token) => {
    if (isNumberToken(token)) {
      const gearSymbols = adjacentSymbols(token, "*");
      for (const gearSymbol of gearSymbols) {
        if (!gearMap.has(gearSymbol)) {
          gearMap.set(gearSymbol, new Set());
        }

        gearMap.get(gearSymbol)?.add(token);
      }
    }
  });

  let gearRatioTotal = 0;

  for (const [, numberTokenSet] of gearMap.entries()) {
    if (numberTokenSet.size < 2) {
      continue;
    }

    let gearRatio: number | undefined = undefined;

    numberTokenSet.forEach((numberToken) => {
      if (gearRatio == null) {
        gearRatio = numberToken.value;
        return;
      }

      gearRatio = gearRatio * numberToken.value;
    });

    gearRatioTotal += gearRatio ?? 0;
  }

  return gearRatioTotal;
}

if (import.meta.main) {
  runPart(2023, 3, 1, part1);
  runPart(2023, 3, 2, part2);
}

const TEST_INPUT = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 4361);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 467835);
});
