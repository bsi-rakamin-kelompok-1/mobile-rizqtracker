import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

interface HeaderProps {
  userName: string;
  avatarUrl: string | null;
  onAvatarPress?: () => void; // Add this prop
}

const Header = ({ userName, avatarUrl, onAvatarPress }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Assalamu'alaikum, {userName}!</Text>
        <Text style={styles.subGreeting}>
          Berikut adalah catatan finansialmu.
        </Text>
      </View>
      <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require('@/assets/images/sagiri.jpeg')
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    ...defaultStyles.shadow,
  },
});

export default Header;
