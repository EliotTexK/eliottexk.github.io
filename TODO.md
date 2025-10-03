1. Have date as a separator, not per-problem:

1/2/2028

problem a

problem b

1/1/2028

problem c

...

1.5. Logo on top left: Eliot Solves Problems

2. Use Kattis API, pull problem by filename minus the file extension:

Cat emoji [10 Kinds of People](open.kattis.com/problems/10kindsofpeople)    Difficulty: 6

This is a flood-fill (bfs) problem which bla bla bla... ( LaTeX )

```cpp
#include <iostream>
#include <vector>
#include <array>
#include <stack>

using namespace std;

vector<vector<int>> space;
vector<array<int,4>> testPoints;
int r, c, n;
int islandBin = 2;  // binary islands are even
int islandDec = 3;  // decimal islands are odd
```
click to expand (like Discord)

3. Pagination, only load 10 then "load more"

4. Project Euler problem category:

Oil emoji [1](https://projecteuler.net/problem=1)    Difficulty 5%

problem statement (embed markdown, since it's small)

The solution is done by bla bla bla... ( LaTeX )

```python

for i in range(3):
```
click to expand (like Discord)

5. Leetcode problem category

Baby emoji [Coin Change](https://leetcode.com/problems/coin-change/) Difficulty Medium

Solution is bla bla bla... ( LaTeX )

```python

for bruh in range(pluh):

```
click to expand (like Discord)

6. Math problem category

Math emoji The Pythagorean Theorem

embed LaTeX

...

click to expand (like Discord)

7. Blogpost category

Book emoji MegaMiner

embed Markdown ( syntax highlighting for code snippets )

click to expand (like Discord)

8. Filter by problem type (small, top right, dropdown)