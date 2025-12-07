package main

import (
	"fmt"
	"strconv"
	"strings"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day05/input")
	fmt.Println("Day 5 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day05/input")
	fmt.Println("Day 5 - Second submission result:", submissionTwoResult)
}

type RecipeIdRange struct {
	Start int
	End   int
}

func RunPartOne(path string) int {
	lines, errs := utils.StreamFileLines(path)
	recipeIdRanges := make([]RecipeIdRange, 0)
	checkRecipeIds := false
	freshIngredients := 0

	// Parse lines
	for line := range lines {
		if len(line) == 0 && !checkRecipeIds {
			checkRecipeIds = true
		}

		if !checkRecipeIds {
			recipeIdRanges = merge(recipeIdRanges, line)
			continue
		}

		ingredient, _ := strconv.Atoi(line)
		for i := 0; i < len(recipeIdRanges); i++ {
			recipeIdRange := recipeIdRanges[i]

			if ingredient >= recipeIdRange.Start && ingredient <= recipeIdRange.End {
				freshIngredients++
				break
			}
		}
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return freshIngredients
}

func RunPartTwo(path string) int {
	lines, errs := utils.StreamFileLines(path)
	recipeIdRanges := make([]RecipeIdRange, 0)
	freshIngredients := 0
	breakLineRead := false

	// Parse lines
	for line := range lines {
		if breakLineRead {
			continue
		}

		if len(line) == 0 {
			breakLineRead = true
			continue
		}

		recipeIdRanges = merge(recipeIdRanges, line)
	}

	for i := 0; i < len(recipeIdRanges); i++ {
		recipeIdRange := recipeIdRanges[i]
		freshIngredients += recipeIdRange.End - recipeIdRange.Start + 1
	}

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return freshIngredients
}

func merge(recipeIdRanges []RecipeIdRange, line string) []RecipeIdRange {
	splitLine := strings.Split(line, "-")
	start, _ := strconv.Atoi(splitLine[0])
	end, _ := strconv.Atoi(splitLine[1])

	newRange := RecipeIdRange{Start: start, End: end}
	merged := []RecipeIdRange{}

	for i := range recipeIdRanges {
		recipeIdRange := recipeIdRanges[i]

		if start > recipeIdRange.End+1 || end < recipeIdRange.Start-1 {
			merged = append(merged, recipeIdRange)
			continue
		}

		if recipeIdRange.Start < start {
			newRange.Start = recipeIdRange.Start
		}

		if recipeIdRange.End > end {
			newRange.End = recipeIdRange.End
		}
	}

	merged = append(merged, newRange)

	return merged
}
