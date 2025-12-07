package utils

import (
	"os"
	"path/filepath"
	"testing"
)

func TestStreamFileLines_Success(t *testing.T) {
	// Create a temporary file with test content
	tmpDir := t.TempDir()
	tmpFile := filepath.Join(tmpDir, "test.txt")
	content := "line1\nline2\nline3"
	err := os.WriteFile(tmpFile, []byte(content), 0644)
	if err != nil {
		t.Fatalf("failed to create temp file: %v", err)
	}

	lines, errs := StreamFileLines(tmpFile)

	var result []string
	for line := range lines {
		result = append(result, line)
	}

	// Check for errors
	if err := <-errs; err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	expected := []string{"line1", "line2", "line3"}
	if len(result) != len(expected) {
		t.Fatalf("got %d lines, want %d", len(result), len(expected))
	}

	for i, line := range result {
		if line != expected[i] {
			t.Errorf("line %d: got %q, want %q", i, line, expected[i])
		}
	}
}

func TestStreamFileLines_EmptyFile(t *testing.T) {
	tmpDir := t.TempDir()
	tmpFile := filepath.Join(tmpDir, "empty.txt")
	err := os.WriteFile(tmpFile, []byte(""), 0644)
	if err != nil {
		t.Fatalf("failed to create temp file: %v", err)
	}

	lines, errs := StreamFileLines(tmpFile)

	var result []string
	for line := range lines {
		result = append(result, line)
	}

	if err := <-errs; err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	if len(result) != 0 {
		t.Errorf("expected 0 lines, got %d", len(result))
	}
}

func TestStreamFileLines_FileNotFound(t *testing.T) {
	lines, errs := StreamFileLines("/nonexistent/path/file.txt")

	// Drain lines channel
	for range lines {
	}

	err := <-errs
	if err == nil {
		t.Error("expected error for non-existent file, got nil")
	}
}

func TestStreamFileLines_SingleLine(t *testing.T) {
	tmpDir := t.TempDir()
	tmpFile := filepath.Join(tmpDir, "single.txt")
	err := os.WriteFile(tmpFile, []byte("only one line"), 0644)
	if err != nil {
		t.Fatalf("failed to create temp file: %v", err)
	}

	lines, errs := StreamFileLines(tmpFile)

	var result []string
	for line := range lines {
		result = append(result, line)
	}

	if err := <-errs; err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	if len(result) != 1 {
		t.Fatalf("expected 1 line, got %d", len(result))
	}

	if result[0] != "only one line" {
		t.Errorf("got %q, want %q", result[0], "only one line")
	}
}
