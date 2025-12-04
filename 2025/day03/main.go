package main

import (
	"fmt"
	"math"
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

func RunPartTwo(path string) int64 {
	indexSize := 12
	total := int64(0)
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

		startingIndex := 0

		for i := range indexSize {
			indexBoundary := startingIndex + ((len(digits) - startingIndex) - (indexSize - i)) + 1
			index := startingIndex

			for j := startingIndex; j < indexBoundary; j++ {
				digit := digits[j]

				if digit == 9 || digits[index] < digit {
					index = j
				}

				if digits[j] == 9 {
					break
				}
			}

			startingIndex = index + 1
			total += int64(digits[index]) * int64(math.Pow(10, float64(indexSize-i-1)))
		}
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return total
}
