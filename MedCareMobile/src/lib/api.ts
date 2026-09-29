import { Platform } from 'react-native';

export type Doctor = {
  id: number;
  name: string;
  specialization: string;
  experience_years: number;
  rating: number | string;
  fee: number | string;
  available_from: string;
  available_to: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
};

export type Appointment = {
  id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  doctor_id: number;
  doctor_name: string;
  specialization: string;
  fee: number | string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001');

type ApiErrorPayload = { error?: string };

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Could not connect to MedCare. Check that the server is running.', 0);
  }

  const payload = await response.json().catch(() => null) as unknown;
  if (!response.ok) {
    const message = (payload as ApiErrorPayload | null)?.error ?? 'Something went wrong.';
    throw new ApiError(message, response.status);
  }
  return payload as T;
}
