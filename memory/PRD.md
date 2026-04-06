# Neon Connect - Dots & Boxes Strategy Game

## Product Overview
Offline multiplayer dots & boxes strategy game with neon dark theme, AI opponent, and smooth animations.

## Current Features (MVP - Square Mode)
- **Local Multiplayer**: 2 players on same device, turn-based
- **VS Computer (AI)**: Easy (random), Medium (defensive), Hard (strategic)
- **Game Board**: Configurable NxN grid (3-7, default 5×5)
- **Game Logic**: Tap lines between dots, complete boxes to score + extra turn
- **Score System**: Points for each captured box, winner = most boxes
- **Animations**: Line drawing (spring scale), box capture (fade+scale), staggered menus
- **Sound/Haptics**: Web Audio API sounds + haptic feedback (with mute option)
- **Settings**: Grid size selector, sound toggle, how-to-play rules
- **Game Over**: Winner announcement, scores, play again, main menu

## Tech Stack
- **Frontend**: Expo SDK 54, React Native, TypeScript, expo-router
- **Animations**: react-native-reanimated
- **Feedback**: expo-haptics + Web Audio API
- **Architecture**: Modular (engine/components/context/utils)

## Color Scheme
- Background: #05050A
- Player 1 (Cyan): #00F0FF
- Player 2 (Magenta): #FF0055

## Future Enhancements
- Rectangle Mode & Triangle Mode
- Game history / undo
- Custom player names
- Dark/Light theme toggle
- Online multiplayer
