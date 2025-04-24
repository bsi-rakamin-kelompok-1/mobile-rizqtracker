import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { StatusBar } from 'expo-status-bar';
import { useAdaptiveToast } from '@/utils/toast';
import { useAuthStore } from '@/store/auth-store';
import { setPinApi } from '@/lib/api/pin';

const NUM_PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'];

const Page = () => {
  const router = useRouter();
  const toast = useAdaptiveToast();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'pin' | 'confirm'>('pin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuthStore((state) => ({
    token: state.token,
  }));

  // Replace useRef+Animated with useSharedValue from Reanimated
  const shakeOffset = useSharedValue(0);

  // Prevent going back with hardware button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (stage === 'confirm') {
          // Go back to PIN input stage if in confirmation stage
          setStage('pin');
          setConfirmPin('');
          setError('');
          return true;
        }

        toast.info('Pin setup required', {
          description: 'Please complete pin setup to continue',
        });
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, [stage]);

  const handleNumberPress = (num: number | string) => {
    if (stage === 'pin' && pin.length < 6) {
      if (typeof num === 'number') {
        setPin((prev) => prev + num);
      }
    } else if (stage === 'confirm' && confirmPin.length < 6) {
      if (typeof num === 'number') {
        setConfirmPin((prev) => prev + num);
      }
    }
  };

  const handleBackspace = () => {
    if (stage === 'pin' && pin.length > 0) {
      setPin((prev) => prev.slice(0, -1));
    } else if (stage === 'confirm' && confirmPin.length > 0) {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  };

  const handleGoBackToPin = () => {
    setStage('pin');
    setConfirmPin('');
    setError('');
  };

  const handleNextStep = () => {
    if (stage === 'pin') {
      if (pin.length === 6) {
        setStage('confirm');
        setError('');
      } else {
        setError('PIN harus 6 digit');
      }
    }
  };

  // Function to create the shaking animation using Reanimated
  const startShakeAnimation = () => {
    // More powerful shaking sequence with Reanimated
    shakeOffset.value = withSequence(
      withTiming(10, { duration: 50, easing: Easing.bounce }),
      withTiming(-10, { duration: 50, easing: Easing.bounce }),
      withTiming(8, { duration: 50, easing: Easing.bounce }),
      withTiming(-8, { duration: 50, easing: Easing.bounce }),
      withTiming(6, { duration: 50, easing: Easing.bounce }),
      withTiming(-6, { duration: 50, easing: Easing.bounce }),
      withTiming(0, { duration: 50, easing: Easing.bounce })
    );
  };

  const handleSubmit = async () => {
    if (confirmPin.length !== 6) {
      setError('PIN konfirmasi harus 6 digit');
      return;
    }

    if (pin !== confirmPin) {
      setError('PIN tidak cocok');
      setConfirmPin('');
      startShakeAnimation(); // Start shaking animation when PINs don't match
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // You would implement the actual API call here
      // For example: await createPin(pin);

      const { success } = await setPinApi(
        {
          pin,
          confirm_pin: confirmPin,
        },
        token!
      );

      if (!success) {
        throw new Error('Gagal membuat PIN. Silakan coba lagi.');
      }

      toast.success('PIN berhasil dibuat!', {
        description: 'Selamat datang di RizqTracker',
        duration: 3000,
      });

      router.replace('./(authenticated)/(tabs)/');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Gagal membuat PIN. Silakan coba lagi.';
      toast.error('Gagal', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Create an animated style using Reanimated's useAnimatedStyle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeOffset.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' backgroundColor={Colors.primary} />
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>
          {stage === 'pin' ? 'Buat PIN' : 'Konfirmasi PIN'}
        </Text>

        {stage === 'confirm' && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBackToPin}
          >
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Animated.View style={[styles.pinSection, animatedStyle]}>
            <Text style={styles.pinLabel}>
              {stage === 'pin' ? 'Masukkan PIN Anda' : 'Konfirmasi PIN Anda'}
            </Text>
            <View style={styles.pinDisplay}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.pinDot,
                      (stage === 'pin' && i < pin.length) ||
                      (stage === 'confirm' && i < confirmPin.length)
                        ? styles.pinDotFilled
                        : {},
                    ]}
                  />
                ))}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </Animated.View>

          <Button
            style={[
              styles.confirmButton,
              (stage === 'pin' && pin.length !== 6) ||
              (stage === 'confirm' && confirmPin.length !== 6)
                ? styles.disabledButton
                : {},
              isLoading ? styles.disabledButton : null,
            ]}
            onPress={stage === 'pin' ? handleNextStep : handleSubmit}
            disabled={
              (stage === 'pin' && pin.length !== 6) ||
              (stage === 'confirm' && confirmPin.length !== 6) ||
              isLoading
            }
          >
            {isLoading ? (
              <ActivityIndicator color='white' size='small' />
            ) : (
              <Text style={styles.confirmButtonText}>
                {stage === 'pin' ? 'Lanjut' : 'Konfirmasi'}
              </Text>
            )}
          </Button>

          <View style={styles.numpadContainer}>
            {NUM_PAD.map((num, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.numpadButton,
                  num === '.' ? styles.disabledNumpadButton : {},
                ]}
                onPress={() => {
                  if (num === 'backspace') {
                    handleBackspace();
                  } else if (typeof num === 'number') {
                    handleNumberPress(num);
                  }
                }}
                disabled={num === '.'}
              >
                {num === 'backspace' ? (
                  <Ionicons
                    name='backspace-outline'
                    size={24}
                    color={Colors.primary}
                  />
                ) : num === '.' ? (
                  <Text></Text>
                ) : (
                  <Text style={styles.numpadText}>{num}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const buttonSize = ((width - 48 - 32) / 3) * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  headerSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 20,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  pinSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  pinLabel: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 16,
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e8f8f5',
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    width: '80%',
  },
  disabledButton: {
    backgroundColor: Colors.primaryMuted,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  numpadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  numpadButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e8f8f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledNumpadButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  numpadText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default Page;
