import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SettingsProvider } from '@/src/context/SettingsContext';
import { COLORS } from '@/src/constants/theme';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.bg },
            animation: 'fade',
          }}
        />
      </View>
    </SettingsProvider>
  );
}
