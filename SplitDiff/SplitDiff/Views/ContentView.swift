//
//  ContentView.swift
//  SplitDiff
//
//  Created by Phuykong on 10/28/24.
//

import SwiftUI

struct ContentView: View {
    
    @State var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack {
                VStack {
                    Text("Home")
                }
                .navigationTitle("SplitDiff🧾")
            }
            .tabItem {
                Image(systemName: "house")
                Text("")
            }
            .tag(0)
            
            NavigationStack {
                VStack {
                    Button("Take a Picture") {
                        print("Took a Picture!")
                    }
                }
                .navigationTitle("SplitDiff🧾")
            }
            .tabItem {
                Image("receipt_1f9fe")
                    .resizable()
                    .frame(width: 10, height: 10)
                Text("")
            }
            .tag(1)
            
            NavigationStack {
                VStack {
                    Text("History")
                }
                .navigationTitle("SplitDiff🧾")
            }
            .tabItem {
                Image(systemName: "clock")
                Text("")
            }
            .tag(2)
        }
    }
}

#Preview {
    ContentView()
}
