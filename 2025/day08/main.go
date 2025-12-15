package main

import (
	"cmp"
	"fmt"
	"math"
	"slices"
	"strconv"
	"strings"

	"aoc/2025/utils"
)

func main() {
	submissionOneResult := RunPartOne("day08/input", 1000)
	fmt.Println("Day 8 - First submission result:", submissionOneResult)

	submissionTwoResult := RunPartTwo("day08/input")
	fmt.Println("Day 8 - Second submission result:", submissionTwoResult)
}

type JunctionBox struct {
	X int
	Y int
	Z int
}

type JunctionBoxPair struct {
	BoxA     JunctionBox
	BoxB     JunctionBox
	Distance float64
}

type Circuit struct {
	Boxes []JunctionBox
}

func RunPartOne(path string, top int) int {
	lines, errs := utils.StreamFileLines(path)
	points := []JunctionBox{}
	pairs := []JunctionBoxPair{}
	circuits := []Circuit{}

	// Parse lines
	for line := range lines {
		dimensions := strings.Split(line, ",")
		x, _ := strconv.Atoi(dimensions[0])
		y, _ := strconv.Atoi(dimensions[1])
		z, _ := strconv.Atoi(dimensions[2])

		points = append(points, JunctionBox{
			X: x,
			Y: y,
			Z: z,
		})
	}

	// Compare
	for a := 0; a < len(points); a++ {
		for b := a + 1; b < len(points); b++ {
			pairs = append(pairs, JunctionBoxPair{
				BoxA:     points[a],
				BoxB:     points[b],
				Distance: calculateEuclideanDistance(points[a], points[b]),
			})
		}
	}

	// Sort
	slices.SortFunc(pairs, func(a, b JunctionBoxPair) int {
		return cmp.Compare(a.Distance, b.Distance)
	})

	for i := range top {
		pair := pairs[i]

		circuitIndexA, foundA := findCircuitIndex(circuits, pair.BoxA)
		circuitIndexB, foundB := findCircuitIndex(circuits, pair.BoxB)

		if foundA && foundB && circuitIndexA == circuitIndexB {
			continue
		}

		if foundA && foundB {
			circuits = mergeCircuits(circuits, circuitIndexA, circuitIndexB)
			continue
		}

		if !foundA && !foundB {
			circuits = append(circuits, Circuit{
				Boxes: []JunctionBox{pair.BoxA, pair.BoxB},
			})
			continue
		}

		if foundA {
			circuits[circuitIndexA].Boxes = append(circuits[circuitIndexA].Boxes, pair.BoxB)
			continue
		}

		circuits[circuitIndexB].Boxes = append(circuits[circuitIndexB].Boxes, pair.BoxA)
	}

	// Final sort
	slices.SortFunc(circuits, func(a, b Circuit) int {
		return cmp.Compare(len(b.Boxes), len(a.Boxes))
	})

	if err := <-errs; err != nil {
		fmt.Println("Error:", err)
	}

	return calculateTopCircuits(circuits, 3)
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

func mergeCircuits(circuits []Circuit, circuitIndexA, circuitIndexB int) []Circuit {
	nextCircuits := []Circuit{}

	for i := range circuits {
		if i == circuitIndexA || i == circuitIndexB {
			continue
		}

		nextCircuits = append(nextCircuits, circuits[i])
	}

	nextCircuits = append(nextCircuits, Circuit{
		Boxes: mergeBoxes(circuits[circuitIndexA].Boxes, circuits[circuitIndexB].Boxes),
	})

	return nextCircuits
}

func mergeBoxes(circuit1Boxes, circuit2Boxes []JunctionBox) []JunctionBox {
	mergedBoxes := circuit1Boxes

	for _, box := range circuit2Boxes {
		if slices.Contains(mergedBoxes, box) {
			continue
		}

		mergedBoxes = append(mergedBoxes, box)
	}

	return mergedBoxes
}

func findCircuitIndex(circuits []Circuit, box JunctionBox) (int, bool) {
	for index, circuit := range circuits {
		if slices.Contains(circuit.Boxes, box) {
			return index, true
		}
	}
	return -1, false
}

func calculateTopCircuits(circuits []Circuit, top int) int {
	total := 1

	for i := range minimum(top, len(circuits)) {
		total *= len(circuits[i].Boxes)
	}

	return total
}

func calculateEuclideanDistance(pointOne JunctionBox, pointTwo JunctionBox) float64 {
	xDistance := float64(pointOne.X - pointTwo.X)
	yDistance := float64(pointOne.Y - pointTwo.Y)
	zDistance := float64(pointOne.Z - pointTwo.Z)

	xDistanceSquared := xDistance * xDistance
	yDistanceSquared := yDistance * yDistance
	zDistanceSquared := zDistance * zDistance

	distance := math.Sqrt(xDistanceSquared + yDistanceSquared + zDistanceSquared)

	return math.Abs(distance)
}

func minimum(numbers ...int) int {
	if len(numbers) == 0 {
		return 0 // or panic, depending on your needs
	}

	minVal := numbers[0]
	for _, num := range numbers[1:] {
		if num < minVal {
			minVal = num
		}
	}
	return minVal
}
