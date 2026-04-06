import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

interface Props {
  visible: boolean;
  onExit: () => void;
  onContinue: () => void;
}

export default function ExitDialog({ visible, onExit, onContinue }: Props) {
  const cardScale = useSharedValue(0.85);

  useEffect(() => {
    if (visible) {
      cardScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    } else {
      cardScale.value = 0.85;
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={styles.overlay}
      testID="exit-dialog"
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.title}>Exit Game?</Text>
        <Text style={styles.message}>Are you sure you want to leave this match?</Text>
        <View style={styles.buttons}>
          <Pressable
            testID="exit-dialog-no"
            onPress={onContinue}
            style={[styles.btn, styles.btnNo]}
          >
            <Text style={[styles.btnText, { color: COLORS.player1 }]}>NO</Text>
          </Pressable>
          <Pressable
            testID="exit-dialog-yes"
            onPress={onExit}
            style={[styles.btn, styles.btnYes]}
          >
            <Text style={[styles.btnText, { color: COLORS.player2 }]}>YES</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 90,
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnNo: {
    borderColor: COLORS.player1 + '40',
    backgroundColor: COLORS.player1 + '08',
  },
  btnYes: {
    borderColor: COLORS.player2 + '40',
    backgroundColor: COLORS.player2 + '08',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
