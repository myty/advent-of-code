package main

import (
	"fmt"
	"strconv"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day03/input")
	fmt.Println("Day 3 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day03/input")
	fmt.Println("Day 3 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	total := 0
	lines, errs := utils.StreamFileLines(path)

	for line := range lines {
		var digits []int

		for _, ch := range line {
			num, err := strconv.Atoi(string(ch))
			if err != nil {
				fmt.Println("Error:", err)
				break
			}
			digits = append(digits, num)
		}

		if len(digits) == 0 {
			break
		}

		firstIndex := 0
		secondIndex := len(digits) - 1

		// Determine the first digit
		for i := firstIndex; i < secondIndex; i++ {

			if digits[i] == 9 || digits[firstIndex] < digits[i] {
				firstIndex = i
			}

			if digits[i] == 9 {
				break
			}
		}

		// Determine the second digit
		for i := secondIndex; i > firstIndex; i-- {
			if digits[i] == 9 || digits[secondIndex] < digits[i] {
				secondIndex = i
			}

			if digits[i] == 9 {
				break
			}
		}

		total += digits[firstIndex] * 10
		total += digits[secondIndex]
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return total
}

func RunPartTwo(path string) int {
	total := 0
	lines, errs := utils.StreamFileLines(path)

	for line := range lines {
		var digits []int

		for _, ch := range line {
			num, err := strconv.Atoi(string(ch))
			if err != nil {
				fmt.Println("Error:", err)
				break
			}
			digits = append(digits, num)
		}

		if len(digits) == 0 {
			break
		}

		indexSize := 12
		indexes := make([]int, indexSize)

		for i := range indexSize {
			indexBoundary := len(digits) - indexSize - indexes[i]
			index := indexes[i]

			for j := index + 1; j < indexBoundary; j++ {
				digit := digits[j]

				if digit == 9 || digits[index] < digit {
					indexes[i] = j
				}

				if digits[j] == 9 {
					break
				}
			}
		}

		firstIndex := 0
		secondIndex := len(digits) - 1

		// Determine the first digit
		for i := firstIndex; i < secondIndex; i++ {
			if digits[i] == 9 || digits[firstIndex] < digits[i] {
				firstIndex = i
			}

			if digits[i] == 9 {
				break
			}
		}

		// Determine the second digit
		for i := secondIndex; i > firstIndex; i-- {
			if digits[i] == 9 || digits[secondIndex] < digits[i] {
				secondIndex = i
			}

			if digits[i] == 9 {
				break
			}
		}

		total += digits[firstIndex] * 10
		total += digits[secondIndex]
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return total
}
