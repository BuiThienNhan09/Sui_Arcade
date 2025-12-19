/**
 * Loto Game Contract Configuration
 * Deployed to Sui Testnet
 */

export const LOTO_CONTRACT = {
    // Package ID
    PACKAGE_ID: '0xd745044eca660ab1a59936e1e01d3b25e8e147303d62b4aef70d5589f9645029',

    // Module name
    MODULE: 'loto_game',

    // LotoPool shared object ID
    LOTO_POOL_ID: '0xd02b9330e50d03493ec5b916c77e1a33ea3476da53fb1521ef34a209c610062e',

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
