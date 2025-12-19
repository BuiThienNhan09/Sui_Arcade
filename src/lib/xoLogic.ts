/**
 * XO Game Logic Utilities
 * Handles win/tie detection for variable board sizes
 */

export type CellValue = 'X' | 'O' | null;
export type Board = CellValue[][];

export interface GameConfig {
    size: number;
    winLength: number;
    entryCost: number;  // in SUI
    winPayout: number;
    tiePayout: number;
}

export const GAME_CONFIGS: Record<number, GameConfig> = {
    3: { size: 3, winLength: 3, entryCost: 0.1, winPayout: 0.2, tiePayout: 0.05 },
    6: { size: 6, winLength: 4, entryCost: 0.5, winPayout: 1.0, tiePayout: 0.25 },
    9: { size: 9, winLength: 5, entryCost: 1.0, winPayout: 2.0, tiePayout: 0.5 },
};

/**
 * Create an empty board of given size
 */
export function createBoard(size: number): Board {
    return Array(size).fill(null).map(() => Array(size).fill(null));
}

/**
 * Check if a player has won
 * Returns the winning player ('X' or 'O') or null
 */
export function checkWinner(board: Board, winLength: number): CellValue {
    const size = board.length;

    // Check all possible lines
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1],  // diagonal down-left
    ];

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = board[row][col];
            if (!cell) continue;

            for (const [dr, dc] of directions) {
                let count = 1;

                // Count in positive direction
                for (let i = 1; i < winLength; i++) {
                    const nr = row + dr * i;
                    const nc = col + dc * i;
                    if (nr < 0 || nr >= size || nc < 0 || nc >= size) break;
                    if (board[nr][nc] !== cell) break;
                    count++;
                }

                if (count >= winLength) {
                    return cell;
                }
            }
        }
    }

    return null;
}

/**
 * Check if the board is full (tie condition when no winner)
 */
export function isBoardFull(board: Board): boolean {
    return board.every(row => row.every(cell => cell !== null));
}

/**
 * Get all available (empty) positions on the board
 */
export function getAvailableMoves(board: Board): [number, number][] {
    const moves: [number, number][] = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === null) {
                moves.push([row, col]);
            }
        }
    }
    return moves;
}

/**
 * Make a move on the board (returns a new board)
 */
export function makeMove(board: Board, row: number, col: number, player: CellValue): Board {
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = player;
    return newBoard;
}

/**
 * Get game result
 */
export type GameResult = 'win' | 'lose' | 'tie' | 'ongoing';

export function getGameResult(board: Board, winLength: number, playerSymbol: CellValue): GameResult {
    const winner = checkWinner(board, winLength);

    if (winner === playerSymbol) {
        return 'win';
    } else if (winner !== null) {
        return 'lose';
    } else if (isBoardFull(board)) {
        return 'tie';
    }

    return 'ongoing';
}
