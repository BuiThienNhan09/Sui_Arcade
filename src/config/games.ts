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
    id: 'xo',
    title: 'XO',
    description: 'Classic Tic Tac Toe game.',
    imageUrl: '/assets/xo_game.webp',
    status: 'live',
    docsUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'loto',
    title: 'Loto',
    description: 'Try your luck with Bingo numbers.',
    imageUrl: '/assets/bingo_game.webp',
    status: 'live',
    docsUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'lucky-chests',
    title: 'Lucky Chests',
    description: 'Open chests to find hidden treasures.',
    imageUrl: '/assets/lucky_chest_game.webp',
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
