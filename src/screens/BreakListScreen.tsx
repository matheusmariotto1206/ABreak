import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { breakService, translateBreakType } from '../services/api';
import { BreakDTO } from '../types';

type BreakListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'BreakList'>;
  route: RouteProp<RootStackParamList, 'BreakList'>;
};

const BreakListScreen: React.FC<BreakListScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const theme = useAppTheme();
  const [breaks, setBreaks] = useState<BreakDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadBreaks();
    }, [userId])
  );

  const loadBreaks = async () => {
    try {
      setLoading(true);
      const response = await breakService.getUserBreaks(userId, 0, 10);
      setBreaks(response.content);
      setHasMore(response.number < response.totalPages - 1);
      setPage(0);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as pausas');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBreaks = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await breakService.getUserBreaks(userId, nextPage, 10);
      setBreaks((prev) => [...prev, ...response.content]);
      setHasMore(response.number < response.totalPages - 1);
      setPage(nextPage);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar mais pausas');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = (breakId: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta pausa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmDelete(breakId),
        },
      ]
    );
  };

  const confirmDelete = async (breakId: number) => {
    try {
      await breakService.delete(breakId);
      setBreaks((prev) => prev.filter((b) => b.id !== breakId));
      Alert.alert('Sucesso', 'Pausa excluída com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a pausa');
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
        };
      case 'HIDRATACAO':
        return {
          icon: 'water-outline' as const,
          color: theme.colors.hydration,
          label: 'Hidratação',
          gradient: ['#74b9ff', '#0984e3'],
        };
      case 'DESCANSO_VISUAL':
        return {
          icon: 'eye-outline' as const,
          color: theme.colors.visual,
          label: 'Descanso Visual',
          gradient: ['#fd79a8', '#e84393'],
        };
      default:
        return {
          icon: 'pause-circle-outline' as const,
          color: theme.colors.primary,
          label: type,
          gradient: [theme.colors.primary, theme.colors.primaryDark],
        };
    }
  };

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) {
      const now = new Date();
      return {
        date: now.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'short',
          timeZone: 'America/Sao_Paulo'
        }),
        time: now.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        })
      };
    }

    const dateObj = new Date(dateTimeString);
    
    const date = dateObj.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      timeZone: 'America/Sao_Paulo'
    });
    const time = dateObj.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
    return { date, time };
  };

  const renderBreakItem = ({ item }: { item: BreakDTO }) => {
    const config = getBreakTypeConfig(item.breakType);
    const { date, time } = formatDateTime(item.dateTime);

    return (
      <Animated.View style={styles.breakCardWrapper}>
        <TouchableOpacity
          style={[styles.breakCard, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('BreakDetail', { breakId: item.id })}
          activeOpacity={0.7}
        >
          <View style={styles.breakHeader}>
            <LinearGradient
              colors={config.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.typeBadge}
            >
              <Ionicons name={config.icon} size={16} color="#ffffff" />
              <Text style={styles.typeBadgeText}>{config.label}</Text>
            </LinearGradient>
            
            <View style={[styles.durationBadge, { backgroundColor: config.color + '20' }]}>
              <Ionicons name="time-outline" size={14} color={config.color} />
              <Text style={[styles.durationText, { color: config.color }]}>
                {item.durationFormatted}
              </Text>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Ionicons name="calendar-outline" size={14} color={theme.colors.textLight} />
              <Text style={[styles.dateTimeText, { color: theme.colors.textLight }]}>
                {date}
              </Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textLight} />
              <Text style={[styles.dateTimeText, { color: theme.colors.textLight }]}>
                {time}
              </Text>
            </View>
          </View>

          <View style={styles.userSection}>
            <View style={[styles.avatar, { backgroundColor: config.color + '30' }]}>
              <Ionicons name="person" size={16} color={config.color} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {item.user.name}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.textLight }]}>
                {item.user.email}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={[styles.deleteButton, { backgroundColor: theme.colors.error + '15' }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={[theme.colors.primary + '10', theme.colors.secondary + '10']}
        style={styles.emptyIconContainer}
      >
        <Ionicons name="cafe-outline" size={64} color={theme.colors.primary} />
      </LinearGradient>
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>
        Nenhuma pausa registrada
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.colors.textLight }]}>
        Comece sua jornada de bem-estar agora!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('AddBreak', { userId })}
      >
        <LinearGradient
          colors={theme.gradients.secondary}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add-circle" size={20} color="#ffffff" />
          <Text style={styles.emptyButtonText}>Registrar Primeira Pausa</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>
          Carregando pausas...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={breaks}
        renderItem={renderBreakItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        onEndReached={loadMoreBreaks}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBreak', { userId })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.gradients.secondary}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
  list: {
    padding: 16,
  },
  breakCardWrapper: {
    marginBottom: 12,
  },
  breakCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  breakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingLeft: 4,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateTimeText: {
    fontSize: 13,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  fabGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BreakListScreen;