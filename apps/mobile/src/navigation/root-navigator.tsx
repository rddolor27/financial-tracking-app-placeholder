import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '@financial-tracker/store';
import { HomeScreen } from '../screens/home-screen';
import { AccountsScreen } from '../screens/accounts-screen';
import { TransactionsScreen } from '../screens/transactions-screen';
import { BudgetsScreen } from '../screens/budgets-screen';
import { SettingsScreen } from '../screens/settings-screen';
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

export type RootStackParamList = AuthStackParamList & MainTabParamList;

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 4, height: 56 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <MainTab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <MainTab.Screen name="Accounts" component={AccountsScreen} options={{ tabBarLabel: 'Accounts' }} />
      <MainTab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: 'Transactions' }} />
      <MainTab.Screen name="Budgets" component={BudgetsScreen} options={{ tabBarLabel: 'Budgets' }} />
      <MainTab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </MainTab.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}
