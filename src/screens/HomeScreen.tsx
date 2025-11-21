import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { breakService } from '../services/api';
import { achievementService, Achievement } from '../services/achievements';
import { BreakDTO } from '../types';
import AchievementBadge from '../components/AchievementBadge';
import BreakCard from '../components/BreakCard';
import GradientCard from '../components/GradientCard';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const theme = useAppTheme();
  const [todayBreaks, setTodayBreaks] = useState<BreakDTO[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextBreakTime, setNextBreakTime] = useState(25 * 60);

  useFocusEffect(
    useCallback(() => {
      loadTodayBreaks();
      
      const interval = setInterval(() => {
        setNextBreakTime((prev) => {
          if (prev <= 0) {
            Alert.alert('⏰ Hora da Pausa!', 'Faça uma pausa saudável agora!');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [userId])
  );

  const loadTodayBreaks = async () => {
    try {
      setLoading(true);
      const data = await breakService.getTodayBreaks(userId);
      setTodayBreaks(data);
      
      const allBreaks = await breakService.getUserBreaks(userId, 0, 200);
      const totalBreaks = allBreaks.content.length;
      const updatedAchievements = await achievementService.updateAchievements(
        totalBreaks,
        data.length
      );
      setAchievements(updatedAchievements);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as pausas de hoje');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTodayBreaks();
    setRefreshing(false);
  }, [userId]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = (): number => {
    return todayBreaks.reduce((acc, b) => {
      const match = b.durationFormatted.match(/(\d+)\s*min/);
      return acc + (match ? parseInt(match[1]) : 0);
    }, 0);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <GradientCard colors={theme.gradients.primary} style={styles.timerCard}>
        <View style={styles.timerHeader}>
          <Ionicons name="timer-outline" size={24} color="#ffffff" />
          <Text style={styles.timerLabel}>Próxima Pausa</Text>
        </View>
        <Text style={styles.timerValue}>{formatTime(nextBreakTime)}</Text>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => navigation.navigate('AddBreak', { userId })}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color="#ffffff" />
          <Text style={styles.quickButtonText}>Registrar Agora</Text>
        </TouchableOpacity>
      </GradientCard>

      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.statIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="calendar-outline" size={24} color="#ffffff" />
          </LinearGradient>
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>{todayBreaks.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Pausas Hoje</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.statIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="time-outline" size={24} color="#ffffff" />
          </LinearGradient>
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>{getTotalDuration()}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Minutos</Text>
        </TouchableOpacity>
      </View>

      {achievements.filter(a => a.unlocked).length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={24} color={theme.colors.warning} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Conquistas
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {achievements
              .filter((a) => a.unlocked)
              .map((achievement) => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <AchievementBadge achievement={achievement} />
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="today" size={24} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Pausas de Hoje</Text>
        </View>
        {todayBreaks.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="cafe-outline" size={64} color={theme.colors.gray400} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Nenhuma pausa registrada
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textLight }]}>
              Comece sua jornada de bem-estar!
            </Text>
          </View>
        ) : (
          todayBreaks.slice(0, 3).map((breakItem) => (
            <BreakCard
              key={breakItem.id}
              breakItem={breakItem}
              onPress={() => navigation.navigate('BreakDetail', { breakId: breakItem.id })}
            />
          ))
        )}
        {todayBreaks.length > 3 && (
          <TouchableOpacity
            style={[styles.viewAllButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('BreakList', { userId })}
          >
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              Ver todas ({todayBreaks.length})
            </Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('BreakList', { userId })}
        >
          <Ionicons name="list" size={24} color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.text }]}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('Statistics', { userId })}
        >
          <Ionicons name="bar-chart" size={24} color={theme.colors.secondary} />
          <Text style={[styles.actionText, { color: theme.colors.text }]}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('Settings', { userId })}
        >
          <Ionicons name="settings" size={24} color={theme.colors.gray500} />
          <Text style={[styles.actionText, { color: theme.colors.text }]}>Config</Text>
        </TouchableOpacity>
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
    marginTop: 16,
    fontSize: 16,
  },
  timerCard: {
    margin: 20,
    alignItems: 'center',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timerLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  timerValue: {
    color: '#ffffff',
    fontSize: 56,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
    gap: 8,
  },
  quickButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementItem: {
    width: 280,
    marginRight: 12,
  },
  emptyState: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default HomeScreen;