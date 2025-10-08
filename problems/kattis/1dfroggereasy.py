n,s,m = map(int,input().split())
s -= 1

board = [int(x) for x in input().split()]
traversed = [0 for _ in board]

h = 0

while True:
    if s < 0:
        print('left')
        break
    if s >= len(board):
        print('right')
        break
    if board[s] == m:
        print('magic')
        break
    if traversed[s] == 1:
        print('cycle')
        break
    traversed[s] = 1
    s += board[s]
    h += 1
print(h)