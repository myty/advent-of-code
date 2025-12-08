package main

import (
	"fmt"
	"strconv"
	"strings"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day06/input", 4)
	fmt.Println("Day 6 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day06/input")
	fmt.Println("Day 6 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string, operationLineIndex int) int {
	fileLines, errs := utils.StreamFileLines(path)
	lines := []string{}

	// Parse lines
	for line := range fileLines {
		lines = append(lines, line)
	}

	runningTotal := 0
	columns := StreamOperations(lines[operationLineIndex])

	index := 0
	for column := range columns {
		total := 0
		for lineIndex := operationLineIndex - 1; lineIndex >= 0; lineIndex-- {
			line := lines[lineIndex]

			var section string
			if column.Width == 0 {
				section = line[index:]
			} else {
				section = line[index : index+column.Width]
			}

			numberString := strings.TrimSpace(section)
			number, _ := strconv.Atoi(numberString)

			if total == 0 {
				total = number
				continue
			}

			if column.Operation == "+" {
				total += number
				continue
			}

			if column.Operation == "*" {
				total = total * number
			}
		}

		runningTotal += total
		index += column.Width
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return runningTotal
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

type Column struct {
	Operation string
	Width     int
}

func StreamOperations(line string) <-chan Column {
	columns := make(chan Column)

	go func() {
		defer close(columns)

		lineRemaining := line
		for true {
			width := strings.IndexFunc(lineRemaining[1:], func(r rune) bool {
				return r == '*' || r == '+'
			}) + 1

			columns <- Column{
				Width:     width,
				Operation: lineRemaining[0:1],
			}

			if width == 0 {
				break
			}

			lineRemaining = lineRemaining[width:]
		}
	}()

	return columns
}
