// Sound and haptic feedback utilities
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

// Play a tone via Web Audio API (web only)
function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol: number = 0.3) {
  if (muted || Platform.OS !== 'web') return;
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playLineSound() {
  if (muted) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  playTone(800, 0.1, 'sine', 0.2);
}

export function playCaptureSound() {
  if (muted) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  playTone(523, 0.15, 'sine', 0.25);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.3), 200);
}

export function playGameOverSound() {
  if (muted) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  playTone(440, 0.2, 'triangle', 0.25);
  setTimeout(() => playTone(554, 0.2, 'triangle', 0.25), 150);
  setTimeout(() => playTone(659, 0.2, 'triangle', 0.25), 300);
  setTimeout(() => playTone(880, 0.5, 'sine', 0.35), 450);
}

export function playUISound() {
  if (muted) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  playTone(600, 0.05, 'square', 0.15);
}
