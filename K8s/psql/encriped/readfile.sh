#!/bin/bash
filename="$1"
while read -r line; do
    name="$line"
    echo "$name"
done < "$filename"
