import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/src/constants/theme';

const TUTORIAL_KEY = 'dotbox_tutorial_done';

const STEPS = [
  {
    icon: 'finger-print-outline' as const,
    title: 'Draw Lines',
    desc: 'Tap any line between dots to draw it',
    color: COLORS.player1,
  },
  {
    icon: 'cube-outline' as const,
    title: 'Claim Boxes',
    desc: 'Complete all 4 sides of a box to claim it',
    color: COLORS.player2,
  },
  {
    icon: 'arrow-redo-outline' as const,
    title: 'Extra Turn',
    desc: 'Claiming a box earns you another turn!',
    color: '#4ADE80',
  },
];

interface Props {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const iconScale = useSharedValue(1);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
      onComplete();
    } else {
      iconScale.value = 0.5;
      iconScale.value = withSpring(1, { damping: 10 });
      setStep(step + 1);
    }
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
      testID="tutorial-overlay"
    >
      <View style={styles.card}>
        {/* Step indicator */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                { backgroundColor: i === step ? current.color : COLORS.textMuted },
              ]}
            />
          ))}
        </View>

        {/* Icon */}
        <Animated.View style={[styles.iconWrap, { borderColor: current.color + '40' }, iconStyle]}>
          <Ionicons name={current.icon} size={40} color={current.color} />
        </Animated.View>

        {/* Text */}
        <Text style={[styles.title, { color: current.color }]}>{current.title}</Text>
        <Text style={styles.desc}>{current.desc}</Text>

        {/* Button */}
        <Pressable
          testID="tutorial-next-btn"
          onPress={handleNext}
          style={[styles.btn, { borderColor: current.color + '50' }]}
        >
          <Text style={[styles.btnText, { color: current.color }]}>
            {isLast ? 'GOT IT!' : 'NEXT'}
          </Text>
        </Pressable>

        {/* Skip */}
        {!isLast && (
          <Pressable
            testID="tutorial-skip-btn"
            onPress={async () => {
              await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
              onComplete();
            }}
          >
            <Text style={styles.skipText}>Skip Tutorial</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

// Helper: check if tutorial has been completed
export async function isTutorialDone(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(TUTORIAL_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 10, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  desc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginTop: 8,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  skipText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
