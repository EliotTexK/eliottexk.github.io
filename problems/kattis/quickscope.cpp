#include <vector>
#include <stack>
#include <unordered_map>
#include <string>
#include <bits/stdc++.h>
using namespace std;

struct id {
    char name[6];
    short int layer;
    bool operator==(const id &other) const {
        return name[0] == other.name[0] &&
               name[1] == other.name[1] &&
               name[2] == other.name[2] &&
               name[3] == other.name[3] &&
               name[4] == other.name[4] &&
               name[5] == other.name[5] &&
               layer   == other.layer;
    }
    id() {
        for (int i = 0; i < 6; i++) {
            name[i] = 0;
        }
    }
};

template <>
struct std::hash<id>
{
  size_t operator()(const id& k) const
  {
    return (k.name[0] ^ 179 <<
            k.name[1] ^ 7 <<
            k.name[2] ^ 83 <<
            k.name[3] ^ 101 <<
            k.name[4] ^ 59 <<
            k.name[5] ^ 71 <<
            k.layer);
  }
};

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    unordered_map<id,string> id2typename;
    unordered_set<int> stale_layers;
    int current_layer = 0;

    int n;
    cin >> n;
    bool mult_dec = false;
    for (int i = 0; i < n; i++) {
        string s1;
        cin >> s1;
        switch (s1[0]) {
            case 'D': {
                string typname;
                id t; cin >> t.name >> typname; t.layer = current_layer;
                if (id2typename.count(t)) {
                    cout << "MULTIPLE DECLARATION" << endl;
                    return 0;
                } else {
                    id2typename[t] = typname;
                }
                break;
            }
            case 'T': {
                bool found = false;
                id t; cin >> t.name; t.layer = current_layer;
                while (t.layer >= 0) {
                    if (!stale_layers.count(t.layer)) {
                        if (id2typename.count(t)) {
                            cout << id2typename[t] << endl;
                            found = true;
                            break;
                        }
                    }
                    t.layer--;
                }
                if (!found) {
                    cout << "UNDECLARED" << endl;
                }
                break;
            }
            case '{': {
                while (stale_layers.count(current_layer)) {
                    current_layer++;
                }
                current_layer++;
            }
                break;
            case '}': {
                stale_layers.insert(current_layer);
                current_layer--;
                break;
            }
        }
    }
}