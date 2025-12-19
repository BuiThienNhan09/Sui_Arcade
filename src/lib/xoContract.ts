/**
 * XO Game Contract Configuration and Transaction Builders
 */

// Contract constants - these will be set after deployment
export const XO_CONTRACT = {
    // Package ID - update after deploying to testnet
    PACKAGE_ID: '0x0', // TODO: Update after deployment

    // Module name
    MODULE: 'xo_game',

    // Shared object IDs - update after deployment
    GAME_POOL_ID: '0x0', // TODO: Update after deployment

    // Entry fees in MIST
    ENTRY_FEES: {
        3: 100_000_000,    // 0.1 SUI
        6: 500_000_000,    // 0.5 SUI
        9: 1_000_000_000,  // 1.0 SUI
    } as Record<number, number>,

    // Win payouts in MIST
    WIN_PAYOUTS: {
        3: 200_000_000,    // 0.2 SUI
        6: 1_000_000_000,  // 1.0 SUI
        9: 2_000_000_000,  // 2.0 SUI
    } as Record<number, number>,

    // Tie payouts in MIST
    TIE_PAYOUTS: {
        3: 50_000_000,     // 0.05 SUI
        6: 250_000_000,    // 0.25 SUI
        9: 500_000_000,    // 0.5 SUI
    } as Record<number, number>,
};

/**
 * Check if contract is deployed (IDs are set)
 */
export function isContractDeployed(): boolean {
    return XO_CONTRACT.PACKAGE_ID !== '0x0' && XO_CONTRACT.GAME_POOL_ID !== '0x0';
}

/**
 * Get entry fee for board size
 */
export function getEntryFee(boardSize: number): number {
    return XO_CONTRACT.ENTRY_FEES[boardSize] || 0;
}

/**
 * Get win payout for board size
 */
export function getWinPayout(boardSize: number): number {
    return XO_CONTRACT.WIN_PAYOUTS[boardSize] || 0;
}

/**
 * Get tie payout for board size
 */
export function getTiePayout(boardSize: number): number {
    return XO_CONTRACT.TIE_PAYOUTS[boardSize] || 0;
}

/**
 * Convert MIST to SUI for display
 */
export function mistToSui(mist: number): number {
    return mist / 1_000_000_000;
}
