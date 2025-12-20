/**
 * Loto Game Contract Configuration
 * Deployed to Sui Testnet with on-chain randomness
 */

export const LOTO_CONTRACT = {
    // Package ID - NEW deployment with sui::random
    PACKAGE_ID: '0xede5653adb7eae30e2f9336eef4993855284762aa99930dad93b5fb434f450ff',

    // Module name
    MODULE: 'loto_game',

    // LotoPool shared object ID
    LOTO_POOL_ID: '0x54621e9bd0ebe8d2d2ec54ca4457ad59daf0640f78eeb3607df9c92b50bec9d7',

    // Sui's on-chain random object
    RANDOM_OBJECT_ID: '0x8',

    // Valid bet amounts in MIST
    BET_AMOUNTS: {
        0.1: 100_000_000,
        0.5: 500_000_000,
        1: 1_000_000_000,
        5: 5_000_000_000,
    } as Record<number, number>,

    // Win multiplier
    WIN_MULTIPLIER: 5,
};

/**
 * Get bet amount in MIST
 */
export function getBetInMist(sui: number): number {
    return LOTO_CONTRACT.BET_AMOUNTS[sui] || 0;
}

/**
 * Convert MIST to SUI
 */
export function mistToSui(mist: number): number {
    return mist / 1_000_000_000;
}
