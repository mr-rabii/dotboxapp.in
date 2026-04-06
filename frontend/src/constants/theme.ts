import { Platform } from 'react-native';

export const COLORS = {
  bg: '#05050A',
  surface: '#0A0A12',
  surfaceLight: '#141420',
  white: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#475569',
  player1: '#00F0FF',
  player1Glow: 'rgba(0, 240, 255, 0.6)',
  player1Fill: 'rgba(0, 240, 255, 0.15)',
  player1Light: 'rgba(0, 240, 255, 0.3)',
  player2: '#FF0055',
  player2Glow: 'rgba(255, 0, 85, 0.6)',
  player2Fill: 'rgba(255, 0, 85, 0.15)',
  player2Light: 'rgba(255, 0, 85, 0.3)',
  dot: '#2A2A3E',
  lineEmpty: 'rgba(255, 255, 255, 0.06)',
  border: 'rgba(255, 255, 255, 0.08)',
  accent: '#7B61FF',
};

export function getPlayerColor(player: 1 | 2): string {
  return player === 1 ? COLORS.player1 : COLORS.player2;
}

export function getPlayerFill(player: 1 | 2): string {
  return player === 1 ? COLORS.player1Fill : COLORS.player2Fill;
}

export function getPlayerGlow(player: 1 | 2): string {
  return player === 1 ? COLORS.player1Glow : COLORS.player2Glow;
}

export const FONTS = {
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};
