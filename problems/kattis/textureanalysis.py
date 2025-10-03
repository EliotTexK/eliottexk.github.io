# TEXTURE ANALYSIS
# https://open.kattis.com/problems/textureanalysis

# PROBLEM INTUITION
# This problem is intuitive, but we will need to be careful.
# It is safe to assume that every line will start with * (black pixel).
# We search for the second occurrence of a black pixel, looping through
# the line. If none is found, the line looks something like:
# *......... or *.........*

import math

# loop infinitely until "END" is encountered, then break
line_number = 1
while True:
    line = input()
    if line == "END": break
    # find the second occurrence of a black pixel
    second_black_index = 1
    while second_black_index < len(line) and line[second_black_index] == '.':
        second_black_index += 1
    # if we traversed the whole line, then we have a sequence like:
    # *.........* which is considered even
    if second_black_index == len(line):
        print(line_number, "EVEN")
        line_number += 1
        continue
    else:
        # otherwise, see if the pattern continues
        is_even = True
        # loop through, skipping the expected number of white pixels
        i = second_black_index
        while i < len(line):
            # is there a white pixel where it shouldn't be?
            if line[i] == '.':
                is_even = False
                break
            # is there a black pixel where it shouldn't be?
            # loop ahead of the current black pixel
            for j in range(i+1,i+second_black_index):
                if j > len(line) - 1:
                    break # don't allow OOB
                if line[j] == '*':
                    is_even = False
                    break
            i += second_black_index
        print(line_number, "EVEN" if is_even else "NOT EVEN")
    line_number += 1