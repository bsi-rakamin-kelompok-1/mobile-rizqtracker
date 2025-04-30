import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBar } from 'expo-status-bar';
import { useAdaptiveToast } from '@/utils/toast';
import { register } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth-store';

const Page = () => {
  const router = useRouter();
  const toast = useAdaptiveToast();
  const { login: loginStore } = useAuthStore();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!fullName) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'No HP wajib diisi';
    } else if (!/^[1-9]\d{1,3}\d{6,14}$/.test(phoneNumber)) {
      newErrors.phoneNumber =
        'No HP harus diawali kode negara dan panjang maksimal 14 digit';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password harus mengandung huruf kapital';
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = 'Password harus mengandung karakter khusus';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak sesuai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await register({
        email,
        password,
        confirm_password: confirmPassword,
        full_name: fullName,
        phone_number: phoneNumber,
      });

      if (response.success) {
        await loginStore(email, password);
        router.replace('./create-pin');
      }
    } catch (error: any) {
      const errorMessages = error?.response?.data?.errors;

      if (error?.response?.data?.message) {
        toast.error('Registrasi gagal', {
          description: error?.response?.data?.message,
          duration: 2000,
        });
      } else if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        const errorDescription = errorMessages
          .map((msg) => `• ${msg}`)
          .join('\n');

        toast.error('Registrasi gagal', {
          description: errorDescription,
          duration: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' backgroundColor={Colors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.topSection}>
          <Text style={styles.greeting}>Assalamualaikum sahabat!</Text>
          <Text style={styles.subtitle}>
            Registrasi untuk memulai perjalanan keuanganmu!
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.formContainer}>
            <View style={styles.formContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    placeholder='viona.amalia@gmail.com'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    style={styles.input}
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      if (errors.fullName) {
                        setErrors({ ...errors, fullName: '' });
                      }
                    }}
                    placeholder='Viona Amalia'
                    style={styles.input}
                  />
                </View>
                {errors.fullName ? (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>No HP</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      if (errors.phoneNumber) {
                        setErrors({ ...errors, phoneNumber: '' });
                      }
                    }}
                    placeholder='628123456789'
                    keyboardType='phone-pad'
                    style={styles.input}
                  />
                </View>
                {errors.phoneNumber ? (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors({ ...errors, password: '' });
                      }
                    }}
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
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Konfirmasi Password</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: '' });
                      }
                    }}
                    placeholder='••••••••'
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                      }
                      size={20}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>

              <Button
                style={[
                  styles.registerButton,
                  isLoading ? styles.disabledButton : null,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <Text style={styles.registerButtonText}>Daftar</Text>
                )}
              </Button>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Sudah punya akun? Masuk </Text>
                <Link href='./login' asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginLink}>disini</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
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
    paddingBottom: 30,
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
  scrollView: {
    flex: 1,
    backgroundColor: Colors.primary, // Set background color to match container
  },
  scrollViewContent: {
    flexGrow: 1, // This makes the content grow to fill available space
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '100%', // Makes the white container at least as tall as the scroll view
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40, // Add enough padding at the bottom
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#e8f8f5',
    borderWidth: 0,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: Colors.primaryMuted,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: Colors.gray,
  },
  loginLink: {
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
