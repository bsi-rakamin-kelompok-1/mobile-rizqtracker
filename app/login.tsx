import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Page = () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      Alert.alert(
        'Exit App', 
        'Press back again to exit the app.',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      
      // Reset the backPressedOnce flag after 2 seconds
      setTimeout(() => {
        backPressedOnce = false;
      }, 2000);
      
      return true; // Prevent default behavior
    };
    
    // Add back press event listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    // Clean up
    return () => backHandler.remove();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Here you would typically call your authentication API
    // For now, we'll just simulate a successful login
    router.replace('./(authenticated)/(tabs)');
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
                  placeholder="viona@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Asik12345"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Button 
              style={styles.loginButton} 
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Masuk</Text>
            </Button>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Belum punya akun? Registrasi </Text>
              <Link href="./register" asChild>
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
});

export default Page;