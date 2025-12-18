# SuiArcade - Web3 Game Launcher

A scalable, Web3-enabled Game Launcher built on the Sui Network.

## Overview

SuiArcade is a "Plug-and-Play" architecture where the website acts as a shell (Launcher) handling authentication, routing, and styling, while individual games can be developed as isolated modules and plugged in later.

## Tech Stack

- **Frontend**: Next.js 16 (React) with App Router
- **Styling**: Tailwind CSS
- **Blockchain**: Sui Network
- **SDKs**: `@mysten/dapp-kit`, `@mysten/sui`
- **State**: Zustand
- **Smart Contracts**: Sui Move

## Project Structure

```
sui-mini-games/
├── contracts/              # Move smart contracts
│   ├── sources/
│   │   └── house.move      # House treasury module
│   └── tests/
│       └── house_tests.move
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # UI Components
│   ├── config/
│   │   └── games.ts        # Game Registry
│   ├── hooks/              # Custom Web3 hooks
│   └── lib/
│       └── sui.ts          # Sui client utilities
└── public/assets/          # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Sui CLI 1.x

### Installation

```bash
cd sui-mini-games
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Smart Contracts

### Build Contracts

```bash
cd contracts
sui move build
```

### Run Tests

```bash
sui move test
```

### Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

## Game Registry

Add new games by updating `src/config/games.ts`:

```typescript
{
  id: 'my-game',
  title: 'My Game',
  description: 'Description here',
  imageUrl: '/assets/my-game-thumb.png',
  status: 'live',
  docsUrl: '#',
  repoUrl: '#',
}
```

## License

MIT
