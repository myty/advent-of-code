package main

import (
	"cmp"
	"fmt"
	"slices"
	"strconv"
	"strings"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day09/input")
	fmt.Println("Day 9 - First submission result:", submissionOneResult)

	// submissionTwoResult := RunPartTwo("day09/input")
	// fmt.Println("Day 9 - Second submission result:", submissionTwoResult)
}

type Coordinate struct {
	X int
	Y int
}

type Box struct {
	A    Coordinate
	B    Coordinate
	Area int
}

// Signed is a constraint for signed integer types
type Signed interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

func Abs[T Signed](n T) T {
	if n < 0 {
		return -n
	}
	return n
}

func RunPartOne(path string) int {
	lines, errs := utils.StreamFileLines(path)
	coordinates := []Coordinate{}
	boxes := []Box{}

	// Parse lines
	for line := range lines {
		split := strings.Split(line, ",")
		x, _ := strconv.Atoi(split[0])
		y, _ := strconv.Atoi(split[1])
		coordinates = append(coordinates, Coordinate{
			X: x,
			Y: y,
		})
	}

	for aIndex := 0; aIndex < len(coordinates); aIndex++ {
		for bIndex := aIndex + 1; bIndex < len(coordinates); bIndex++ {
			a := coordinates[aIndex]
			b := coordinates[bIndex]
			area := calculateArea(a, b)

			boxes = append(boxes, Box{
				A:    a,
				B:    b,
				Area: area,
			})
		}
	}

	slices.SortFunc(boxes, func(a, b Box) int {
		return cmp.Compare(b.Area, a.Area)
	})

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return boxes[0].Area
}

func calculateArea(a, b Coordinate) int {
	x := 1 + Abs(a.X-b.X)
	y := 1 + Abs(a.Y-b.Y)

	return x * y
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
