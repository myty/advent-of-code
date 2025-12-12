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

	submissionTwoResult := RunPartTwo("day06/input", 4)
	fmt.Println("Day 6 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string, operationLineIndex int) int {
	fileLines, errs := utils.StreamFileLines(path)
	lines := []string{}
	lineLength := 0

	// Parse lines
	for line := range fileLines {
		lines = append(lines, line)

		if len(line) > lineLength {
			lineLength = len(line)
		}
	}

	lines = ensureLineLength(lines, lineLength)

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

func RunPartTwo(path string, operationLineIndex int) int {
	fileLines, errs := utils.StreamFileLines(path)
	lines := []string{}
	lineLength := 0

	// Parse lines
	for line := range fileLines {
		lines = append(lines, line)

		if len(line) > lineLength {
			lineLength = len(line)
		}
	}

	lines = ensureLineLength(lines, lineLength)

	runningTotal := 0
	columns := StreamOperations(lines[operationLineIndex])

	index := 0
	for column := range columns {
		total := 0

		for columnIndex := index + column.Width - 1; columnIndex >= index; columnIndex-- {
			numberString := ""

			for lineIndex := range operationLineIndex {
				line := lines[lineIndex]

				if len(line) > columnIndex {
					numberString = numberString + line[columnIndex:columnIndex+1]
				}
			}

			number, _ := strconv.Atoi(strings.TrimSpace(numberString))

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

type Column struct {
	Operation string
	Width     int
}

func StreamOperations(line string) <-chan Column {
	columns := make(chan Column)

	go func() {
		defer close(columns)

		lineRemaining := line
		for len(lineRemaining) > 0 {
			remainingText := lineRemaining[1:]
			width := strings.IndexFunc(remainingText, func(r rune) bool {
				return r == '*' || r == '+'
			}) + 1

			operation := lineRemaining[0:1]

			if width < 1 {
				width = len(remainingText) + 1
			}

			columns <- Column{
				Width:     width,
				Operation: operation,
			}

			lineRemaining = lineRemaining[width:]
		}
	}()

	return columns
}

func ensureLineLength(lines []string, lineLength int) []string {
	newLines := []string{}

	for lineNum := range len(lines) {
		newLines = append(newLines, rightPad(lines[lineNum], lineLength, " "))
	}

	return newLines
}

func rightPad(s string, totalWidth int, padChar string) string {
	if len(s) >= totalWidth {
		return s
	}
	padding := strings.Repeat(padChar, totalWidth-len(s))
	return s + padding
}
