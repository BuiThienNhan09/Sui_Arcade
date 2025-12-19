/// XO Game Module
/// 
/// Trustless XO (Tic-Tac-Toe) game with on-chain payouts.
/// Supports 3 board sizes with different economics.
module minis::xo_game {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;

    // ==================== Error Codes ====================
    
    const EInsufficientBalance: u64 = 0;
    const EInvalidEntryFee: u64 = 1;
    const EInvalidBoardSize: u64 = 2;
    const ESessionAlreadyClaimed: u64 = 3;

    // ==================== Constants ====================
    
    // Entry fees in MIST (1 SUI = 1_000_000_000 MIST)
    const ENTRY_FEE_3X3: u64 = 100_000_000;   // 0.1 SUI
    const ENTRY_FEE_6X6: u64 = 500_000_000;   // 0.5 SUI
    const ENTRY_FEE_9X9: u64 = 1_000_000_000; // 1.0 SUI

    // Win payouts
    const WIN_PAYOUT_3X3: u64 = 200_000_000;  // 0.2 SUI
    const WIN_PAYOUT_6X6: u64 = 1_000_000_000; // 1.0 SUI
    const WIN_PAYOUT_9X9: u64 = 2_000_000_000; // 2.0 SUI

    // Tie payouts
    const TIE_PAYOUT_3X3: u64 = 50_000_000;   // 0.05 SUI
    const TIE_PAYOUT_6X6: u64 = 250_000_000;  // 0.25 SUI
    const TIE_PAYOUT_9X9: u64 = 500_000_000;  // 0.5 SUI

    // Board sizes
    const BOARD_3X3: u8 = 3;
    const BOARD_6X6: u8 = 6;
    const BOARD_9X9: u8 = 9;

    // ==================== Structs ====================

    /// Shared pool holding funds for game payouts
    public struct GamePool has key {
        id: UID,
        balance: Balance<SUI>,
        total_games: u64,
        total_payouts: u64,
    }

    /// Individual game session - owned by player
    public struct GameSession has key, store {
        id: UID,
        player: address,
        board_size: u8,
        entry_fee: u64,
        is_claimed: bool,
    }

    // ==================== Events ====================

    public struct GameStarted has copy, drop {
        session_id: ID,
        player: address,
        board_size: u8,
        entry_fee: u64,
    }

    public struct GameEnded has copy, drop {
        session_id: ID,
        player: address,
        result: u8, // 0 = loss, 1 = tie, 2 = win
        payout: u64,
    }

    public struct PoolFunded has copy, drop {
        amount: u64,
        new_balance: u64,
    }

    // ==================== Init ====================

    fun init(ctx: &mut TxContext) {
        let pool = GamePool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_games: 0,
            total_payouts: 0,
        };
        transfer::share_object(pool);
    }

    // ==================== Public Functions ====================

    /// Fund the game pool (anyone can add funds)
    public fun fund_pool(
        pool: &mut GamePool,
        coin: Coin<SUI>,
    ) {
        let amount = coin.value();
        pool.balance.join(coin.into_balance());
        
        event::emit(PoolFunded {
            amount,
            new_balance: pool.balance.value(),
        });
    }

    /// Start a new game by paying entry fee
    public fun start_game(
        pool: &mut GamePool,
        board_size: u8,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ): GameSession {
        // Validate board size
        assert!(
            board_size == BOARD_3X3 || board_size == BOARD_6X6 || board_size == BOARD_9X9,
            EInvalidBoardSize
        );

        // Get required entry fee
        let required_fee = get_entry_fee(board_size);
        assert!(payment.value() >= required_fee, EInvalidEntryFee);

        // Take entry fee into pool
        let payment_balance = payment.into_balance();
        pool.balance.join(payment_balance);
        pool.total_games = pool.total_games + 1;

        let session = GameSession {
            id: object::new(ctx),
            player: ctx.sender(),
            board_size,
            entry_fee: required_fee,
            is_claimed: false,
        };

        event::emit(GameStarted {
            session_id: object::id(&session),
            player: ctx.sender(),
            board_size,
            entry_fee: required_fee,
        });

        session
    }

    /// Claim win payout
    public fun claim_win(
        pool: &mut GamePool,
        session: GameSession,
        ctx: &mut TxContext,
    ) {
        assert!(!session.is_claimed, ESessionAlreadyClaimed);
        
        let payout_amount = get_win_payout(session.board_size);
        assert!(pool.balance.value() >= payout_amount, EInsufficientBalance);

        let payout = coin::from_balance(pool.balance.split(payout_amount), ctx);
        pool.total_payouts = pool.total_payouts + payout_amount;

        event::emit(GameEnded {
            session_id: object::id(&session),
            player: session.player,
            result: 2, // win
            payout: payout_amount,
        });

        transfer::public_transfer(payout, session.player);
        
        // Destroy session
        let GameSession { id, player: _, board_size: _, entry_fee: _, is_claimed: _ } = session;
        object::delete(id);
    }

    /// Claim tie payout
    public fun claim_tie(
        pool: &mut GamePool,
        session: GameSession,
        ctx: &mut TxContext,
    ) {
        assert!(!session.is_claimed, ESessionAlreadyClaimed);
        
        let payout_amount = get_tie_payout(session.board_size);
        assert!(pool.balance.value() >= payout_amount, EInsufficientBalance);

        let payout = coin::from_balance(pool.balance.split(payout_amount), ctx);
        pool.total_payouts = pool.total_payouts + payout_amount;

        event::emit(GameEnded {
            session_id: object::id(&session),
            player: session.player,
            result: 1, // tie
            payout: payout_amount,
        });

        transfer::public_transfer(payout, session.player);
        
        // Destroy session
        let GameSession { id, player: _, board_size: _, entry_fee: _, is_claimed: _ } = session;
        object::delete(id);
    }

    /// Claim loss (no payout, just closes session)
    public fun claim_loss(
        session: GameSession,
    ) {
        assert!(!session.is_claimed, ESessionAlreadyClaimed);

        event::emit(GameEnded {
            session_id: object::id(&session),
            player: session.player,
            result: 0, // loss
            payout: 0,
        });
        
        // Destroy session
        let GameSession { id, player: _, board_size: _, entry_fee: _, is_claimed: _ } = session;
        object::delete(id);
    }

    // ==================== View Functions ====================

    public fun get_pool_balance(pool: &GamePool): u64 {
        pool.balance.value()
    }

    public fun get_total_games(pool: &GamePool): u64 {
        pool.total_games
    }

    public fun get_total_payouts(pool: &GamePool): u64 {
        pool.total_payouts
    }

    // ==================== Helper Functions ====================

    fun get_entry_fee(board_size: u8): u64 {
        if (board_size == BOARD_3X3) {
            ENTRY_FEE_3X3
        } else if (board_size == BOARD_6X6) {
            ENTRY_FEE_6X6
        } else {
            ENTRY_FEE_9X9
        }
    }

    fun get_win_payout(board_size: u8): u64 {
        if (board_size == BOARD_3X3) {
            WIN_PAYOUT_3X3
        } else if (board_size == BOARD_6X6) {
            WIN_PAYOUT_6X6
        } else {
            WIN_PAYOUT_9X9
        }
    }

    fun get_tie_payout(board_size: u8): u64 {
        if (board_size == BOARD_3X3) {
            TIE_PAYOUT_3X3
        } else if (board_size == BOARD_6X6) {
            TIE_PAYOUT_6X6
        } else {
            TIE_PAYOUT_9X9
        }
    }

    // ==================== Test Functions ====================

    #[test_only]
    public fun create_pool_for_testing(ctx: &mut TxContext): GamePool {
        GamePool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_games: 0,
            total_payouts: 0,
        }
    }

    #[test_only]
    public fun destroy_pool_for_testing(pool: GamePool) {
        let GamePool { id, balance, total_games: _, total_payouts: _ } = pool;
        balance::destroy_zero(balance);
        object::delete(id);
    }
}
