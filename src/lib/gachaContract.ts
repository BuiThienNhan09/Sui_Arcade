/**
 * Gacha/Lucky Chests Game Contract Configuration
 * Deployed to Sui Testnet
 */

export const GACHA_CONTRACT = {
    PACKAGE_ID: '0xc7a6c71b3712ca378c13b0d4fe7a8c0b64d759a3bee772ef6d8646c95dce3872',
    MODULE: 'gacha',
    TREASURY_ID: '0xe2f01f4ebaa1a397cc5a9e5754b7bc6f135792a7130d9b65f5c7cb6b9a6d2dde',
    RANDOM_OBJECT_ID: '0x8', // Sui's on-chain random object
};

export interface ChestConfig {
    id: number;
    name: string;
    price: number;
    priceMist: number;
    winRate: number;
    winPayout: number;
    losePayout: number;
    color: string;
    rateText: string;
}

export const CHESTS: ChestConfig[] = [
    {
        id: 1,
        name: 'WOODEN CHEST',
        price: 0.1,
        priceMist: 100_000_000,
        winRate: 10,
        winPayout: 0.15,
        losePayout: 0.05,
        color: '#8B4513',
        rateText: '10% get 1.5x',
    },
    {
        id: 2,
        name: 'GOLDEN CHEST',
        price: 0.5,
        priceMist: 500_000_000,
        winRate: 50,
        winPayout: 0.8,
        losePayout: 0.3,
        color: '#FFD700',
        rateText: '50% get 1.6x',
    },
    {
        id: 3,
        name: 'DIAMOND CHEST',
        price: 1.0,
        priceMist: 1_000_000_000,
        winRate: 30,
        winPayout: 2.5,
        losePayout: 0.7,
        color: '#00CED1',
        rateText: '30% get 2.5x',
    },
];

export const REWARDS = {
    1: {
        lose: { amount: 0.05, rarity: 'REKT 📉', multiplier: '0.5x' },
        win: { amount: 0.15, rarity: 'STONKS 📈', multiplier: '1.5x' },
    },
    2: {
        lose: { amount: 0.3, rarity: 'NGMI 💀', multiplier: '0.6x' },
        win: { amount: 0.8, rarity: 'WAGMI 🔥', multiplier: '1.6x' },
    },
    3: {
        lose: { amount: 0.7, rarity: 'DOWN BAD 😭', multiplier: '0.7x' },
        win: { amount: 2.5, rarity: 'LAMBO 🏎️', multiplier: '2.5x' },
    },
} as Record<number, { lose: { amount: number; rarity: string; multiplier: string }; win: { amount: number; rarity: string; multiplier: string } }>;
