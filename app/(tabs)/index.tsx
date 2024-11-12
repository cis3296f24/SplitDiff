import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { auth } from "../../firebase";  
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true); 

  // Sign-up function
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        Alert.alert("Success", "User signed up!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  // Sign-in function
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        Alert.alert("Success", "User signed in!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  // Sign-out function
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        Alert.alert("Success", "User signed out!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  // Observe auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe; 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Auth</Text>

      {user ? (
        <View>
          <Text style={styles.userText}>Welcome, {user.email}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        <View style={styles.authContainer}>
          {isSignUp ? (
            <>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize='none'
                keyboardType='email-address'
                spellCheck={false} 
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Button title="Sign Up" onPress={handleSignUp} />
              <Button title="Already have an account? Sign In" onPress={() => setIsSignUp(false)} />
            </>
          ) : (
            <>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize='none'
                keyboardType='email-address'
                spellCheck={false} 
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                autoCapitalize='none'
                keyboardType='email-address'
                spellCheck={false} 
              />
              <Button title="Sign In" onPress={handleSignIn} />
              <Button title="Don't have an account? Sign Up" onPress={() => setIsSignUp(true)} />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  authContainer: {
    width: "100%",
  },
  userText: {
    fontSize: 18,
    color: "green",
    marginBottom: 10,
  },
});
