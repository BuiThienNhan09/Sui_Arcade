/**
 * XO Game Contract Configuration
 * Deployed to Sui Testnet
 */

export const XO_CONTRACT = {
    // Package ID - updated deployment
    PACKAGE_ID: '0xede5653adb7eae30e2f9336eef4993855284762aa99930dad93b5fb434f450ff',

    // Module name
    MODULE: 'xo_game',

    // GamePool shared object ID
    GAME_POOL_ID: '0xe39549eabc2d229c436e2717687912de4733e06d36d631fc8f86d7099be189aa',

    // Entry fees in MIST (1 SUI = 1_000_000_000 MIST)
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
 * Check if contract is deployed
 */
export function isContractDeployed(): boolean {
    return XO_CONTRACT.PACKAGE_ID !== '0x0' && XO_CONTRACT.GAME_POOL_ID !== '0x0';
}

/**
 * Get entry fee for board size (in MIST)
 */
export function getEntryFee(boardSize: number): number {
    return XO_CONTRACT.ENTRY_FEES[boardSize] || 0;
}

/**
 * Get win payout for board size (in MIST)
 */
export function getWinPayout(boardSize: number): number {
    return XO_CONTRACT.WIN_PAYOUTS[boardSize] || 0;
}

/**
 * Get tie payout for board size (in MIST)
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
