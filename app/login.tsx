import Colors from '@/constants/Colors';
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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdaptiveToast } from '@/utils/toast';
import { useAuthStore } from '@/store/auth-store';

const Page = () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const toast = useAdaptiveToast();
  const authStore = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let backPressedOnce = false;

    const handleBackPress = () => {
      if (backPressedOnce) {
        BackHandler.exitApp();
        return true;
      }

      backPressedOnce = true;
      toast.info('Keluar aplikasi', {
        description: 'Tekan sekali lagi untuk keluar',
        duration: 2000,
      });

      setTimeout(() => {
        backPressedOnce = false;
      }, 2000);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

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
      const user = await authStore.login(email, password);

      toast.success('Login berhasil!', {
        description: `Selamat datang, ${user.full_name}!`,
        duration: 1000,
      });

      router.replace('/(authenticated)/(tabs)');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        'Login gagal';

      toast.error('Login gagal', {
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    placeholder='••••••••'
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
                disabled={authStore.isLoading}
              >
                {authStore.isLoading ? (
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
