/// Loto/Bingo Game Module
/// 
/// 5x5 Bingo with 40 number draws.
/// Players bet 0.1, 0.5, 1, or 5 SUI.
/// Win 5x bet per completed line (max 12 lines).
/// Uses Sui's on-chain randomness for fair draw sequence.
module minis::loto_game {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::random::{Self, Random};

    // ==================== Error Codes ====================
    
    const EInsufficientBalance: u64 = 0;
    const EInvalidBetAmount: u64 = 1;
    const EInvalidLinesWon: u64 = 2;
    const EInvalidCardSize: u64 = 3;

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

    // Draw count
    const DRAW_COUNT: u64 = 40;

    // Card size (24 numbers + 1 FREE space)
    const CARD_SIZE: u64 = 24;

    // ==================== Structs ====================

    /// Shared pool for Loto game payouts
    public struct LotoPool has key {
        id: UID,
        balance: Balance<SUI>,
        total_games: u64,
        total_payouts: u64,
    }

    // ==================== Events ====================

    public struct GamePlayed has copy, drop {
        player: address,
        bet_amount: u64,
        card_numbers: vector<u8>,
        draw_sequence: vector<u8>,
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

    /// Play a complete game with on-chain randomness
    /// card_numbers: 24 numbers the player selected (1-75)
    entry fun play_game(
        pool: &mut LotoPool,
        payment: Coin<SUI>,
        card_numbers: vector<u8>,
        r: &Random,
        ctx: &mut TxContext,
    ) {
        let bet_amount = payment.value();
        let player = ctx.sender();
        
        // Validate bet amount
        assert!(
            bet_amount == BET_01_SUI || 
            bet_amount == BET_05_SUI || 
            bet_amount == BET_1_SUI || 
            bet_amount == BET_5_SUI,
            EInvalidBetAmount
        );

        // Validate card size
        assert!(card_numbers.length() == CARD_SIZE, EInvalidCardSize);

        // Take bet into pool
        pool.balance.join(payment.into_balance());
        pool.total_games = pool.total_games + 1;

        // Generate random draw sequence (40 unique numbers from 1-75)
        let draw_sequence = generate_draw_sequence(r, ctx);

        // Calculate winning lines
        let lines_won = calculate_lines_won(&card_numbers, &draw_sequence);

        // Calculate payout
        let payout = if (lines_won > 0) {
            bet_amount * WIN_MULTIPLIER * lines_won
        } else {
            0
        };

        // Pay out winnings
        if (payout > 0) {
            assert!(pool.balance.value() >= payout, EInsufficientBalance);
            let payout_coin = coin::from_balance(pool.balance.split(payout), ctx);
            pool.total_payouts = pool.total_payouts + payout;
            transfer::public_transfer(payout_coin, player);
        };

        // Emit event with all game data (frontend reads this for animation)
        event::emit(GamePlayed {
            player,
            bet_amount,
            card_numbers,
            draw_sequence,
            lines_won,
            payout,
        });
    }

    // ==================== Internal Functions ====================

    /// Generate 40 unique random numbers from 1-75
    fun generate_draw_sequence(r: &Random, ctx: &mut TxContext): vector<u8> {
        let mut generator = random::new_generator(r, ctx);
        let mut draws: vector<u8> = vector::empty();
        let mut used: vector<bool> = vector::empty();
        
        // Initialize used array (indices 0-75, we'll use 1-75)
        let mut i: u64 = 0;
        while (i <= 75) {
            used.push_back(false);
            i = i + 1;
        };

        // Generate 40 unique numbers
        while (draws.length() < DRAW_COUNT) {
            let num = random::generate_u8_in_range(&mut generator, 1, 75);
            let idx = (num as u64);
            if (!*used.borrow(idx)) {
                *used.borrow_mut(idx) = true;
                draws.push_back(num);
            };
        };

        draws
    }

    /// Calculate winning lines based on card and draws
    fun calculate_lines_won(card: &vector<u8>, draws: &vector<u8>): u64 {
        // Build 5x5 grid marking matched cells
        // Grid layout: [0-4]=row0, [5-9]=row1, etc.
        // Center (index 12) is FREE space
        let mut matched: vector<bool> = vector::empty();
        let mut i: u64 = 0;
        
        // Fill first 12 positions from card[0..11]
        while (i < 12) {
            let num = *card.borrow(i);
            matched.push_back(is_drawn(num, draws));
            i = i + 1;
        };
        
        // Position 12 is FREE (always matched)
        matched.push_back(true);
        
        // Fill remaining 12 positions from card[12..23]
        while (i < 24) {
            let num = *card.borrow(i);
            matched.push_back(is_drawn(num, draws));
            i = i + 1;
        };

        let mut lines: u64 = 0;

        // Check 5 rows
        if (check_row(&matched, 0)) { lines = lines + 1; };
        if (check_row(&matched, 1)) { lines = lines + 1; };
        if (check_row(&matched, 2)) { lines = lines + 1; };
        if (check_row(&matched, 3)) { lines = lines + 1; };
        if (check_row(&matched, 4)) { lines = lines + 1; };

        // Check 5 columns
        if (check_col(&matched, 0)) { lines = lines + 1; };
        if (check_col(&matched, 1)) { lines = lines + 1; };
        if (check_col(&matched, 2)) { lines = lines + 1; };
        if (check_col(&matched, 3)) { lines = lines + 1; };
        if (check_col(&matched, 4)) { lines = lines + 1; };

        // Check 2 diagonals
        if (check_diag1(&matched)) { lines = lines + 1; };
        if (check_diag2(&matched)) { lines = lines + 1; };

        lines
    }

    fun is_drawn(num: u8, draws: &vector<u8>): bool {
        let mut i: u64 = 0;
        while (i < draws.length()) {
            if (*draws.borrow(i) == num) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun check_row(matched: &vector<bool>, row: u64): bool {
        let start = row * 5;
        *matched.borrow(start) && 
        *matched.borrow(start + 1) && 
        *matched.borrow(start + 2) && 
        *matched.borrow(start + 3) && 
        *matched.borrow(start + 4)
    }

    fun check_col(matched: &vector<bool>, col: u64): bool {
        *matched.borrow(col) && 
        *matched.borrow(col + 5) && 
        *matched.borrow(col + 10) && 
        *matched.borrow(col + 15) && 
        *matched.borrow(col + 20)
    }

    fun check_diag1(matched: &vector<bool>): bool {
        // Top-left to bottom-right: 0, 6, 12, 18, 24
        *matched.borrow(0) && 
        *matched.borrow(6) && 
        *matched.borrow(12) && 
        *matched.borrow(18) && 
        *matched.borrow(24)
    }

    fun check_diag2(matched: &vector<bool>): bool {
        // Top-right to bottom-left: 4, 8, 12, 16, 20
        *matched.borrow(4) && 
        *matched.borrow(8) && 
        *matched.borrow(12) && 
        *matched.borrow(16) && 
        *matched.borrow(20)
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
