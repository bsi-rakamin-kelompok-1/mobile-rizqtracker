import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import React from 'react';

export default function AuthenticatedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
        animation: 'slide_from_right',
        title: ' ', // Add this line with an empty space to override the folder name
      }}
    >
      {/* <Stack.Screen name='(authenticated)' options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name='(tabs)' options={{ headerShown: false }} /> */}
      <Stack.Screen
        name='topup-pin'
        options={{
          // headerShown: false,
          animation: 'slide_from_bottom',
          title: ' ', // Add this to ensure the title is hidden
        }}
      />
      <Stack.Screen
        name='topup-result'
        options={{
          headerShown: false,
          animation: 'fade',
          presentation: 'transparentModal',
          gestureEnabled: false,
          title: ' ', // Add this to ensure the title is hidden
        }}
      />
    </Stack>
  );
}
