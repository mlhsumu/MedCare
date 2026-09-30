// Entry screen for MedCare.
// It redirects the user to either the home page or login page depending on the session state.
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/components/medcare-ui';
import { useSession } from '@/providers/session-provider';

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading) router.replace(user ? '/home' : '/login');
  }, [loading, router, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={palette.teal} />
      <Text style={styles.label}>Opening your care space</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: palette.background,
  },
  label: { color: palette.muted, fontSize: 14 },
});