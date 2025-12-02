package main

import (
	"fmt"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day02/input")
	fmt.Println("Day 2 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day02/1input")
	fmt.Println("Day 2 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	lines, errs := utils.StreamFileLines(path)

	for line := range lines {
		fmt.Println(line)
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return 0
}

func RunPartTwo(path string) int {
	lines, errs := utils.StreamFileLines(path)

	for line := range lines {
		fmt.Println(line)
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return 0
}
