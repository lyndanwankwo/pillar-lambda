/*
Class to hold the object definitions for the account information
*/

const util = require("./util");

class AccountContext {
    constructor(data) {
        this.policy = JSON.parse(data).policy;
        this.functionType = JSON.parse(data).operation;
        this.freeWithdrawalAmountLeft = parseInt(this.policy.freeWithdrawalAmountLeft);
        this.freeWithdrawalPercent = parseInt(this.policy.freeWithdrawalPercent)
        this.guaranteedTerm = parseInt(this.policy.guaranteedTerm)
        this.premium = parseInt(this.policy.premium);
        this.startingAccountValue = parseInt(this.policy.startingAccountValue)
        this.endingAccountValue = parseInt(this.policy.endingAccountValue);
        this.surrenderRate = parseInt(this.policy.surrenderRate);
        this.lastTransactionDate = this.policy.lastTransactionDate;
        this.withdrawalAmount = parseInt(this.policy.withdrawalAmount);
        this.yearsValued = parseInt(this.yearsValued);
        this.guaranteedRate = 2.5;
        this.guaranteedRenewalRate = 1;

        // API request object definitions
        this.authBody = JSON.stringify({
            "hostName": "pillar-dev-configeditor.co.sandbox.socotra.com",
            "username": "alice.lee",
            "password": "socotra"
        });
        this.authOptions = {
            method: 'POST',
            body: authBody,
            headers: { 'Content-Type': 'application/json' }
        };
        this.url = "https://api.sandbox.socotra.com";
        this.authUrl = "/account/authenticate";
        this.auxUrl = "/auxData/" + this.policy.locator.toString();
    }

    // Calculate the amount left in the free withdrawal limit
    freeValueLeft() {
        if (util.trimAndLower(this.functionType) === "premium") { return (this.freeWithdrawalPercent / 100) * this.premium }
        if (util.trimAndLower(this.functionType) === "surrender") { return 0; }
        let freeValueLeft = this.freeWithdrawalAmountLeft - this.withdrawalAmount;
        if (freeValueLeft < 0) { freeValueLeft = 0 }
        return freeValueLeft
    }

    // Generate a quote for a quick look
    quoteAccount() {
        return (this.premium * ((1 + this.guaranteedRate)**this.guaranteedTerm))
    }

    // Calculate the number of days since the last transaction
    daysSinceLastTransaction() {
        if (util.trimAndLower(this.functionType) === "premium") { return 0; }
        let initialDate = new Date(this.lastTransactionDate);
        let today = new Date();
        return (today - initialDate);
    }

    // Check what interest rate to use in calculations
    interestRate() {
        let interestRate = 0
        if (util.trimAndLower(this.functionType) === "renewal") {
            interestRate = this.guaranteedRenewalRate
        }
        else {
            interestRate = this.guaranteedRate
        }
        return interestRate;
    }

    // Calculate what the current account value is after interest
    currentAccountValue() {
        if (util.trimAndLower(this.functionType) === "premium") { return 0; }
        let initialDate = new Date(this.lastTransactionDate);
        let today = new Date();
        let currentAccountValue = this.endingAccountValue * ((1 + this.interestRate()) ** ((today - initialDate) / 365))
        return currentAccountValue;
    }

    // Calculate how much surrender charges need to be paid
    surrenderCharge() {
        let surrenderCharge = 0;
        if (util.trimAndLower(this.functionType) === "premium") { return 0; }
        if (util.trimAndLower(this.functionType) === "surrender") { return (this.currentAccountValue() - this.freeWithdrawalAmountLeft) * (this.surrenderRate / 100) }
        let holdback = this.freeWithdrawalAmountLeft - this.withdrawalAmount
        if (holdback < 0) {
            surrenderCharge = (this.withdrawalAmount - this.freeWithdrawalAmountLeft) * (this.surrenderRate / 100)
        }
        return surrenderCharge
    }

    // Return the amount of money disbursed in the transaction after surrender charges
    disbursedAmount() {
        if (util.trimAndLower(this.functionType) === "premium") { return 0; }
        if (util.trimAndLower(this.functionType) === "surrender") { return this.currentAccountValue() - this.surrenderCharge() }
        return (this.withdrawalAmount - this.surrenderCharge());
    }

    //Calculate the new account value after withdrawal
    newEndingValue() {
        if (util.trimAndLower(this.functionType) === "premium") { return this.premium }
        if (util.trimAndLower(this.functionType) === "surrender") { return 0; }
        let newEndingValue = this.currentAccountValue() - this.withdrawalAmount;
        return newEndingValue;
    }

    // Get the interest earned since the last transaction
    interestEarned() {
        if (util.trimAndLower(this.functionType) === "premium") { return 0; }
        if (util.trimAndLower(this.functionType) === "quoteaccount") { return (this.quoteAccount()-this.premium) }
        return (this.currentAccountValue() - this.endingAccountValue);
    }

    // Get the interest earned since the beginning 
    interestYTD() {
        if (util.trimAndLower(this.functionType) === "premium") { return 0; }
        return (this.currentAccountValue() - this.premium);
    }

    // Get the withdrawal amount
    _withdrawalAmount() {
        if (util.trimAndLower(this.functionType) === "surrender") { return this.currentAccountValue(); }
        if (util.trimAndLower(this.functionType) === "premium") { return 0; }
        return this.withdrawalAmount
    }
};

exports.AccountContext = AccountContext;

//TODO: Grab the interest rates from aux data(product locator)
