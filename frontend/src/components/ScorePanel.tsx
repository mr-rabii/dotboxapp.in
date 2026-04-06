import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSpring, useSharedValue, withSequence } from 'react-native-reanimated';
import { COLORS, FONTS } from '@/src/constants/theme';
import { Player } from '@/src/engine/gameLogic';

interface Props {
  scores: [number, number];
  currentPlayer: Player;
  player1Name: string;
  player2Name: string;
  gameOver: boolean;
}

function PlayerScore({ name, score, color, isActive, testID }: {
  name: string; score: number; color: string; isActive: boolean; testID: string;
}) {
  const glowOpacity = useSharedValue(isActive ? 1 : 0.4);
  const scoreScale = useSharedValue(1);

  React.useEffect(() => {
    glowOpacity.value = withTiming(isActive ? 1 : 0.4, { duration: 300 });
  }, [isActive]);

  React.useEffect(() => {
    scoreScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
  }, [score]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <Animated.View testID={testID} style={[styles.playerContainer, containerStyle]}>
      <Text style={[styles.playerName, { color }]} numberOfLines={1}>{name}</Text>
      <Animated.Text style={[styles.scoreText, { color }, scoreStyle]}>{score}</Animated.Text>
      {isActive && <View style={[styles.activeBar, { backgroundColor: color }]} />}
    </Animated.View>
  );
}

export default function ScorePanel({ scores, currentPlayer, player1Name, player2Name, gameOver }: Props) {
  return (
    <View testID="score-panel" style={styles.container}>
      <PlayerScore
        name={player1Name}
        score={scores[0]}
        color={COLORS.player1}
        isActive={!gameOver && currentPlayer === 1}
        testID="player1-score"
      />
      <View style={styles.divider}>
        <Text style={styles.vs}>VS</Text>
      </View>
      <PlayerScore
        name={player2Name}
        score={scores[1]}
        color={COLORS.player2}
        isActive={!gameOver && currentPlayer === 2}
        testID="player2-score"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '900',
    fontFamily: FONTS.mono,
  },
  activeBar: {
    width: 24,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
  },
  divider: {
    paddingHorizontal: 12,
  },
  vs: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
});
