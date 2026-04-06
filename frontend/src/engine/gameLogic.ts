// Core game logic for Dots & Boxes

export type Player = 1 | 2;
export type LineType = 'h' | 'v';

export interface Move {
  type: LineType;
  row: number;
  col: number;
}

export interface GameState {
  gridSize: number;       // N dots per side
  hLines: boolean[][];    // horizontal lines: [N rows][N-1 cols]
  vLines: boolean[][];    // vertical lines: [N-1 rows][N cols]
  hOwner: (Player | null)[][];
  vOwner: (Player | null)[][];
  boxes: (Player | null)[][]; // [N-1][N-1]
  currentPlayer: Player;
  scores: [number, number];
  gameOver: boolean;
  lastMove: Move | null;
  newBoxes: { row: number; col: number }[];
}

function make2D<T>(rows: number, cols: number, val: T): T[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(val));
}

export function createGameState(gridSize: number): GameState {
  const n = gridSize;
  return {
    gridSize: n,
    hLines: make2D(n, n - 1, false),
    vLines: make2D(n - 1, n, false),
    hOwner: make2D(n, n - 1, null),
    vOwner: make2D(n - 1, n, null),
    boxes: make2D(n - 1, n - 1, null),
    currentPlayer: 1,
    scores: [0, 0],
    gameOver: false,
    lastMove: null,
    newBoxes: [],
  };
}

// Check if box at (row, col) has all 4 sides drawn
function isBoxComplete(state: GameState, row: number, col: number): boolean {
  return (
    state.hLines[row][col] &&       // top
    state.hLines[row + 1][col] &&   // bottom
    state.vLines[row][col] &&       // left
    state.vLines[row][col + 1]      // right
  );
}

// Find newly completed boxes after drawing a line
function findNewBoxes(state: GameState, move: Move): { row: number; col: number }[] {
  const { type, row, col } = move;
  const n = state.gridSize;
  const completed: { row: number; col: number }[] = [];

  if (type === 'h') {
    // Horizontal line at (row, col) borders box above (row-1, col) and below (row, col)
    if (row > 0 && isBoxComplete(state, row - 1, col) && state.boxes[row - 1][col] === null) {
      completed.push({ row: row - 1, col });
    }
    if (row < n - 1 && isBoxComplete(state, row, col) && state.boxes[row][col] === null) {
      completed.push({ row, col });
    }
  } else {
    // Vertical line at (row, col) borders box left (row, col-1) and right (row, col)
    if (col > 0 && isBoxComplete(state, row, col - 1) && state.boxes[row][col - 1] === null) {
      completed.push({ row, col: col - 1 });
    }
    if (col < n - 1 && isBoxComplete(state, row, col) && state.boxes[row][col] === null) {
      completed.push({ row, col });
    }
  }

  return completed;
}

// Execute a move and return new state, or null if invalid
export function makeMove(state: GameState, move: Move): GameState | null {
  const { type, row, col } = move;

  // Validate: line not already drawn
  if (type === 'h' && state.hLines[row][col]) return null;
  if (type === 'v' && state.vLines[row][col]) return null;

  // Deep copy
  const ns: GameState = {
    ...state,
    hLines: state.hLines.map(r => [...r]),
    vLines: state.vLines.map(r => [...r]),
    hOwner: state.hOwner.map(r => [...r]),
    vOwner: state.vOwner.map(r => [...r]),
    boxes: state.boxes.map(r => [...r]),
    scores: [...state.scores] as [number, number],
  };

  // Draw the line
  if (type === 'h') {
    ns.hLines[row][col] = true;
    ns.hOwner[row][col] = state.currentPlayer;
  } else {
    ns.vLines[row][col] = true;
    ns.vOwner[row][col] = state.currentPlayer;
  }

  ns.lastMove = move;

  // Check for completed boxes
  const completed = findNewBoxes(ns, move);
  ns.newBoxes = completed;

  if (completed.length > 0) {
    // Assign boxes and add score
    completed.forEach(({ row: r, col: c }) => {
      ns.boxes[r][c] = state.currentPlayer;
    });
    ns.scores[state.currentPlayer - 1] += completed.length;
    // Extra turn: don't switch player
  } else {
    // Switch player
    ns.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
  }

  // Check game over
  ns.gameOver = checkGameOver(ns);

  return ns;
}

function checkGameOver(state: GameState): boolean {
  for (const row of state.hLines) {
    for (const val of row) {
      if (!val) return false;
    }
  }
  for (const row of state.vLines) {
    for (const val of row) {
      if (!val) return false;
    }
  }
  return true;
}

export function getAvailableMoves(state: GameState): Move[] {
  const moves: Move[] = [];
  const n = state.gridSize;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n - 1; c++) {
      if (!state.hLines[r][c]) moves.push({ type: 'h', row: r, col: c });
    }
  }
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n; c++) {
      if (!state.vLines[r][c]) moves.push({ type: 'v', row: r, col: c });
    }
  }

  return moves;
}

export function getWinner(state: GameState): Player | 0 {
  if (state.scores[0] > state.scores[1]) return 1;
  if (state.scores[1] > state.scores[0]) return 2;
  return 0; // tie
}

// Count drawn sides of box at (row, col)
export function countBoxSides(state: GameState, row: number, col: number): number {
  let count = 0;
  if (state.hLines[row][col]) count++;
  if (state.hLines[row + 1][col]) count++;
  if (state.vLines[row][col]) count++;
  if (state.vLines[row][col + 1]) count++;
  return count;
}
