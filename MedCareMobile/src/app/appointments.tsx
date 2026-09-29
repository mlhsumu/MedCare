import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppNavigation, DoctorMark, palette } from '@/components/medcare-ui';
import { Appointment, request } from '@/lib/api';
import { useSession } from '@/providers/session-provider';

export default function AppointmentsScreen() {
  const { token } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAppointments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      setAppointments(await request<Appointment[]>('/appointments', {}, token));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load appointments.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const cancelAppointment = async (id: number) => {
    if (!token) return;
    try {
      await request(`/appointments/${id}`, { method: 'DELETE' }, token);
      await loadAppointments();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Could not cancel this appointment.');
    }
  };

  return (
    <View style={styles.page}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.eyebrow}>YOUR CARE PLAN</Text>
            <Text style={styles.title}>My appointments</Text>
            <Text style={styles.subtitle}>Your upcoming and past visits in one place.</Text>
          </View>
        )}
        ListEmptyComponent={(
          <View style={styles.empty}>
            {loading ? <ActivityIndicator size="large" color={palette.teal} /> : null}
            <Text style={styles.emptyTitle}>{loading ? 'Loading visits' : 'No appointments yet'}</Text>
            <Text style={styles.emptyCopy}>{error || (loading ? '' : 'When you book a doctor, the details will appear here.')}</Text>
            {!loading && error ? <Pressable onPress={loadAppointments}><Text style={styles.retry}>Try again</Text></Pressable> : null}
          </View>
        )}
        renderItem={({ item }) => {
          const date = new Date(`${item.appointment_date}T12:00:00`);
          const formattedDate = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          const time = new Date(`2000-01-01T${item.appointment_time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
          const active = item.status === 'confirmed';
          return (
            <View style={styles.appointment}>
              <View style={styles.appointmentTop}>
                <DoctorMark name={item.doctor_name} size={48} />
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{item.doctor_name}</Text>
                  <Text style={styles.specialty}>{item.specialization}</Text>
                </View>
                <View style={[styles.status, !active && styles.statusPast]}>
                  <Text style={[styles.statusText, !active && styles.statusTextPast]}>{active ? 'CONFIRMED' : item.status.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.visitDetails}>
                <View><Text style={styles.detailLabel}>DATE</Text><Text style={styles.detailValue}>{formattedDate}</Text></View>
                <View><Text style={styles.detailLabel}>TIME</Text><Text style={styles.detailValue}>{time}</Text></View>
                <View><Text style={styles.detailLabel}>FEE</Text><Text style={styles.detailValue}>৳{item.fee}</Text></View>
              </View>
              {active ? (
                <Pressable accessibilityRole="button" onPress={() => void cancelAppointment(item.id)} style={styles.cancel}>
                  <Text style={styles.cancelText}>Cancel appointment</Text>
                </Pressable>
              ) : null}
            </View>
          );
        }}
      />
      <AppNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.background },
  list: { flexGrow: 1, paddingHorizontal: 19, paddingBottom: 20 },
  header: { paddingTop: 23, paddingBottom: 18 },
  eyebrow: { color: palette.teal, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { marginTop: 7, color: palette.ink, fontFamily: 'serif', fontSize: 29, fontWeight: '700' },
  subtitle: { marginTop: 6, color: palette.muted, fontSize: 14, lineHeight: 20 },
  empty: { alignItems: 'center', paddingTop: 65, paddingHorizontal: 18, gap: 10 },
  emptyTitle: { color: palette.ink, fontFamily: 'serif', fontWeight: '700', fontSize: 21 },
  emptyCopy: { color: palette.muted, textAlign: 'center', lineHeight: 21 },
  retry: { color: palette.teal, fontWeight: '800', padding: 8 },
  appointment: { marginBottom: 12, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface },
  appointmentTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  doctorDetails: { flex: 1, minWidth: 0 },
  doctorName: { color: palette.ink, fontWeight: '800', fontSize: 15 },
  specialty: { color: palette.teal, fontSize: 12, marginTop: 4 },
  status: { borderRadius: 4, backgroundColor: palette.mint, paddingHorizontal: 7, paddingVertical: 5 },
  statusPast: { backgroundColor: palette.paleCoral },
  statusText: { color: palette.tealDark, fontSize: 9, fontWeight: '800' },
  statusTextPast: { color: palette.coral },
  divider: { height: 1, backgroundColor: palette.line, marginVertical: 14 },
  visitDetails: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  detailLabel: { color: palette.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },
  detailValue: { color: palette.ink, fontSize: 13, fontWeight: '700', marginTop: 4 },
  cancel: { alignSelf: 'flex-start', marginTop: 15, paddingVertical: 6 },
  cancelText: { color: palette.danger, fontSize: 12, fontWeight: '700' },
});