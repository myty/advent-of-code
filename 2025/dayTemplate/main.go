package main

import (
	"fmt"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("dayTemplate/input")
	fmt.Println("Day Template - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("dayTemplate/input")
	fmt.Println("Day Template - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	lines, errs := utils.StreamFileLines(path)

	// Parse lines
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

	// Parse lines
	for line := range lines {
		fmt.Println(line)
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return 0
}
