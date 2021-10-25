/*
Main entry point for the lambda API
*/

const { AccountContext } = require("./accountContext");
const testData = require("./testData.json");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//exports.handler = async (event) => {  //Uncomment for AWS
    //let data = event.body  //Uncomment for AWS
    let data = testData  //Uncomment for local testing
    // Initiate the account class
    const accountCalc = new AccountContext(data); 
    // Return object to be filled with return data
    var returnObject = {};
    // Return function for a simple account quote
    if (accountCalc.functionType === "quoteAccount") {
        returnObject["projectedValue"] = accountCalc.quoteAccount();
        returnObject["interestEarned"] = accountCalc.interestEarned();
        returnObject["interestRate"] = accountCalc.interestRate();
        // Return as API response
        const response = {
            statusCode: 200,
            body: JSON.stringify(returnObject),
        };
        return response;
    }
    // Return object for an account balance calculation
    else if (accountCalc.functionType === "checkAccountBalance")
    {
        returnObject["withdrawalAmount"] = accountCalc._withdrawalAmount();
        returnObject["surrenderCharges"] = accountCalc.surrenderCharge();
        returnObject["amountDisbursed"] = accountCalc.disbursedAmount();
        returnObject["startingAccountValue"] = accountCalc.currentAccountValue();
        returnObject["endingAccountValue"] = accountCalc.newEndingValue();
        returnObject["freeWithdrawalAmountLeft"] = accountCalc.freeValueLeft();
        returnObject["interestEarned"] = accountCalc.interestEarned();
        returnObject["interestYTD"] = accountCalc.interestYTD();
        returnObject["lastTransactionDate"] = new Date();
        returnObject["interestRate"] = accountCalc.interestRate();
        // Return as API response
        const response = {
            statusCode: 200,
            body: JSON.stringify(returnObject),
        };
        return response;
    }
    // Return object for any other transaction type
    else {
        returnObject["withdrawalAmount"] = accountCalc._withdrawalAmount();
        returnObject["surrenderCharges"] = accountCalc.surrenderCharge();
        returnObject["amountDisbursed"] = accountCalc.disbursedAmount();
        returnObject["startingAccountValue"] = accountCalc.currentAccountValue();
        returnObject["endingAccountValue"] = accountCalc.newEndingValue();
        returnObject["freeWithdrawalAmountLeft"] = accountCalc.freeValueLeft();
        returnObject["interestEarned"] = accountCalc.interestEarned();
        returnObject["interestYTD"] = accountCalc.interestYTD();
        returnObject["lastTransactionDate"] = new Date();
        returnObject["interestRate"] = accountCalc.interestRate();

        // Async function to post the return object to aux data (policy locator as aux locator)
        async function postAuxData() {
            // Fetch auth token
            const auth = await fetch(accountCalc.url + accountCalc.authUrl, accountCalc.authOptions).then(response => response.json());
            // Define object to post to Aux data
            for (const [key, value] of Object.entries(returnObject)) {
                var raw = JSON.stringify({
                    auxData: {
                        key: key,
                        value: value,
                        uiType: "normal"
                    }
                });
                // Decorate API object for fetch call. Use auth token response from above
                var setAuxOptions = {
                    method: 'PUT',
                    body: raw,
                    headers: { 'Authorization': auth.authorizationToken, 'Content-Type': 'application/json', 'Accept': 'application/json', }
                }
                // Post data to aux data
                const aux = await fetch(accountCalc.url + accountCalc.auxUrl, setAuxOptions).then(response => response.text())
                    .catch(err => console.log(err));
            }
        }
        postAuxData();

        // Return as API response
        const response = {
            statusCode: 200,
            body: JSON.stringify(returnObject),
        };
        return response;
        }

//};  //Uncomment for AWS

// TODO: Create another aux data push to keep track of historical data