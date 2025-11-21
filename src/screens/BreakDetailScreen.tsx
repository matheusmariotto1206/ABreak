import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { breakService, translateBreakType } from '../services/api';
import { BreakDTO } from '../types';

type BreakDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'BreakDetail'>;
  route: RouteProp<RootStackParamList, 'BreakDetail'>;
};

const BreakDetailScreen: React.FC<BreakDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { breakId } = route.params;
  const theme = useAppTheme();
  const [breakData, setBreakData] = useState<BreakDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBreakDetail();
    }, [breakId])
  );

  const loadBreakDetail = async () => {
    try {
      setLoading(true);
      const data = await breakService.getById(breakId);
      setBreakData(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da pausa');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta pausa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await breakService.delete(breakId);
      Alert.alert('Sucesso', 'Pausa excluída com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a pausa');
    } finally {
      setDeleting(false);
    }
  };

  const getBreakTypeConfig = (type: string) => {
    switch (type) {
      case 'ALONGAMENTO':
        return {
          icon: 'body-outline' as const,
          color: theme.colors.stretching,
          label: 'Alongamento',
          gradient: ['#a29bfe', '#6c5ce7'],
          benefit: 'Previne dores musculares e melhora a postura',
        };
      case 'HIDRATACAO':
        return {
          icon: 'water-outline' as const,
          color: theme.colors.hydration,
          label: 'Hidratação',
          gradient: ['#74b9ff', '#0984e3'],
          benefit: 'Mantém o corpo hidratado e melhora a concentração',
        };
      case 'DESCANSO_VISUAL':
        return {
          icon: 'eye-outline' as const,
          color: theme.colors.visual,
          label: 'Descanso Visual',
          gradient: ['#fd79a8', '#e84393'],
          benefit: 'Reduz fadiga ocular e previne ressecamento',
        };
      default:
        return {
          icon: 'pause-circle-outline' as const,
          color: theme.colors.primary,
          label: type,
          gradient: [theme.colors.primary, theme.colors.primaryDark],
          benefit: 'Pausa para bem-estar',
        };
    }
  };

  const formatDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    const time = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const dayOfWeek = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    return { date, time, dayOfWeek };
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>
          Carregando detalhes...
        </Text>
      </View>
    );
  }

  if (!breakData) {
    return null;
  }

  const config = getBreakTypeConfig(breakData.breakType);
  const { date, time, dayOfWeek } = formatDateTime();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com Gradiente */}
      <LinearGradient
        colors={config.gradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Ionicons name={config.icon} size={48} color="#ffffff" />
          </View>
        </View>
        <Text style={styles.headerTitle}>{config.label}</Text>
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={20} color="#ffffff" />
          <Text style={styles.durationText}>{breakData.durationFormatted}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Card de Data e Hora */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={20} color={config.color} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Data e Horário
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textLight} />
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Data</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {date}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textLight} />
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Horário</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {time}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="sunny-outline" size={16} color={theme.colors.textLight} />
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Dia</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {dayOfWeek}
            </Text>
          </View>
        </View>

        {/* Card de Benefícios */}
        <View style={[styles.card, { backgroundColor: config.color + '15' }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={20} color={config.color} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Benefícios
            </Text>
          </View>
          <Text style={[styles.benefitText, { color: theme.colors.text }]}>
            {config.benefit}
          </Text>
        </View>

        {/* Card de Informações do Usuário */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={20} color={theme.colors.primary} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Registrado por
            </Text>
          </View>
          <View style={styles.userCard}>
            <View style={[styles.userAvatar, { backgroundColor: config.color + '30' }]}>
              <Ionicons name="person" size={24} color={config.color} />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {breakData.user.name}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.textLight }]}>
                {breakData.user.email}
              </Text>
              <View style={styles.userIdBadge}>
                <Text style={[styles.userIdText, { color: theme.colors.textLight }]}>
                  ID: {breakData.user.id}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Card de Metadados */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={20} color={theme.colors.info} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Informações Técnicas
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>
              ID da Pausa
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              #{breakData.id}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditBreak', { 
              breakId: breakData.id,
              userId: breakData.user.id 
            })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="create-outline" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Editar Pausa</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleDelete}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ff6b6b', '#ee5a6f']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {deleting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={20} color="#ffffff" />
                  <Text style={styles.buttonText}>Excluir Pausa</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    marginTop: -16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  benefitText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 6,
  },
  userIdBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  userIdText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    marginTop: 8,
    gap: 12,
    marginBottom: 32,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BreakDetailScreen;