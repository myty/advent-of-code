package main

import (
	"fmt"

	"aoc/2025/utils"
)

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
		row := make([]int, rowLength)

		for i := range rowLength {
			switch string(line[i]) {
			case ".":
				row[i] = -1
			case "@":
				row[i] = 0
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
