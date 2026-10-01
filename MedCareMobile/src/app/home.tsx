// This is the main landing page after login.
// It shows the account info, doctor search, specialties, and quick access to appointments.
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppNavigation, Button, DoctorMark, Eyebrow, palette } from '@/components/medcare-ui';
import { Doctor, request } from '@/lib/api';
import { useSession } from '@/providers/session-provider';

export default function HomeScreen() {
  const router = useRouter();
  const { user, token, signOut } = useSession();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [loadError, setLoadError] = useState('');

  const loadDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    setLoadError('');
    try {
      setDoctors(await request<Doctor[]>('/doctors'));
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : 'Could not load specialties.');
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors]);

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean))].slice(0, 6);
  const searchDoctors = () => {
    router.push({ pathname: '/doctors', params: search.trim() ? { search: search.trim() } : {} });
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topbar}>
          <View style={styles.brandLine}>
            <View style={styles.brandMark}><Text style={styles.plus}>+</Text></View>
            <Text style={styles.brand}>IUSMED CONNECT</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await signOut();
              router.replace('/login');
            }}
            style={styles.signOutButton}
          >
            <Text style={styles.signOut}>Sign out</Text>
          </Pressable>
        </View>

        <View style={styles.greeting}>
          <Eyebrow>ACCOUNT TYPE: {user?.role.toUpperCase() ?? 'PATIENT'}</Eyebrow>
          <Text style={styles.greetingTitle}>Good day, {user?.name.split(' ')[0] ?? 'there'}.</Text>
          <Text style={styles.greetingCopy}>How can we help you feel better?</Text>
        </View>

        <View style={styles.searchBar}>
          <TextInput
            accessibilityLabel="Search doctors or specialties"
            placeholder="Doctor, specialty, or clinic"
            placeholderTextColor={palette.muted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={searchDoctors}
            returnKeyType="search"
            style={styles.searchInput}
          />
          <Pressable accessibilityRole="button" onPress={searchDoctors} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopyBlock}>
            <Text style={styles.heroLabel}>PERSONAL CARE, MADE SIMPLE</Text>
            <Text style={styles.heroTitle}>The right doctor is a better first step.</Text>
            <Text style={styles.heroSub}>Browse specialists and book a time that works for you.</Text>
            <Pressable accessibilityRole="button" onPress={() => router.push('/doctors')} style={styles.heroAction}>
              <Text style={styles.heroActionText}>Find a doctor  →</Text>
            </Pressable>
          </View>
          <View style={styles.heroOrbit}>
            <View style={styles.heroCircle}><Text style={styles.heroCross}>+</Text></View>
            <View style={styles.heroDot} />
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Eyebrow>EXPLORE BY NEED</Eyebrow>
            <Text style={styles.sectionTitle}>Specialties</Text>
          </View>
          <Pressable accessibilityRole="link" onPress={() => router.push('/doctors')}>
            <Text style={styles.viewAll}>All doctors  →</Text>
          </Pressable>
        </View>

        {loadError ? (
          <View style={styles.stateBlock}>
            <Text accessibilityRole="alert" style={styles.message}>{loadError}</Text>
            <Pressable accessibilityRole="button" onPress={() => void loadDoctors()} style={styles.retryButton}>
              <Text style={styles.viewAll}>Try again</Text>
            </Pressable>
          </View>
        ) : doctorsLoading ? (
          <View style={styles.stateRow}>
            <ActivityIndicator color={palette.teal} />
            <Text style={styles.message}>Loading specialties…</Text>
          </View>
        ) : specialties.length ? (
          <View style={styles.categoryGrid}>
            {specialties.map((specialty, index) => (
              <Pressable
                key={specialty}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/doctors', params: { specialization: specialty } })}
                style={[styles.category, index % 3 === 1 && styles.categoryTint]}
              >
                <Text style={styles.categoryNumber}>{String(index + 1).padStart(2, '0')}</Text>
                <Text style={styles.categoryName}>{specialty}</Text>
                <Text style={styles.categoryArrow}>↗</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.message}>No doctor specialties are available yet.</Text>
        )}

        <View style={styles.appointmentBand}>
          <View style={styles.appointmentIcon}><Text style={styles.calendarGlyph}>24</Text></View>
          <View style={styles.appointmentCopy}>
            <Text style={styles.appointmentTitle}>Your next visit</Text>
            <Text style={styles.appointmentText}>Keep track of upcoming appointments.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/appointments')} hitSlop={10}>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.footerActions}>
          <Button label="Browse all doctors" onPress={() => router.push('/doctors')} variant="secondary" />
          <Text style={styles.connected}>Signed in securely</Text>
        </View>
      </ScrollView>
      <AppNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.background },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  signOutButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 30, height: 30, borderRadius: 9, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
  plus: { color: palette.white, fontSize: 24, lineHeight: 27 },
  brand: { color: palette.ink, fontWeight: '800', fontSize: 12 },
  signOut: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  greeting: { gap: 7, marginBottom: 20 },
  greetingTitle: { color: palette.ink, fontFamily: 'serif', fontWeight: '700', fontSize: 29 },
  greetingCopy: { color: palette.muted, fontSize: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 8, padding: 5, borderWidth: 1, borderColor: palette.line, marginBottom: 17 },
  searchInput: { flex: 1, minWidth: 0, height: 48, paddingHorizontal: 11, color: palette.ink, fontSize: 14 },
  searchButton: { paddingHorizontal: 14, minHeight: 44, borderRadius: 8, backgroundColor: palette.teal, justifyContent: 'center' },
  searchButtonText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  hero: { minHeight: 205, backgroundColor: palette.tealDark, borderRadius: 8, padding: 21, flexDirection: 'row', overflow: 'hidden', marginBottom: 26 },
  heroCopyBlock: { flex: 1, justifyContent: 'center', zIndex: 1 },
  heroLabel: { color: '#D8F0F3', fontSize: 12, fontWeight: '800' },
  heroTitle: { maxWidth: 300, marginTop: 9, color: palette.white, fontFamily: 'serif', fontSize: 24, lineHeight: 29, fontWeight: '700' },
  heroSub: { maxWidth: 280, marginTop: 8, color: '#E1F2F4', fontSize: 14, lineHeight: 20 },
  heroAction: { alignSelf: 'flex-start', marginTop: 13, paddingVertical: 8 },
  heroActionText: { color: palette.gold, fontSize: 15, fontWeight: '800' },
  heroOrbit: { width: 83, alignItems: 'center', justifyContent: 'center' },
  heroCircle: { width: 67, height: 67, borderRadius: 34, backgroundColor: '#1593A2', alignItems: 'center', justifyContent: 'center' },
  heroCross: { color: '#D9F1E8', fontSize: 45, lineHeight: 51, fontWeight: '300' },
  heroDot: { position: 'absolute', width: 12, height: 12, right: 3, top: 31, borderRadius: 6, backgroundColor: palette.coral },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { color: palette.ink, fontSize: 22, fontFamily: 'serif', fontWeight: '700', marginTop: 4 },
  viewAll: { color: palette.teal, fontWeight: '700', fontSize: 12, paddingBottom: 4 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  category: { width: '31.5%', minHeight: 91, padding: 12, justifyContent: 'space-between', borderRadius: 8, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line },
  categoryTint: { backgroundColor: palette.paleCoral, borderColor: palette.paleCoral },
  categoryNumber: { color: palette.coral, fontSize: 12, fontWeight: '800' },
  categoryName: { color: palette.ink, fontSize: 12, lineHeight: 16, fontWeight: '700' },
  categoryArrow: { position: 'absolute', top: 9, right: 10, color: palette.muted, fontSize: 14 },
  message: { color: palette.muted, paddingVertical: 17, lineHeight: 21, fontSize: 14 },
  stateRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 10 },
  stateBlock: { paddingVertical: 8 },
  retryButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  appointmentBand: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line, paddingVertical: 16, marginTop: 23 },
  appointmentIcon: { width: 41, height: 41, borderRadius: 8, backgroundColor: '#FFF3D1', alignItems: 'center', justifyContent: 'center' },
  calendarGlyph: { color: '#795E28', fontSize: 13, fontWeight: '800' },
  appointmentCopy: { flex: 1 },
  appointmentTitle: { color: palette.ink, fontSize: 14, fontWeight: '800' },
  appointmentText: { color: palette.muted, fontSize: 12, marginTop: 3 },
  arrow: { color: palette.teal, fontSize: 23, paddingHorizontal: 5 },
  footerActions: { gap: 12, marginTop: 17 },
  connected: { color: palette.muted, textAlign: 'center', fontSize: 12 },
});