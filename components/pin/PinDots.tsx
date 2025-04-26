import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface PinDotsProps {
  length: number;
  filledCount: number;
}

const PinDots = ({ length, filledCount }: PinDotsProps) => {
  return (
    <View style={styles.pinDisplay}>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <View
            key={i}
            style={[styles.pinDot, i < filledCount ? styles.pinDotFilled : {}]}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default PinDots;
