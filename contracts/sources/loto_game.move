/// Loto/Bingo Game Module
/// 
/// 5x5 Bingo with 40 number draws.
/// Players bet 0.1, 0.5, 1, or 5 SUI.
/// Win 5x bet per completed line (max 12 lines).
module minis::loto_game {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;

    // ==================== Error Codes ====================
    
    const EInsufficientBalance: u64 = 0;
    const EInvalidBetAmount: u64 = 1;
    const EInvalidLinesWon: u64 = 2;
    const ESessionAlreadyClaimed: u64 = 3;

    // ==================== Constants ====================
    
    // Valid bet amounts in MIST
    const BET_01_SUI: u64 = 100_000_000;    // 0.1 SUI
    const BET_05_SUI: u64 = 500_000_000;    // 0.5 SUI
    const BET_1_SUI: u64 = 1_000_000_000;   // 1 SUI
    const BET_5_SUI: u64 = 5_000_000_000;   // 5 SUI

    // Multiplier per winning line
    const WIN_MULTIPLIER: u64 = 5;

    // Maximum possible winning lines (5 rows + 5 cols + 2 diags)
    const MAX_LINES: u64 = 12;

    // ==================== Structs ====================

    /// Shared pool for Loto game payouts
    public struct LotoPool has key {
        id: UID,
        balance: Balance<SUI>,
        total_games: u64,
        total_payouts: u64,
    }

    /// Game session - owned by player
    public struct LotoSession has key, store {
        id: UID,
        player: address,
        bet_amount: u64,
        is_claimed: bool,
    }

    // ==================== Events ====================

    public struct GameStarted has copy, drop {
        session_id: ID,
        player: address,
        bet_amount: u64,
    }

    public struct GameEnded has copy, drop {
        session_id: ID,
        player: address,
        lines_won: u64,
        payout: u64,
    }

    public struct PoolFunded has copy, drop {
        amount: u64,
        new_balance: u64,
    }

    // ==================== Init ====================

    fun init(ctx: &mut TxContext) {
        let pool = LotoPool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_games: 0,
            total_payouts: 0,
        };
        transfer::share_object(pool);
    }

    // ==================== Public Functions ====================

    /// Fund the pool
    public fun fund_pool(pool: &mut LotoPool, coin: Coin<SUI>) {
        let amount = coin.value();
        pool.balance.join(coin.into_balance());
        
        event::emit(PoolFunded {
            amount,
            new_balance: pool.balance.value(),
        });
    }

    /// Start a new game
    public fun start_game(
        pool: &mut LotoPool,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ): LotoSession {
        let bet_amount = payment.value();
        
        // Validate bet amount
        assert!(
            bet_amount == BET_01_SUI || 
            bet_amount == BET_05_SUI || 
            bet_amount == BET_1_SUI || 
            bet_amount == BET_5_SUI,
            EInvalidBetAmount
        );

        // Take bet into pool
        pool.balance.join(payment.into_balance());
        pool.total_games = pool.total_games + 1;

        let session = LotoSession {
            id: object::new(ctx),
            player: ctx.sender(),
            bet_amount,
            is_claimed: false,
        };

        event::emit(GameStarted {
            session_id: object::id(&session),
            player: ctx.sender(),
            bet_amount,
        });

        session
    }

    /// Claim reward based on lines won
    public fun claim_reward(
        pool: &mut LotoPool,
        session: LotoSession,
        lines_won: u64,
        ctx: &mut TxContext,
    ) {
        assert!(!session.is_claimed, ESessionAlreadyClaimed);
        assert!(lines_won <= MAX_LINES, EInvalidLinesWon);

        let payout = if (lines_won > 0) {
            session.bet_amount * WIN_MULTIPLIER * lines_won
        } else {
            0
        };

        if (payout > 0) {
            assert!(pool.balance.value() >= payout, EInsufficientBalance);
            let payout_coin = coin::from_balance(pool.balance.split(payout), ctx);
            pool.total_payouts = pool.total_payouts + payout;
            transfer::public_transfer(payout_coin, session.player);
        };

        event::emit(GameEnded {
            session_id: object::id(&session),
            player: session.player,
            lines_won,
            payout,
        });

        // Destroy session
        let LotoSession { id, player: _, bet_amount: _, is_claimed: _ } = session;
        object::delete(id);
    }

    // ==================== View Functions ====================

    public fun get_pool_balance(pool: &LotoPool): u64 {
        pool.balance.value()
    }

    public fun get_total_games(pool: &LotoPool): u64 {
        pool.total_games
    }

    // ==================== Test Functions ====================

    #[test_only]
    public fun create_pool_for_testing(ctx: &mut TxContext): LotoPool {
        LotoPool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_games: 0,
            total_payouts: 0,
        }
    }

    #[test_only]
    public fun destroy_pool_for_testing(pool: LotoPool) {
        let LotoPool { id, balance, total_games: _, total_payouts: _ } = pool;
        balance::destroy_zero(balance);
        object::delete(id);
    }
}
