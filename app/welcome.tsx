import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebase";  
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged
} from "firebase/auth";
import { FirebaseError } from 'firebase/app';

export default function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)");
      }
    });
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    try {
      const authFunction = isSignUp ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
      await authFunction(auth, email, password);
      Alert.alert("Success", isSignUp ? "Account created!" : "Signed in!");
      router.replace("/(tabs)");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      Alert.alert("Error", firebaseError.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SplitDiff</Text>
      <Text style={styles.subtitle}>Split bills effortlessly with friends</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          spellCheck={false}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
        
        <Button 
          title={isSignUp ? "Sign Up" : "Sign In"} 
          onPress={handleAuth}
        />
        
        <Button
          title={isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          onPress={() => setIsSignUp(!isSignUp)}
        />
        
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>
        
        <Button 
          title="Continue without account" 
          onPress={() => router.replace("/(tabs)")}
          color="gray"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 10,
    color: "#666",
  },
});