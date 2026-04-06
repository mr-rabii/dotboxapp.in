import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getPlayerColor, FONTS } from '@/src/constants/theme';
import { GameState, createGameState, makeMove, getWinner, LineType } from '@/src/engine/gameLogic';
import { getAIMove, Difficulty } from '@/src/engine/aiPlayer';
import { playLineSound, playCaptureSound, playGameOverSound, playUISound } from '@/src/utils/sounds';
import GameBoard from '@/src/components/GameBoard';
import ScorePanel from '@/src/components/ScorePanel';
import ExitDialog from '@/src/components/ExitDialog';
import Tutorial, { isTutorialDone } from '@/src/components/Tutorial';

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode: string;
    gridSize: string;
    difficulty: string;
    shapeMode: string;
  }>();

  const mode = (params.mode || 'local') as 'local' | 'ai';
  const gridSize = parseInt(params.gridSize || '5', 10);
  const difficulty = (params.difficulty || 'easy') as Difficulty;
  const isAI = mode === 'ai';

  const player1Name = isAI ? 'YOU' : 'PLAYER 1';
  const player2Name = isAI ? 'AI BOT' : 'PLAYER 2';

  const [gameState, setGameState] = useState<GameState>(() => createGameState(gridSize));
  const [isThinking, setIsThinking] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Check tutorial on mount
  useEffect(() => {
    isTutorialDone().then((done) => {
      if (!done) setShowTutorial(true);
    });
  }, []);

  // Android back button handler
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showTutorial) return true;
      if (!gameState.gameOver && !navigating) {
        setShowExitDialog(true);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [gameState.gameOver, navigating, showTutorial]);

  // Thinking dots animation
  const thinkDot = useSharedValue(0);
  useEffect(() => {
    if (isThinking) {
      thinkDot.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      );
    }
  }, [isThinking]);

  const thinkStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + thinkDot.value * 0.6,
  }));

  const handleLinePress = useCallback((type: LineType, row: number, col: number) => {
    if (gameState.gameOver || navigating || showTutorial) return;
    if (isAI && gameState.currentPlayer === 2) return;

    const newState = makeMove(gameState, { type, row, col });
    if (!newState) return;

    if (newState.newBoxes.length > 0) {
      playCaptureSound();
    } else {
      playLineSound();
    }

    setGameState(newState);
  }, [gameState, isAI, navigating, showTutorial]);

  // AI move
  useEffect(() => {
    if (!isAI || gameState.currentPlayer !== 2 || gameState.gameOver || navigating || showTutorial) {
      setIsThinking(false);
      return;
    }

    setIsThinking(true);
    const delay = 500 + Math.random() * 500;
    const timer = setTimeout(() => {
      const move = getAIMove(gameState, difficulty);
      if (move) {
        const newState = makeMove(gameState, move);
        if (newState) {
          if (newState.newBoxes.length > 0) playCaptureSound();
          else playLineSound();
          setGameState(newState);
        }
      }
      setIsThinking(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [gameState, isAI, difficulty, navigating, showTutorial]);

  // Game over navigation
  useEffect(() => {
    if (gameState.gameOver && !navigating) {
      setNavigating(true);
      playGameOverSound();
      const timer = setTimeout(() => {
        const winner = getWinner(gameState);
        router.replace({
          pathname: '/game-over',
          params: {
            score1: gameState.scores[0].toString(),
            score2: gameState.scores[1].toString(),
            player1: player1Name,
            player2: player2Name,
            winner: winner.toString(),
            mode,
            gridSize: gridSize.toString(),
            difficulty,
          },
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameOver]);

  const currentColor = getPlayerColor(gameState.currentPlayer);
  const currentName = gameState.currentPlayer === 1 ? player1Name : player2Name;
  const totalBoxes = (gridSize - 1) * (gridSize - 1);
  const filledBoxes = gameState.scores[0] + gameState.scores[1];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          testID="btn-back"
          onPress={() => {
            if (!gameState.gameOver && !navigating) {
              setShowExitDialog(true);
            } else {
              router.back();
            }
          }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {mode === 'ai' ? `VS AI · ${difficulty.toUpperCase()}` : 'LOCAL MATCH'}
          </Text>
          <Text style={styles.headerSub}>{filledBoxes}/{totalBoxes} boxes</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Score Panel */}
      <View style={styles.scoreContainer}>
        <ScorePanel
          scores={gameState.scores}
          currentPlayer={gameState.currentPlayer}
          player1Name={player1Name}
          player2Name={player2Name}
          gameOver={gameState.gameOver}
        />
      </View>

      {/* Game Board */}
      <View style={styles.boardArea}>
        <GameBoard
          gameState={gameState}
          onLinePress={handleLinePress}
          disabled={gameState.gameOver || (isAI && gameState.currentPlayer === 2) || showTutorial}
        />
      </View>

      {/* Turn Indicator */}
      <View style={styles.turnContainer}>
        {gameState.gameOver ? (
          <Text style={styles.gameOverText}>GAME OVER</Text>
        ) : isThinking ? (
          <Animated.View style={[styles.turnRow, thinkStyle]}>
            <Ionicons name="hardware-chip-outline" size={18} color={COLORS.player2} />
            <Text style={[styles.turnText, { color: COLORS.player2 }]}>AI is thinking...</Text>
          </Animated.View>
        ) : (
          <View style={styles.turnRow}>
            <View style={[styles.turnDot, { backgroundColor: currentColor }]} />
            <Text style={[styles.turnText, { color: currentColor }]}>
              {currentName}'S TURN
            </Text>
          </View>
        )}
      </View>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <Tutorial onComplete={() => setShowTutorial(false)} />
      )}

      {/* Exit Dialog */}
      <ExitDialog
        visible={showExitDialog}
        onExit={() => {
          setShowExitDialog(false);
          playUISound();
          router.back();
        }}
        onContinue={() => {
          setShowExitDialog(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 2,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
    marginTop: 2,
  },
  scoreContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 8,
  },
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  turnDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  turnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  gameOverText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: 4,
  },
});
