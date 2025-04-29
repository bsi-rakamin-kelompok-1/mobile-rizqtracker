import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, Camera } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import { CameraType } from 'expo-image-picker';

const QRCodeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [mode, setMode] = useState<'scan' | 'generate'>('generate');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Request camera permission for scanning mode
    if (mode === 'scan') {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [mode]);

  // Generate QR code data
  const generateQRData = () => {
    if (!user?.account?.account_number) {
      return '';
    }
    // Create a simple JSON string with the account number
    return JSON.stringify({
      accountNumber: user.account.account_number,
    });
  };

  // Handle QR code scanning with the new CameraView
  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.accountNumber) {
        // Navigate to transfer page with pre-filled recipient account
        router.push({
          pathname: '/(authenticated)/(tabs)/transfer',
          params: {
            scannedAccount: parsedData.accountNumber.toString(),
          },
        });
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code does not contain valid account information.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process QR code data. Please try again.');
    }
  };

  const copyAccountNumber = async () => {
    if (user?.account?.account_number) {
      await Clipboard.setStringAsync(user.account.account_number.toString());
      Alert.alert('Copied', 'Account number copied to clipboard');
    }
  };

  // Toggle between scan and generate modes
  const toggleMode = () => {
    setMode(mode === 'scan' ? 'generate' : 'scan');
    setScanned(false);
  };

  return (
    <>
      <StatusBar style='light' backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.header,
            {
              paddingTop:
                Platform.OS === 'android'
                  ? insets.top > 0
                    ? insets.top
                    : RNStatusBar.currentHeight
                  : 0,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'scan' ? 'Scan QR Code' : 'QR Code Saya'}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Ionicons
              name={mode === 'scan' ? 'qr-code' : 'scan'}
              size={24}
              color='white'
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {mode === 'generate' ? (
            <View style={styles.qrContainer}>
              <Text style={styles.title}>
                Tampilkan QR Code Ini Untuk Menerima Transfer
              </Text>

              <View style={styles.qrWrapper}>
                <QRCode
                  value={generateQRData()}
                  size={200}
                  color={Colors.dark}
                  backgroundColor='white'
                  logo={require('@/assets/images/Logo.svg')}
                  logoSize={40}
                  logoBackgroundColor='white'
                />
              </View>

              <View style={styles.accountInfoBox}>
                <Text style={styles.accountLabel}>Nomor Rekening</Text>
                <View style={styles.accountRow}>
                  <Text style={styles.accountNumber}>
                    {user?.account?.account_number}
                  </Text>
                  <TouchableOpacity
                    onPress={copyAccountNumber}
                    style={styles.copyButton}
                  >
                    <Ionicons
                      name='copy-outline'
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.accountName}>{user?.full_name}</Text>
              </View>

              <Text style={styles.note}>
                Tunjukkan QR code ini kepada pengirim untuk melakukan transfer
                ke akun Anda
              </Text>
            </View>
          ) : (
            <View style={styles.scanContainer}>
              {hasPermission === null ? (
                <Text style={styles.permissionText}>
                  Meminta izin kamera...
                </Text>
              ) : hasPermission === false ? (
                <Text style={styles.permissionText}>
                  Tidak ada akses ke kamera
                </Text>
              ) : (
                <>
                  <Text style={styles.title}>Scan QR Code untuk Transfer</Text>
                  <View style={styles.cameraContainer}>
                    <CameraView
                      style={StyleSheet.absoluteFillObject}
                      onBarcodeScanned={
                        scanned ? undefined : handleBarcodeScanned
                      }
                      barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                      }}
                      facing={CameraType.back}
                    />
                    <View style={styles.scannerOverlay}>
                      <View style={styles.scanCorner1} />
                      <View style={styles.scanCorner2} />
                      <View style={styles.scanCorner3} />
                      <View style={styles.scanCorner4} />
                    </View>
                  </View>
                  <Text style={styles.note}>
                    Arahkan kamera ke QR code penerima transfer
                  </Text>
                  {scanned && (
                    <TouchableOpacity
                      style={styles.rescanButton}
                      onPress={() => setScanned(false)}
                    >
                      <Text style={styles.rescanText}>Scan Ulang</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // Your existing styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 24,
    textAlign: 'center',
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountInfoBox: {
    width: '100%',
    backgroundColor: '#F0F9F6',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  copyButton: {
    padding: 8,
  },
  accountName: {
    fontSize: 14,
    color: Colors.dark,
    marginTop: 4,
  },
  note: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 16,
  },
  cameraContainer: {
    width: 280,
    height: 280,
    overflow: 'hidden',
    borderRadius: 12,
    marginVertical: 30,
    position: 'relative',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scanCorner1: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.primary,
  },
  scanCorner2: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.primary,
  },
  scanCorner3: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.primary,
  },
  scanCorner4: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.primary,
  },
  rescanButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 16,
  },
  rescanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRCodeScreen;
