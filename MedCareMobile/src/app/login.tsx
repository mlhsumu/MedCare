// Login screen wrapper.
// It reuses the shared authentication component in login mode.
import { AuthScreen } from '@/components/auth-screen';

export default function LoginScreen() {
  return <AuthScreen mode="login" />;
}