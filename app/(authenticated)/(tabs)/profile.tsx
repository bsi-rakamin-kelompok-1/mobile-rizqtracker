import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth-store';
import useAxiosPrivate from '@/hooks/use-axios-private';
import * as ImagePicker from 'expo-image-picker';
import { useAdaptiveToast } from '@/utils/toast';
import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuthStore();
  const axios = useAxiosPrivate();
  const toast = useAdaptiveToast();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phone_number || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/v1/users/detail');
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setFullName(userData.full_name);
        setEmail(userData.email);
        setPhoneNumber(userData.phone_number);
        setAvatarUrl(userData.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Gagal memuat data profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!fullName || !phoneNumber) {
      toast.error('Data tidak lengkap', {
        description: 'Nama lengkap dan nomor telepon wajib diisi',
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.patch('/v1/users/detail', {
        full_name: fullName,
        phone_number: phoneNumber,
      });

      if (response.data.success) {
        setUser(response.data.data);

        toast.success('Profil berhasil diperbarui');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Izin diperlukan',
        'Izin akses galeri diperlukan untuk mengubah avatar'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    setIsUploadingAvatar(true);

    const formData = new FormData();
    const filename = uri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri,
      name: filename,
      type,
    } as any);

    try {
      const response = await axios.post('/v1/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        let newAvatarUrl = response.data.data;

        if (newAvatarUrl && newAvatarUrl.startsWith('http://')) {
          newAvatarUrl = newAvatarUrl.replace('http://', 'https://');
        }

        newAvatarUrl = `${newAvatarUrl}${
          newAvatarUrl.includes('?') ? '&' : '?'
        }t=${Date.now()}`;

        setAvatarUrl(newAvatarUrl);
        setUser({
          ...user!,
          avatar_url: newAvatarUrl,
        });
        toast.success('Avatar berhasil diperbarui');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Gagal mengupload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah anda yakin ingin keluar dari aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size='large' color='white' />
      </View>
    );
  }

  const handleAvatarClick = () => {
    setIsAvatarModalVisible(true);
  };

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor={Colors.background} />

      <SafeAreaView style={styles.container}>
        {/* Avatar Modal */}
        <Modal
          visible={isAvatarModalVisible}
          transparent={true}
          animationType='fade'
          onRequestClose={() => setIsAvatarModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsAvatarModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <ExpoImage
                source={
                  avatarUrl
                    ? { uri: avatarUrl }
                    : require('@/assets/images/cat-wink.png')
                }
                key={avatarUrl}
                style={styles.modalAvatarImage}
                contentFit='contain'
                transition={{
                  duration: 1000,
                  timing: 'ease-in-out',
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft} />
            <Text style={styles.headerTitle}>Profil</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name='log-out-outline' size={24} color='white' />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Profile Image */}
            <View style={styles.imageContainer}>
              {isUploadingAvatar ? (
                <View style={styles.avatarLoadingContainer}>
                  <ActivityIndicator color={Colors.primary} size='large' />
                </View>
              ) : (
                <TouchableOpacity onPress={handleAvatarClick}>
                  <ExpoImage
                    source={
                      avatarUrl
                        ? { uri: avatarUrl }
                        : require('@/assets/images/cat-wink.png')
                    }
                    key={avatarUrl}
                    style={styles.profileImage}
                    contentFit='cover'
                    transition={{
                      duration: 1000,
                      timing: 'ease-in-out',
                    }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={handlePickImage}
                disabled={isUploadingAvatar}
              >
                <Ionicons name='camera' size={20} color='white' />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                    placeholder='Masukkan nama lengkap'
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={email}
                    editable={false}
                    style={[styles.input, styles.disabledInput]}
                    keyboardType='email-address'
                    autoCapitalize='none'
                  />
                </View>
                <Text style={styles.helperText}>Email tidak dapat diubah</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>No HP</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={styles.input}
                    keyboardType='phone-pad'
                    placeholder='Contoh: 628123456789'
                  />
                </View>
              </View>

              <Button
                style={[
                  styles.updateButton,
                  isUpdating && styles.disabledButton,
                ]}
                onPress={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <Text style={styles.updateButtonText}>Perbaharui Profil</Text>
                )}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Colors.primary,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  logoutButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  avatarLoadingContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f8f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#e8f8f5',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '37%',
    backgroundColor: Colors.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 30,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#e8f8f5',
    borderWidth: 0,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: Colors.gray,
    opacity: 0.7,
  },

  // Add these new styles for the modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalAvatarImage: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
    borderRadius: 10,
  },
});

export default ProfilePage;
