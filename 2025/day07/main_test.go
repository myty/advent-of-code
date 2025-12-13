package main

import "testing"

func TestPartOne(t *testing.T) {
	got := RunPartOne("test_input")
	want := 21

	if got != want {
		t.Errorf("got %d want %d", got, want)
	}
}

func TestPartTwo(t *testing.T) {
	t.Skip("Incomplete part 2 test")
	got := RunPartTwo("test_input")
	want := 40

	if got != want {
		t.Errorf("got %d want %d", got, want)
	}
}
