#include <iostream>
#include <vector>

using namespace std;

int main() {
    int testCases; cin >> testCases;
    for (int t = 0; t < testCases; t ++) {
        int biggestWeight = 0;
        vector<int> list = {};

        int n; cin >> n;
        int m; cin >> m;

        int next;
        for (int i = 0; i < n; i++) {
            cin >> next;
            list.push_back(next);
        }

        for (int i = 0; i < list.size(); i++) {
            if (list[i] == m) {
                int weightL = 0;
                int weightR = 0;
                if (i < list.size() - 1) {
                    for (int j = i+1; j < list.size(); j++) {
                        if (list[j] <= m) {
                            break;
                        }
                        weightR += list[j];
                    }
                }
                if (i > 1) {
                    for (int j = i-1; j >= 0; j--) {
                        if (list[j] <= m) {
                            break;
                        }
                        weightL += list[j];
                    }
                }
                int total = m + weightL + weightR;
                if (total > biggestWeight) {
                    biggestWeight = total;
                }
            }
        }
        cout << biggestWeight << endl;
    }
}