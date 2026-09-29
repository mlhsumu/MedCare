import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, DoctorMark, Eyebrow, palette } from '@/components/medcare-ui';
import { Doctor, request } from '@/lib/api';

export default function DoctorDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDoctor = async () => {
    setLoading(true);
    setError('');
    try {
      setDoctor(await request<Doctor>(`/doctors/${id}`));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load doctor details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDoctor();
  }, [id]);

  const goBack = () => router.back();
  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={palette.teal} /><Text style={styles.message}>Loading doctor…</Text></View>;
  }
  if (!doctor) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error || 'Doctor not found.'}</Text>
        <Pressable onPress={loadDoctor}><Text style={styles.link}>Try again</Text></Pressable>
        <Pressable onPress={goBack}><Text style={styles.link}>Go back</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={goBack} hitSlop={10} style={styles.back}>
          <Text style={styles.backText}>←  Doctors</Text>
        </Pressable>
        <View style={styles.profile}>
          <DoctorMark name={doctor.name} size={82} />
          <Eyebrow>{doctor.specialization}</Eyebrow>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.rating}>★ {doctor.rating}  ·  {doctor.experience_years} years experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the visit</Text>
          <Text style={styles.copy}>Book a consultation with {doctor.name}. Choose an available date and time that fits your schedule.</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>CONSULTATION FEE</Text>
            <Text style={styles.detailValue}>৳{doctor.fee}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>AVAILABLE HOURS</Text>
            <Text style={styles.detailValue}>{doctor.available_from.slice(0, 5)} – {doctor.available_to.slice(0, 5)}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View><Text style={styles.feeLabel}>Consultation</Text><Text style={styles.fee}>৳{doctor.fee}</Text></View>
        <View style={styles.bookButton}>
          <Button label="Book appointment" onPress={() => router.push(`/booking/${doctor.id}`)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.background },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 20, paddingBottom: 35 },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 20 },
  backText: { color: palette.teal, fontSize: 14, fontWeight: '700' },
  profile: { alignItems: 'center', gap: 10, paddingVertical: 22 },
  name: { color: palette.ink, fontFamily: 'serif', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  rating: { color: palette.muted, fontSize: 13 },
  section: { borderTopWidth: 1, borderColor: palette.line, paddingTop: 21, marginTop: 20 },
  sectionTitle: { color: palette.ink, fontSize: 18, fontWeight: '800' },
  copy: { color: palette.muted, fontSize: 14, lineHeight: 22, marginTop: 9 },
  details: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 24 },
  detailItem: { flex: 1, minWidth: 145, padding: 15, backgroundColor: palette.mint, borderRadius: 8 },
  detailLabel: { color: palette.tealDark, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  detailValue: { color: palette.ink, fontSize: 16, fontWeight: '700', marginTop: 8 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 16, borderTopWidth: 1, borderColor: palette.line, backgroundColor: palette.surface },
  feeLabel: { color: palette.muted, fontSize: 11 },
  fee: { color: palette.ink, fontSize: 17, fontWeight: '800', marginTop: 3 },
  bookButton: { flex: 1, maxWidth: 235 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: palette.background, padding: 24 },
  message: { color: palette.muted, textAlign: 'center', lineHeight: 21 },
  link: { color: palette.teal, fontWeight: '700', padding: 6 },
});