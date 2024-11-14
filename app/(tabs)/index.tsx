import { View, Text, StyleSheet } from "react-native";
import { auth } from "../../firebase";
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.email}>Welcome, {user.email}</Text>
        </View>
      ) : (
        <Text style={styles.guestText}>Welcome, Guest User!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  guestText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  }
});