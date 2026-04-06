import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '@/src/constants/theme';
import { useSettings } from '@/src/context/SettingsContext';
import { playUISound } from '@/src/utils/sounds';
import MenuButton from '@/src/components/MenuButton';
import { Difficulty } from '@/src/engine/aiPlayer';

export default function HomeScreen() {
  const router = useRouter();
  const { gridSize } = useSettings();
  const [showDifficulty, setShowDifficulty] = useState(false);

  // Staggered entrance animations
  const titleOp = useSharedValue(0);
  const titleY = useSharedValue(30);
  const subOp = useSharedValue(0);
  const btn1Op = useSharedValue(0);
  const btn1Y = useSharedValue(20);
  const btn2Op = useSharedValue(0);
  const btn2Y = useSharedValue(20);
  const settingsOp = useSharedValue(0);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    titleOp.value = withDelay(100, withTiming(1, { duration: 600 }));
    titleY.value = withDelay(100, withSpring(0, { damping: 15 }));
    subOp.value = withDelay(300, withTiming(1, { duration: 600 }));
    btn1Op.value = withDelay(500, withTiming(1, { duration: 500 }));
    btn1Y.value = withDelay(500, withSpring(0, { damping: 15 }));
    btn2Op.value = withDelay(650, withTiming(1, { duration: 500 }));
    btn2Y.value = withDelay(650, withSpring(0, { damping: 15 }));
    settingsOp.value = withDelay(800, withTiming(1, { duration: 500 }));

    // Subtle pulsing glow on title
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOp.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOp.value }));
  const btn1Style = useAnimatedStyle(() => ({
    opacity: btn1Op.value,
    transform: [{ translateY: btn1Y.value }],
  }));
  const btn2Style = useAnimatedStyle(() => ({
    opacity: btn2Op.value,
    transform: [{ translateY: btn2Y.value }],
  }));
  const settingsStyle = useAnimatedStyle(() => ({ opacity: settingsOp.value }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const startGame = (mode: 'local' | 'ai', difficulty?: Difficulty) => {
    playUISound();
    router.push({
      pathname: '/game',
      params: { mode, gridSize: gridSize.toString(), difficulty: difficulty || 'easy' },
    });
  };

  const difficultyOptions: { label: string; value: Difficulty; color: string }[] = [
    { label: 'EASY', value: 'easy', color: '#4ADE80' },
    { label: 'MEDIUM', value: 'medium', color: '#FBBF24' },
    { label: 'HARD', value: 'hard', color: '#EF4444' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background decorative dots */}
      <View style={styles.bgDots}>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <View
              key={`bg-${r}-${c}`}
              style={[
                styles.bgDot,
                {
                  left: `${15 + c * 23}%`,
                  top: `${10 + r * 20}%`,
                },
              ]}
            />
          ))
        )}
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Animated.View style={glowStyle}>
            <Text style={styles.title}>NEON</Text>
            <Text style={styles.titleAccent}>CONNECT</Text>
          </Animated.View>
        </Animated.View>

        <Animated.Text style={[styles.subtitle, subStyle]}>
          DOTS & BOXES
        </Animated.Text>

        {/* Menu Buttons */}
        <View style={styles.buttonsContainer}>
          <Animated.View style={btn1Style}>
            <MenuButton
              testID="btn-local-multiplayer"
              title="LOCAL MULTIPLAYER"
              color={COLORS.player1}
              onPress={() => {
                setShowDifficulty(false);
                startGame('local');
              }}
            />
          </Animated.View>

          <Animated.View style={btn2Style}>
            <MenuButton
              testID="btn-vs-computer"
              title="VS COMPUTER"
              color={COLORS.player2}
              onPress={() => {
                playUISound();
                setShowDifficulty(!showDifficulty);
              }}
            />
          </Animated.View>

          {/* Difficulty Selection */}
          {showDifficulty && (
            <View style={styles.difficultyContainer}>
              {difficultyOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  testID={`btn-difficulty-${opt.value}`}
                  onPress={() => startGame('ai', opt.value)}
                  style={[styles.difficultyBtn, { borderColor: opt.color + '50' }]}
                >
                  <Text style={[styles.difficultyText, { color: opt.color }]}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Settings */}
        <Animated.View style={settingsStyle}>
          <Pressable
            testID="btn-settings"
            onPress={() => {
              playUISound();
              router.push('/settings');
            }}
            style={styles.settingsBtn}
          >
            <Ionicons name="settings-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.settingsText}>SETTINGS</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Grid size indicator */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Grid: {gridSize}×{gridSize}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  bgDots: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    pointerEvents: 'none',
  },
  bgDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 8,
    textAlign: 'center',
  },
  titleAccent: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.player1,
    letterSpacing: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 6,
    marginBottom: 40,
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 16,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  difficultyBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 32,
  },
  settingsText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
  },
});
