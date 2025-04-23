import { useColorScheme } from 'react-native';
import { toast as sonnerToast } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import React from 'react';

export const useAdaptiveToast = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? 'white' : Colors.primary;
  const backgroundColor = isDark ? '#333' : 'white';
  const errorBackgroundColor = isDark ? '#502626' : '#d9534f';
  
  const toast = {
    success: (title: string, options?: any) => {
      return sonnerToast.success(title, {
        style: { backgroundColor },
        ...options,
        icon: options?.icon || <Ionicons name="checkmark-circle" size={24} color={iconColor} />,
      });
    },
    error: (title: string, options?: any) => {
      return sonnerToast.error(title, {
        style: { backgroundColor: errorBackgroundColor },
        ...options,
        icon: options?.icon || <Ionicons name="close-circle" size={24} color={iconColor} />,
      });
    },
    info: (title: string, options?: any) => {
      return sonnerToast.info(title, {
        style: { backgroundColor },
        ...options,
        icon: options?.icon || <Ionicons name="information-circle" size={24} color={iconColor} />,
      });
    },
    warning: (title: string, options?: any) => {
      return sonnerToast.warning(title, {
        style: { backgroundColor: isDark ? '#594415' : '#f0ad4e' },
        ...options,
        icon: options?.icon || <Ionicons name="warning" size={24} color={iconColor} />,
      });
    },
    default: sonnerToast,
  };
  
  return toast;
};