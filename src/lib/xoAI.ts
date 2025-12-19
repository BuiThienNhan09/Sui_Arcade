/**
 * XO Game AI
 * Hard difficulty using minimax with alpha-beta pruning
 */

import { Board, CellValue, checkWinner, getAvailableMoves, makeMove, isBoardFull } from './xoLogic';

interface MoveScore {
    row: number;
    col: number;
    score: number;
}

/**
 * Get AI move - Hard difficulty
 * Uses minimax with alpha-beta pruning, deeper search, and minimal randomization
 */
export function getAIMove(
    board: Board,
    winLength: number,
    aiSymbol: CellValue = 'O',
    playerSymbol: CellValue = 'X'
): [number, number] | null {
    const availableMoves = getAvailableMoves(board);

    if (availableMoves.length === 0) return null;

    // For larger boards, adjust depth for performance while maintaining strength
    const size = board.length;
    let maxDepth: number;
    if (size <= 3) {
        maxDepth = 10; // Full tree search for 3x3
    } else if (size <= 6) {
        maxDepth = 5;  // Deeper search for 6x6
    } else {
        maxDepth = 4;  // Reasonable depth for 9x9
    }

    // Hard difficulty: 95% optimal moves, 5% slightly suboptimal
    const random = Math.random();
    if (random > 0.95 && availableMoves.length > 1) {
        // Occasionally make second-best move instead of best
        const moves = getBestMoves(board, winLength, aiSymbol, playerSymbol, maxDepth, 2);
        if (moves.length > 1) {
            return [moves[1].row, moves[1].col];
        }
    }

    // Find best move using minimax
    const bestMoves = getBestMoves(board, winLength, aiSymbol, playerSymbol, maxDepth, 1);

    if (bestMoves.length > 0) {
        return [bestMoves[0].row, bestMoves[0].col];
    }

    return availableMoves[0];
}

/**
 * Get top N best moves
 */
function getBestMoves(
    board: Board,
    winLength: number,
    aiSymbol: CellValue,
    playerSymbol: CellValue,
    maxDepth: number,
    count: number
): MoveScore[] {
    const availableMoves = getAvailableMoves(board);
    const scoredMoves: MoveScore[] = [];

    for (const [row, col] of availableMoves) {
        const newBoard = makeMove(board, row, col, aiSymbol);
        const score = minimax(
            newBoard,
            maxDepth - 1,
            false,
            -Infinity,
            Infinity,
            winLength,
            aiSymbol,
            playerSymbol
        );
        scoredMoves.push({ row, col, score });
    }

    // Sort by score descending
    scoredMoves.sort((a, b) => b.score - a.score);

    return scoredMoves.slice(0, count);
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    winLength: number,
    aiSymbol: CellValue,
    playerSymbol: CellValue
): number {
    const winner = checkWinner(board, winLength);

    // Terminal states - weight by depth to prefer faster wins
    if (winner === aiSymbol) return 1000 + depth;
    if (winner === playerSymbol) return -1000 - depth;
    if (isBoardFull(board) || depth === 0) {
        // Evaluate board position for non-terminal states
        return evaluateBoard(board, winLength, aiSymbol, playerSymbol);
    }

    const availableMoves = getAvailableMoves(board);

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const [row, col] of availableMoves) {
            const newBoard = makeMove(board, row, col, aiSymbol);
            const score = minimax(newBoard, depth - 1, false, alpha, beta, winLength, aiSymbol, playerSymbol);
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (const [row, col] of availableMoves) {
            const newBoard = makeMove(board, row, col, playerSymbol);
            const score = minimax(newBoard, depth - 1, true, alpha, beta, winLength, aiSymbol, playerSymbol);
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
        return minScore;
    }
}

/**
 * Evaluate board position heuristically
 * Counts potential winning lines for each player
 */
function evaluateBoard(
    board: Board,
    winLength: number,
    aiSymbol: CellValue,
    playerSymbol: CellValue
): number {
    const size = board.length;
    let aiScore = 0;
    let playerScore = 0;

    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1],  // diagonal down-left
    ];

    // Check all possible lines
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            for (const [dr, dc] of directions) {
                // Check if a line of winLength is possible from this position
                const endRow = row + dr * (winLength - 1);
                const endCol = col + dc * (winLength - 1);

                if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

                let aiCount = 0;
                let playerCount = 0;
                let emptyCount = 0;

                for (let i = 0; i < winLength; i++) {
                    const r = row + dr * i;
                    const c = col + dc * i;
                    const cell = board[r][c];

                    if (cell === aiSymbol) aiCount++;
                    else if (cell === playerSymbol) playerCount++;
                    else emptyCount++;
                }

                // Score lines that only contain one player's pieces
                if (aiCount > 0 && playerCount === 0) {
                    aiScore += Math.pow(10, aiCount);
                }
                if (playerCount > 0 && aiCount === 0) {
                    playerScore += Math.pow(10, playerCount);
                }
            }
        }
    }

    return aiScore - playerScore;
}
