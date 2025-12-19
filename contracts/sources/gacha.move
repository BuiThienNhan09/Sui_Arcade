/// Lucky Chests (Gacha) Game Module
/// 
/// Buy chests with SUI and win rewards based on random chance.
/// Uses Sui's on-chain randomness for fair results.
module minis::gacha {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::random::{Self, Random};
    use sui::event;
    use sui::balance::{Self, Balance};

    // --- TREASURY POOL ---
    public struct Treasury has key {
        id: UID,
        balance: Balance<SUI>,
    }

    // --- EVENT ---
    public struct ChestOpened has copy, drop {
        player: address,
        chest_type: u8,
        paid_amount: u64,
        won_amount: u64,
        is_win: bool,
    }

    public struct TreasuryFunded has copy, drop {
        amount: u64,
        new_balance: u64,
    }

    // --- CHEST PRICES ---
    const PRICE_WOOD: u64 = 100_000_000;    // 0.1 SUI
    const PRICE_GOLD: u64 = 500_000_000;    // 0.5 SUI
    const PRICE_DIAMOND: u64 = 1_000_000_000; // 1.0 SUI

    // --- ERROR CODES ---
    const EInsufficientPayment: u64 = 0;
    const EInsufficientTreasury: u64 = 1;
    const EInvalidChestType: u64 = 2;

    // --- INIT ---
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
        };
        transfer::share_object(treasury);
    }

    // --- FUND TREASURY ---
    public fun fund_treasury(
        treasury: &mut Treasury,
        payment: Coin<SUI>
    ) {
        let amount = payment.value();
        treasury.balance.join(payment.into_balance());
        
        event::emit(TreasuryFunded {
            amount,
            new_balance: treasury.balance.value(),
        });
    }

    // --- BUY CHEST ---
    entry fun buy_chest(
        treasury: &mut Treasury,
        chest_rank: u8,
        payment: Coin<SUI>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let value = payment.value();
        let sender = ctx.sender();

        // Validate chest type and get price
        let required_price = if (chest_rank == 1) {
            PRICE_WOOD
        } else if (chest_rank == 2) {
            PRICE_GOLD
        } else if (chest_rank == 3) {
            PRICE_DIAMOND
        } else {
            abort EInvalidChestType
        };
        
        assert!(value >= required_price, EInsufficientPayment);

        // Take payment into treasury
        treasury.balance.join(payment.into_balance());

        // Generate random number 1-100
        let mut generator = random::new_generator(r, ctx);
        let rand_num = random::generate_u8_in_range(&mut generator, 1, 100);

        // Calculate reward
        let (won_amount, is_win) = calculate_reward(chest_rank, rand_num);

        // Check treasury has enough
        assert!(treasury.balance.value() >= won_amount, EInsufficientTreasury);

        // Pay out reward
        let reward_coin = coin::from_balance(treasury.balance.split(won_amount), ctx);
        transfer::public_transfer(reward_coin, sender);

        event::emit(ChestOpened {
            player: sender,
            chest_type: chest_rank,
            paid_amount: required_price,
            won_amount,
            is_win,
        });
    }

    // --- CALCULATE REWARD ---
    fun calculate_reward(chest_rank: u8, rand_num: u8): (u64, bool) {
        if (chest_rank == 1) {
            // Wooden: 10% win rate
            if (rand_num <= 10) {
                (150_000_000, true)  // 0.15 SUI
            } else {
                (50_000_000, false)  // 0.05 SUI
            }
        } else if (chest_rank == 2) {
            // Golden: 50% win rate
            if (rand_num <= 50) {
                (800_000_000, true)  // 0.8 SUI
            } else {
                (300_000_000, false) // 0.3 SUI
            }
        } else {
            // Diamond: 30% win rate
            if (rand_num <= 30) {
                (2_500_000_000, true) // 2.5 SUI
            } else {
                (700_000_000, false)  // 0.7 SUI
            }
        }
    }

    // --- VIEW FUNCTIONS ---
    public fun get_treasury_balance(treasury: &Treasury): u64 {
        treasury.balance.value()
    }
}
