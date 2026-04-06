import React, { useEffect, useRef } from 'react';
import { View, Pressable, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, getPlayerColor, getPlayerFill } from '@/src/constants/theme';
import { GameState, Player } from '@/src/engine/gameLogic';

interface Props {
  gameState: GameState;
  onLinePress: (type: 'h' | 'v', row: number, col: number) => void;
  disabled: boolean;
}

// Animated line that scales in when first appearing
function NewLine({ isHorizontal, color }: { isHorizontal: boolean; color: string }) {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: isHorizontal
      ? [{ scaleX: scale.value }]
      : [{ scaleY: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        { flex: 1, borderRadius: 4, backgroundColor: color },
        style,
      ]}
    />
  );
}

// Animated box fill on capture
function NewBox({ player }: { player: Player }) {
  const opacity = useSharedValue(0);
  const boxScale = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 350 });
    boxScale.value = withSpring(1, { damping: 10, stiffness: 160 });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: boxScale.value }],
  }));

  const color = getPlayerColor(player);
  const fill = getPlayerFill(player);

  return (
    <Animated.View style={[styles.boxInner, { backgroundColor: fill, borderColor: color + '30' }, style]}>
      <Text style={[styles.boxText, { color }]}>{player}</Text>
    </Animated.View>
  );
}

export default function GameBoard({ gameState, onLinePress, disabled }: Props) {
  const { width } = useWindowDimensions();
  const n = gameState.gridSize;
  const BOARD_PAD = 18;
  const availWidth = Math.min(width - 48, 400);
  const innerSize = availWidth - 2 * BOARD_PAD;
  const cellSize = innerSize / (n - 1);
  const dotSize = Math.max(10, Math.min(16, cellSize * 0.2));
  const lineThick = Math.max(5, Math.min(9, cellSize * 0.12));
  const touchPad = Math.max(28, cellSize * 0.38);

  // Track which boxes have been animated
  const animatedBoxes = useRef(new Set<string>()).current;

  const isLastH = (r: number, c: number) =>
    gameState.lastMove?.type === 'h' && gameState.lastMove.row === r && gameState.lastMove.col === c;
  const isLastV = (r: number, c: number) =>
    gameState.lastMove?.type === 'v' && gameState.lastMove.row === r && gameState.lastMove.col === c;

  // Render captured boxes
  const boxes: React.ReactNode[] = [];
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const player = gameState.boxes[r][c];
      if (player === null) continue;
      const key = `${r}-${c}`;
      const isNew = !animatedBoxes.has(key);
      if (isNew) animatedBoxes.add(key);

      boxes.push(
        <View
          key={`box-${r}-${c}`}
          testID={`box-${r}-${c}`}
          style={{
            position: 'absolute',
            left: BOARD_PAD + c * cellSize + dotSize / 2,
            top: BOARD_PAD + r * cellSize + dotSize / 2,
            width: cellSize - dotSize,
            height: cellSize - dotSize,
          }}
        >
          {isNew ? (
            <NewBox player={player} />
          ) : (
            <View style={[styles.boxInner, { backgroundColor: getPlayerFill(player), borderColor: getPlayerColor(player) + '30' }]}>
              <Text style={[styles.boxText, { color: getPlayerColor(player) }]}>{player}</Text>
            </View>
          )}
        </View>
      );
    }
  }

  // Render horizontal lines
  const hLines: React.ReactNode[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n - 1; c++) {
      const drawn = gameState.hLines[r][c];
      const owner = gameState.hOwner[r][c];
      const isNew = drawn && isLastH(r, c);
      const lineColor = owner ? getPlayerColor(owner) : COLORS.lineEmpty;

      hLines.push(
        <Pressable
          key={`h-${r}-${c}`}
          testID={`line-h-${r}-${c}`}
          onPress={() => !disabled && !drawn && onLinePress('h', r, c)}
          style={{
            position: 'absolute',
            left: BOARD_PAD + c * cellSize + dotSize / 2,
            top: BOARD_PAD + r * cellSize - touchPad / 2,
            width: cellSize - dotSize,
            height: touchPad,
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <View
            style={[
              styles.lineWrapper,
              { height: lineThick, borderRadius: lineThick / 2 },
              drawn && owner && Platform.OS !== 'web' && {
                shadowColor: lineColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
          >
            {drawn ? (
              isNew ? (
                <NewLine isHorizontal color={lineColor} />
              ) : (
                <View style={{ flex: 1, backgroundColor: lineColor, borderRadius: lineThick / 2 }} />
              )
            ) : (
              <View style={{ flex: 1, backgroundColor: COLORS.lineEmpty, borderRadius: lineThick / 2 }} />
            )}
          </View>
        </Pressable>
      );
    }
  }

  // Render vertical lines
  const vLines: React.ReactNode[] = [];
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n; c++) {
      const drawn = gameState.vLines[r][c];
      const owner = gameState.vOwner[r][c];
      const isNew = drawn && isLastV(r, c);
      const lineColor = owner ? getPlayerColor(owner) : COLORS.lineEmpty;

      vLines.push(
        <Pressable
          key={`v-${r}-${c}`}
          testID={`line-v-${r}-${c}`}
          onPress={() => !disabled && !drawn && onLinePress('v', r, c)}
          style={{
            position: 'absolute',
            left: BOARD_PAD + c * cellSize - touchPad / 2,
            top: BOARD_PAD + r * cellSize + dotSize / 2,
            width: touchPad,
            height: cellSize - dotSize,
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <View
            style={[
              styles.lineWrapperV,
              { width: lineThick, borderRadius: lineThick / 2 },
              drawn && owner && Platform.OS !== 'web' && {
                shadowColor: lineColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
          >
            {drawn ? (
              isNew ? (
                <NewLine isHorizontal={false} color={lineColor} />
              ) : (
                <View style={{ flex: 1, backgroundColor: lineColor, borderRadius: lineThick / 2 }} />
              )
            ) : (
              <View style={{ flex: 1, backgroundColor: COLORS.lineEmpty, borderRadius: lineThick / 2 }} />
            )}
          </View>
        </Pressable>
      );
    }
  }

  // Render dots
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      dots.push(
        <View
          key={`dot-${r}-${c}`}
          testID={`dot-${r}-${c}`}
          style={[
            styles.dot,
            {
              left: BOARD_PAD + c * cellSize - dotSize / 2,
              top: BOARD_PAD + r * cellSize - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
            },
          ]}
        />
      );
    }
  }

  return (
    <View
      testID="game-board"
      style={[styles.boardContainer, { width: availWidth, height: availWidth }]}
    >
      {boxes}
      {hLines}
      {vLines}
      {dots}
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    position: 'relative',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  lineWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  lineWrapperV: {
    height: '100%',
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    backgroundColor: COLORS.dot,
    zIndex: 20,
  },
  boxInner: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
});
