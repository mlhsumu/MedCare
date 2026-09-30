// Shared authentication form for login and registration.
// It handles the auth form state and calls the session provider to create or restore the user session.
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Eyebrow, Field, Page, palette } from '@/components/medcare-ui';
import { useSession } from '@/providers/session-provider';

export function AuthScreen({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const { signIn, signUp } = useSession();
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      if (isRegister) await signUp(name, email, password);
      else await signIn(email, password);
      router.replace('/home');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><Text style={styles.brandCross}>+</Text></View>
            <Text style={styles.brand}>MEDCARE CONNECT</Text>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroStripe} />
            <Eyebrow>Care, connected</Eyebrow>
            <Text style={styles.heroTitle}>A healthier day starts here.</Text>
            <Text style={styles.heroCopy}>Find trusted specialists and make your next appointment feel simple.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>{isRegister ? 'Create your account' : 'Welcome back'}</Text>
            <Text style={styles.formCopy}>{isRegister ? 'Your care journey, all in one place.' : 'Sign in to continue to your care.'}</Text>
            {isRegister ? (
              <Field label="Full name" placeholder="Your name" value={name} onChangeText={setName} autoCapitalize="words" returnKeyType="next" />
            ) : null}
            <Field label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next" />
            <Field label="Password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} secureTextEntry returnKeyType="go" onSubmitEditing={submit} />
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <Button label={isRegister ? 'Create account' : 'Sign in'} onPress={submit} busy={busy} />
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>{isRegister ? 'Already have an account?' : 'New to MedCare?'}</Text>
              <Pressable
                accessibilityRole="link"
                onPress={() => router.replace(isRegister ? '/login' : '/register')}
                hitSlop={8}
              >
                <Text style={styles.switchLink}>{isRegister ? 'Sign in' : 'Create account'}</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.privacy}>Your health information stays private and secure.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 25, paddingBottom: 30, maxWidth: 600, width: '100%', alignSelf: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
  brandCross: { color: palette.white, fontSize: 27, fontWeight: '500', lineHeight: 30 },
  brand: { color: palette.ink, fontSize: 12, fontWeight: '800', letterSpacing: 1.1 },
  hero: { marginTop: 34, padding: 22, minHeight: 194, justifyContent: 'flex-end', backgroundColor: palette.mint, borderRadius: 10, overflow: 'hidden', gap: 9 },
  heroStripe: { position: 'absolute', width: 8, top: 0, bottom: 0, right: 36, backgroundColor: palette.gold },
  heroTitle: { maxWidth: 330, color: palette.ink, fontFamily: 'serif', fontSize: 32, fontWeight: '700', lineHeight: 37 },
  heroCopy: { maxWidth: 320, color: palette.muted, fontSize: 14, lineHeight: 21 },
  form: { marginTop: 27 },
  formTitle: { color: palette.ink, fontFamily: 'serif', fontSize: 25, fontWeight: '700' },
  formCopy: { color: palette.muted, marginTop: 4, marginBottom: 21, fontSize: 14 },
  error: { marginBottom: 12, color: palette.danger, lineHeight: 20 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 5, marginTop: 18 },
  switchText: { color: palette.muted, fontSize: 14 },
  switchLink: { color: palette.tealDark, fontSize: 14, fontWeight: '700' },
  privacy: { color: palette.muted, fontSize: 12, textAlign: 'center', marginTop: 23 },
});