/// House Treasury Module
/// 
/// Central treasury that manages the SUI balance for all mini-games.
/// Individual games can request payouts from this shared treasury
/// instead of managing their own liquidity pools.
module minis::house {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;

    // ==================== Error Codes ====================
    
    /// Error when trying to withdraw more than available balance
    const EInsufficientBalance: u64 = 0;
    /// Error when amount is zero
    const EZeroAmount: u64 = 1;

    // ==================== Structs ====================

    /// Admin capability for house operations
    /// Only the holder of this capability can perform admin actions
    public struct HouseCap has key, store {
        id: UID,
    }

    /// Shared treasury object that holds the house funds
    public struct HouseTreasury has key {
        id: UID,
        /// The SUI balance held by the house
        balance: Balance<SUI>,
        /// Total amount paid out to winners (for analytics)
        total_payouts: u64,
        /// Total amount deposited (for analytics)
        total_deposits: u64,
    }

    // ==================== Events ====================

    /// Emitted when funds are deposited into the treasury
    public struct DepositEvent has copy, drop {
        amount: u64,
        new_balance: u64,
    }

    /// Emitted when a winner is paid out
    public struct PayoutEvent has copy, drop {
        amount: u64,
        recipient: address,
        remaining_balance: u64,
    }

    // ==================== Init ====================

    /// Initialize the house treasury and create admin capability
    fun init(ctx: &mut TxContext) {
        // Create the admin capability and transfer to deployer
        let house_cap = HouseCap {
            id: object::new(ctx),
        };
        transfer::transfer(house_cap, ctx.sender());

        // Create the shared treasury
        let treasury = HouseTreasury {
            id: object::new(ctx),
            balance: balance::zero(),
            total_payouts: 0,
            total_deposits: 0,
        };
        transfer::share_object(treasury);
    }

    // ==================== Public Functions ====================

    /// Deposit SUI into the house treasury
    /// Anyone can deposit to fund the house
    public fun deposit(
        treasury: &mut HouseTreasury,
        coin: Coin<SUI>,
    ) {
        let amount = coin.value();
        assert!(amount > 0, EZeroAmount);

        let coin_balance = coin.into_balance();
        treasury.balance.join(coin_balance);
        treasury.total_deposits = treasury.total_deposits + amount;

        event::emit(DepositEvent {
            amount,
            new_balance: treasury.balance.value(),
        });
    }

    /// Pay out winnings to a player
    /// This function should be called by authorized game contracts
    /// For now, we use the HouseCap for authorization
    public fun pay_winner(
        _cap: &HouseCap,
        treasury: &mut HouseTreasury,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        assert!(amount > 0, EZeroAmount);
        assert!(treasury.balance.value() >= amount, EInsufficientBalance);

        let payout_balance = treasury.balance.split(amount);
        let payout_coin = coin::from_balance(payout_balance, ctx);
        
        treasury.total_payouts = treasury.total_payouts + amount;

        event::emit(PayoutEvent {
            amount,
            recipient,
            remaining_balance: treasury.balance.value(),
        });

        transfer::public_transfer(payout_coin, recipient);
    }

    // ==================== View Functions ====================

    /// Get the current balance of the treasury
    public fun get_balance(treasury: &HouseTreasury): u64 {
        treasury.balance.value()
    }

    /// Get total payouts made
    public fun get_total_payouts(treasury: &HouseTreasury): u64 {
        treasury.total_payouts
    }

    /// Get total deposits made
    public fun get_total_deposits(treasury: &HouseTreasury): u64 {
        treasury.total_deposits
    }

    // ==================== Test Functions ====================

    #[test_only]
    /// Create a HouseCap for testing purposes
    public fun create_house_cap_for_testing(ctx: &mut TxContext): HouseCap {
        HouseCap {
            id: object::new(ctx),
        }
    }

    #[test_only]
    /// Create a HouseTreasury for testing purposes
    public fun create_treasury_for_testing(ctx: &mut TxContext): HouseTreasury {
        HouseTreasury {
            id: object::new(ctx),
            balance: balance::zero(),
            total_payouts: 0,
            total_deposits: 0,
        }
    }

    #[test_only]
    /// Destroy HouseCap after testing
    public fun destroy_house_cap_for_testing(cap: HouseCap) {
        let HouseCap { id } = cap;
        object::delete(id);
    }

    #[test_only]
    /// Destroy HouseTreasury after testing
    public fun destroy_treasury_for_testing(treasury: HouseTreasury) {
        let HouseTreasury { id, balance, total_payouts: _, total_deposits: _ } = treasury;
        balance::destroy_zero(balance);
        object::delete(id);
    }
}
