package main

import "testing"

func TestPartOne(t *testing.T) {
	got := RunPartOne("test_input", 10)
	want := 40

	if got != want {
		t.Errorf("got %d want %d", got, want)
	}
}

func TestPartTwo(t *testing.T) {
	t.Skip("Skip Template Test. Delete when ready to test.")

	got := RunPartTwo("test_input")
	want := -1

	if got != want {
		t.Errorf("got %d want %d", got, want)
	}
}
