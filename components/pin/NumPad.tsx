import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface NumPadProps {
  onNumberPress: (num: number) => void;
  onBackspacePress: () => void;
}

const NUM_PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'];

const NumPad = ({ onNumberPress, onBackspacePress }: NumPadProps) => {
  const handleButtonPress = (value: number | string) => {
    if (value === 'backspace') {
      onBackspacePress();
    } else if (typeof value === 'number') {
      onNumberPress(value);
    }
  };

  return (
    <View style={styles.numpadContainer}>
      {NUM_PAD.map((num, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.numpadButton,
            num === '.' ? styles.disabledNumpadButton : {},
          ]}
          onPress={() => handleButtonPress(num)}
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
  );
};

const { width } = Dimensions.get('window');
const buttonSize = ((width - 48 - 32) / 3) * 0.8;

const styles = StyleSheet.create({
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

export default NumPad;
