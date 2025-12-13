package main

import (
	"fmt"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day07/input")
	fmt.Println("Day 7 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day07/input")
	fmt.Println("Day 7 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	lines, errs := utils.StreamFileLines(path)
	grid := []string{}

	// Parse lines
	for line := range lines {
		grid = append(grid, line)
	}

	processedGrid := []string{}
	tachyonManifoldCount := 0

	for lineNum := 0; lineNum < len(grid); lineNum++ {
		row := grid[lineNum]

		if lineNum > 0 {
			prevLine := []rune(processedGrid[lineNum-1])
			currentLine := []rune(grid[lineNum])

			for cellNum := 0; cellNum < len(row); cellNum++ {
				cellAbove := prevLine[cellNum]
				currentCell := currentLine[cellNum]

				if currentCell == '^' {
					if cellAbove != '|' {
						continue
					}

					tachyonManifoldCount++

					if currentLine[cellNum-1] == '.' {
						currentLine[cellNum-1] = '|'
					}

					if currentLine[cellNum+1] == '.' {
						currentLine[cellNum+1] = '|'
					}

					continue
				}

				if cellAbove == 'S' || cellAbove == '|' {
					currentLine[cellNum] = '|'
				}
			}

			row = string(currentLine)
		}

		processedGrid = append(processedGrid, row)
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return tachyonManifoldCount
}

type Cell struct {
	OriginalCharacter rune
	IsTachyonManifold bool
	PathCount         int
}

func RunPartTwo(path string) int {
	lines, errs := utils.StreamFileLines(path)
	grid := [][]Cell{}

	// Parse lines
	lineNum := 0
	for line := range lines {
		if lineNum == 0 {
			grid = append(grid, toCellRow(line, []Cell{}))
		} else {
			grid = append(grid, toCellRow(line, grid[lineNum-1]))
		}

		lineNum++
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	timelineCount := 0
	lastCellLine := grid[len(grid)-1]

	for i := range lastCellLine {
		cell := lastCellLine[i]
		timelineCount += cell.PathCount
	}

	return timelineCount
}

func toCellRow(line string, prevLine []Cell) []Cell {
	runes := []rune(line)
	cells := []Cell{}

	for i := range runes {
		originalCharacter := runes[i]

		cells = append(cells, Cell{
			OriginalCharacter: originalCharacter,
			IsTachyonManifold: originalCharacter == '^',
			PathCount:         calculatePathCount(i, runes, prevLine),
		})
	}

	return cells
}

func calculatePathCount(i int, runes []rune, prevLine []Cell) int {
	switch runes[i] {
	case '^':
		return 0
	case 'S':
		return 1
	}

	return calcUpperLeftVal(i, runes, prevLine) + calcUpperVal(i, prevLine) + calcUpperRightVal(i, runes, prevLine)
}

func calcUpperRightVal(i int, runes []rune, prevLine []Cell) int {
	if len(prevLine) <= 0 || i+1 == len(runes) || runes[i+1] != '^' {
		return 0
	}

	return prevLine[i+1].PathCount
}

func calcUpperVal(i int, prevLine []Cell) int {
	if len(prevLine) <= 0 {
		return 0
	}

	return prevLine[i].PathCount
}

func calcUpperLeftVal(i int, runes []rune, prevLine []Cell) int {
	if i == 0 || len(prevLine) <= 0 || runes[i-1] != '^' {
		return 0
	}

	return prevLine[i-1].PathCount
}
