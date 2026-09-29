import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>MedCare</Text>
        <Text style={styles.subtitle}>
          Your healthcare, made simple.
        </Text>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>
          Find the right doctor
        </Text>

        <Text style={styles.welcomeText}>
          Search doctors, check their availability and book an appointment.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push('/doctors')}
        >
          <Text style={styles.buttonText}>
            Find a Doctor
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>
        Medical Specialties
      </Text>

      <View style={styles.specialties}>
        <View style={styles.specialtyCard}>
          <Text style={styles.specialtyIcon}>❤️</Text>
          <Text style={styles.specialtyText}>Cardiology</Text>
        </View>

        <View style={styles.specialtyCard}>
          <Text style={styles.specialtyIcon}>🧠</Text>
          <Text style={styles.specialtyText}>Neurology</Text>
        </View>

        <View style={styles.specialtyCard}>
          <Text style={styles.specialtyIcon}>🦴</Text>
          <Text style={styles.specialtyText}>Orthopedics</Text>
        </View>

        <View style={styles.specialtyCard}>
          <Text style={styles.specialtyIcon}>👶</Text>
          <Text style={styles.specialtyText}>Pediatrics</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Why MedCare?
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Easy Appointment Booking
        </Text>

        <Text style={styles.infoText}>
          Choose a doctor, select a convenient date and time,
          and confirm your appointment.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },

  header: {
    backgroundColor: '#087F8C',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },

  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#D8F3F5',
  },

  welcomeCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 22,
    borderRadius: 16,
    elevation: 3,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#12343B',
  },

  welcomeText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#66777C',
  },

  button: {
    backgroundColor: '#087F8C',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#12343B',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },

  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
  },

  specialtyCard: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    margin: 8,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2,
  },

  specialtyIcon: {
    fontSize: 30,
  },

  specialtyText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#12343B',
  },

  infoCard: {
    backgroundColor: '#E5F5F6',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 14,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#087F8C',
  },

  infoText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#456066',
  },
});