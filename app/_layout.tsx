import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#2A2318' },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
