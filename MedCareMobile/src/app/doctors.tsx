// This page lists doctors and supports search and filtering by specialty.
// Patients can browse specialists and open a doctor detail screen from here.
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';

import { AppNavigation, BackButton, DoctorMark, palette } from '@/components/medcare-ui';
import { Doctor, request } from '@/lib/api';

export default function DoctorsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ search?: string; specialization?: string }>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(typeof params.search === 'string' ? params.search : '');
  const [specialization, setSpecialization] = useState(
    typeof params.specialization === 'string' ? params.specialization : '',
  );

  useEffect(() => {
    void fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');

    try {
      setDoctors(await request<Doctor[]>('/doctors'));
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean))];
  const filteredDoctors = doctors.filter((doctor) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${doctor.name} ${doctor.specialization}`.toLowerCase().includes(query);
    return matchesSearch && (!specialization || doctor.specialization === specialization);
  });

  const listHeader = (
    <View style={styles.header}>
      <BackButton fallback="/home" label="Home" />
      <Text style={styles.eyebrow}>IUSMED CONNECT</Text>
      <Text style={styles.title}>Find a doctor</Text>
      <Text style={styles.subtitle}>Search trusted specialists and choose the right fit for you.</Text>
      <TextInput
        accessibilityLabel="Search doctors"
        placeholder="Name or specialty"
        placeholderTextColor={palette.muted}
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        style={styles.search}
      />
      {specializations.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Pressable onPress={() => setSpecialization('')} style={[styles.filter, !specialization && styles.filterSelected]}>
            <Text style={[styles.filterText, !specialization && styles.filterTextSelected]}>All</Text>
          </Pressable>
          {specializations.map((item) => (
            <Pressable key={item} onPress={() => setSpecialization(specialization === item ? '' : item)} style={[styles.filter, specialization === item && styles.filterSelected]}>
              <Text style={[styles.filterText, specialization === item && styles.filterTextSelected]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      <Text style={styles.resultCount}>{filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            {loading ? <ActivityIndicator size="large" color={palette.teal} /> : null}
            <Text style={styles.emptyText}>
              {loading ? 'Loading doctors…' : error || 'No doctors match this search.'}
            </Text>
            {error ? <Pressable onPress={fetchDoctors}><Text style={styles.retry}>Try again</Text></Pressable> : null}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name}, ${item.specialization}`}
            onPress={() => router.push({ pathname: '/doctors/[id]', params: { id: String(item.id) } })}
            style={({ pressed }) => [styles.doctorRow, pressed && styles.pressed]}
          >
            <DoctorMark name={item.name} size={50} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialization}>{item.specialization}</Text>
              <Text style={styles.details}>{item.experience_years} years · ★ {item.rating}</Text>
            </View>
            <View style={styles.feeWrap}>
              <Text style={styles.fee}>৳{item.fee}</Text>
              <Text style={styles.feeLabel}>visit</Text>
            </View>
          </Pressable>
        )}
      />
      <AppNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  list: { paddingHorizontal: 18, paddingBottom: 18, flexGrow: 1 },
  header: { paddingTop: 21, paddingBottom: 17 },
  eyebrow: { color: palette.teal, fontWeight: '800', fontSize: 12 },
  title: { marginTop: 7, fontSize: 30, fontWeight: '700', fontFamily: 'serif', color: palette.ink },
  subtitle: { marginTop: 5, color: palette.muted, fontSize: 14, lineHeight: 20 },
  search: { marginTop: 17, height: 49, borderRadius: 8, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface, paddingHorizontal: 14, color: palette.ink },
  filters: { gap: 8, paddingVertical: 14 },
  filter: { minHeight: 44, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 13, borderWidth: 1, borderColor: palette.line, borderRadius: 20, backgroundColor: palette.surface },
  filterSelected: { backgroundColor: palette.teal, borderColor: palette.teal },
  filterText: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  filterTextSelected: { color: palette.white },
  resultCount: { paddingTop: 3, paddingBottom: 8, color: palette.muted, fontSize: 12, fontWeight: '700' },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 9,
    borderRadius: 8,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
  },
  pressed: { opacity: 0.7 },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '800', color: palette.ink },
  specialization: { marginTop: 4, fontSize: 13, color: palette.teal, fontWeight: '700' },
  details: { marginTop: 5, fontSize: 12, color: palette.muted },
  feeWrap: { alignItems: 'flex-end' },
  fee: { color: palette.ink, fontWeight: '800', fontSize: 14 },
  feeLabel: { color: palette.muted, marginTop: 3, fontSize: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 35 },
  emptyText: { color: palette.muted, textAlign: 'center', lineHeight: 21 },
  retry: { color: palette.teal, fontWeight: '800', minHeight: 44, paddingHorizontal: 9, textAlignVertical: 'center' },
});