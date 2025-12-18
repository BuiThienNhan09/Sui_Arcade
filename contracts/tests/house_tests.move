/// House Treasury Tests
/// 
/// Unit tests for the house treasury module
#[test_only]
module minis::house_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self};
    use sui::sui::SUI;
    use minis::house;

    // Test addresses
    const ADMIN: address = @0xAD;
    const PLAYER: address = @0xB0B;

    // ==================== Helper Functions ====================

    fun setup_test(): Scenario {
        ts::begin(ADMIN)
    }

    fun mint_sui(amount: u64, scenario: &mut Scenario): coin::Coin<SUI> {
        coin::mint_for_testing<SUI>(amount, ts::ctx(scenario))
    }

    // ==================== Tests ====================

    #[test]
    /// Test that treasury can be created with zero balance
    fun test_create_treasury() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let treasury = house::create_treasury_for_testing(ctx);
            
            assert!(house::get_balance(&treasury) == 0, 0);
            assert!(house::get_total_payouts(&treasury) == 0, 1);
            assert!(house::get_total_deposits(&treasury) == 0, 2);
            
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }

    #[test]
    /// Test depositing funds into treasury
    fun test_deposit() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut treasury = house::create_treasury_for_testing(ctx);
            
            // Deposit 1000 MIST
            let deposit_coin = mint_sui(1000, &mut scenario);
            house::deposit(&mut treasury, deposit_coin);
            
            assert!(house::get_balance(&treasury) == 1000, 0);
            assert!(house::get_total_deposits(&treasury) == 1000, 1);
            
            // Deposit more
            let deposit_coin2 = mint_sui(500, &mut scenario);
            house::deposit(&mut treasury, deposit_coin2);
            
            assert!(house::get_balance(&treasury) == 1500, 2);
            assert!(house::get_total_deposits(&treasury) == 1500, 3);
            
            // Clean up - we need to withdraw all funds first
            let cap = house::create_house_cap_for_testing(ts::ctx(&mut scenario));
            house::pay_winner(&cap, &mut treasury, 1500, ADMIN, ts::ctx(&mut scenario));
            house::destroy_house_cap_for_testing(cap);
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }

    #[test]
    /// Test paying winner from treasury
    fun test_pay_winner() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut treasury = house::create_treasury_for_testing(ctx);
            let cap = house::create_house_cap_for_testing(ts::ctx(&mut scenario));
            
            // Fund the treasury
            let deposit_coin = mint_sui(1000, &mut scenario);
            house::deposit(&mut treasury, deposit_coin);
            
            // Pay winner 300 MIST
            house::pay_winner(&cap, &mut treasury, 300, PLAYER, ts::ctx(&mut scenario));
            
            assert!(house::get_balance(&treasury) == 700, 0);
            assert!(house::get_total_payouts(&treasury) == 300, 1);
            
            // Clean up
            house::pay_winner(&cap, &mut treasury, 700, ADMIN, ts::ctx(&mut scenario));
            house::destroy_house_cap_for_testing(cap);
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }

    #[test]
    /// Test multiple payouts
    fun test_multiple_payouts() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut treasury = house::create_treasury_for_testing(ctx);
            let cap = house::create_house_cap_for_testing(ts::ctx(&mut scenario));
            
            // Fund the treasury
            let deposit_coin = mint_sui(1000, &mut scenario);
            house::deposit(&mut treasury, deposit_coin);
            
            // Multiple payouts
            house::pay_winner(&cap, &mut treasury, 100, PLAYER, ts::ctx(&mut scenario));
            house::pay_winner(&cap, &mut treasury, 200, PLAYER, ts::ctx(&mut scenario));
            house::pay_winner(&cap, &mut treasury, 150, PLAYER, ts::ctx(&mut scenario));
            
            assert!(house::get_balance(&treasury) == 550, 0);
            assert!(house::get_total_payouts(&treasury) == 450, 1);
            
            // Clean up
            house::pay_winner(&cap, &mut treasury, 550, ADMIN, ts::ctx(&mut scenario));
            house::destroy_house_cap_for_testing(cap);
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = house::EInsufficientBalance)]
    /// Test that payout fails with insufficient balance
    fun test_payout_insufficient_balance() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut treasury = house::create_treasury_for_testing(ctx);
            let cap = house::create_house_cap_for_testing(ts::ctx(&mut scenario));
            
            // Fund with only 100
            let deposit_coin = mint_sui(100, &mut scenario);
            house::deposit(&mut treasury, deposit_coin);
            
            // Try to pay 500 - should fail
            house::pay_winner(&cap, &mut treasury, 500, PLAYER, ts::ctx(&mut scenario));
            
            // Clean up (won't reach here due to expected failure)
            house::destroy_house_cap_for_testing(cap);
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = house::EZeroAmount)]
    /// Test that zero deposit fails
    fun test_zero_deposit() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut treasury = house::create_treasury_for_testing(ctx);
            
            // Try to deposit zero
            let zero_coin = mint_sui(0, &mut scenario);
            house::deposit(&mut treasury, zero_coin);
            
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = house::EZeroAmount)]
    /// Test that zero payout fails
    fun test_zero_payout() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut treasury = house::create_treasury_for_testing(ctx);
            let cap = house::create_house_cap_for_testing(ts::ctx(&mut scenario));
            
            // Fund the treasury
            let deposit_coin = mint_sui(1000, &mut scenario);
            house::deposit(&mut treasury, deposit_coin);
            
            // Try zero payout - should fail
            house::pay_winner(&cap, &mut treasury, 0, PLAYER, ts::ctx(&mut scenario));
            
            house::destroy_house_cap_for_testing(cap);
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }

    #[test]
    /// Test view functions work correctly
    fun test_view_functions() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut treasury = house::create_treasury_for_testing(ctx);
            let cap = house::create_house_cap_for_testing(ts::ctx(&mut scenario));
            
            // Initially all zeros
            assert!(house::get_balance(&treasury) == 0, 0);
            assert!(house::get_total_payouts(&treasury) == 0, 1);
            assert!(house::get_total_deposits(&treasury) == 0, 2);
            
            // After deposit
            let deposit_coin = mint_sui(1000, &mut scenario);
            house::deposit(&mut treasury, deposit_coin);
            
            assert!(house::get_balance(&treasury) == 1000, 3);
            assert!(house::get_total_deposits(&treasury) == 1000, 4);
            
            // After payout
            house::pay_winner(&cap, &mut treasury, 400, PLAYER, ts::ctx(&mut scenario));
            
            assert!(house::get_balance(&treasury) == 600, 5);
            assert!(house::get_total_payouts(&treasury) == 400, 6);
            assert!(house::get_total_deposits(&treasury) == 1000, 7); // Deposits unchanged
            
            // Clean up
            house::pay_winner(&cap, &mut treasury, 600, ADMIN, ts::ctx(&mut scenario));
            house::destroy_house_cap_for_testing(cap);
            house::destroy_treasury_for_testing(treasury);
        };
        
        ts::end(scenario);
    }
}
