import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Colors from '@/constants/Colors';

export default function Background({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" style={styles.svg}>
        <Defs>
          <LinearGradient id="backgroundGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.primaryDark} stopOpacity="1" />
            <Stop offset="0.4" stopColor={Colors.primary} stopOpacity="1" />
            <Stop offset="0.8" stopColor={Colors.primaryMuted} stopOpacity="1" />
            <Stop offset="1" stopColor="white" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#backgroundGradient)"
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});