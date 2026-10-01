// This screen is shown after a booking succeeds.
// It displays the saved visit details and gives the user quick actions to return to the home page or appointments list.
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, DoctorMark, Eyebrow, Page, palette } from '@/components/medcare-ui';

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value ?? '';
}

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    doctorName?: string;
    specialization?: string;
    date?: string;
    time?: string;
    fee?: string;
  }>();
  const router = useRouter();
  const doctorName = firstParam(params.doctorName);
  const dateValue = firstParam(params.date);
  const timeValue = firstParam(params.time);
  const date = dateValue ? new Date(`${dateValue}T12:00:00`) : null;
  const formattedDate = date?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) ?? '';
  const formattedTime = timeValue ? new Date(`2000-01-01T${timeValue}:00`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  return (
    <Page>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.replace('/home')} style={styles.close}>
          <Text style={styles.closeText}>IUSMed Connect</Text>
        </Pressable>
        <View style={styles.confirmationMark}><Text style={styles.check}>✓</Text></View>
        <Eyebrow>APPOINTMENT CONFIRMED</Eyebrow>
        <Text style={styles.title}>Your visit is booked.</Text>
        <Text style={styles.copy}>We’ve saved your appointment. You can find it anytime in My appointments.</Text>

        <View style={styles.visit}>
          <View style={styles.visitHeader}>
            <DoctorMark name={doctorName || 'IUSMed'} size={54} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctorName || 'Your doctor'}</Text>
              <Text style={styles.specialty}>{firstParam(params.specialization)}</Text>
            </View>
          </View>
          <View style={styles.rule} />
          <View style={styles.detailRow}><Text style={styles.detailLabel}>DATE</Text><Text style={styles.detailValue}>{formattedDate}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>TIME</Text><Text style={styles.detailValue}>{formattedTime}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>CONSULTATION</Text><Text style={styles.detailValue}>৳{firstParam(params.fee)}</Text></View>
          {params.id ? <Text style={styles.reference}>Reference  MC-{firstParam(params.id)}</Text> : null}
        </View>

        <View style={styles.actions}>
          <Button label="View my appointments" onPress={() => router.replace('/appointments')} />
          <Button label="Back to home" onPress={() => router.replace('/home')} variant="secondary" />
        </View>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', flexGrow: 1, justifyContent: 'center', padding: 23, paddingTop: 38, paddingBottom: 32 },
  close: { alignSelf: 'flex-start', marginBottom: 35 },
  closeText: { color: palette.ink, fontWeight: '800', fontSize: 12, letterSpacing: 0.8 },
  confirmationMark: { width: 58, height: 58, borderRadius: 29, backgroundColor: palette.mint, alignItems: 'center', justifyContent: 'center', marginBottom: 21 },
  check: { color: palette.teal, fontSize: 30, fontWeight: '700' },
  title: { color: palette.ink, fontFamily: 'serif', fontSize: 31, fontWeight: '700', marginTop: 7 },
  copy: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 9 },
  visit: { marginTop: 25, padding: 17, borderRadius: 8, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line },
  visitHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  doctorInfo: { flex: 1 },
  doctorName: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  specialty: { color: palette.teal, fontSize: 12, marginTop: 4 },
  rule: { height: 1, backgroundColor: palette.line, marginVertical: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 11 },
  detailLabel: { color: palette.muted, fontSize: 10, fontWeight: '800' },
  detailValue: { color: palette.ink, fontSize: 13, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  reference: { borderTopWidth: 1, borderColor: palette.line, paddingTop: 12, marginTop: 16, color: palette.muted, fontSize: 11 },
  actions: { gap: 10, marginTop: 19 },
});