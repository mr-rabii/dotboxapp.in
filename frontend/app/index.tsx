import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Alert } from 'react-native';
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
import AnimatedBackground from '@/src/components/AnimatedBackground';
import { Difficulty } from '@/src/engine/aiPlayer';

type ShapeMode = 'square' | 'rectangle' | 'triangle';

const MODES: { key: ShapeMode; label: string; icon: string; available: boolean }[] = [
  { key: 'square', label: 'Square', icon: 'square-outline', available: true },
  { key: 'rectangle', label: 'Rectangle', icon: 'tablet-landscape-outline', available: false },
  { key: 'triangle', label: 'Triangle', icon: 'triangle-outline', available: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const { gridSize } = useSettings();
  const [selectedMode, setSelectedMode] = useState<ShapeMode>('square');
  const [showDifficulty, setShowDifficulty] = useState(false);

  // Entrance animations
  const titleOp = useSharedValue(0);
  const titleY = useSharedValue(25);
  const modeOp = useSharedValue(0);
  const btn1Op = useSharedValue(0);
  const btn1Y = useSharedValue(20);
  const btn2Op = useSharedValue(0);
  const btn2Y = useSharedValue(20);
  const footerOp = useSharedValue(0);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    titleOp.value = withDelay(100, withTiming(1, { duration: 600 }));
    titleY.value = withDelay(100, withSpring(0, { damping: 15 }));
    modeOp.value = withDelay(350, withTiming(1, { duration: 500 }));
    btn1Op.value = withDelay(550, withTiming(1, { duration: 500 }));
    btn1Y.value = withDelay(550, withSpring(0, { damping: 15 }));
    btn2Op.value = withDelay(700, withTiming(1, { duration: 500 }));
    btn2Y.value = withDelay(700, withSpring(0, { damping: 15 }));
    footerOp.value = withDelay(900, withTiming(1, { duration: 500 }));
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000 }),
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
  const modeStyle = useAnimatedStyle(() => ({ opacity: modeOp.value }));
  const btn1Style = useAnimatedStyle(() => ({
    opacity: btn1Op.value,
    transform: [{ translateY: btn1Y.value }],
  }));
  const btn2Style = useAnimatedStyle(() => ({
    opacity: btn2Op.value,
    transform: [{ translateY: btn2Y.value }],
  }));
  const footerStyle = useAnimatedStyle(() => ({ opacity: footerOp.value }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const startGame = (mode: 'local' | 'ai', difficulty?: Difficulty) => {
    if (selectedMode !== 'square') {
      Alert.alert('Coming Soon', `${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} mode is coming soon!`);
      return;
    }
    playUISound();
    router.push({
      pathname: '/game',
      params: { mode, gridSize: gridSize.toString(), difficulty: difficulty || 'easy', shapeMode: selectedMode },
    });
  };

  const difficultyOptions: { label: string; value: Difficulty; color: string }[] = [
    { label: 'EASY', value: 'easy', color: '#4ADE80' },
    { label: 'MEDIUM', value: 'medium', color: '#FBBF24' },
    { label: 'HARD', value: 'hard', color: '#EF4444' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Animated.View style={glowStyle}>
            <Text style={styles.title}>DotBox</Text>
          </Animated.View>
          <Text style={styles.tagline}>The Next Level Brain Game</Text>
        </Animated.View>

        {/* Mode Selection */}
        <Animated.View style={[styles.modeSection, modeStyle]}>
          <Text style={styles.sectionLabel}>SELECT MODE</Text>
          <View style={styles.modeRow}>
            {MODES.map((m) => {
              const isSelected = selectedMode === m.key;
              const color = isSelected ? COLORS.player1 : COLORS.textMuted;
              return (
                <Pressable
                  key={m.key}
                  testID={`mode-${m.key}`}
                  onPress={() => {
                    playUISound();
                    setSelectedMode(m.key);
                  }}
                  style={[
                    styles.modeCard,
                    isSelected && styles.modeCardActive,
                  ]}
                >
                  <Ionicons name={m.icon as any} size={28} color={color} />
                  <Text style={[styles.modeLabel, { color }]}>{m.label}</Text>
                  {!m.available && (
                    <View style={styles.soonBadge}>
                      <Text style={styles.soonText}>SOON</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Game Mode Buttons */}
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
        <Pressable
          testID="btn-settings"
          onPress={() => {
            playUISound();
            router.push('/settings');
          }}
          style={styles.settingsBtn}
        >
          <Ionicons name="settings-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.settingsText}>SETTINGS</Text>
        </Pressable>

        {/* Footer */}
        <Animated.View style={[styles.footer, footerStyle]}>
          <Text style={styles.footerGrid}>Grid: {gridSize}×{gridSize}</Text>
          <Text style={styles.footerDev}>developed by Zero Dice Technologies</Text>
        </Animated.View>
      </ScrollView>

      {/* Buy Me a Coffee floating button */}
      <Pressable
        testID="btn-coffee"
        onPress={() => Linking.openURL('https://razorpay.me/@zerodice')}
        style={styles.coffeeBtn}
      >
        <Text style={styles.coffeeIcon}>☕</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    flexGrow: 1,
    justifyContent: 'center',
    gap: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.player1,
    letterSpacing: 4,
    textShadow: `0 0 30px ${COLORS.player1Glow}`,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginBottom: 10,
  },
  modeSection: {
    alignItems: 'center',
    width: '100%',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  modeCardActive: {
    borderColor: COLORS.player1 + '50',
    backgroundColor: COLORS.player1 + '08',
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  soonBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.player2 + '25',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  soonText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.player2,
    letterSpacing: 0.5,
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 14,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
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
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  settingsText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerGrid: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
  },
  footerDev: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  coffeeBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  coffeeIcon: {
    fontSize: 22,
  },
});
