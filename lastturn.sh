#!/bin/bash

# Define the file to monitor
FILE_TO_MONITOR="README.md"

# Define the target directory (git repo)
TARGET_DIR="~/Desktop/lotr2/sav"

# Monitor the file for changes
inotifywait -e modify,close_write "$FILE_TO_MONITOR" | while read -r _ _ _ path; do
  echo "The file '$path' appeared in directory '$TARGET_DIR' via '$FILE_TO_MONITOR'"
  # Copy the file to the target directory
  cp "$FILE_TO_MONITOR" "$TARGET_DIR/$FILE_TO_MONITOR"
  hexdump -v -C "$TARGET_DIR/$FILE_TO_MONITOR" > "$TARGET_DIR/$FILE_TO_MONITOR.hex"
  # Update the git repository
  cd "$TARGET_DIR"
  git add .
  git commit -m "Automatic update from script: $(date)"
done
