import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, StatusBar } from 'react-native';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

export default function TabsLayout() {
  useEffect(() => {
    StatusBar.setBackgroundColor(Colors.primary);
    StatusBar.setBarStyle('light-content');

    return () => {
      StatusBar.setBackgroundColor(Colors.background);
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  return (
    <>
      <StatusBar backgroundColor={Colors.primary} barStyle='light-content' />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.gray,
          tabBarStyle: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: 100,
            paddingTop: 20,
            borderRadius: 15,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            paddingTop: 6,
          },
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: 'white',
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name='home' size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='transfer'
          options={{
            title: 'Transfer',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name='arrow-forward-circle' size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='qris'
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={styles.qrisIconContainer}>
                <Ionicons name='qr-code' size={28} color='#FFF' />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name='topup'
          options={{
            title: 'Top Up',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name='add-circle' size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name='person' size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  qrisIconContainer: {
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
