N, k = [int(x) for x in input().split()]

if N == 1:
    print(0)
    exit(0)

if k > 1:
    total = 0
    for i in range(N-1):
        total += [int(x) for x in input().split()][2]
    print(total)
    exit(0)

first = 1
adjacent = dict()
for i in range(N-1):
    u, v, c = [int(x) for x in input().split()]
    if u not in adjacent.keys(): adjacent[u] = dict()
    if v not in adjacent.keys(): adjacent[v] = dict()
    adjacent[u][v] = c
    adjacent[v][u] = c
    first = u

best_overall = 0
stack = [first]
evaluated = dict()
traversed = set()
while len(stack) > 0:
    current_node = stack[-1]
    traversed.add(current_node)
    best_diameter = 0
    second_best_diameter = 0
    keep_looping = True
    for sub_node in adjacent[current_node]:
        sub_diameter = 0
        # check to see if sub-node has been evaluated already
        if sub_node in evaluated.keys():
            # get its diameter
            sub_diameter = evaluated[sub_node] + adjacent[current_node][sub_node]
        else:
            # check to see if sub-node is a leaf node
            if len(adjacent[sub_node].keys()) != 1:
                # if it's a branch node and hasn't been evaluated,
                # save it for later
                if sub_node not in traversed:
                    stack.append(sub_node)
                    keep_looping = False
                else:
                    continue
            else:
                # if it is a leaf node, get its diameter
                sub_diameter = adjacent[current_node][sub_node]
        if sub_diameter >= best_diameter:
            second_best_diameter = best_diameter
            best_diameter = sub_diameter
        elif sub_diameter > second_best_diameter:
            second_best_diameter = sub_diameter

    if not keep_looping: continue
    # compare subnode diameters to best overall diameter
    if best_diameter + second_best_diameter > best_overall:
        best_overall = best_diameter + second_best_diameter
    # collapse node
    adjacent.pop(current_node)
    stack.pop()
    evaluated[current_node] = best_diameter    

print(best_overall)