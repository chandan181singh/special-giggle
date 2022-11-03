// #include <bits/stdc++.h>
// using namespace std;

// int main() {
// 	// your code goes here
// 	int t;
// 	cin>>t;
// 	while(t--){
// 	   int n;
// 	   cin>>n;
// 	   vector<int> v;
// 	   int k = 0;
// 	   for(int i = 1; i <= n; i++){
// 	       int curr1 = sqrt(i);
// 	       float curr2 = sqrt(i);
// 	       int next1 = sqrt(i+1);
// 	       float next2 = sqrt(i+1);
// 	       if(curr1 == curr2 && next1 == next2){
// 	           v[k] = i;
// 	           k++;
// 	           continue;
// 	       }
// 	       cout<<i<<" ";
// 	       if(!v.empty()){
// 	           for(int i = 0; i < v.size(); i++){
// 	               cout<<v[i]<<" ";
// 	           }
// 	       }
// 	   }
// 	   cout<<endl;
// 	}
// 	return 0;
// }

#include <iostream>
using namespace std;

int main() {
	// your code goes here
	int t;
	cin>>t;
	while(t--){
	    int n;
	    int arr[n];
	    for(int i = 0; i<n; i++){
	        cin>>arr[i];
	    }
	    int count = 1;
	    for(int i = 0; i<n; i++){
	        for(int j = i+1; j<n && arr[i] != -1; j++){
	            if((arr[i] - arr[j] == 0) || (abs(arr[i] - arr[j]) == 1)){
	                count++;
	                if(arr[i] == arr[j]) arr[j] = -1;
	            }
	        }
	    }
	    cout<<n-count<<endl;
	}
	return 0;
}
