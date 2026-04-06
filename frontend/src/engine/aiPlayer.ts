// AI player logic for Dots & Boxes
import { GameState, Move, getAvailableMoves, makeMove, countBoxSides } from './gameLogic';

export type Difficulty = 'easy' | 'medium' | 'hard';

export function getAIMove(state: GameState, difficulty: Difficulty): Move | null {
  const moves = getAvailableMoves(state);
  if (moves.length === 0) return null;

  switch (difficulty) {
    case 'easy': return pickRandom(moves);
    case 'medium': return mediumStrategy(state, moves);
    case 'hard': return hardStrategy(state, moves);
    default: return pickRandom(moves);
  }
}

function pickRandom(moves: Move[]): Move {
  return moves[Math.floor(Math.random() * moves.length)];
}

// Medium: complete boxes if possible, avoid giving opponent boxes, else random
function mediumStrategy(state: GameState, moves: Move[]): Move {
  const completing = moves.filter(m => wouldComplete(state, m));
  if (completing.length > 0) return pickRandom(completing);

  const safe = moves.filter(m => !wouldGiveBox(state, m));
  if (safe.length > 0) return pickRandom(safe);

  return pickRandom(moves);
}

// Hard: maximize completions, avoid chains, minimize opponent gains
function hardStrategy(state: GameState, moves: Move[]): Move {
  // 1. Complete as many boxes as possible
  const scored = moves
    .map(m => ({ move: m, count: completionCount(state, m) }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count);

  if (scored.length > 0) return scored[0].move;

  // 2. Safe moves that don't create 3-sided boxes
  const safe = moves.filter(m => !wouldGiveBox(state, m));
  if (safe.length > 0) {
    // Prefer moves that don't create 2-sided boxes (avoids future chains)
    const best = safe.filter(m => !creates2Sided(state, m));
    if (best.length > 0) return pickRandom(best);
    return pickRandom(safe);
  }

  // 3. All moves dangerous: pick the one giving away fewest boxes
  const ranked = moves
    .map(m => ({ move: m, loss: opponentGains(state, m) }))
    .sort((a, b) => a.loss - b.loss);

  return ranked[0].move;
}

function wouldComplete(state: GameState, move: Move): boolean {
  return completionCount(state, move) > 0;
}

function completionCount(state: GameState, move: Move): number {
  const result = makeMove(state, move);
  if (!result) return 0;
  return result.newBoxes.length;
}

function wouldGiveBox(state: GameState, move: Move): boolean {
  const result = makeMove(state, move);
  if (!result) return false;
  if (result.newBoxes.length > 0) return false; // We completed it, not opponent

  const n = state.gridSize;
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      if (result.boxes[r][c] === null && countBoxSides(result, r, c) === 3) {
        if (countBoxSides(state, r, c) < 3) return true;
      }
    }
  }
  return false;
}

function opponentGains(state: GameState, move: Move): number {
  const result = makeMove(state, move);
  if (!result) return 999;

  const n = state.gridSize;
  let count = 0;
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      if (result.boxes[r][c] === null && countBoxSides(result, r, c) === 3) {
        count++;
      }
    }
  }
  return count;
}

function creates2Sided(state: GameState, move: Move): boolean {
  const result = makeMove(state, move);
  if (!result) return false;

  const n = state.gridSize;
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      if (result.boxes[r][c] === null && countBoxSides(result, r, c) === 2) {
        if (countBoxSides(state, r, c) < 2) return true;
      }
    }
  }
  return false;
}
