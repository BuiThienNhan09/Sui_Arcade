# SuiArcade - Web3 Game Launcher

SuiArcade là nền tảng game phi tập trung được xây dựng trên Sui blockchain, bao gồm các trò chơi kinh điển như Rương may mắn, Cờ Caro (XO), và Lô Tô. Trải nghiệm gaming công bằng minh bạch với giao dịch tức thì, sở hữu thật sự tài sản trong game, và phần thưởng on-chain rõ ràng. Chơi game yêu thích của bạn và kiếm giá trị thực trong kỷ nguyên Web3.

---

## �️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Game UI    │  │  Hooks       │  │  @mysten/dapp-kit    │  │
│  │  Components  │──│  useXOGame   │──│  Wallet Connection   │  │
│  │              │  │  useLotoGame │  │  Transaction Signing │  │
│  └──────────────┘  │  useGacha    │  └──────────────────────┘  │
│                    └──────────────┘                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ JSON-RPC
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Sui Blockchain (Testnet)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Smart Contracts (Move Modules)                 │ │
│  ├────────────────┬────────────────┬────────────────┬─────────┤ │
│  │   xo_game      │   loto_game    │     gacha      │  house  │ │
│  │   ─────────    │   ──────────   │    ───────     │ ─────── │ │
│  │   GamePool     │   LotoPool     │   Treasury     │  Admin  │ │
│  │   GameSession  │   sui::random  │   sui::random  │         │ │
│  └────────────────┴────────────────┴────────────────┴─────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Shared Objects                         │   │
│  │  • GamePool (XO)   - Holds SUI for XO payouts            │   │
│  │  • LotoPool (Loto) - Holds SUI for Loto payouts          │   │
│  │  • Treasury (Gacha)- Holds SUI for Lucky Chests payouts  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### How SuiArcade Utilizes Sui

| Sui Feature | Usage |
|------------|-------|
| **Shared Objects** | Game pools are shared objects that hold SUI funds and can be accessed by any player |
| **`sui::random`** | On-chain randomness for Loto draw sequences and Lucky Chests rewards |
| **Events** | `GameEnded`, `ChestOpened`, `PoolFunded` events for transparent transaction history |
| **Object-Centric Model** | Each game session is an owned object transferred to the player's address |
| **PTB (Programmable Transaction Blocks)** | Compose bet → play → payout in a single atomic transaction |

---

## 🎮 Games & On-Chain Status

| Game | On-Chain Logic | Randomness | Status |
|------|---------------|------------|--------|
| **Lucky Chests** | ✅ Full | `sui::random` | **Fully On-Chain** |
| **Loto/Bingo** | ✅ Full | `sui::random` | **Fully On-Chain** |
| **XO Game** | ⚠️ Partial | Client-side | Game result trusted from frontend |

### Lucky Chests (Gacha) - Fully On-Chain

```
Player ──► buy_chest(treasury, payment, chest_type, Random) ──► Contract
                                                                    │
                    ┌───────────────────────────────────────────────┘
                    ▼
           ┌───────────────────────┐
           │  sui::random          │
           │  generate_u8(1-100)   │
           └───────────────────────┘
                    │
                    ▼
           ┌───────────────────────┐
           │  calculate_reward()   │
           │  Win: 10-50% chance   │
           │  Return SUI to player │
           └───────────────────────┘
                    │
                    ▼
           ChestOpened Event (player, chest_type, won_amount, is_win)
```

### Loto - Fully On-Chain

```
Player ──► play_game(pool, payment, card_numbers[24], Random) ──► Contract
                                                                      │
                    ┌─────────────────────────────────────────────────┘
                    ▼
           ┌───────────────────────────┐
           │  generate_draw_sequence() │
           │  40 unique numbers 1-75   │
           │  using sui::random        │
           └───────────────────────────┘
                    │
                    ▼
           ┌───────────────────────────┐
           │  calculate_lines_won()    │
           │  Check rows, cols, diags  │
           │  Center = FREE space      │
           └───────────────────────────┘
                    │
                    ▼
           GamePlayed Event (player, draw_sequence, lines_won, payout)
                    │
                    ▼
           Frontend animates draw sequence from event data
```

### XO Game - Partially On-Chain

```
Player ──► start_game(pool, payment, board_size) ──► Contract ──► GameSession
                                                                      │
           ┌──────────────────────────────────────────────────────────┘
           ▼
    [Client-Side Game Play]
    Player vs AI (minimax)
           │
           ▼
Player ──► claim_win/claim_tie/claim_loss(pool, session) ──► Contract
                                                                  │
                              ⚠️ Trusts frontend result           │
                                                                  ▼
                                                          GameEnded Event
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS, Pixel Art Theme |
| **Animation** | Framer Motion |
| **Blockchain** | Sui Network (Testnet) |
| **SDK** | `@mysten/dapp-kit` v0.17, `@mysten/sui` v1.24 |
| **Contracts** | Sui Move 2024.1 |
| **Randomness** | `sui::random` (on-chain VRF) |

---

## 📁 Project Structure

```
SuiArcane/
├── contracts/                    # Move smart contracts
│   └── sources/
│       ├── house.move            # House treasury admin
│       ├── xo_game.move          # XO game pool & sessions
│       ├── loto_game.move        # Loto with sui::random
│       └── gacha.move            # Lucky Chests with sui::random
├── src/
│   ├── app/
│   │   └── games/
│   │       ├── xo/page.tsx       # XO game UI
│   │       ├── loto/page.tsx     # Loto game UI
│   │       └── lucky-chests/     # Gacha game UI
│   ├── components/
│   │   ├── games/                # Game-specific components
│   │   └── layers/               # Parallax homepage layers
│   ├── hooks/
│   │   ├── useXOGame.ts          # XO blockchain hook
│   │   ├── useLotoGame.ts        # Loto blockchain hook
│   │   └── useGachaGame.ts       # Gacha blockchain hook
│   └── lib/
│       ├── xoContract.ts         # XO contract config
│       ├── lotoContract.ts       # Loto contract config
│       ├── gachaContract.ts      # Gacha contract config
│       ├── xoLogic.ts            # XO game utilities
│       └── lotoLogic.ts          # Loto game utilities
└── public/                       # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Sui CLI 1.x (for contract deployment)
- Sui Wallet browser extension

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

---

## 📜 Smart Contracts

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

---

## 📄 License

MIT
