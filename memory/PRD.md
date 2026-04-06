# DotBox - The Next Level Brain Game

## Product Overview
Offline multiplayer dots & boxes strategy game with premium dark neon UI, AI opponent, splash animation, tutorial, and modular architecture for future shape modes.

## Current Features
- **Splash Animation**: Premium intro with dots forming a square, DotBox branding, tap to skip (~3s)
- **Home Screen**: DotBox title with neon glow, tagline, mode selection (Square/Rectangle/Triangle), game mode buttons, animated neon grid background
- **Mode Selection**: Square (active), Rectangle (Coming Soon), Triangle (Coming Soon) - visual cards with neon outlines
- **Game Modes**: Local Multiplayer (2 players) + VS Computer (AI: Easy/Medium/Hard)
- **First-Time Tutorial**: 3-step overlay (Draw Lines, Claim Boxes, Extra Turn), persisted via AsyncStorage
- **Exit Confirmation**: Dialog when pressing back during an active game
- **Game Board**: Configurable NxN grid (3-7, default 5×5) with smooth line/box animations
- **AI Engine**: Easy (random), Medium (defensive), Hard (strategic chain analysis)
- **Sound & Haptics**: Web Audio API tones + expo-haptics, mute toggle in Settings
- **Buy Me a Coffee**: Floating button linking to razorpay.me/@zerodice
- **Developer Footer**: "developed by Zero Dice Technologies"
- **Score System**: Points for captured boxes, extra turn on completion, winner by most boxes

## Tech Stack
- **Frontend**: Expo SDK 54, React Native, TypeScript, expo-router
- **Animations**: react-native-reanimated (splash, line draw, box capture, scan lines, staggered menus)
- **Storage**: @react-native-async-storage/async-storage (tutorial persistence)
- **Feedback**: expo-haptics + Web Audio API
- **Architecture**: Modular (engine/components/context/utils)

## Color Scheme
- Background: #05050A (deep dark)
- Player 1 (Cyan): #00F0FF
- Player 2 (Magenta): #FF0055
- Accent: #7B61FF

## File Structure
```
frontend/
  app/
    _layout.tsx       # Root layout with splash
    index.tsx         # Home screen (redesigned)
    game.tsx          # Game screen + tutorial + exit dialog
    settings.tsx      # Settings screen
    game-over.tsx     # Results screen
  src/
    components/
      SplashAnimation.tsx    # Intro animation
      AnimatedBackground.tsx # Neon grid background
      Tutorial.tsx           # First-time tutorial
      ExitDialog.tsx         # Exit confirmation
      GameBoard.tsx          # Game board
      ScorePanel.tsx         # Score display
      MenuButton.tsx         # Reusable button
    engine/
      gameLogic.ts     # Core game state & logic
      aiPlayer.ts      # AI strategies
    constants/theme.ts # Colors & fonts
    context/SettingsContext.tsx
    utils/sounds.ts    # Audio & haptics
```

## Future Enhancements
- Rectangle Mode (grid-based rectangles of any size)
- Triangle Mode (triangular grid)
- Online multiplayer
- Game history / undo move
- Custom player names & avatars
