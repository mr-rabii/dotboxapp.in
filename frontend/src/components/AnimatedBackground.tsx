import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

const GRID_COLS = 8;
const GRID_ROWS = 14;

export default function AnimatedBackground() {
  const { width, height } = useWindowDimensions();
  const scan1 = useSharedValue(0);
  const scan2 = useSharedValue(0);

  useEffect(() => {
    scan1.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
    scan2.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const scanStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: scan1.value * height }],
  }));

  const scanStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: scan2.value * height }],
  }));

  const cellW = width / GRID_COLS;
  const cellH = height / GRID_ROWS;

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none', overflow: 'hidden' }]}>
      {/* Grid dots */}
      {Array.from({ length: GRID_ROWS }).map((_, r) =>
        Array.from({ length: GRID_COLS }).map((_, c) => (
          <View
            key={`gd-${r}-${c}`}
            style={[
              styles.gridDot,
              { left: c * cellW + cellW / 2, top: r * cellH + cellH / 2 },
            ]}
          />
        ))
      )}
      {/* Horizontal grid lines */}
      {Array.from({ length: GRID_ROWS + 1 }).map((_, r) => (
        <View
          key={`gh-${r}`}
          style={[styles.gridLineH, { top: r * cellH, width }]}
        />
      ))}
      {/* Vertical grid lines */}
      {Array.from({ length: GRID_COLS + 1 }).map((_, c) => (
        <View
          key={`gv-${c}`}
          style={[styles.gridLineV, { left: c * cellW, height }]}
        />
      ))}
      {/* Scan lines */}
      <Animated.View style={[styles.scanLine, { width }, scanStyle1]} />
      <Animated.View style={[styles.scanLine2, { width }, scanStyle2]} />
    </View>
  );
}

const styles = StyleSheet.create({
  gridDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  gridLineH: {
    position: 'absolute',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  gridLineV: {
    position: 'absolute',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  scanLine: {
    position: 'absolute',
    height: 80,
    top: -80,
    backgroundColor: 'rgba(0,240,255,0.015)',
  },
  scanLine2: {
    position: 'absolute',
    height: 120,
    top: -120,
    backgroundColor: 'rgba(255,0,85,0.01)',
  },
});
