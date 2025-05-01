import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import React from 'react';

export default function TransactionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name='transaction-pin'
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name='transaction-result'
        options={{
          headerShown: false,
          animation: 'fade',
          presentation: 'transparentModal',
          gestureEnabled: false,
        }}
      />
      
    </Stack>
  );
}
