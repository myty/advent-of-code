package main

import "testing"

func TestPartOne(t *testing.T) {
	got := RunPartOne("test_input")
	want := 1227775554

	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}

func TestPartTwo(t *testing.T) {
	got := RunPartTwo("test_input")
	want := 1227775554

	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}
