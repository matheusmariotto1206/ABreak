import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

const ACHIEVEMENTS_KEY = '@abreak_achievements';

const defaultAchievements: Achievement[] = [
  {
    id: 'first_break',
    title: 'Primeira Pausa',
    description: 'Registre sua primeira pausa',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'ten_breaks',
    title: 'Dedicado',
    description: 'Registre 10 pausas',
    icon: '💪',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'fifty_breaks',
    title: 'Mestre do Autocuidado',
    description: 'Registre 50 pausas',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'hundred_breaks',
    title: 'Lendário',
    description: 'Registre 100 pausas',
    icon: '👑',
    unlocked: false,
    progress: 0,
    target: 100,
  },
  {
    id: 'streak_7',
    title: 'Sequência de Fogo',
    description: 'Faça pausas por 7 dias seguidos',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: 'ten_in_day',
    title: 'Produtivo',
    description: 'Faça 10 pausas em um dia',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    target: 10,
  },
];

export const achievementService = {
  async getAchievements(): Promise<Achievement[]> {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
      return defaultAchievements;
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
      return defaultAchievements;
    }
  },

  async updateAchievements(totalBreaks: number, todayBreaks: number): Promise<Achievement[]> {
    try {
      const achievements = await this.getAchievements();

      const updated = achievements.map((achievement) => {
        if (achievement.unlocked) return achievement;

        let newProgress = achievement.progress;
        let unlocked = false;

        switch (achievement.id) {
          case 'first_break':
            newProgress = totalBreaks;
            unlocked = totalBreaks >= 1;
            break;
          case 'ten_breaks':
            newProgress = totalBreaks;
            unlocked = totalBreaks >= 10;
            break;
          case 'fifty_breaks':
            newProgress = totalBreaks;
            unlocked = totalBreaks >= 50;
            break;
          case 'hundred_breaks':
            newProgress = totalBreaks;
            unlocked = totalBreaks >= 100;
            break;
          case 'ten_in_day':
            newProgress = todayBreaks;
            unlocked = todayBreaks >= 10;
            break;
        }

        return {
          ...achievement,
          progress: newProgress,
          unlocked,
        };
      });

      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar conquistas:', error);
      return await this.getAchievements();
    }
  },

  async resetAchievements(): Promise<void> {
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
  },
};