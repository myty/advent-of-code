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
      const node: MapNode = { elevation: row[x], x, y, neighbors: [] };
      nodes.push(node);

      neighbors.addEasternNeighbor(node);
      neighbors.addNorthernNeighbor(node);
      neighbors.addSouthernNeighbor(node);
      neighbors.addWesternNeighbor(node);
    }
  }

  return nodes;
}

function getNeighbors(grid: number[][], nodeStore: MapNode[]) {
  const addEasternNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    const row = grid[y];
    const easternX = x + 1;
    const easternNodeElevation = row[easternX];

    if (
      easternNodeElevation == null ||
      easternNodeElevation > currentNode.elevation + 1 ||
      easternNodeElevation < currentNode.elevation - 1
    ) {
      return;
    }

    const existingNode = nodeStore.find((node) =>
      node.x === easternX && node.y === y
    );

    if (
      existingNode != null && currentNode.neighbors.indexOf(existingNode) === -1
    ) {
      currentNode.neighbors.push(existingNode);
      return;
    }

    currentNode.neighbors.push({
      elevation: row[easternX],
      x: easternX,
      y,
      neighbors: [currentNode],
    });
  };

  const addNorthernNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    if (y === 0) {
      return;
    }

    const northernRowNumber = y - 1;
    const northernRow = grid[northernRowNumber];

    const northernNodeElevation = northernRow[x];
    if (
      northernNodeElevation == null ||
      northernNodeElevation > currentNode.elevation + 1 ||
      northernNodeElevation < currentNode.elevation - 1
    ) {
      return;
    }

    const existingNode = nodeStore.find((node) =>
      node.x === x && node.y === northernRowNumber
    );

    if (
      existingNode != null && currentNode.neighbors.indexOf(existingNode) === -1
    ) {
      currentNode.neighbors.push(existingNode);
      return;
    }

    currentNode.neighbors.push({
      elevation: northernRow[x],
      x,
      y: northernRowNumber,
      neighbors: [currentNode],
    });
  };

  const addSouthernNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    if (y === grid.length - 1) {
      return;
    }

    const southernRowNumber = y + 1;
    const southernRow = grid[southernRowNumber];

    const southerNodeElevation = southernRow[x];
    if (
      southerNodeElevation == null ||
      southerNodeElevation > currentNode.elevation + 1 ||
      southerNodeElevation < currentNode.elevation - 1
    ) {
      return;
    }

    const existingNode = nodeStore.find((node) =>
      node.x === x && node.y === southernRowNumber
    );
    if (
      existingNode != null && currentNode.neighbors.indexOf(existingNode) === -1
    ) {
      currentNode.neighbors.push(existingNode);
      return;
    }

    currentNode.neighbors.push({
      elevation: southernRow[x],
      x,
      y: southernRowNumber,
      neighbors: [currentNode],
    });
  };

  const addWesternNeighbor = (currentNode: MapNode): void => {
    const { x, y } = currentNode;
    if (x === 0) {
      return;
    }

    const westernX = x - 1;
    const row = grid[y];

    const westernNodeElevation = row[westernX];
    if (
      westernNodeElevation == null ||
      westernNodeElevation > currentNode.elevation + 1 ||
      westernNodeElevation < currentNode.elevation - 1
    ) {
      return;
    }

    const existingNode = nodeStore.find((node) =>
      node.x === westernX && node.y === y
    );

    if (
      existingNode != null && currentNode.neighbors.indexOf(existingNode) !== -1
    ) {
      currentNode.neighbors.push(existingNode);
      return;
    }

    currentNode.neighbors.push({
      elevation: row[westernX],
      x: westernX,
      y,
      neighbors: [currentNode],
    });
  };

  return {
    addNorthernNeighbor,
    addEasternNeighbor,
    addSouthernNeighbor,
    addWesternNeighbor,
  };
}

function part1(input: string): number {
  const nodes = parse(input);

  const startingNodes = nodes.filter((node) => node.elevation === 0);
  if (startingNodes.length === 0) {
    throw new Error("No starting nodes found");
  }

  return startingNodes.reduce((acc, current) => {
    return acc + getPathsToNineCount(current);
  }, 0);
}

// function part2(input: string): number {
//   const items = parse(input);
//   throw new Error("TODO");
// }

if (import.meta.main) {
  runPart(2024, 10, 1, part1);
  // runPart(2024, 10, 2, part2);
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

function getPathsToNineCount(current: MapNode): number {
  if (current.elevation === 9) {
    return 1;
  }

  return current.neighbors.reduce((acc, neighbor) => {
    return acc + getPathsToNineCount(neighbor);
  }, 0);
}
// Deno.test("part2", () => {
//   assertEquals(part2(TEST_INPUT), 12);
// });
