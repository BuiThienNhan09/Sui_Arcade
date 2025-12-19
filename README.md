# SuiArcade - Web3 Game Launcher

A pixel-art styled Web3 Game Launcher built on the Sui Network with real SUI payouts.

## 🎮 Games Available

| Game | Route | Entry | Mechanic |
|------|-------|-------|----------|
| **XO Game** | `/games/xo` | 0.1-1 SUI | Beat AI to win 2x |
| **Loto/Bingo** | `/games/loto` | 0.1-5 SUI | Complete lines for 5x per line |
| **Lucky Chests** | `/games/lucky-chests` | 0.1-1 SUI | Random chance rewards |

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Pixel Art Theme
- **Blockchain**: Sui Network (Testnet)
- **SDKs**: `@mysten/dapp-kit`, `@mysten/sui`
- **Animation**: Framer Motion
- **Smart Contracts**: Sui Move

## Project Structure

```
SuiArcane/
├── contracts/              # Move smart contracts
│   └── sources/
│       ├── house.move      # House treasury
│       ├── xo_game.move    # XO game logic
│       ├── loto_game.move  # Loto/Bingo game
│       └── gacha.move      # Lucky Chests
├── src/
│   ├── app/
│   │   └── games/          # Game pages
│   │       ├── xo/
│   │       ├── loto/
│   │       └── lucky-chests/
│   ├── components/         # UI Components
│   ├── hooks/              # Blockchain hooks
│   └── lib/                # Game logic & contracts
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Sui CLI 1.x (optional, for contract deployment)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Build

```bash
npm run build
```

## Smart Contracts

### Build & Deploy

```bash
cd contracts
sui move build
sui client publish --gas-budget 100000000
```

### Fund Game Pools

```bash
# Fund XO GamePool
sui client call --package <PACKAGE_ID> --module xo_game --function fund_pool --args <POOL_ID> <COIN_ID> --gas-budget 10000000

# Fund Loto Pool
sui client call --package <PACKAGE_ID> --module loto_game --function fund_pool --args <POOL_ID> <COIN_ID> --gas-budget 10000000

# Fund Gacha Treasury
sui client call --package <PACKAGE_ID> --module gacha --function fund_treasury --args <TREASURY_ID> <COIN_ID> --gas-budget 10000000
```

## License

MIT
