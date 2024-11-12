import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
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
          title: 'Camera',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
