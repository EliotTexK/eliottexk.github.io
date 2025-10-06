# Level 1

s = 0
for i in range(1,1000):
    if i%3 == 0 or i%5 == 0:
        s += i
print(s)

# Or for you "functional programming" elitists
print(sum(filter(lambda x: x%3==0 or x%5==0,range(0,1000))))

# Level 3