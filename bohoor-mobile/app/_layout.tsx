import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          title: '',
          headerTitle: '',
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#0F2547',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="unit/[id]" options={{ headerShown: true, title: '', headerTitle: '' }} />
        <Stack.Screen name="units/[id]" options={{ headerShown: true, title: '', headerTitle: '' }} />
        <Stack.Screen name="project/[id]" options={{ headerShown: true, title: '', headerTitle: '' }} />
        <Stack.Screen name="projects/[id]" options={{ headerShown: true, title: '', headerTitle: '' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
