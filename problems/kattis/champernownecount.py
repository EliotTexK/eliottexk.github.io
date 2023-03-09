n,k = map(int, input().split())

ans = 0
s = '0'
for i in range(1,n+1):
    s = str(int(s) % k)
    s += str(i)
    if int(s) % k == 0:
        ans += 1

print(ans)
