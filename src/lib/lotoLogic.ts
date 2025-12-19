/**
 * Loto/Bingo Game Logic
 */

// 5x5 grid = 25 cells, but center is FREE (24 selectable)
export const GRID_SIZE = 5;
export const TOTAL_CELLS = 24; // 24 selectable + 1 FREE center
export const CENTER_INDEX = 12; // Middle of 5x5 grid (index 12)
export const TOTAL_DRAWS = 40;
export const DRAW_INTERVAL_MS = 2000;

// Available bet amounts in SUI
export const BET_AMOUNTS = [0.1, 0.5, 1, 5];

// Win multiplier per line
export const WIN_MULTIPLIER = 5;

export type LotoCard = (number | 'FREE' | null)[];

/**
 * Generate random unique numbers for the card (24 numbers)
 */
export function generateRandomCard(): number[] {
    const numbers: number[] = [];
    while (numbers.length < TOTAL_CELLS) {
        const num = Math.floor(Math.random() * 100);
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers;
}

/**
 * Convert 24 selected numbers to 25-cell card with FREE center
 */
export function createCardWithFreeSpace(selectedNumbers: number[]): LotoCard {
    const card: LotoCard = [];
    let numIndex = 0;

    for (let i = 0; i < 25; i++) {
        if (i === CENTER_INDEX) {
            card.push('FREE');
        } else {
            card.push(selectedNumbers[numIndex] ?? null);
            numIndex++;
        }
    }

    return card;
}

/**
 * Generate draw sequence (40 unique numbers from 0-99)
 */
export function generateDrawSequence(): number[] {
    const numbers: number[] = [];
    while (numbers.length < TOTAL_DRAWS) {
        const num = Math.floor(Math.random() * 100);
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers;
}

/**
 * Check if a cell is matched (FREE center is always matched)
 */
export function isCellMatched(cell: number | 'FREE' | null, drawnNumbers: Set<number>): boolean {
    if (cell === 'FREE') return true;
    if (cell === null) return false;
    return drawnNumbers.has(cell);
}

/**
 * Check winning lines (horizontal, vertical, diagonal)
 * Center (FREE) is automatically matched
 */
export function checkWinningLines(card: LotoCard, drawnNumbers: Set<number>): number {
    let linesWon = 0;

    // Check 5 horizontal rows
    for (let row = 0; row < GRID_SIZE; row++) {
        let complete = true;
        for (let col = 0; col < GRID_SIZE; col++) {
            const idx = row * GRID_SIZE + col;
            if (!isCellMatched(card[idx], drawnNumbers)) {
                complete = false;
                break;
            }
        }
        if (complete) linesWon++;
    }

    // Check 5 vertical columns
    for (let col = 0; col < GRID_SIZE; col++) {
        let complete = true;
        for (let row = 0; row < GRID_SIZE; row++) {
            const idx = row * GRID_SIZE + col;
            if (!isCellMatched(card[idx], drawnNumbers)) {
                complete = false;
                break;
            }
        }
        if (complete) linesWon++;
    }

    // Check main diagonal (top-left to bottom-right)
    let mainDiag = true;
    for (let i = 0; i < GRID_SIZE; i++) {
        const idx = i * GRID_SIZE + i;
        if (!isCellMatched(card[idx], drawnNumbers)) {
            mainDiag = false;
            break;
        }
    }
    if (mainDiag) linesWon++;

    // Check anti-diagonal (top-right to bottom-left)
    let antiDiag = true;
    for (let i = 0; i < GRID_SIZE; i++) {
        const idx = i * GRID_SIZE + (GRID_SIZE - 1 - i);
        if (!isCellMatched(card[idx], drawnNumbers)) {
            antiDiag = false;
            break;
        }
    }
    if (antiDiag) linesWon++;

    return linesWon;
}

/**
 * Calculate reward
 */
export function calculateReward(betAmount: number, linesWon: number): number {
    return betAmount * WIN_MULTIPLIER * linesWon;
}

/**
 * Format number with leading zero
 */
export function formatNumber(n: number): string {
    return n.toString().padStart(2, '0');
}
