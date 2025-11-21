import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { breakService, minutesToSeconds } from '../services/api';
import { BreakType, BreakDTO } from '../types';

type EditBreakScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditBreak'>;
  route: RouteProp<RootStackParamList, 'EditBreak'>;
};

interface BreakTypeOption {
  type: BreakType;
  label: string;
  icon: string;
  color: string;
}

const EditBreakScreen: React.FC<EditBreakScreenProps> = ({ navigation, route }) => {
  const { breakId, userId } = route.params;
  const theme = useAppTheme();
  const [breakData, setBreakData] = useState<BreakDTO | null>(null);
  const [selectedType, setSelectedType] = useState<BreakType | null>(null);
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const breakTypes: BreakTypeOption[] = [
    {
      type: 'ALONGAMENTO',
      label: 'Alongamento',
      icon: '🧘',
      color: theme.colors.stretching,
    },
    {
      type: 'HIDRATACAO',
      label: 'Hidratação',
      icon: '💧',
      color: theme.colors.hydration,
    },
    {
      type: 'DESCANSO_VISUAL',
      label: 'Descanso Visual',
      icon: '👁️',
      color: theme.colors.visual,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      loadBreakData();
    }, [breakId])
  );

  const loadBreakData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await breakService.getById(breakId);
      setBreakData(data);
      setSelectedType(data.breakType);
      
      const match = data.durationFormatted.match(/(\d+)min/);
      const mins = match ? match[1] : '0';
      setDuration(mins);
      setRetryCount(0);
    } catch (err: any) {
      const errorMessage = err.message || 'Não foi possível carregar os dados da pausa';
      setError(errorMessage);
      Alert.alert(
        'Erro ao Carregar',
        errorMessage,
        [
          { text: 'Voltar', onPress: () => navigation.goBack() },
          { text: 'Tentar Novamente', onPress: loadBreakData }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = (): boolean => {
    setError(null);

    if (!selectedType) {
      setError('Selecione o tipo de pausa');
      return false;
    }

    const durationNum = parseInt(duration);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      setError('Insira uma duração válida (em minutos)');
      return false;
    }

    if (durationNum > 3) {
      setError('A duração máxima é de 3 minutos');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    const durationNum = parseInt(duration);

    try {
      setSaving(true);
      setError(null);

      await breakService.update(breakId, {
        userId,
        breakType: selectedType!,
        durationSeconds: minutesToSeconds(durationNum),
      });

      Alert.alert('Sucesso! 🎉', 'Pausa atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      const errorMessage = err.message || 'Não foi possível atualizar a pausa';
      setError(errorMessage);
      Alert.alert('Erro ao Atualizar', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>
          Carregando dados...
        </Text>
      </View>
    );
  }

  if (error && !breakData) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.errorCard, { backgroundColor: theme.colors.card }]}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            Erro ao Carregar
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textLight }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={loadBreakData}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '15' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              ⚠️ {error}
            </Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tipo de Pausa</Text>
        <View style={styles.typeGrid}>
          {breakTypes.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.typeCard,
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.gray300 
                },
                selectedType === option.type && {
                  backgroundColor: option.color,
                  borderColor: option.color,
                },
              ]}
              onPress={() => {
                setSelectedType(option.type);
                setError(null);
              }}
              disabled={saving}
            >
              <Text style={styles.typeIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  { color: theme.colors.text },
                  selectedType === option.type && styles.typeLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Duração (minutos)</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: error && !selectedType ? theme.colors.error : theme.colors.gray300
            }
          ]}
          placeholder="Ex: 3"
          keyboardType="numeric"
          value={duration}
          onChangeText={(text) => {
            setDuration(text);
            setError(null);
          }}
          placeholderTextColor={theme.colors.gray400}
          editable={!saving}
        />

        <View style={styles.quickDurations}>
          {[1, 2, 3].map((mins) => (
            <TouchableOpacity
              key={mins}
              style={[styles.quickButton, { backgroundColor: theme.colors.gray200 }]}
              onPress={() => {
                setDuration(mins.toString());
                setError(null);
              }}
              disabled={saving}
            >
              <Text style={[styles.quickButtonText, { color: theme.colors.text }]}>{mins} min</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
            saving && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>Salvando...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>💾 Salvar Alterações</Text>
          )}
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
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  typeIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  typeLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickDurations: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  quickButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditBreakScreen;