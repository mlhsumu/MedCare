// Registration screen wrapper.
// It reuses the shared authentication component in register mode.
import { AuthScreen } from '@/components/auth-screen';

export default function RegisterScreen() {
  return <AuthScreen mode="register" />;
}