import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdaptiveToast } from '@/utils/toast';
import { useAuthStore } from '@/store/auth-store';

const Page = () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const toast = useAdaptiveToast();

  // Use auth store
  const { login, isLoading } = useAuthStore();

  // Local state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Track if back was pressed once
    let backPressedOnce = false;

    const handleBackPress = () => {
      if (backPressedOnce) {
        // If pressed twice, exit the app
        BackHandler.exitApp();
        return true;
      }

      // First press
      backPressedOnce = true;
      toast.info('Exit App', {
        description: 'Press back again to exit the app.',
        duration: 2000,
      });

      // Reset the backPressedOnce flag after 2 seconds
      setTimeout(() => {
        backPressedOnce = false;
      }, 2000);

      return true; // Prevent default behavior
    };

    // Add back press event listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    // Clean up
    return () => backHandler.remove();
  }, [toast]);

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      // Use the login action from auth store
      const user = await login(email, password);

      // Show success toast
      toast.success('Login berhasil!', {
        description: `Selamat datang, ${user.full_name}!`,
        duration: 3000,
        onDismiss: () => router.replace('./(authenticated)/(tabs)'),
      });

      // Navigate to authenticated area
      router.replace('./(authenticated)/(tabs)');
    } catch (error: any) {
      // Handle specific error responses
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        'Login failed. Please check your credentials.';

      // Show error toast
      toast.error('Login gagal', {
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.topSection}>
          <Text style={styles.greeting}>Assalamualaikum sahabat!</Text>
          <Text style={styles.subtitle}>
            Masuk untuk memulai perjalanan keuanganmu!
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder='viona.amalia@gmail.com'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  style={styles.input}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder='Rahasia123#'
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.gray}
                  />
                </TouchableOpacity>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>
            </View>

            <Button
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text style={styles.loginButtonText}>Masuk</Text>
              )}
            </Button>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Belum punya akun? Registrasi{' '}
              </Text>
              <Link href='./register' asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>disini</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#e8f8f5',
    borderWidth: 0,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: Colors.gray,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Page;
