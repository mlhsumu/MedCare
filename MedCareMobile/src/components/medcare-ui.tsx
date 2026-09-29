import React from 'react';
import { usePathname, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

export const palette = {
  background: '#F4F7F5',
  surface: '#FFFFFF',
  ink: '#183B36',
  muted: '#6A7D78',
  teal: '#14756D',
  tealDark: '#105B56',
  mint: '#DDEFE8',
  coral: '#C96E52',
  paleCoral: '#F8E9E2',
  line: '#DCE6E1',
  gold: '#E1B45E',
  white: '#FFFFFF',
  danger: '#B5473C',
};

export function Page({ children }: React.PropsWithChildren) {
  return <SafeAreaView style={styles.page}>{children}</SafeAreaView>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  variant?: 'primary' | 'secondary' | 'quiet';
};

export function Button({ label, onPress, disabled = false, busy = false, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'quiet' && styles.quietButton,
        (pressed || disabled || busy) && styles.buttonDimmed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={variant === 'primary' ? palette.white : palette.teal} />
      ) : (
        <Text style={[styles.buttonText, variant !== 'primary' && styles.secondaryButtonText]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

type FieldProps = TextInputProps & { label: string; error?: string };

export function Field({ label, error, style, ...props }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={palette.muted}
        style={[styles.field, error ? styles.fieldError : undefined, style]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function Eyebrow({ children }: React.PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function PageTitle({ children, subtitle }: React.PropsWithChildren<{ subtitle?: string }>) {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.pageTitle}>{children}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function DoctorMark({ name, size = 52 }: { name: string; size?: number }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.doctorMark, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.doctorInitials, { fontSize: size * 0.34 }]}>{initials || 'MD'}</Text>
    </View>
  );
}

export function AppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    { label: 'Home', path: '/home' as const },
    { label: 'Doctors', path: '/doctors' as const },
    { label: 'Appointments', path: '/appointments' as const },
  ];

  return (
    <View style={styles.navigation}>
      {items.map((item) => {
        const active = pathname === item.path || (item.path !== '/home' && pathname.startsWith(`${item.path}/`));
        return (
          <Pressable
            key={item.path}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => router.replace(item.path)}
            style={styles.navigationItem}
          >
            <View style={[styles.navigationDot, active && styles.navigationDotActive]} />
            <Text style={[styles.navigationLabel, active && styles.navigationLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.background },
  button: {
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: { backgroundColor: palette.teal },
  secondaryButton: { backgroundColor: palette.mint },
  quietButton: { backgroundColor: 'transparent' },
  buttonDimmed: { opacity: 0.68 },
  buttonText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  secondaryButtonText: { color: palette.tealDark },
  fieldWrap: { gap: 7, marginBottom: 15 },
  fieldLabel: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  field: {
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: palette.surface,
    color: palette.ink,
    fontSize: 15,
  },
  fieldError: { borderColor: palette.danger },
  errorText: { color: palette.danger, fontSize: 13, lineHeight: 18 },
  eyebrow: { color: palette.teal, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  titleBlock: { gap: 7 },
  pageTitle: { color: palette.ink, fontSize: 30, fontWeight: '700', fontFamily: 'serif' },
  subtitle: { color: palette.muted, fontSize: 15, lineHeight: 22 },
  doctorMark: { alignItems: 'center', justifyContent: 'center', backgroundColor: palette.mint },
  doctorInitials: { color: palette.tealDark, fontWeight: '800' },
  navigation: { minHeight: 62, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: palette.line, backgroundColor: palette.surface, paddingHorizontal: 12 },
  navigationItem: { minWidth: 82, alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8 },
  navigationDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'transparent' },
  navigationDotActive: { backgroundColor: palette.coral },
  navigationLabel: { color: palette.muted, fontSize: 11, fontWeight: '600' },
  navigationLabelActive: { color: palette.ink, fontWeight: '800' },
});
