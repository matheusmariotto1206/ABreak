import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppTheme } from '../hooks/useAppTheme';

import HomeScreen from '../screens/HomeScreen';
import BreakListScreen from '../screens/BreakListScreen';
import BreakDetailScreen from '../screens/BreakDetailScreen';
import AddBreakScreen from '../screens/AddBreakScreen';
import EditBreakScreen from '../screens/EditBreakScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserSelectionScreen from '../screens/UserSelectionScreen';

export type RootStackParamList = {
  UserSelection: undefined;
  Home: { userId: number };
  BreakList: { userId: number };
  BreakDetail: { breakId: number };
  AddBreak: { userId: number };
  EditBreak: { breakId: number; userId: number };
  Statistics: { userId: number };
  Settings: { userId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const theme = useAppTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="UserSelection"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          cardStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="UserSelection"
          component={UserSelectionScreen}
          options={{
            title: 'Bem-vindo ao ABreak',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '🏠 ABreak',
          }}
        />

        <Stack.Screen
          name="BreakList"
          component={BreakListScreen}
          options={{
            title: '📋 Minhas Pausas',
          }}
        />

        <Stack.Screen
          name="BreakDetail"
          component={BreakDetailScreen}
          options={{
            title: '🔍 Detalhes da Pausa',
          }}
        />

        <Stack.Screen
          name="AddBreak"
          component={AddBreakScreen}
          options={{
            title: '➕ Nova Pausa',
          }}
        />

        <Stack.Screen
          name="EditBreak"
          component={EditBreakScreen}
          options={{
            title: '✏️ Editar Pausa',
          }}
        />

        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            title: '📊 Estatísticas',
          }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: '⚙️ Configurações',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;