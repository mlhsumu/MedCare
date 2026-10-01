/**
 * Shared theme configuration for MedCare.
 * These colors and spacing tokens keep the app styling consistent across screens and components.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const COLORS = {
  primary: '#028090',
  secondary: '#FFFFFF',
  background: '#F0F7F9',
  text: '#0A2342',
  subtext: '#7BA7B8',
  success: '#2ECC71',
  warning: '#FFB800',
  danger: '#E05252',
  border: '#D9E5E8',
} as const;

export const Colors = {
  light: {
    text: COLORS.text,
    background: COLORS.background,
    backgroundElement: COLORS.secondary,
    backgroundSelected: '#DCEFF2',
    textSecondary: COLORS.subtext,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
