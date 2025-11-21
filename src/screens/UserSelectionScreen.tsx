import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type UserSelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'UserSelection'>;
};

const UserSelectionScreen: React.FC<UserSelectionScreenProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    const id = parseInt(userId);

    if (!userId || isNaN(id) || id <= 0) {
      Alert.alert('Erro', 'Por favor, insira um ID de usuário válido');
      return;
    }

    navigation.replace('Home', { userId: id });
  };

  const quickLogin = (id: number) => {
    navigation.replace('Home', { userId: id });
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <Ionicons name="pause-circle" size={80} color="#ffffff" />
          </View>
          <Text style={styles.title}>ABreak</Text>
          <Text style={styles.subtitle}>
            Monitor de Pausas Saudáveis
          </Text>
        </Animated.View>

        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu ID de usuário"
              keyboardType="numeric"
              value={userId}
              onChangeText={setUserId}
              placeholderTextColor="#b0b0b0"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#56ab2f', '#a8e063']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Entrar</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou acesso rápido</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.quickLoginButtons}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => quickLogin(1)}
              activeOpacity={0.8}
            >
              <Ionicons name="person" size={20} color="#ffffff" />
              <Text style={styles.quickButtonText}>Usuário 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => quickLogin(2)}
              activeOpacity={0.8}
            >
              <Ionicons name="person" size={20} color="#ffffff" />
              <Text style={styles.quickButtonText}>Usuário 2</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Text style={styles.footer}>
          FIAP - Global Solution 2025{'\n'}
          O Futuro do Trabalho
        </Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#2d3436',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ffffff',
    opacity: 0.3,
  },
  dividerText: {
    color: '#ffffff',
    fontSize: 14,
    marginHorizontal: 16,
    opacity: 0.8,
  },
  quickLoginButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  quickButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 48,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 18,
  },
});

export default UserSelectionScreen;