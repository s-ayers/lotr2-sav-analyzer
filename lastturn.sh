#!/bin/bash

# Define the file to monitor
DIR_TO_MONITOR="$HOME/Desktop/lotr2/wine"
FILE_TO_MONITOR="lastturn.sav"

# Define the target directory (git repo)
TARGET_DIR="$HOME/Desktop/lotr2/sav"
TMP=`mktemp -d -p $TARGET_DIR XXXXXXXX`
echo $TMP
TARGET_DIR=$TMP
CWD=`pwd`
ls "$DIR_TO_MONITOR/$FILE_TO_MONITOR"
while true; do
  # Monitor the file for changes
  inotifywait "$DIR_TO_MONITOR/$FILE_TO_MONITOR" | while read -r _ _ _ path; do
    echo "The file '$FILE_TO_MONITOR' appeared in directory '$TARGET_DIR'"
    # Copy the file to the target directory
    cp "$DIR_TO_MONITOR/$FILE_TO_MONITOR" "$TARGET_DIR/$FILE_TO_MONITOR"
    hexdump -v -C "$TARGET_DIR/$FILE_TO_MONITOR" > "$TARGET_DIR/$FILE_TO_MONITOR.hex"
    # Update the git repository
    cd "$TARGET_DIR"
    git add .
    git commit -m "Automatic update from script: $(date)"
    git --no-pager diff --minimal HEAD^ HEAD $FILE_TO_MONITOR.hex
    CHUCKS_CHANGES=`git --no-pager diff --minimal HEAD^ HEAD lastturn.sav.hex|grep '@@'|wc -l`
    echo "Chunks: $CHUCKS_CHANGES"
    cd $CWD
  done
done
