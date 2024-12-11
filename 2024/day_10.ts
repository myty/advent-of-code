import { assertEquals } from "@std/assert";
import { runPart } from "@macil/aocd";

interface MapNode {
  x: number;
  y: number;
  elevation: number;
  neighbors: MapNode[];
}

function parse(input: string) {
  const grid = input.trimEnd().split("\n").filter(Boolean).map((row) => {
    return row.split("").map((ch) => parseInt(ch));
  });

  const nodes: MapNode[] = [];
  const neighbors = getNeighbors(grid, nodes);
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const node = neighbors.createMapNode(x, y, row[x]);

      neighbors.addEasternNeighbor(node);
      neighbors.addNorthernNeighbor(node);
      neighbors.addSouthernNeighbor(node);
      neighbors.addWesternNeighbor(node);
    }
  }

  return nodes;
}

function part1(input: string): number {
  const nodes = parse(input);

  const startingNodes = nodes.filter((node) => node.elevation === 0);
  if (startingNodes.length === 0) {
    throw new Error("No starting nodes found");
  }

  return startingNodes.reduce((acc, current) => {
    const pathsToNine = getPathsFromStartingPoint(current);
    return acc + pathsToNine;
  }, 0);
}

function part2(input: string): number {
  const nodes = parse(input);

  const startingNodes = nodes.filter((node) => node.elevation === 0);
  if (startingNodes.length === 0) {
    throw new Error("No starting nodes found");
  }

  return startingNodes.reduce((acc, current) => {
    const pathsToNine = getPathsFromStartingPoint(current, false);
    return acc + pathsToNine;
  }, 0);
}

if (import.meta.main) {
  runPart(2024, 10, 1, part1);
  runPart(2024, 10, 2, part2);
}

const TEST_INPUT = `\
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

Deno.test("part1", () => {
  assertEquals(part1(TEST_INPUT), 36);
});

Deno.test("part2", () => {
  assertEquals(part2(TEST_INPUT), 81);
});

function getPathsFromStartingPoint(
  current: MapNode,
  shouldDedup = true,
): number {
  let nodes = [current];

  for (let i = current.elevation + 1; i <= 9; i++) {
    const nextNodes = nodes.flatMap((node) =>
      node.neighbors.filter((n) => n.elevation === i)
    );
    if (nextNodes.length === 0) {
      return 0;
    }

    nodes = shouldDedup ? dedup(nextNodes) : nextNodes;
  }

  return nodes.length;
}

function getNeighbors(grid: number[][], nodeStore: MapNode[]) {
  const createMapNode = (x: number, y: number, elevation: number) => {
    return nodeStore.find((node) => node.x === x && node.y === y) ??
      (function () {
        const node = { x, y, elevation, neighbors: [] };
        nodeStore.push(node);
        return node;
      })();
  };

  const addMapNodeNeighbor = (
    currentNode: MapNode,
    { x, y, elevation }:
      & Omit<MapNode, "neighbors" | "elevation">
      & Partial<Pick<MapNode, "elevation">>,
  ) => {
    if (elevation == null) {
      return;
    }

    const neighborNode = createMapNode(x, y, elevation);

    if (!neighborNode.neighbors.includes(currentNode)) {
      neighborNode.neighbors.push(currentNode);
    }

    if (!currentNode.neighbors.includes(neighborNode)) {
      currentNode.neighbors.push(neighborNode);
    }
  };

  const addEasternNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    const row = grid[y];
    const easternX = x + 1;

    addMapNodeNeighbor(currentNode, {
      elevation: row[easternX],
      x: easternX,
      y,
    });
  };

  const addNorthernNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    if (y === 0) {
      return;
    }

    const northernRowNumber = y - 1;
    const northernRow = grid[northernRowNumber];

    addMapNodeNeighbor(currentNode, {
      elevation: northernRow[x],
      x,
      y: northernRowNumber,
    });
  };

  const addSouthernNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    if (y === grid.length - 1) {
      return;
    }

    const southernRowNumber = y + 1;
    const southernRow = grid[southernRowNumber];

    addMapNodeNeighbor(currentNode, {
      elevation: southernRow[x],
      x,
      y: southernRowNumber,
    });
  };

  const addWesternNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    if (x === 0) {
      return;
    }

    const westernX = x - 1;
    const row = grid[y];

    addMapNodeNeighbor(currentNode, {
      elevation: row[westernX],
      x: westernX,
      y,
    });
  };

  return {
    addNorthernNeighbor,
    addEasternNeighbor,
    addSouthernNeighbor,
    addWesternNeighbor,
    createMapNode,
  };
}

function dedup(nextNodes: MapNode[]): MapNode[] {
  const seen = new Set<MapNode>();
  return nextNodes.filter((node) => {
    if (seen.has(node)) {
      return false;
    }

    seen.add(node);
    return true;
  });
}
