import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner-native';

export default function AuthenticatedHome() {
  const router = useRouter();
  const authStore = useAuthStore();

  console.log('Auth state:', authStore);
  
  const handleLogout = () => {
    authStore.logout();
    toast.success('Logout berhasil', {
      description: 'Anda telah berhasil keluar dari aplikasi.',
      duration: 2000,
    });

    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RizqTracker!</Text>
      <Text style={styles.subtitle}>You are now logged in</Text>

      <View style={styles.dashboardCard}>
        <Text style={styles.cardTitle}>Your Balance</Text>
        <Text style={styles.balanceText}>$10,245.50</Text>
        <Text style={styles.growthText}>+5.3% this month</Text>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 8,
    color: Colors.dark,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 40,
  },
  dashboardCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 8,
  },
  growthText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});