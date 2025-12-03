package main

import (
	"fmt"
	"strconv"
	"strings"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day02/input")
	fmt.Println("Day 2 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day02/input")
	fmt.Println("Day 2 - Second submission result:", submissionTwoResult)
}

func RunPartOne(path string) int {
	total := 0
	lines, errs := utils.StreamFileLines(path)

	for line := range lines {
		for ranges := range strings.SplitSeq(line, ",") {
			pair := strings.SplitN(ranges, "-", 2)
			start, startErr := strconv.Atoi(pair[0])
			end, endErr := strconv.Atoi(pair[1])

			if startErr != nil || endErr != nil {
				fmt.Println("Error:", startErr, endErr)
				continue
			}

			for i := start; i <= end; i++ {
				current := strconv.Itoa(i)

				mid := len(current) / 2
				if current[mid:] == current[:mid] {
					total += i
				}
			}
		}
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
		for ranges := range strings.SplitSeq(line, ",") {
			pair := strings.SplitN(ranges, "-", 2)
			start, startErr := strconv.Atoi(pair[0])
			end, endErr := strconv.Atoi(pair[1])

			if startErr != nil || endErr != nil {
				fmt.Println("Error:", startErr, endErr)
				continue
			}

			for i := start; i <= end; i++ {
				current := strconv.Itoa(i)
				currentLength := len(current)

				for groupCount := 2; groupCount <= currentLength; groupCount++ {
					if currentLength%groupCount != 0 {
						continue
					}

					size := currentLength / groupCount
					start := 0
					compare := current[start:size]
					matchFound := false

					for start += size; start < currentLength; start += size {
						compareNext := current[start : start+size]

						if compare != compareNext {
							matchFound = false
							break
						}

						matchFound = true
					}

					if matchFound {
						total += i
						break
					}
				}
			}
		}
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return total
}
