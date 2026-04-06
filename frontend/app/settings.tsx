import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '@/src/constants/theme';
import { useSettings } from '@/src/context/SettingsContext';
import { playUISound } from '@/src/utils/sounds';

const GRID_OPTIONS = [3, 4, 5, 6, 7];

export default function SettingsScreen() {
  const router = useRouter();
  const { gridSize, soundEnabled, setGridSize, setSoundEnabled } = useSettings();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          testID="btn-settings-back"
          onPress={() => {
            playUISound();
            router.back();
          }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Grid Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GRID SIZE</Text>
          <Text style={styles.sectionSub}>
            {gridSize}×{gridSize} grid · {(gridSize - 1) * (gridSize - 1)} boxes
          </Text>
          <View style={styles.gridOptions}>
            {GRID_OPTIONS.map((size) => (
              <Pressable
                key={size}
                testID={`grid-size-${size}`}
                onPress={() => {
                  playUISound();
                  setGridSize(size);
                }}
                style={[
                  styles.gridBtn,
                  gridSize === size && styles.gridBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.gridBtnText,
                    gridSize === size && styles.gridBtnTextActive,
                  ]}
                >
                  {size}×{size}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sound Toggle */}
        <View style={styles.section}>
          <View style={styles.soundRow}>
            <View>
              <Text style={styles.sectionTitle}>SOUND & HAPTICS</Text>
              <Text style={styles.sectionSub}>
                {soundEnabled ? 'Audio feedback enabled' : 'Audio feedback disabled'}
              </Text>
            </View>
            <Switch
              testID="toggle-mute"
              value={soundEnabled}
              onValueChange={(val) => {
                setSoundEnabled(val);
                if (val) playUISound();
              }}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.player1 + '40' }}
              thumbColor={soundEnabled ? COLORS.player1 : COLORS.textMuted}
            />
          </View>
        </View>

        {/* Game Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOW TO PLAY</Text>
          <View style={styles.rulesContainer}>
            <Text style={styles.rule}>• Tap between dots to draw a line</Text>
            <Text style={styles.rule}>• Complete a box to score a point</Text>
            <Text style={styles.rule}>• Completing a box gives an extra turn</Text>
            <Text style={styles.rule}>• Player with the most boxes wins</Text>
          </View>
        </View>
      </View>
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
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
  },
  gridOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  gridBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  gridBtnActive: {
    borderColor: COLORS.player1 + '60',
    backgroundColor: COLORS.player1 + '10',
  },
  gridBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
  },
  gridBtnTextActive: {
    color: COLORS.player1,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rulesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rule: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
