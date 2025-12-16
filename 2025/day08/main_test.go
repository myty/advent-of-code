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
	got := RunPartTwo("test_input")
	want := 25272

	if got != want {
		t.Errorf("got %d want %d", got, want)
	}
}
