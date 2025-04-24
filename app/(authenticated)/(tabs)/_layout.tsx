import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { View, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          height: 100,
          paddingTop: 26,
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingTop: 6,
        },
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
          tabBarIcon: ({ color }) => (
            <Ionicons name='add-circle' size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name='person' size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  qrisIconContainer: {
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
