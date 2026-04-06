import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

interface Props {
  onComplete: () => void;
}

export default function SplashAnimation({ onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const HALF = 50;
  const DOT = 10;
  const LINE = 3;

  const d1 = useSharedValue(0);
  const d2 = useSharedValue(0);
  const d3 = useSharedValue(0);
  const d4 = useSharedValue(0);
  const lT = useSharedValue(0);
  const lR = useSharedValue(0);
  const lB = useSharedValue(0);
  const lL = useSharedValue(0);
  const glow = useSharedValue(0);
  const titleScale = useSharedValue(0.5);
  const titleOp = useSharedValue(0);
  const tagOp = useSharedValue(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    d1.value = withDelay(200, withSpring(1, { damping: 12 }));
    d2.value = withDelay(350, withSpring(1, { damping: 12 }));
    d3.value = withDelay(500, withSpring(1, { damping: 12 }));
    d4.value = withDelay(650, withSpring(1, { damping: 12 }));
    lT.value = withDelay(800, withTiming(1, { duration: 200 }));
    lR.value = withDelay(1000, withTiming(1, { duration: 200 }));
    lB.value = withDelay(1200, withTiming(1, { duration: 200 }));
    lL.value = withDelay(1400, withTiming(1, { duration: 200 }));
    glow.value = withDelay(1600, withSpring(1, { damping: 6 }));
    titleOp.value = withDelay(1800, withTiming(1, { duration: 400 }));
    titleScale.value = withDelay(1800, withSpring(1, { damping: 10 }));
    tagOp.value = withDelay(2100, withTiming(1, { duration: 300 }));
    fade.value = withDelay(2700, withTiming(0, { duration: 400 }));
    const t = setTimeout(onComplete, 3200);
    return () => clearTimeout(t);
  }, []);

  const cx = width / 2;
  const cy = height / 2 - 40;

  const dotStyle = (sv: Animated.SharedValue<number>, x: number, y: number) =>
    useAnimatedStyle(() => ({
      position: 'absolute' as const,
      left: cx + x - DOT / 2,
      top: cy + y - DOT / 2,
      width: DOT,
      height: DOT,
      borderRadius: DOT / 2,
      backgroundColor: COLORS.player1,
      opacity: sv.value,
      transform: [{ scale: sv.value }],
    }));

  const ds1 = dotStyle(d1, -HALF, -HALF);
  const ds2 = dotStyle(d2, HALF, -HALF);
  const ds3 = dotStyle(d3, HALF, HALF);
  const ds4 = dotStyle(d4, -HALF, HALF);

  const hLineStyle = (sv: Animated.SharedValue<number>, x: number, y: number) =>
    useAnimatedStyle(() => ({
      position: 'absolute' as const,
      left: cx + x,
      top: cy + y - LINE / 2,
      width: HALF * 2,
      height: LINE,
      borderRadius: 2,
      backgroundColor: COLORS.player1,
      transform: [{ scaleX: sv.value }],
    }));

  const vLineStyle = (sv: Animated.SharedValue<number>, x: number, y: number) =>
    useAnimatedStyle(() => ({
      position: 'absolute' as const,
      left: cx + x - LINE / 2,
      top: cy + y,
      width: LINE,
      height: HALF * 2,
      borderRadius: 2,
      backgroundColor: COLORS.player1,
      transform: [{ scaleY: sv.value }],
    }));

  const ls1 = hLineStyle(lT, -HALF, -HALF);
  const ls2 = vLineStyle(lR, HALF, -HALF);
  const ls3 = hLineStyle(lB, -HALF, HALF);
  const ls4 = vLineStyle(lL, -HALF, -HALF);

  const glowStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: cx - HALF - 10,
    top: cy - HALF - 10,
    width: HALF * 2 + 20,
    height: HALF * 2 + 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.player1,
    opacity: glow.value * 0.6,
    transform: [{ scale: 0.95 + glow.value * 0.05 }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOp.value,
    transform: [{ scale: titleScale.value }],
  }));

  const tagStyle = useAnimatedStyle(() => ({ opacity: tagOp.value }));
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <Pressable style={styles.container} onPress={onComplete} testID="splash-screen">
      <Animated.View style={[StyleSheet.absoluteFill, fadeStyle]}>
        <View style={StyleSheet.absoluteFill}>
          <Animated.View style={ds1} />
          <Animated.View style={ds2} />
          <Animated.View style={ds3} />
          <Animated.View style={ds4} />
          <Animated.View style={ls1} />
          <Animated.View style={ls2} />
          <Animated.View style={ls3} />
          <Animated.View style={ls4} />
          <Animated.View style={glowStyle} />
        </View>
        <View style={[styles.titleArea, { top: cy + HALF + 40 }]}>
          <Animated.Text style={[styles.title, titleStyle]}>DotBox</Animated.Text>
          <Animated.Text style={[styles.tag, tagStyle]}>The Next Level Brain Game</Animated.Text>
        </View>
        <Text style={styles.skip}>Tap to skip</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  titleArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.player1,
    letterSpacing: 4,
  },
  tag: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  skip: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
});
