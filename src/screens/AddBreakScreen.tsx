import React, { useState } from 'react';
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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { breakService, minutesToSeconds } from '../services/api';
import { BreakType } from '../types';

type AddBreakScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddBreak'>;
  route: RouteProp<RootStackParamList, 'AddBreak'>;
};

interface BreakTypeOption {
  type: BreakType;
  label: string;
  icon: string;
  color: string;
}

const AddBreakScreen: React.FC<AddBreakScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const theme = useAppTheme();
  const [selectedType, setSelectedType] = useState<BreakType | null>(null);
  const [duration, setDuration] = useState('3');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Erro', 'Selecione o tipo de pausa');
      return;
    }

    const durationNum = parseInt(duration);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Erro', 'Insira uma duração válida (em minutos)');
      return;
    }

    if (durationNum > 3) {
      Alert.alert('Erro', 'A duração máxima é de 3 minutos');
      return;
    }

    try {
      setLoading(true);
      await breakService.create({
        userId,
        breakType: selectedType,
        durationSeconds: minutesToSeconds(durationNum),
      });

      Alert.alert('Sucesso! 🎉', 'Pausa registrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a pausa. Verifique se o usuário existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
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
              onPress={() => setSelectedType(option.type)}
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
              borderColor: theme.colors.gray300 
            }
          ]}
          placeholder="Ex: 3"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
          placeholderTextColor={theme.colors.gray400}
        />

        <View style={styles.quickDurations}>
          {[1, 2, 3].map((mins) => (
            <TouchableOpacity
              key={mins}
              style={[styles.quickButton, { backgroundColor: theme.colors.gray200 }]}
              onPress={() => setDuration(mins.toString())}
            >
              <Text style={[styles.quickButtonText, { color: theme.colors.text }]}>{mins} min</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.secondary },
            loading && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>✅ Registrar Pausa</Text>
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
  content: {
    padding: 16,
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

export default AddBreakScreen;