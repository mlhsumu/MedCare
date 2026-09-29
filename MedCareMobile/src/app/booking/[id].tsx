import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, DoctorMark, Eyebrow, palette } from '@/components/medcare-ui';
import { Doctor, request } from '@/lib/api';
import { useSession } from '@/providers/session-provider';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function minutes(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function createSlots(from: string, to: string) {
  const slots: string[] = [];
  const start = Math.ceil(minutes(from.slice(0, 5)) / 30) * 30;
  for (let value = start; value < minutes(to.slice(0, 5)); value += 30) {
    slots.push(`${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`);
  }
  return slots;
}

function displayTime(time: string) {
  return new Date(`2000-01-01T${time}:00`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token } = useSession();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState(tomorrow);
  const [dateText, setDateText] = useState(formatDate(tomorrow));
  const [dateInputError, setDateInputError] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    request<Doctor>(`/doctors/${id}`)
      .then((result) => { if (active) setDoctor(result); })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load this doctor.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const slots = doctor ? createSlots(doctor.available_from, doctor.available_to) : [];
  const submit = async () => {
    if (!doctor || !selectedTime || !token) {
      setError('Choose a time to continue.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await request<{ id: number }>('/appointments', {
        method: 'POST',
        body: JSON.stringify({ doctorId: doctor.id, date: formatDate(date), time: selectedTime }),
      }, token);
      router.replace({
        pathname: '/confirmation',
        params: {
          id: String(result.id),
          doctorName: doctor.name,
          specialization: doctor.specialization,
          date: formatDate(date),
          time: selectedTime,
          fee: String(doctor.fee),
        },
      });
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Could not book this time.');
    } finally {
      setBusy(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type !== 'dismissed' && selectedDate) {
      setDate(selectedDate);
      setDateText(formatDate(selectedDate));
    }
  };

  const onDateTextChange = (value: string) => {
    setDateText(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setDateInputError('Enter the date as YYYY-MM-DD.');
      return;
    }

    const parsed = new Date(`${value}T12:00:00`);
    if (Number.isNaN(parsed.getTime()) || formatDate(parsed) !== value) {
      setDateInputError('Enter a valid calendar date.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsed < today) {
      setDateInputError('Choose today or a future date.');
      return;
    }

    setDate(parsed);
    setDateInputError('');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={palette.teal} /><Text style={styles.copy}>Loading available visits…</Text></View>;
  if (!doctor) return <View style={styles.center}><Text style={styles.copy}>{error || 'Doctor not found.'}</Text></View>;

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>←  Doctor details</Text></Pressable>
        <Eyebrow>BOOK A VISIT</Eyebrow>
        <Text style={styles.title}>Choose a time</Text>
        <Text style={styles.copy}>Select an upcoming date and an available consultation slot.</Text>

        <View style={styles.doctorLine}>
          <DoctorMark name={doctor.name} size={48} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialty}>{doctor.specialization}</Text>
          </View>
          <Text style={styles.fee}>৳{doctor.fee}</Text>
        </View>

        <Text style={styles.label}>Appointment date</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            accessibilityLabel="Appointment date"
            value={dateText}
            onChangeText={onDateTextChange}
            style={styles.dateButton}
            placeholder="YYYY-MM-DD"
            maxLength={10}
            keyboardType="numbers-and-punctuation"
          />
        ) : (
          <Pressable accessibilityRole="button" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateValue}>{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            <Text style={styles.editDate}>Change</Text>
          </Pressable>
        )}
        {dateInputError ? <Text accessibilityRole="alert" style={styles.error}>{dateInputError}</Text> : null}
        {showDatePicker ? (
          <DateTimePicker value={date} mode="date" minimumDate={new Date()} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
        ) : null}

        <View style={styles.slotHeading}>
          <Text style={styles.label}>Available times</Text>
          <Text style={styles.hours}>{doctor.available_from.slice(0, 5)}–{doctor.available_to.slice(0, 5)}</Text>
        </View>
        <View style={styles.slots}>
          {slots.map((slot) => (
            <Pressable
              key={slot}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTime === slot }}
              onPress={() => setSelectedTime(slot)}
              style={[styles.slot, selectedTime === slot && styles.slotSelected]}
            >
              <Text style={[styles.slotText, selectedTime === slot && styles.slotTextSelected]}>{displayTime(slot)}</Text>
            </Pressable>
          ))}
        </View>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        <View><Text style={styles.totalLabel}>Consultation fee</Text><Text style={styles.total}>৳{doctor.fee}</Text></View>
        <View style={styles.submit}><Button label="Confirm booking" onPress={submit} busy={busy} disabled={!selectedTime || Boolean(dateInputError)} /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.background },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 20, paddingBottom: 30 },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 17 },
  backText: { color: palette.teal, fontWeight: '700', fontSize: 13 },
  title: { color: palette.ink, fontFamily: 'serif', fontWeight: '700', fontSize: 29, marginTop: 6 },
  copy: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  doctorLine: { flexDirection: 'row', alignItems: 'center', gap: 11, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line, paddingVertical: 15, marginTop: 20, marginBottom: 24 },
  doctorInfo: { flex: 1 },
  doctorName: { color: palette.ink, fontSize: 14, fontWeight: '800' },
  specialty: { color: palette.teal, fontSize: 12, marginTop: 4 },
  fee: { color: palette.ink, fontSize: 14, fontWeight: '800' },
  label: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  dateButton: { minHeight: 50, borderRadius: 8, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface, marginTop: 9, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: palette.ink },
  dateValue: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  editDate: { color: palette.teal, fontSize: 12, fontWeight: '700' },
  slotHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  hours: { color: palette.muted, fontSize: 11 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  slot: { minWidth: '30%', minHeight: 43, paddingHorizontal: 10, borderRadius: 7, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface, alignItems: 'center', justifyContent: 'center' },
  slotSelected: { backgroundColor: palette.teal, borderColor: palette.teal },
  slotText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  slotTextSelected: { color: palette.white },
  error: { color: palette.danger, marginTop: 15, lineHeight: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 13, padding: 15, borderTopWidth: 1, borderColor: palette.line, backgroundColor: palette.surface },
  totalLabel: { color: palette.muted, fontSize: 11 },
  total: { color: palette.ink, fontSize: 17, fontWeight: '800', marginTop: 3 },
  submit: { maxWidth: 220, flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: palette.background },
});