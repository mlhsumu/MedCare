// Session management for MedCare.
// This provider stores the auth token, restores the session on app start, and exposes sign-in/sign-out helpers.
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { request, User } from '@/lib/api';

const TOKEN_KEY = 'medcare-session-token';

type AuthResponse = { token: string; user: User };
type SessionContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

async function readToken() {
  if (Platform.OS === 'web') {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function storeToken(token: string | null) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else window.localStorage.removeItem(TOKEN_KEY);
    }
    return;
  }
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const savedToken = await readToken();
        if (!savedToken) return;
        const restoredUser = await request<User>('/auth/me', {}, savedToken);
        if (active) {
          setToken(savedToken);
          setUser(restoredUser);
        }
      } catch {
        await storeToken(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const authenticate = async (path: string, body: Record<string, string>) => {
    const result = await request<AuthResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    await storeToken(result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const signIn = (email: string, password: string) =>
    authenticate('/auth/login', { email, password });

  const signUp = (name: string, email: string, password: string) =>
    authenticate('/auth/register', { name, email, password });

  const signOut = async () => {
    await storeToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used inside SessionProvider.');
  return context;
}
