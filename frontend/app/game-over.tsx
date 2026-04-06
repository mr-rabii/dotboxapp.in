import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONTS, getPlayerColor } from '@/src/constants/theme';
import { playUISound } from '@/src/utils/sounds';
import MenuButton from '@/src/components/MenuButton';
import { Player } from '@/src/engine/gameLogic';
import { Difficulty } from '@/src/engine/aiPlayer';

export default function GameOverScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    score1: string;
    score2: string;
    player1: string;
    player2: string;
    winner: string;
    mode: string;
    gridSize: string;
    difficulty: string;
  }>();

  const score1 = parseInt(params.score1 || '0', 10);
  const score2 = parseInt(params.score2 || '0', 10);
  const player1 = params.player1 || 'PLAYER 1';
  const player2 = params.player2 || 'PLAYER 2';
  const winner = parseInt(params.winner || '0', 10) as Player | 0;
  const mode = params.mode || 'local';
  const gridSize = params.gridSize || '5';
  const difficulty = params.difficulty || 'easy';

  const winnerName = winner === 0 ? "IT'S A TIE!" : winner === 1 ? `${player1} WINS!` : `${player2} WINS!`;
  const winnerColor = winner === 0 ? COLORS.accent : getPlayerColor(winner as Player);

  const trophyOp = useSharedValue(0);
  const trophyScale = useSharedValue(0.3);
  const nameOp = useSharedValue(0);
  const nameY = useSharedValue(20);
  const scoreOp = useSharedValue(0);
  const btn1Op = useSharedValue(0);
  const btn2Op = useSharedValue(0);
  const glowPulse = useSharedValue(0.6);

  useEffect(() => {
    trophyOp.value = withDelay(200, withTiming(1, { duration: 500 }));
    trophyScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 100 }));
    nameOp.value = withDelay(500, withTiming(1, { duration: 500 }));
    nameY.value = withDelay(500, withSpring(0, { damping: 15 }));
    scoreOp.value = withDelay(700, withTiming(1, { duration: 500 }));
    btn1Op.value = withDelay(1000, withTiming(1, { duration: 400 }));
    btn2Op.value = withDelay(1150, withTiming(1, { duration: 400 }));
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.6, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    opacity: trophyOp.value,
    transform: [{ scale: trophyScale.value }],
  }));
  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOp.value,
    transform: [{ translateY: nameY.value }],
  }));
  const scoreStyle = useAnimatedStyle(() => ({ opacity: scoreOp.value }));
  const btn1Style = useAnimatedStyle(() => ({ opacity: btn1Op.value }));
  const btn2Style = useAnimatedStyle(() => ({ opacity: btn2Op.value }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowPulse.value }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.bgGlow,
          { backgroundColor: winnerColor + '08', pointerEvents: 'none' },
          glowStyle,
        ]}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.trophyContainer, trophyStyle]}>
          <Text style={styles.trophyEmoji}>{winner === 0 ? '🤝' : '🏆'}</Text>
        </Animated.View>

        <Animated.Text style={[styles.winnerName, { color: winnerColor }, nameStyle]}>
          {winnerName}
        </Animated.Text>

        <Animated.View style={[styles.scoreCard, scoreStyle]}>
          <View style={styles.scoreRow}>
            <View style={styles.scorePlayer}>
              <Text style={[styles.playerLabel, { color: COLORS.player1 }]}>{player1}</Text>
              <Text style={[styles.scoreValue, { color: COLORS.player1 }]}>{score1}</Text>
            </View>
            <View style={styles.scoreDivider}>
              <Text style={styles.scoreDash}>—</Text>
            </View>
            <View style={styles.scorePlayer}>
              <Text style={[styles.playerLabel, { color: COLORS.player2 }]}>{player2}</Text>
              <Text style={[styles.scoreValue, { color: COLORS.player2 }]}>{score2}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <Animated.View style={btn1Style}>
            <MenuButton
              testID="btn-play-again"
              title="PLAY AGAIN"
              color={COLORS.player1}
              onPress={() => {
                playUISound();
                router.replace({
                  pathname: '/game',
                  params: { mode, gridSize, difficulty },
                });
              }}
            />
          </Animated.View>

          <Animated.View style={btn2Style}>
            <MenuButton
              testID="btn-main-menu"
              title="MAIN MENU"
              color={COLORS.textSecondary}
              onPress={() => {
                playUISound();
                router.dismissAll();
              }}
            />
          </Animated.View>
        </View>
      </View>

      <Text style={styles.footerDev}>developed by Zero Dice Technologies</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  bgGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 200,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  trophyContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyEmoji: {
    fontSize: 48,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scorePlayer: {
    alignItems: 'center',
    gap: 8,
  },
  playerLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: '900',
    fontFamily: FONTS.mono,
  },
  scoreDivider: {
    paddingHorizontal: 12,
  },
  scoreDash: {
    fontSize: 24,
    color: COLORS.textMuted,
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  footerDev: {
    textAlign: 'center',
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    opacity: 0.6,
    paddingBottom: 16,
  },
});
