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

// flood fill algorithm, fills pixel islands
void fillIsland(bool decimal, int startY, int startX) {
    stack<pair<int,int>> recurStack;
    recurStack.push({startY,startX});
    while (!recurStack.empty()) {
        // grab coords of the top of the stack, then delete it
        int currentY = recurStack.top().first;
        int currentX = recurStack.top().second;
        recurStack.pop();
        // fill island with a unique even/odd number
        // depending on if we're filling zeroes or ones
        space[currentY][currentX] = decimal? islandDec : islandBin;
        if (currentX < c-1 && space[currentY][currentX+1] == decimal) {
            recurStack.push({currentY,currentX+1});
        }
        if (currentX > 0 && space[currentY][currentX-1] == decimal) {
            recurStack.push({currentY,currentX-1});
        }
        if (currentY < r-1 && space[currentY+1][currentX] == decimal) {
            recurStack.push({currentY+1,currentX});
        }
        if (currentY > 0 && space[currentY-1][currentX] == decimal) {
            recurStack.push({currentY-1,currentX});
        }
    }
}

int main() {
    // grab n' parse input
    cin >> r >> c;
    space = vector<vector<int>>(r, vector<int> (c,0));

    for (int y = 0; y < r; y++) {
        char line[c];
        cin >> line;
        for (int x = 0; x < c; x++) {
            if (line[x] == '0') space[y][x] = 0;
            else space[y][x] = 1;
        }
    }
    cin >> n;
    testPoints = vector<array<int,4>>(n, {0,0,0,0});

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < 4; j++) {
            cin >> testPoints[i][j];
        }
    }

    // loop through, flood-filling pixel islands
    for (int y = 0; y < r; y++) {
        for (int x = 0; x < c; x++) {
            if (space[y][x] == 0) {
                fillIsland(false,y,x);
                islandBin+=2;
            }
            if (space[y][x] == 1) {
                fillIsland(true,y,x);
                islandDec+=2;
            }
            // otherwise, the island is already full
        }
    }

    // now that we've processed space in this way, it's
    // easy to tell if points are in the same area
    for (auto pt : testPoints) {
        int island1 = space[pt[0]-1][pt[1]-1];
        int island2 = space[pt[2]-1][pt[3]-1];
        if (island1 == island2) {
            if (island1 % 2 == 0) {
                cout << "binary" << endl;
            } else {
                cout << "decimal" << endl;
            }
        } else {
            cout << "neither" << endl;
        }
    }
}