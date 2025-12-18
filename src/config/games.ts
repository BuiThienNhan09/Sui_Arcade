export interface GameConfig {
  /** Unique slug (e.g., 'blackjack') */
  id: string;
  /** Display name */
  title: string;
  /** Short description */
  description: string;
  /** Card asset URL */
  imageUrl: string;
  /** Game availability status */
  status: 'live' | 'coming-soon' | 'maintenance';
  /** On-chain contract address (optional) */
  contractAddress?: string;
  /** Documentation URL */
  docsUrl: string;
  /** Repository URL */
  repoUrl: string;
}

export const games: GameConfig[] = [
  {
    id: 'blackjack',
    title: 'Blackjack',
    description: 'Beat the dealer by getting as close to 21 as possible without going over.',
    imageUrl: '/assets/blackjack-thumb.png',
    status: 'live',
    docsUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'satoshi-flip',
    title: 'Satoshi Coin Flip',
    description: 'A simple coin flip game, where you can bet that the result will be either heads or tails.',
    imageUrl: '/assets/coin-thumb.png',
    status: 'live',
    docsUrl: '#',
    repoUrl: '#',
  },
];

/**
 * Get a game configuration by its ID
 */
export function getGameById(id: string): GameConfig | undefined {
  return games.find((game) => game.id === id);
}

/**
 * Get all live games
 */
export function getLiveGames(): GameConfig[] {
  return games.filter((game) => game.status === 'live');
}

/**
 * Get all games grouped by status
 */
export function getGamesByStatus(): Record<GameConfig['status'], GameConfig[]> {
  return {
    live: games.filter((g) => g.status === 'live'),
    'coming-soon': games.filter((g) => g.status === 'coming-soon'),
    maintenance: games.filter((g) => g.status === 'maintenance'),
  };
}
