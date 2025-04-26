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

interface PinInputProps {
  label?: string;
  confirmLabel?: string;
  pinLength?: number;
  onComplete: (pin: string) => void;
  onCancel?: () => void;
  isConfirmationMode?: boolean;
  loading?: boolean;
}

const PinInput = ({
  label = 'Enter PIN',
  confirmLabel = 'Confirm PIN',
  pinLength = 6,
  onComplete,
  onCancel,
  isConfirmationMode = false,
  loading = false,
}: PinInputProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'pin' | 'confirm'>(
    isConfirmationMode ? 'confirm' : 'pin'
  );
  const [error, setError] = useState('');

  // Animation for shake effect
  const shakeOffset = useSharedValue(0);

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

  const startShakeAnimation = () => {
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

  useEffect(() => {
    // Check if PIN is complete
    if (stage === 'pin' && pin.length === pinLength && !isConfirmationMode) {
      // If no confirmation needed, call onComplete directly
      onComplete(pin);
    } else if (
      stage === 'pin' &&
      pin.length === pinLength &&
      isConfirmationMode
    ) {
      // Move to confirmation stage if required
      setStage('confirm');
    }
  }, [pin, stage, pinLength, isConfirmationMode]);

  useEffect(() => {
    // Check if confirmation PIN is complete
    if (stage === 'confirm' && confirmPin.length === pinLength) {
      if (pin === confirmPin || !isConfirmationMode) {
        onComplete(confirmPin);
      } else {
        setError('PINs do not match');
        setConfirmPin('');
        startShakeAnimation();
      }
    }
  }, [confirmPin, pin, stage, pinLength]);

  const handleNextStep = () => {
    if (stage === 'pin') {
      if (pin.length === pinLength) {
        setStage('confirm');
        setError('');
      } else {
        setError(`PIN must be ${pinLength} digits`);
      }
    }
  };

  // Create an animated style using Reanimated's useAnimatedStyle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeOffset.value }],
    };
  });

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

      {/* Conditional button for next/confirm action */}
      {isConfirmationMode && (
        <Button
          style={[
            styles.confirmButton,
            (stage === 'pin' && pin.length !== pinLength) ||
            (stage === 'confirm' && confirmPin.length !== pinLength)
              ? styles.disabledButton
              : {},
            loading ? styles.disabledButton : null,
          ]}
          onPress={
            stage === 'pin'
              ? handleNextStep
              : () => {
                  if (pin === confirmPin) {
                    onComplete(pin);
                  } else {
                    setError('PINs do not match');
                    setConfirmPin('');
                    startShakeAnimation();
                  }
                }
          }
          disabled={
            (stage === 'pin' && pin.length !== pinLength) ||
            (stage === 'confirm' && confirmPin.length !== pinLength) ||
            loading
          }
        >
          {loading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <Text style={styles.confirmButtonText}>
              {stage === 'pin' ? 'Next' : 'Confirm'}
            </Text>
          )}
        </Button>
      )}

      <NumPad
        onNumberPress={handleNumberPress}
        onBackspacePress={handleBackspacePress}
      />

      {stage === 'confirm' && isConfirmationMode && (
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={handleGoBackToPin}
        >
          <Text style={styles.goBackText}>Re-enter PIN</Text>
        </TouchableOpacity>
      )}

      {onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
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
    marginBottom: 20,
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
    marginTop: 8,
    padding: 10,
  },
  cancelText: {
    color: Colors.gray,
    fontSize: 14,
  },
});

export default PinInput;
