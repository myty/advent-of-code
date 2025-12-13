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

func RunPartTwo(path string) int {
	lines, errs := utils.StreamFileLines(path)
	grid := []string{}

	// Parse lines
	for line := range lines {
		grid = append(grid, line)
	}

	processedGrid := []string{}
	tachyonManifoldCount := 0
	timelineCount := 0

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
						timelineCount++
					}

					if currentLine[cellNum+1] == '.' {
						currentLine[cellNum+1] = '|'
						timelineCount++
					}

					continue
				}

				if cellAbove == 'S' || cellAbove == '|' {
					currentLine[cellNum] = '|'
					timelineCount++
				}
			}

			row = string(currentLine)
		}

		processedGrid = append(processedGrid, row)
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return timelineCount
}
