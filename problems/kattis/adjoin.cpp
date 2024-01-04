#include <vector>
#include <array>
#include <queue>
#include <iostream>
#include <unordered_map>
#include <algorithm>
#include <bits/stdc++.h>

using namespace std;

int find_leaf_node(int start, vector<vector<int>>& adj_list, vector<bool>& traversed) {
    int result = -1;
    if (adj_list[start].size() == 0) {
        return -1;
    }
    queue<int> bfs; bfs.push(start);
    while (!bfs.empty()) {
        int top = bfs.front(); bfs.pop();
        traversed[top] = true;
        if (adj_list[top].size() == 1) {
            result = top; // returning early could result in trees being double-counted
        }
        for (int nbr : adj_list[top]) {
            if (!traversed[nbr]) {
                bfs.push(nbr);
            }
        }
    }
    return result;
}

int find_longest_path(int start, vector<vector<int>>& adj_list, vector<bool>& traversed) {
    int leaf = find_leaf_node(start,adj_list,traversed);
    if (leaf == -1) return 0;
    int best = 0;
    queue<int> bfs; bfs.push(leaf);
    unordered_map<int,int> dist; dist[leaf] = 0;
    while (!bfs.empty()) {
        int top = bfs.front(); bfs.pop();
        if (dist[top] > best) best = dist[top];
        for (int nbr: adj_list[top]) {
            if (!dist.count(nbr)) {
                bfs.push(nbr);
                dist[nbr] = dist[top] + 1;
            }
        }
    }
    return best;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int c, l;
    cin >> c >> l;

    vector<vector<int>> adj_list(c);
    for (int i = 0; i < l; i++) {
        int c1, c2;
        cin >> c1 >> c2;
        adj_list[c1].push_back(c2);
        adj_list[c2].push_back(c1);
    }

    vector<bool> traversed(c, false);
    vector<int> minmax_paths;
    for (int i = 0; i < c; i++) {
        if (!traversed[i]) {
            minmax_paths.push_back(find_longest_path(i,adj_list,traversed));
        }
    }
    sort(minmax_paths.begin(), minmax_paths.end());
    int back = minmax_paths.back();
    for (int i = 0; i < minmax_paths.size() - 1; i++) {
        int front = minmax_paths[i];
        int joined_len = (front/2) + (front%2) + (back/2) + (back%2) + 1;
        if (joined_len > back) back = joined_len;
    }
    cout << back << std::endl;
}