N, k = map(int, input().split())

lst = []

for i in range(N):
    lst.append(int(input()))

lst.sort()

l = 0
r = N-1

while l < r:
    if lst[l] + lst[r] == k:
        print(lst[l], lst[r])
        exit()
    elif lst[l] + lst[r] > k:
        r -= 1
    else:
        l += 1

print('Neibb')