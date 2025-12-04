package main

import "testing"

func TestPartOne(t *testing.T) {
	got := RunPartOne("test_input")
	want := int64(357)

	if got != want {
		t.Errorf("got %d want %d", got, want)
	}
}

func TestPartTwo(t *testing.T) {
	got := RunPartTwo("test_input")
	want := int64(3121910778619)

	if got != want {
		t.Errorf("got %d want %d", got, want)
	}
}
