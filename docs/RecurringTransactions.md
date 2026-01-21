# Powertranz Managed Recurring Transactions

To start a Powertranz managed recurring transaction, you should send an initial financial transaction flagged as recurring, along with a recurring schedule contained in the request.

On each recurring cycle you will charge the cardholder the same amount as the initial amount and please note that **you can not change this amount once you setup a recurring transaction**.

Through this guide, "Recurring Schedule" refers to the full group of scheduled recurrences and "Recurring Cycle" refers to the instance of the recurrence (i.e. monthly or weekly attempt).

Setting up Powertranz Managed Recurring

# [](https://developer.powertranz.com/docs/integration-types#setting-up-powertranz-managed-recurring)

To setup a recurring transaction you should either send an "Authorization" request for start and recurrence in future or a "Sale" request for start on current date and recurrence in future.

To send the initial Auth or Sale request, you can use SPI or FPI endpoints along with 3DS, Fraud, HPP, Tokenization and other supported use cases.

Please note, subsequent recurrences in future process as a non-3DS sale transaction, since the cardholder is not present during the transaction .

Webhook URL

## [](https://developer.powertranz.com/docs/integration-types#webhook-url)

When you setup a recurring transaction by calling Powertranz APIs, you will receive a response to original API call on the Response URL as well as a "**notification**".

This notification contains important information about financial transaction response for the cycle as well as information about schedule.

To receive this notification, you should implement another "Response URL" known as "**Webhook URL**". You will receive notifications on the same Webhook URL for each recurrence as well, when PowerTranz initiates transactions on your behalf in future.

Before implementing recurring functionality, You should reach out to the Powertranz support team to enable the service and provide us with a webhook URL to receive notifications otherwise, you will receive an error for any Powertranz managed recurring requests.

> 📘
>
> ###
>
> Note !
>
> Both a successful (approved) real time financial transaction response and the webhook notification are required to consider the scheduled recurring setup successful. After a successful setup, all future recurrences will be processed as sale transactions.
>
> If you receive a successful authorization response but no notification to the webhook URL, please contact [Powertranz Support](mailto:support@powertranz.bm) to check the status of the of the setup.

Recurring Object

## [](https://developer.powertranz.com/docs/integration-types#recurring-object)

You should pass the Recurring Object and set the **RecurringInitial** field to true to properly register a schedule for a Powertranz managed recurring transaction.

The Recurring object must be included and contain the four mandatory fields to indicate a Powertranz managed recurring request. Please have a look at the below example :

JSON

`

      "Recurring": {
        "Managed": true, //always set to true for Powertranz managed recurring
    			"StartDate":"2024-06-01", //date of the first requested occurrence
    			"ExpiryDate":"2024-12-01", //date that the recurring cycle will be cancelled
        "Frequency": "M" //intended frequency (D,W,F,M,B,Q,S,Y)
    }

`

Currently you can set frequency using one of the following cycles:

Daily(**D**), Weekly(**W**), Fortnightly (every two weeks)(**F**), Monthly(**M**), Bi-Monthly (every other month)(**B**), Quarterly (every three months)(**Q**), Semi-annually (every 6 months)(**S**) or Yearly(**Y**)

Depending on your agreement with cardholder and based on StartDate field :

1.  If you intend to start charging cardholder today (StartDate is equal to today's date) then the initial recurring request is considered to be the first in the cycle and in this case the "Sale" endpoint must be used to setup the recurring transaction. Powertranz will send out a sale transaction to cardholder bank and if successful, will register a managed recurring transaction and send a notification. Your recurring setup is complete at this point.

2.  If the StartDate is in the future, You should use "Auth" endpoint. In this case the initial recurring request will be an authorization only (the day you setup recurring) and the first transaction in the cycle (the day first day you intend to charge your client) will be a "Sale" on the provided start date . Powertranz will send an authorization to cardholder bank and if successful, will register a managed recurring transaction and send a notification. Your recurring setup is complete at this point but to avoid cardholder confusion, you should send a void to release the hold on funds from customer account.

In both cases, if the initial transaction is declined, no notification will be sent and the recurring schedule will not be set up.

And finally, a recurring schedule will automatically be cancelled the day following the expiry date and no more recurrences will run. If the next execution date is the same as the defined expiry date then this will be the last execution.

Sample Request

## [](https://developer.powertranz.com/docs/integration-types#sample-request)

Here is an example of the body of a request for a Powertranz managed recurring request to set up a monthly billing cycle beginning June 1, 2024 and running for one year with the final recurrence running on June 1, 2025.

JSON

`

{
"TransactionIdentifier": "{{$guid}}",//GUID needs to be unique example:40511888-ad35-4bba-8dcb-214f493e185c
"TotalAmount": 1,
"CurrencyCode": "840", //Numeric currency code (ISO 4217). 840 = USD
"ThreeDSecure": true,
"RecurringInitial":true,
"Source": {
"CardPan": "4012000000020006", //Test card
"CardCvv": "123",
"CardExpiration": "2512",
"CardholderName": "John Doe"
},
"OrderIdentifier": "INT-{{$guid}}-Orc",
"AddressMatch": false,
"ExtendedData": {
"Recurring":{
"Managed":true,
"StartDate":"20240601",
"ExpiryDate":"20250601",
"Frequency":"M"
},
"ThreeDSecure": {
"ChallengeWindowSize": 4,
"ChallengeIndicator": "01"
},

        "MerchantResponseUrl": "{{MERCHANT_URL}}" //Please use a valid URL. PowerTranz's servers will send
          //a response to the merchant response url. It's a callback URL.
    }

}

`

Sample Recurring Notifications

## [](https://developer.powertranz.com/docs/integration-types#sample-recurring-notifications)

###

Notification sample - StartDate is Current Date (sale endpoint)

[](https://developer.powertranz.com/docs/integration-types#notification-sample---startdate-is-current-date-sale-endpoint)

Sample for successful recurring setup with StartDate as today's date. Note this also includes the payment response as this was the first transaction.

JSON

`

{
"PowerTranzId": "99990001",
"ResponseMessage": "Recurrence successful",
"ResponseCode": "R0",
"Cycle": 1,
"CycleDate": "20240903",
"AttemptDate": "20240903",
"Attempt": 1,
"NextExecutionDate": "20240910",
"ExpiryDate": "20241023",
"Active": true,
"Frequency": "W",
"InitialTransactionIdentifier": "02d87f82-b01b-4077-90a4-a18ab84a87e8",
"PaymentResponse": {
"TransactionType": 2,
"Approved": true,
"AuthorizationCode": "123456",
"TransactionIdentifier": "02d87f82-b01b-4077-90a4-a18ab84a87e8",
"TotalAmount": 1,
"CurrencyCode": "840",
"RRN": "424721415899",
"CardBrand": "Visa",
"IsoResponseCode": "00",
"ResponseMessage": "Transaction is approved",
"ExternalIdentifier": "My Managed Recurring",
"OrderIdentifier": "638562297798519003"
}
}

`

###

Notification sample - StartDate is Future Date (Auth endpoint)

[](https://developer.powertranz.com/docs/integration-types#notification-sample---startdate-is-future-date-auth-endpoint)

Sample for successful recurring setup with StartDate as a future date. This confirms (along with the real time response) that the schedule will be set up.

JSON

`

{
"PowerTranzId": "99990001",
"ResponseMessage": "Managed recurring setup only",
"ResponseCode": "R1",
"Cycle": 0,
"Attempt": 0,
"NextExecutionDate": "20240904",
"ExpiryDate": "20240908",
"Active": true,
"Frequency": "D",
"InitialTransactionIdentifier": "46acdb9c-51ab-40d7-8aec-6d35fd0a4509"
}

`

Managing Recurring Transactions

# [](https://developer.powertranz.com/docs/integration-types#managing-recurring-transactions)

Now that Powertranz managed transactions have been set up successfully, Powertranz runs a service daily that will pick up a recurrences scheduled to run that day unless the cycle or schedule is canceled.

Cancelling a Recurring Cycle - Powertranz Initiated

## [](https://developer.powertranz.com/docs/integration-types#cancelling-a-recurring-cycle---powertranz-initiated)

Powertranz will cancel a recurring cycle if too many declines are received. If a scheduled recurrence declines, Powertranz will attempt the transaction for the next four days. Once the fifth decline is received, the cycle will be skipped and will not run again until the next scheduled recurrence.

The exception to this is daily recurrences, where retries of a recurring cycle are not supported due to the frequency of the transactions. Daily recurrences will run each day as the next transaction in the cycle and will expire the day following the expiry date.

Cancelling a Recurring Schedule - Merchant Initiated

## [](https://developer.powertranz.com/docs/integration-types#cancelling-a-recurring-schedule---merchant-initiated)

Merchants can cancel the recurring cycle at any time by sending a Recurring Cancellation request to the Management API. You will receive both a real time response as well as a notification to the webhook URL.

Endpoint: **<API Root>/api/admin/recurring/cancel**

###

Sample Recurring Cancellation Request

[](https://developer.powertranz.com/docs/integration-types#sample-recurring-cancellation-request)

JSON

`

{
"RecurringIdentifier": "a3bb76f4-8bcc-4155-a207-eb9448e9ffd4",
}

`

###

Sample Recurring Cancellation Response

[](https://developer.powertranz.com/docs/integration-types#sample-recurring-cancellation-response)

JSON

`

{
"RecurringIdentifier": "a3bb76f4-8bcc-4155-a207-eb9448e9ffd4",
"RequestType": "CancelRecurring",
"IsoResponseCode": "R5",
"ResponseMessage": "Recurring canceled",
"RequestIdentifier": "a1600b83-c0e7-43d9-925c-18c082860ed4"
}

`

###

Sample Recurring Cancellation Notification

[](https://developer.powertranz.com/docs/integration-types#sample-recurring-cancellation-notification)

JSON

`

{
"PowerTranzId": "99990001",
"ResponseMessage": "Recurring canceled",
"ResponseCode": "R5",
"Cycle": 1,
"CycleDate": "20240831",
"AttemptDate": "20240831",
"Attempt": 1,
"ExpiryDate": "20250831",
"Active": false,
"Frequency": "W",
"InitialTransactionIdentifier": "a3bb76f4-8bcc-4155-a207-eb9448e9ffd4"
}

`

> ❗️
>
> ###
>
> Important Note
>
> **After a Powertranz managed recurring schedule has been cancelled, it cannot be reactivated. A new schedule must be setup.**
