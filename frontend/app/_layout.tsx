import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SettingsProvider } from '@/src/context/SettingsContext';
import { COLORS } from '@/src/constants/theme';
import SplashAnimation from '@/src/components/SplashAnimation';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SettingsProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <StatusBar style="light" />
        {showSplash ? (
          <SplashAnimation onComplete={() => setShowSplash(false)} />
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.bg },
              animation: 'fade',
            }}
          />
        )}
      </View>
    </SettingsProvider>
  );
}
