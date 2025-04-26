import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface PinPageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const PinPageHeader = ({
  title,
  showBackButton = false,
  onBackPress,
}: PinPageHeaderProps) => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.headerTitle}>{title}</Text>

      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 20,
  },
});

export default PinPageHeader;
