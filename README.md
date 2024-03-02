# lotr2-sav-analyzer
For discovering teh structure of a lords to the real 2 sav game file.

Commit game file to git repo on save.

A bash script uses inotify to monitor file changes and add the new file to the repo.

```bash
sudo apt install inotify-tools
```

Patterns to look for:

* longest span of continuous zeros
* which turn/commit each line/Byte changed
* Never Changed
* Changed once
* most changes
* chuck/range changed with byte.

Metrics:
* Address
* Offest percentage
* one-byte int
* two-byte int
* string

How many nobles, which nobles, which color
Play's name and color

Campagain type, or custom

other details if custom.

Looking for:
armies
history of each turn
territory
merchents and location
