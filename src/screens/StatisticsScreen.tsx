import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { breakService, translateBreakType } from '../services/api';
import { BreakType, BreakDTO } from '../types';
import { PieChart, BarChart } from 'react-native-chart-kit';

type StatisticsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Statistics'>;
  route: RouteProp<RootStackParamList, 'Statistics'>;
};

interface Stats {
  total: number;
  totalMinutes: number;
  byType: Record<BreakType, number>;
  averagePerDay: number;
}

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ route }) => {
  const { userId } = route.params;
  const theme = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    totalMinutes: 0,
    byType: {
      ALONGAMENTO: 0,
      HIDRATACAO: 0,
      DESCANSO_VISUAL: 0,
    },
    averagePerDay: 0,
  });
  const [last7DaysData, setLast7DaysData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [userId])
  );

  const calculateAveragePerDay = (breaks: BreakDTO[]): number => {
    if (breaks.length === 0) return 0;
    
    const dateSet = new Set<string>();
    breaks.forEach(breakItem => {
      const date = new Date().toDateString();
      dateSet.add(date);
    });
    
    const daysWithBreaks = dateSet.size;
    const average = breaks.length / daysWithBreaks;
    
    return Math.round(average * 10) / 10;
  };

  const getLast7DaysData = (breaks: BreakDTO[]): number[] => {
    const last7Days: number[] = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    breaks.forEach(breakItem => {
      const breakDate = new Date();
      breakDate.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - breakDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < 7) {
        last7Days[6 - diffDays]++;
      }
    });
    
    return last7Days;
  };

  const getLast7DaysLabels = (): string[] => {
    const labels: string[] = [];
    const today = new Date();
    const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayIndex = date.getDay();
      labels.push(daysOfWeek[dayIndex]);
    }
    
    return labels;
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await breakService.getUserBreaks(userId, 0, 100);
      const breaks = response.content;

      const totalMinutes = breaks.reduce((acc, b) => {
        const match = b.durationFormatted.match(/(\d+)\s*min/);
        return acc + (match ? parseInt(match[1]) : 0);
      }, 0);

      const byType: Record<BreakType, number> = {
        ALONGAMENTO: 0,
        HIDRATACAO: 0,
        DESCANSO_VISUAL: 0,
      };

      breaks.forEach((b) => {
        byType[b.breakType]++;
      });

      setStats({
        total: breaks.length,
        totalMinutes,
        byType,
        averagePerDay: calculateAveragePerDay(breaks),
      });
      
      setLast7DaysData(getLast7DaysData(breaks));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const mostFrequent = Object.entries(stats.byType).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  const pieData = [
    {
      name: 'Alongamento',
      population: stats.byType.ALONGAMENTO,
      color: '#9B59B6',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Hidratação',
      population: stats.byType.HIDRATACAO,
      color: '#3498DB',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Descanso Visual',
      population: stats.byType.DESCANSO_VISUAL,
      color: '#E67E22',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ];

  const barData = {
    labels: getLast7DaysLabels(),
    datasets: [
      {
        data: last7DaysData.length > 0 ? last7DaysData : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.mainCard, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.mainNumber}>{stats.total}</Text>
        <Text style={styles.mainLabel}>Total de Pausas</Text>
      </View>

      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.summaryNumber, { color: theme.colors.text }]}>{stats.totalMinutes}</Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.textLight }]}>Minutos Totais</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.summaryNumber, { color: theme.colors.text }]}>{stats.averagePerDay}</Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.textLight }]}>Média/Dia</Text>
        </View>
      </View>

      {stats.total > 0 && (
        <>
          <View style={[styles.chartSection, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>📊 Distribuição por Tipo</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </View>

          <View style={[styles.chartSection, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>📈 Últimos 7 Dias</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={barData}
                width={screenWidth - 32}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                style={styles.barChart}
                showValuesOnTopOfBars
                fromZero
              />
            </View>
          </View>
        </>
      )}

      <View style={[styles.highlightCard, { backgroundColor: theme.colors.secondary }]}>
        <Text style={styles.highlightIcon}>🏆</Text>
        <Text style={styles.highlightTitle}>Tipo Mais Frequente</Text>
        <Text style={styles.highlightValue}>
          {translateBreakType(mostFrequent[0] as BreakType)}
        </Text>
        <Text style={styles.highlightCount}>
          {mostFrequent[1]} pausas realizadas
        </Text>
      </View>

      <View style={[styles.motivationCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.motivationText, { color: theme.colors.text }]}>
          {stats.total === 0 && '💪 Comece sua jornada de bem-estar!'}
          {stats.total > 0 && stats.total < 10 && '🌱 Ótimo começo! Continue assim!'}
          {stats.total >= 10 && stats.total < 50 && '🚀 Você está no caminho certo!'}
          {stats.total >= 50 && '⭐ Parabéns! Você é um exemplo de autocuidado!'}
        </Text>
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
  mainCard: {
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  mainNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  chartSection: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  barChart: {
    borderRadius: 12,
  },
  highlightCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  highlightIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  highlightCount: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  motivationCard: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  motivationText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default StatisticsScreen;