# Merchant Tokenization with Powertranz

By utilizing the "/RiskMgmt" endpoint, you can tokenize a card (PAN) by setting the Tokenize flag to true in your request message. This enables you to securely retain the PAN token within your system. Later, you can use this "PanToken" to send Authentication (3DS2) or Financial (Payment) requests to Powertranz without sending expiry date or CVV2 values. This is suitable for use cases such as Recurring Billing, Guest Checkout, Adding a Card to digital wallet or situations where your business necessitates the storage of a distinct identifier for customer payment methods.

This is a sample response object returned from "/RiskMgmt" endpoint.

JSON

`

{
"TransactionType": 8,
"Approved": false,
"TransactionIdentifier": "5791c8b1-ec5b-4827-93dd-d3bb00c79d72",
"TotalAmount": 0.00,
"CurrencyCode": "840",
"CardBrand": "Visa",
"IsoResponseCode": "TK0",
"ResponseMessage": "Tokenize complete",
"PanToken": "3199bdzd3hc2fardvoinksxmrjfrslyfbkum29nw9n3p9tzc5m",
"ExternalIdentifier": "V-102-100-1 NF Frictionless, Status=Y",
"OrderIdentifier": "STF-638267527120457060 (tok-2)"
}

`

> 📘
>
> ###
>
> Good to Know !
>
> You can use "/RiskMgmt" endpoint to Tokenize and perform 3DS2 authentication in a single request. To do this, you should set Tokenize and ThreeDSecure flag to True.

As default configuration for merchants, Powertranz will not return a PanToken on responses returned from financial endpoints (auth/sale). If you prefer to receive PanToken in such cases, please contact the Powertranz support team".

> 🚧
>
> ###
>
> Note !
>
> If the card expires, you should send a new Risk Management tokenization request to update the PanToken within your systems.
>
> While tokens can be returned with a financial authorization, tokenization is a function of Risk Managed and this endpoint must be used to update and request new tokens when expiry dates change.
>
> CVV2 values are not to be stored by anyone involved in the payment process due to PCI compliance. If using a PanToken in a subsequent payment request, you have the option to prompt the cardholder to enter the CVV2 value on checkout.
