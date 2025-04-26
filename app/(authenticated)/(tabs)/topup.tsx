import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';

const Topup = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle='light-content' />
      <View style={styles.content}>
        <Text>Topup</Text>
      </View>
    </SafeAreaView>
  );
};

export default Topup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
});
