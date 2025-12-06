package main

import (
	"fmt"

	"aoc/2025/utils"
)

const EMPTY = -1
const ROLL = "@"
const MAX_MOVABLE_ROLLS = 4

func main() {
	submissionOneResult := RunPartOne("day04/input")
	fmt.Println("Day 4 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day04/input")
	fmt.Println("Day 4 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	var grid [][]int

	lines, errs := utils.StreamFileLines(path)
	rowIndex := 0

	// Parse lines
	for line := range lines {
		rowLength := len(line)

		if len(grid) == 0 {
			grid = append(grid, createAndFill(rowLength+2, EMPTY))
		}

		row := createAndFill(rowLength+2, EMPTY)

		for i := range rowLength {
			if string(line[i]) == ROLL {
				row[i+1] += 1
			}
		}

		grid = append(grid, row)

		rowIndex++
	}

	grid = append(grid, createAndFill(len(grid[1]), EMPTY))

	movableRolls, _ := removeRolls(grid)

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return movableRolls
}

func RunPartTwo(path string) int {
	var grid [][]int

	lines, errs := utils.StreamFileLines(path)
	rowIndex := 0

	// Parse lines
	for line := range lines {
		rowLength := len(line)

		if len(grid) == 0 {
			grid = append(grid, createAndFill(rowLength+2, EMPTY))
		}

		row := createAndFill(rowLength+2, EMPTY)

		for i := range rowLength {
			if string(line[i]) == ROLL {
				row[i+1] += 1
			}
		}

		grid = append(grid, row)

		rowIndex++
	}

	grid = append(grid, createAndFill(len(grid[1]), EMPTY))
	rollsMoved := 0

	for true {
		var rolls int
		rolls, grid = removeRolls(grid)

		if rolls == 0 {
			break
		}

		rollsMoved += rolls
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return rollsMoved
}

func removeRolls(grid [][]int) (int, [][]int) {
	// Process rolls
	width := len(grid[1]) - 1
	height := len(grid) - 1
	removedRolls := 0
	nextGrid := copy2D(grid)

	// rows
	for row := 1; row < height; row++ {
		// cells
		for cell := 1; cell < width; cell++ {
			if grid[row][cell] != EMPTY && getSurroundingRollsCount(grid, row, cell) < MAX_MOVABLE_ROLLS {
				removedRolls++
				nextGrid[row][cell] = EMPTY
			}
		}
	}

	return removedRolls, nextGrid
}

func createAndFill[T any](length int, value T) []T {
	s := make([]T, length)
	for i := range s {
		s[i] = value
	}
	return s
}

func getSurroundingRollsCount(grid [][]int, row int, cell int) int {
	cellValue := grid[row][cell]

	if cellValue == EMPTY {
		return cellValue
	}

	for i := row - 1; i <= row+1; i++ {
		for j := cell - 1; j <= cell+1; j++ {
			if (i == row && j == cell) || grid[i][j] == EMPTY {
				continue
			}

			cellValue++

			if cellValue >= MAX_MOVABLE_ROLLS {
				return cellValue
			}
		}
	}

	return cellValue
}

// copy2D creates a deep copy of a 2D slice of any type.
func copy2D[T any](grid [][]T) [][]T {
	newGrid := make([][]T, len(grid))
	for i := range grid {
		newGrid[i] = make([]T, len(grid[i]))
		copy(newGrid[i], grid[i])
	}
	return newGrid
}
