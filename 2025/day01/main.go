package main

import (
	"fmt"
	"strconv"

	"aoc/2025/utils"
)

func main() {
	lines, errs := utils.StreamFileLines("day01/input")

	// count := RunPartOne(lines)
	// fmt.Println("Day 1 result:", count)

	count := RunPartTwo(lines)
	fmt.Println("Day 2 result:", count)

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

}

func RunPartOne(lines <-chan string) int {
	count := 0
	sum := 50

	for line := range lines {
		var sign string
		if string(line[0]) == "R" {
			sign = "+"
		} else {
			sign = "-"
		}

		var start int
		if len(line) > 3 {
			start = len(line) - 2
		} else {
			start = 1
		}

		n, err := strconv.Atoi(line[start:])
		if err != nil {
			fmt.Println("Parse error:", err, start, line)
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

		fmt.Println("Current sum:", sum, line)

		if sum == 0 {
			count++
		}
	}

	return count
}

func RunPartTwo(lines <-chan string) int {
	count := 0
	sum := 50

	for line := range lines {
		startingSum := sum
		direction := string(line[0])

		var start int
		passedZeroCount := 0
		if len(line) > 3 {
			start = len(line) - 2
		} else {
			start = 1
		}

		n, err := strconv.Atoi(line[start:])
		if err != nil {
			fmt.Println("Parse error:", err, start, line)
			continue
		}

		if start > 1 {
			passedZeroCount, err = strconv.Atoi(line[1:start])
			if err != nil {
				fmt.Println("Parse error:", err, start, line)
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

		fmt.Println("Current sum:", startingSum, line, sum, count, passedZeroCount)
	}

	return count
}
