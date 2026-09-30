// Root application layout.
// This file wires the app navigation and protects screens based on whether the user is logged in.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SessionProvider } from '@/providers/session-provider';
import { useSession } from '@/providers/session-provider';

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { user } = useSession();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F4F7F5' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(user)}>
        <Stack.Screen name="home" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="doctors" />
        <Stack.Screen name="doctors/[id]" />
        <Stack.Screen name="booking/[id]" />
        <Stack.Screen name="confirmation" />
        <Stack.Screen name="appointments" />
      </Stack.Protected>
    </Stack>
  );
}
