N, K = map(int, input().split())

legs = []

for _ in range(K):
    leg = tuple([int(x) for x in input().split()])
    legs.append(leg)

legs = sorted(legs,key=lambda x: x[1],reverse=True)

players = list(range(N))

for leg in legs:
    temp = players[leg[0]]
    players[leg[0]] = players[leg[0]+1]
    players[leg[0]+1] = temp

for n in range(len(players)):
    if n == len(players) -1:
        print(players[n],end='\n')
    else:
        print(players[n],end=' ')