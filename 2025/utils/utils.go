package utils

import (
	"bufio"
	"os"
)

// StreamFileLines streams a file line by line through a channel.
// It returns a channel of strings and a channel of errors.
func StreamFileLines(path string) (<-chan string, <-chan error) {
	lines := make(chan string)
	errs := make(chan error, 1)

	go func() {
		defer close(lines)
		defer close(errs)

		file, err := os.Open(path)
		if err != nil {
			errs <- err
			return
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			lines <- scanner.Text()
		}

		if err := scanner.Err(); err != nil {
			errs <- err
		}
	}()

	return lines, errs
}
