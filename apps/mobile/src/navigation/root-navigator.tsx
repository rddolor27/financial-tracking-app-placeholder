import React from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '@financial-tracker/store';
import { useThemeColors } from '../lib/use-theme';
import { HomeScreen } from '../screens/home-screen';
import { AccountsScreen } from '../screens/accounts-screen';
import { TransactionsScreen } from '../screens/transactions-screen';
import { BudgetsScreen } from '../screens/budgets-screen';
import { SettingsScreen } from '../screens/settings-screen';
import { GoalsScreen } from '../screens/goals-screen';
import { BillsScreen } from '../screens/bills-screen';
import { InvestmentsScreen } from '../screens/investments-screen';
import { LoginScreen } from '../screens/auth/login-screen';
import { RegisterScreen } from '../screens/auth/register-screen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Accounts: undefined;
  Transactions: undefined;
  Budgets: undefined;
  Settings: undefined;
};

export type MainStackParamList = MainTabParamList & {
  Goals: undefined;
  Bills: undefined;
  Investments: undefined;
};

export type RootStackParamList = AuthStackParamList & MainStackParamList;

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

const TAB_GLYPHS: Record<string, string> = {
  Home: '◧',
  Accounts: '▦',
  Transactions: '⇄',
  Budgets: '◔',
  Settings: '⚙',
};

function TabNavigator() {
  const { colors } = useThemeColors();
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 18 }}>{TAB_GLYPHS[route.name] ?? '•'}</Text>
        ),
      })}
    >
      <MainTab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <MainTab.Screen name="Accounts" component={AccountsScreen} options={{ tabBarLabel: 'Accounts' }} />
      <MainTab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: 'Activity' }} />
      <MainTab.Screen name="Budgets" component={BudgetsScreen} options={{ tabBarLabel: 'Budgets' }} />
      <MainTab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </MainTab.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: true }}>
      <MainStack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      <MainStack.Screen name="Goals" component={GoalsScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Bills" component={BillsScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Investments" component={InvestmentsScreen} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}
