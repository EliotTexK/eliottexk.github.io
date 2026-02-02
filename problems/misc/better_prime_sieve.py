# Can we do better?

# Well, we can iterate through odd numbers only, which
# cuts the table size in half.

# That requires us to know some iterator rule that lets us
# only iterate over desirable numbers. This is trivial for
# odd numbers, but what about numbers not divisible by
# multiple primes?

# For 2 and 3, the sequence is:
# 1, 5, 7, 11, 13, ...

# Clearly, the pattern is just "add 4, add 2, add 4, add 2, ..."
# Or is it?

odd = set([x for x in range(2000) if x % 2 != 0])
not_div_3 = set([x for x in range(2000) if x % 3 != 0])

both_maybe = set()
i = 1
j = True
while i < 2000:
    both_maybe.add(i)
    if j:
        i += 4
    else:
        i += 2
    j = not j

print(odd.intersection(not_div_3) - both_maybe)

# I guess we would have to prove it, not just show examples up to x = 2000