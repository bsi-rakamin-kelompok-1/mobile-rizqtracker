import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import Colors from '@/constants/Colors';
import PinDots from './PinDots';
import NumPad from './NumPad';

type Props = {
  label?: string;
  confirmLabel?: string;
  pinLength?: number;
  onComplete: (pin: string) => void;
  isConfirmationMode?: boolean;
  loading?: boolean;
  resetOnError?: boolean;
};

const PinInput = ({ resetOnError = false, ...props }: Props) => {
  const {
    label = 'Masukkan PIN baru',
    confirmLabel = 'Masukkan PIN untuk konfirmasi',
    pinLength = 6,
    onComplete,
    isConfirmationMode = false,
  } = props;

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'pin' | 'confirm'>(
    isConfirmationMode ? 'confirm' : 'pin'
  );
  const [error, setError] = useState('');

  // For animation
  const translateX = useSharedValue(0);

  // Create animated style for shaking
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Trigger shake animation
  const playShakeAnimation = () => {
    translateX.value = withSequence(
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(0, { duration: 50, easing: Easing.linear })
    );
  };

  // Add ref to track previous value
  const prevResetOnError = React.useRef(resetOnError);

  // Watch for resetOnError changes to trigger animation and reset PIN
  useEffect(() => {
    // Only trigger if reset changes from false to true
    if (resetOnError && !prevResetOnError.current) {
      if (stage === 'pin') {
        setPin('');
      } else {
        setConfirmPin('');
      }
      playShakeAnimation();
    }

    // Update the ref value after checking
    prevResetOnError.current = resetOnError;
  }, [resetOnError, stage]);

  const handleNumberPress = (num: number) => {
    if (stage === 'pin' && pin.length < pinLength) {
      setPin((prev) => prev + num);
    } else if (stage === 'confirm' && confirmPin.length < pinLength) {
      setConfirmPin((prev) => prev + num);
    }
  };

  const handleBackspacePress = () => {
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

  useEffect(() => {
    // Check if PIN is complete
    if (stage === 'pin' && pin.length === pinLength) {
      if (!isConfirmationMode) {
        // If no confirmation needed, call onComplete directly
        onComplete(pin);
      } else {
        // Move to confirmation stage if required and we're in create pin mode
        setStage('confirm');
      }
    }
  }, [pin, pinLength, isConfirmationMode]);

  useEffect(() => {
    // Check if confirmation PIN is complete
    if (stage === 'confirm' && confirmPin.length === pinLength) {
      if (isConfirmationMode) {
        // In transaction confirmation mode, we don't compare with pin
        // Just complete with entered PIN
        if (!pin || pin === '') {
          onComplete(confirmPin);
        } else {
          // In create PIN mode with confirmation
          if (pin === confirmPin) {
            onComplete(confirmPin);
          } else {
            setError('PIN tidak cocok');
            setConfirmPin('');
            playShakeAnimation();
          }
        }
      } else {
        // This shouldn't happen but handle it safely
        onComplete(confirmPin);
      }
    }
  }, [confirmPin, pin, stage, pinLength, isConfirmationMode]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pinSection, animatedStyle]}>
        <Text style={styles.pinLabel}>
          {stage === 'pin' ? label : confirmLabel}
        </Text>

        <PinDots
          length={pinLength}
          filledCount={stage === 'pin' ? pin.length : confirmPin.length}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Animated.View>

      <NumPad
        onNumberPress={handleNumberPress}
        onBackspacePress={handleBackspacePress}
      />

      {stage === 'confirm' && !isConfirmationMode && (
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={handleGoBackToPin}
        >
          <Text style={styles.goBackText}>Masukan PIN kembali</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
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
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  goBackButton: {
    marginTop: 12,
    padding: 10,
  },
  goBackText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 16,
    padding: 10,
  },
  cancelText: {
    color: Colors.gray,
    fontSize: 14,
  },
  loadingContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: Colors.primary,
    fontSize: 14,
  },
});

export default PinInput;
