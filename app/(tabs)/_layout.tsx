import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#C5962B',
        tabBarInactiveTintColor: '#8ec3b9',
        tabBarStyle: {
          backgroundColor: '#1A1510',
          borderTopColor: '#3d3425',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#2A2318',
        },
        headerTintColor: '#F5E6D3',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Quest',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⚔️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'Hero',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🛡️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📜</Text>
          ),
        }}
      />
    </Tabs>
  );
}
