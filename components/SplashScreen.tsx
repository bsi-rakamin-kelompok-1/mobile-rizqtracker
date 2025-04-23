import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Logo from '@/assets/images/Logo.svg';
import Colors from '@/constants/Colors';

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Logo />
        <Text style={styles.appName}>RizqTracker</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 16,
  },
});

export default SplashScreen;