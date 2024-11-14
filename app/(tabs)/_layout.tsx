import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, TouchableOpacity } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/welcome");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error signing out", errorMessage);
    }
  };

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'blue',
      headerRight: () => (
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="black" style={{ marginRight: 16 }} />
        </TouchableOpacity>
      )
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: '',
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/receipt_1f9fe.png')}
              style={{ width: 100, height: 100 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={24} color="black" style={{ marginRight: 16 }} />
            </TouchableOpacity>
          )
        }}
      />
    </Tabs>
  );
}