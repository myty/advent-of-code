package main

import (
	"fmt"
	"strconv"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day01/input")
	fmt.Println("Day 1 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day01/input")
	fmt.Println("Day 1 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	count := 0
	sum := 50

	lines, errs := utils.StreamFileLines(path)

	for line := range lines {
		var sign string
		if string(line[0]) == "R" {
			sign = "+"
		} else {
			sign = "-"
		}

		startingIndex := getStartingIndex(line)
		n, err := strconv.Atoi(line[startingIndex:])

		if err != nil {
			fmt.Println("Parse error:", err, startingIndex, line)
			continue
		}

		if sign == "+" {
			sum += n
		} else {
			sum -= n
		}

		if sum >= 100 {
			sum = sum - 100
		}

		if sum < 0 {
			sum = sum + 100
		}

		if sum == 0 {
			count++
		}
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return count
}

func getStartingIndex(line string) int {
	if len(line) > 3 {
		return len(line) - 2
	}

	return 1
}

func RunPartTwo(path string) int {
	count := 0
	sum := 50

	lines, errs := utils.StreamFileLines(path)

	for line := range lines {
		startingSum := sum
		direction := string(line[0])
		passedZeroCount := 0
		startingIndex := getStartingIndex(line)
		n, err := strconv.Atoi(line[startingIndex:])

		if err != nil {
			fmt.Println("Parse error:", err, startingIndex, line)
			continue
		}

		if startingIndex > 1 {
			passedZeroCount, err = strconv.Atoi(line[1:startingIndex])
			if err != nil {
				fmt.Println("Parse error:", err, startingIndex, line)
				continue
			}
		}

		if direction == "R" {
			sum += n
		} else {
			sum -= n
		}

		if sum > 100 {
			passedZeroCount++
			sum = sum - 100
		}

		if sum < 0 {
			if startingSum > 0 {
				passedZeroCount++
			}
			sum = sum + 100
		}

		count += passedZeroCount

		if sum == 0 || sum == 100 {
			sum = 0
			count++
		}
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return count
}
