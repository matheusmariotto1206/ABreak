import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { BreakDTO } from '../types';

interface BreakCardProps {
  breakItem: BreakDTO;
  onPress: () => void;
}

const BreakCard: React.FC<BreakCardProps> = ({ breakItem, onPress }) => {
  const theme = useAppTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALONGAMENTO':
        return 'body-outline';
      case 'HIDRATACAO':
        return 'water-outline';
      case 'DESCANSO_VISUAL':
        return 'eye-outline';
      default:
        return 'pause-circle-outline';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'ALONGAMENTO':
        return theme.colors.stretching;
      case 'HIDRATACAO':
        return theme.colors.hydration;
      case 'DESCANSO_VISUAL':
        return theme.colors.visual;
      default:
        return theme.colors.primary;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'ALONGAMENTO':
        return 'Alongamento';
      case 'HIDRATACAO':
        return 'Hidratação';
      case 'DESCANSO_VISUAL':
        return 'Descanso Visual';
      default:
        return type;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getColor(breakItem.breakType) + '20' }]}>
        <Ionicons name={getIcon(breakItem.breakType) as any} size={28} color={getColor(breakItem.breakType)} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {getLabel(breakItem.breakType)}
        </Text>
        <View style={styles.footer}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={14} color={theme.colors.textLight} />
            <Text style={[styles.userName, { color: theme.colors.textLight }]}>
              {breakItem.user.name}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.duration, { color: theme.colors.primary }]}>
          {breakItem.durationFormatted}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 13,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BreakCard;