from math import sqrt, ceil

# Sieve of Eratosthenes
# Only need to try numbers up to sqrt(600851475143)
upper_bound = ceil(sqrt(600851475143))
is_prime_table = [True for _ in range(upper_bound+1)]
current_prime = 2
best_prime = current_prime
while current_prime <= upper_bound:
    # check for a new biggest prime factor
    if 600851475143 % current_prime == 0:
        best_prime = current_prime
    # mark all relevant multiples of the current prime
    multiple = current_prime
    while multiple <= upper_bound:
        is_prime_table[multiple] = False
        multiple += current_prime
    next_prime = current_prime
    # linear search for the next prime in the table
    while True:
        # there is no next prime, we have the answer
        if next_prime >= upper_bound:
            print(best_prime)
            exit()
        # current number is not prime, keep searching
        if is_prime_table[next_prime] == False:
            next_prime += 1
            continue
        # found the next prime
        else:
            current_prime = next_prime
            break