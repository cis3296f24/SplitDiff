//
//  ContentView.swift
//  SplitDiff
//
//  Created by Phuykong on 10/28/24.
//

import SwiftUI
import PhotosUI
import AIReceiptScanner
import FirebaseAuth

struct ContentView: View {
    
    @State var selectedTab = 0
    @State private var email = ""
    @State private var password = ""
    @State private var message = ""
    
    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack {
                VStack(spacing: 20) {
                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal)
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal)
                    
                    Button("Sign Up") {
                        signUp()
                    }
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    
                    Button("Sign In") {
                        signIn()
                    }
                    .padding()
                    .background(Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    
                    Text(message)
                        .foregroundColor(.red)
                }
                .padding()
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
    
    func signUp() {
            Auth.auth().createUser(withEmail: email, password: password) { authResult, error in
                if let error = error {
                    message = "Error: \(error.localizedDescription)"
                    return
                }
                message = "User signed up successfully!"
            }
        }

        func signIn() {
            Auth.auth().signIn(withEmail: email, password: password) { authResult, error in
                if let error = error {
                    message = "Error: \(error.localizedDescription)"
                    return
                }
                message = "User signed in successfully!"
            }
        }
}

#Preview {
    ContentView()
}
