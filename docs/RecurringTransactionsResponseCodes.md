Recurring Notification Response Codes
When the Powertranz managed recurrences run on the defined schedule, a notification will be sent to the webhook URL provided during setup. you should analyze the response codes and decide about next steps.

Here is a table with possible response codes with details about them.

ResponseCode Description Note
R0 Recurrence successful. Initial or subsequent recurrence is successful and PaymentResponse.IsoResponseCode=00 shows the financial transaction is approved.
R1 Managed recurring setup successful. Your recurring transaction setup is successful. You will receive this response code when you set up recurring transaction using Auth or /SPI/Auth endpoint with a StartDate in the future. Please note, Payment Response will not be provided. Your Authorization transaction was approved but was not captured.
R4 Recurrence successful for last execution. Recurrence is expiring. This is your last recurrence and PaymentResponse.IsoResponseCode shows your financial transaction results. Your recurring transaction last cycle has been completed.
RD0 Recurrence was not approved. Subsequent recurrence was processed but financial transaction was not approved. please check PaymentResponse.IsoResponseCode to find out more about the reason for decline.
RD1 Recurrence was not approved. Further recurrences are expired. This is your last recurrence. all attempts on your last recurrent transaction were declined. please check PaymentResponse.IsoResponseCode to find out more about the reason for decline.
RD2 Recurrence was not approved. Further attempts not allowed and recurring cycle is cancelled. This is your last recurrence. all attempts on your recurring transaction were declined.please check PaymentResponse.IsoResponseCode to find out more about the reason for decline. your recurrency is Canceled.
RD3 Recurrence was not approved. Further attempts not allowed and recurring cycle is skipped. All attempts on this recurring transaction were declined. Please check PaymentResponse.IsoResponseCode to find out more about the reason for decline. your recurrency is active and will be processed on next cycle.
RE Recurring error. Initial recurring failed as first notification was not successful. Your financial transaction will be reversed and recurring setup is not successful .This error code will be sent in API response to your first call ( to setup recurring) if your webhook endpoint times out. To acknowledge notifications a HTTP 200 is expected from your webhook endpoint. Additional details in Errors object
RE Recurring error Your recurring transaction is not successful . Please contact Powertranz support team. Additional details in Errors object.
R5 Recurring canceled Recurring cancellation was successful.
Samples

Please have a look to a few samples that might give you a better idea about recurring notifications with different response codes.

Recurrence successful

JSON

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
Managed recurring setup successful

JSON

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
Recurrence successful for last execution. Recurrence is expiring

JSON

{
"PowerTranzId": "99990001",
"ResponseMessage": "Successful. Last execution: recurrence is expiring.",
"ResponseCode": "R4",
"Cycle": 3,
"CycleDate": "20240917",
"AttemptDate": "20240917",
"Attempt": 1,
"ExpiryDate": "20240917",
"Active": false,
"Frequency": "W",
"InitialTransactionIdentifier": "25e9c9c1-af32-4750-8983-3f139aad9d24",
"PaymentResponse": {
"TransactionType": 2,
"Approved": true,
"AuthorizationCode": "123456",
"TransactionIdentifier": "77f51319-6ea5-485b-a3b2-5a57db62af5e",
"TotalAmount": 1,
"CurrencyCode": "840",
"RRN": "424723734679",
"CardBrand": "Visa",
"IsoResponseCode": "00",
"ResponseMessage": "Transaction is approved",
"ExternalIdentifier": "My Managed Recurring",
"OrderIdentifier": "638562307518852834-4"
}
}
Recurrence was not approved

JSON

{
"PowerTranzId": "99990001",
"ResponseMessage": "Recurrence not approved",
"ResponseCode": "RD0",
"Cycle": 4,
"CycleDate": "20240924",
"AttemptDate": "20240924",
"Attempt": 1,
"NextExecutionDate": "20241001",
"ExpiryDate": "20241023",
"Active": true,
"Frequency": "W",
"InitialTransactionIdentifier": "02d87f82-b01b-4077-90a4-a18ab84a87e8",
"PaymentResponse": {
"TransactionType": 2,
"Approved": false,
"TransactionIdentifier": "5d926ce0-74ce-4e12-a963-ddae55359b90",
"TotalAmount": 1,
"CurrencyCode": "840",
"RRN": "424721415910",
"CardBrand": "Visa",
"IsoResponseCode": "05",
"ResponseMessage": "Transaction is declined",
"ExternalIdentifier": "My Managed Recurring",
"OrderIdentifier": "638562297798519003-3"
}
}
Recurrence was not approved and further recurrences are expired

JSON

{
"PowerTranzId": "99990001",
"ResponseMessage": "Not approved. Further recurrences are expired.",
"ResponseCode": "RD1",
"Cycle": 3,
"CycleDate": "20240917",
"AttemptDate": "20240917",
"Attempt": 1,
"ExpiryDate": "20240917",
"Active": false,
"Frequency": "W",
"InitialTransactionIdentifier": "86ad1fe1-5b57-496b-bde3-4390f1698e96",
"PaymentResponse": {
"TransactionType": 2,
"Approved": false,
"TransactionIdentifier": "d32aea53-0cff-4e26-b5a4-812cc0bbc30a",
"TotalAmount": 1,
"CurrencyCode": "840",
"RRN": "424723415950",
"CardBrand": "Visa",
"IsoResponseCode": "98",
"ResponseMessage": "Transaction is declined",
"ExternalIdentifier": "My Managed Recurring",
"OrderIdentifier": "638562297798519003-3"
}
}
Recurrence was not approved, further attempts not allowed and recurring cycle is cancelled

JSON

{
"PowerTranzId": "99990001",
"ResponseMessage": "Not approved. Further attempts disallowed. Recurring is canceled.",
"ResponseCode": "RD2",
"Cycle": 8,
"CycleDate": "20241022",
"AttemptDate": "20241023",
"Attempt": 2,
"ExpiryDate": "20241023",
"Active": false,
"Frequency": "W",
"InitialTransactionIdentifier": "02d87f82-b01b-4077-90a4-a18ab84a87e8",
"PaymentResponse": {
"TransactionType": 2,
"Approved": false,
"TransactionIdentifier": "54c91a89-56f2-471f-9789-b6ec3373266d",
"TotalAmount": 1,
"CurrencyCode": "840",
"RRN": "424722415938",
"CardBrand": "Visa",
"IsoResponseCode": "98",
"ResponseMessage": "Transaction is declined",
"ExternalIdentifier": "My Managed Recurring",
"OrderIdentifier": "638561468490838711-2"
}
}
Recurrence was not approved, further attempts not allowed and recurring cycle is skipped

JSON

{
"PowerTranzId": "99990001",
"ResponseMessage": "Not approved. Further attempts disallowed. Cycle skipped.",
"ResponseCode": "RD3",
"Cycle": 4,
"CycleDate": "20240924",
"AttemptDate": "20240925",
"Attempt": 2,
"NextExecutionDate": "20241001",
"ExpiryDate": "20241023",
"Active": true,
"Frequency": "W",
"InitialTransactionIdentifier": "02d87f82-b01b-4077-90a4-a18ab84a87e8",
"PaymentResponse": {
"TransactionType": 2,
"Approved": false,
"TransactionIdentifier": "002cd64d-41d4-4735-8011-f80150eb880e",
"TotalAmount": 1,
"CurrencyCode": "840",
"RRN": "424722415912",
"CardBrand": "Visa",
"IsoResponseCode": "98",
"ResponseMessage": "Transaction is declined",
"ExternalIdentifier": "My Managed Recurring",
"OrderIdentifier": "638562348632551814-1"
}
}
Recurring error. Initial recurring failed as first notification was not successful

JSON

{
"TransactionType": 1,
"Approved": false,
"AuthorizationCode": "123456",
"TransactionIdentifier": "ee552299-24ce-495e-a5c9-05ca2d065cad",
"TotalAmount": 1.00,
"CurrencyCode": "840",
"RRN": "419222584906",
"CardBrand": "Visa",
"IsoResponseCode": "RE",
"ResponseMessage": "Recurring error",
"ExternalIdentifier": "My Managed RecurringInitial",
"OrderIdentifier": "638562354362791182",
"Errors": [
{
"Code": "1348",
"Message": "Notification failed: 0"
}
]
}
Recurring cancellation successful.

JSON

{
"PowerTranzId": "88804186",
"ResponseMessage": "Recurring canceled",
"ResponseCode": "R5",
"Cycle": 1,
"CycleDate": "20240831",
"AttemptDate": "20240831",
"Attempt": 1,
"ExpiryDate": "20250831",
"Active": false,
"Frequency": "W",
"InitialTransactionIdentifier": "6aaa96c2-de25-4c74-976b-f6d5ff281fe8"
}
