string = input()
string = string[::-1]

stack = 0
new_str = []
for i in range(len(string)):
    if string[i] == '<':
        stack += 1
    else:
        if stack == 0:
            new_str.append(string[i])
        else:
            stack -= 1

print(''.join(new_str)[::-1])