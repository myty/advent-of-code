package main

import (
	"fmt"

	"aoc/2025/utils"
)

const EMPTY = -1

func main() {
	submissionOneResult := RunPartOne("day03/input")
	fmt.Println("Day 3 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day03/input")
	fmt.Println("Day 3 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	var grid [][]int

	lines, errs := utils.StreamFileLines(path)
	rowIndex := 0

	for line := range lines {
		rowLength := len(line)
		row := make([]int, rowLength+2)

		for i := range rowLength {
			switch string(line[i]) {
			case ".":
				row[i] = EMPTY
			case "@":
				row[i] = 0
			}
		}

		for i := range rowLength {
			if i == 0 && row[i+1] != EMPTY {
				row[i] += 1
				continue
			}

			if i == rowLength-1 && row[i-1] != EMPTY {
				row[i] += 1
				continue
			}
		}

		grid = append(grid, row)

		rowIndex++
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return 0
}

func RunPartTwo(path string) int {
	return 0
}
