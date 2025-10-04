#!/bin/bash
# Generate problem index so that we don't have to retrieve it from the API every time

REPO=$1

mkdir -p problems
echo "[" > problems/index.json
first=true
for file in $(find problems/kattis -type f); do
    # Get last commit date in ISO format
    date=$(git log -1 --format="%cI" -- "$file")
    name=$(basename "$file")
    lang="${name##*.}"

    # Add comma except before first entry
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> problems/index.json
    fi

    # Escape double quotes in JSON strings
    echo "  {\"type\":\"Kattis\",\"name\":\"$name\",\"date\":\"$date\",\"lang\": \"$lang\",\"solutionContentURL\":\"$file\"}" >> problems/index.json
done
echo "]" >> problems/index.json

