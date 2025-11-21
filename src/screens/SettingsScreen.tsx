import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { lightTheme, darkTheme } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { achievementService } from '../services/achievements';
import { breakService } from '../services/api';

type SettingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>;
  route: RouteProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair do aplicativo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => navigation.replace('UserSelection'),
      },
    ]);
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o ABreak',
      'ABreak - Monitor de Pausas Saudáveis\n\n' +
        'Versão: 1.0.0\n\n' +
        'Desenvolvido para a Global Solution 2025 da FIAP\n\n' +
        'Tema: O Futuro do Trabalho\n\n' +
        'Este aplicativo ajuda trabalhadores a manter pausas regulares para melhorar o bem-estar e a produtividade.',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Ajuda',
      'Como usar o ABreak:\n\n' +
        '1. Registre suas pausas manualmente\n' +
        '2. Acompanhe suas estatísticas\n' +
        '3. Mantenha uma rotina saudável de pausas\n\n' +
        'Tipos de pausas:\n' +
        '🧘 Alongamento: Movimente o corpo\n' +
        '💧 Hidratação: Beba água\n' +
        '👁️ Visual: Descanse os olhos',
      [{ text: 'Entendi' }]
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
    Alert.alert(
      isDarkMode ? 'Modo Claro Ativado ☀️' : 'Modo Escuro Ativado 🌙',
      'O tema foi alterado com sucesso!'
    );
  };

  const handleResetAll = async () => {
    Alert.alert(
      '⚠️ RESETAR TUDO',
      'Tem certeza que deseja RESETAR TUDO?\n\n🗑️ Todas as pausas serão DELETADAS do banco de dados\n🏆 Todas as conquistas serão resetadas\n\n⚠️ Esta ação NÃO pode ser desfeita!',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        {
          text: 'RESETAR TUDO',
          style: 'destructive',
          onPress: async () => {
            try {
              // Buscar todas as pausas do usuário (máximo 1000)
              const response = await breakService.getUserBreaks(userId, 0, 1000);
              const allBreaks = response.content;
              
              if (allBreaks.length === 0) {
                // Se não há pausas, apenas reseta as conquistas
                await achievementService.resetAchievements();
                Alert.alert(
                  '✅ Concluído', 
                  'Conquistas resetadas com sucesso!\n\nNão havia pausas para deletar.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('Home', { userId })
                    }
                  ]
                );
                return;
              }

              // Deletar cada pausa
              let deletedCount = 0;
              let errorCount = 0;

              for (const breakItem of allBreaks) {
                try {
                  await breakService.delete(breakItem.id);
                  deletedCount++;
                } catch (error) {
                  errorCount++;
                  console.error(`Erro ao deletar pausa ${breakItem.id}:`, error);
                }
              }

              // Resetar as conquistas
              await achievementService.resetAchievements();
              
              Alert.alert(
                '✅ Tudo Resetado!', 
                `🗑️ ${deletedCount} pausa(s) deletada(s)\n🏆 Conquistas resetadas${errorCount > 0 ? `\n\n❌ ${errorCount} erro(s) encontrado(s)` : ''}`,
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home', { userId })
                  }
                ]
              );
            } catch (error) {
              console.error('Erro ao resetar:', error);
              Alert.alert('Erro', 'Não foi possível resetar. Verifique sua conexão com o servidor.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.userCard, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.userIcon}>👤</Text>
        <Text style={styles.userId}>Usuário ID: {userId}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textLight }]}>
          APARÊNCIA
        </Text>
        
        <View style={[styles.option, { borderBottomColor: theme.colors.gray200 }]}>
          <Text style={styles.optionIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Modo Escuro
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textLight }]}>
              {isDarkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            trackColor={{ false: theme.colors.gray300, true: theme.colors.primary }}
            thumbColor={theme.colors.textWhite}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textLight }]}>
          DADOS
        </Text>
        
        <TouchableOpacity 
          style={[styles.option, { borderBottomColor: 'transparent' }]} 
          onPress={handleResetAll}
        >
          <Text style={styles.optionIcon}>🔄</Text>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: theme.colors.error }]}>
              Resetar Tudo
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textLight }]}>
              ⚠️ Deleta todas as pausas e reseta conquistas
            </Text>
          </View>
          <Text style={[styles.optionArrow, { color: theme.colors.gray400 }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textLight }]}>
          GERAL
        </Text>
        
        <TouchableOpacity 
          style={[styles.option, { borderBottomColor: theme.colors.gray200 }]} 
          onPress={handleHelp}
        >
          <Text style={styles.optionIcon}>❓</Text>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Ajuda
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textLight }]}>
              Como usar o aplicativo
            </Text>
          </View>
          <Text style={[styles.optionArrow, { color: theme.colors.gray400 }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.option, { borderBottomColor: 'transparent' }]} 
          onPress={handleAbout}
        >
          <Text style={styles.optionIcon}>ℹ️</Text>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Sobre
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textLight }]}>
              Informações do aplicativo
            </Text>
          </View>
          <Text style={[styles.optionArrow, { color: theme.colors.gray400 }]}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪 Trocar de Usuário</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textLight }]}>
          FIAP - Global Solution 2025
        </Text>
        <Text style={[styles.footerSubtext, { color: theme.colors.textLight }]}>
          O Futuro do Trabalho
        </Text>
        <Text style={[styles.footerVersion, { color: theme.colors.gray400 }]}>
          v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userCard: {
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
  userIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  userId: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
  },
  optionArrow: {
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  footerVersion: {
    fontSize: 12,
    marginTop: 8,
  },
});

export default SettingsScreen;