import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

export type NetworkType = 'testnet' | 'mainnet' | 'devnet' | 'localnet';

/**
 * Default network for the application
 */
export const DEFAULT_NETWORK: NetworkType = 'testnet';

/**
 * Network configuration for Sui
 */
export const networkConfig = {
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
    devnet: { url: getFullnodeUrl('devnet') },
    localnet: { url: 'http://127.0.0.1:9000' },
} as const;

/**
 * Create a Sui client for the specified network
 */
export function createSuiClient(network: NetworkType = DEFAULT_NETWORK): SuiClient {
    return new SuiClient({ url: networkConfig[network].url });
}

/**
 * Get the explorer URL for a transaction or object
 */
export function getExplorerUrl(
    type: 'tx' | 'object' | 'address',
    id: string,
    network: NetworkType = DEFAULT_NETWORK
): string {
    const baseUrl = network === 'mainnet'
        ? 'https://suiscan.xyz/mainnet'
        : `https://suiscan.xyz/${network}`;

    const pathMap = {
        tx: 'tx',
        object: 'object',
        address: 'account',
    };

    return `${baseUrl}/${pathMap[type]}/${id}`;
}

/**
 * Format a Sui address for display (truncated)
 */
export function formatAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Convert MIST to SUI (1 SUI = 10^9 MIST)
 */
export function mistToSui(mist: bigint | number | string): number {
    return Number(BigInt(mist)) / 1_000_000_000;
}

/**
 * Convert SUI to MIST
 */
export function suiToMist(sui: number): bigint {
    return BigInt(Math.floor(sui * 1_000_000_000));
}
