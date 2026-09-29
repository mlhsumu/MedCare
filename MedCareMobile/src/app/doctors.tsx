import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  experience_years: number;
  rating: string;
  fee: string;
  available_from: string;
  available_to: string;
};

const API_URL = 'http://localhost:5000';

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors`);

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();

      setDoctors(data);
    } catch (error) {
      console.error(error);
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#087F8C" />
        <Text style={styles.loadingText}>
          Loading doctors...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Find a Doctor
      </Text>

      <Text style={styles.subtitle}>
        Choose a doctor for your appointment
      </Text>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name.charAt(4)}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.specialization}>
                {item.specialization}
              </Text>

              <Text style={styles.details}>
                {item.experience_years} years experience
              </Text>

              <Text style={styles.rating}>
                ⭐ {item.rating}
              </Text>

              <Text style={styles.fee}>
                Consultation Fee: ৳{item.fee}
              </Text>

              <Text style={styles.availability}>
                Available: {item.available_from.slice(0, 5)} -{' '}
                {item.available_to.slice(0, 5)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FC',
  },

  loadingText: {
    marginTop: 10,
    color: '#66777C',
  },

  errorText: {
    color: '#D32F2F',
    fontSize: 16,
  },

  title: {
    marginTop: 60,
    marginHorizontal: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#12343B',
  },

  subtitle: {
    marginTop: 6,
    marginHorizontal: 20,
    fontSize: 15,
    color: '#66777C',
  },

  list: {
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 3,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#D8F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#087F8C',
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#12343B',
  },

  specialization: {
    marginTop: 4,
    fontSize: 15,
    color: '#087F8C',
    fontWeight: '600',
  },

  details: {
    marginTop: 5,
    fontSize: 13,
    color: '#66777C',
  },

  rating: {
    marginTop: 7,
    fontSize: 14,
    color: '#444444',
  },

  fee: {
    marginTop: 7,
    fontSize: 14,
    fontWeight: '600',
    color: '#12343B',
  },

  availability: {
    marginTop: 5,
    fontSize: 13,
    color: '#66777C',
  },
});