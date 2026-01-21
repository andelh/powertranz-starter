SPI-HPP
Introduction

This guide will walk you through simplified payment integration method for 3DS e-commerce transactions.

How HPP Works in General ?

When a customer is ready to make a payment on your e-commerce website, they click on the "Checkout" or "Payment" button. Instead of collecting payment information directly on your website, the customer is redirected to the secure hosted payment page provided by Powertranz. This ensures that the payment data never reaches your website, reducing security risks.

On the hosted payment page, the customer enters their payment information, such as credit card details, billing address, and any other required data and the payment information entered by the customer is securely transmitted to Powertranz for processing. After the payment is approved, the customer is redirected back to your e-commerce website.

Available endpoints

Endpoint
Description
Type
Method
URL
Alive
Gateway status
Non-financial
GET
<API Root>/api/alive
Auth
Performs an authorization securing funds for later capture.
Financial
POST
<API Root>/api/spi/auth
Sale
Performs an authorization with capture.
Financial
POST
<API Root>/api/spi/sale
RiskMgmt
Non-financial transaction. Used for 3DS authentication, to tokenize a card or Fraud Check.
Non-financial
POST
<API Root>/api/spi/riskmgmt
Payment
Payment Completion for 3DS pre-authenticated sale or authorization transactions.
Financial
POST
<API Root>/api/spi/payment
Capture
Captures a previously authorized transaction.
Financial
POST
<API Root>/api/capture
Refund
Refunds a previously authorized transaction
Financial
POST
<API Root>/api/refund
Void
Void an authorization.
Financial
POST
<API Root>/api/void
With this implementation, the merchant will make multiple calls to endpoints in the Powertranz API.

The first request (Auth, Sale, or RiskMgmt) will initiate the authentication process and return an authorization SpiToken for subsequent requests.
If the first request is successful, subsequent requests can be made to the "Payment", "Capture", "Void" and "Refund" endpoints to either cancel or complete the transaction as required.
Transaction Flow

Step
Description
1.1
The merchant web server displays the finalized shopping cart to the cardholder.
1.2
The cardholder checks out.
1.3
The merchant sends an Auth, Sale, or RiskMgmt request to the Powertranz server, which includes a hosted page set and name . The relevant cardholder and payment details will be collected on the hosted page.
1.4
Powertranz authenticates the request coming from the merchant, generates a SpiToken, and replies to the merchant server with RedirectData. An IsoResponseCode of SP4 is returned if the request passes basic validation.
1.5
The Redirect Data can be found within the response received from the Auth/Sale/RiskMgmt endpoint. The response received contains an HTML form accompanied by JavaScript code. This code is then injected into an iFrame which resides within the cardholder's browser, to initiate the subsequent steps .The iFrame, functioning within the cardholder's browser, interacts with Powertranz and will display the hosted page (HPP). The cardholder enters credit card details and billing information then submits them by pressing "Confirm Payment"
1.6
Powertranz processes the request and responds back to the merchant server via the cardholder browser. Note that this is not a financial transaction but a confirmation that cardholder data was collected. Expected IsoResponseCode is HP0.
1.7
A payment completion is sent using the SpiToken and Payment endpoint.The payment completion needs to be sent within 5 minutes. After 5 minutes, the SpiToken will be unavailable. The authorization request is then sent from the Powertranz server to the processor and to the issuing bank.
1.8
Powertranz returns the Auth/Sale payment response to the merchant server.
1.9
The merchant server then displays the final results to the cardholder browser. If the merchant originally called a Sale, the financial transaction is now complete, and then, following settlement (controlled by PowerTranz), the cardholder will be billed, and the merchant account will be credited. If the merchant called an Auth, there will be a hold on funds, but a Capture must be sent when the merchant is ready to finalize the transaction and bill the cardholder.
SPI Flow
General SPI Flow

Example

You can use a tool like Postman to call the endpoint with the body you created.

📘
Requirements

Make sure to include the required headers.
Here is an example of the body that you might use:

If using postman, the variable "{{$guid}}" generates a unique GUID.

JSON

{
"TransactionIdentifier": "{{$guid}}",//GUID needs to be unique example:40511888-ad35-4bba-8dcb-214f493e185c
"TotalAmount": 1,
"CurrencyCode": "840", //Numeric currency code (ISO 4217). 840 = USD
"ThreeDSecure": false, //This must be set to false
"OrderIdentifier": "INT-{{$guid}}-Orc",
"AddressMatch": false,
"ExtendedData": {

          "HostedPage": {
            "PageSet": "YourPageSet",
            "PageName": "YourPageName"
        },
        "MerchantResponseUrl": "{{MERCHANT_URL}}" //Please use a valid URL. PowerTranz's servers will send
         //a response to the merchant response url. It's a callback URL.
    }

}
📘
Note !

The hosted page is created using the Powertranz merchant portal. Please contact our support team for details.

Pages created in Powertranz Merchant Portal MUST contain the ‘PTZ/’ prefix in the Page Set request. If this prefix is missing, the transaction will fail, and the Hosted Payment Page will not be loaded correctly.

If the request is successful, Powertranz should produce a similar response to this one:

Response

{
"TransactionType": 1,
"Approved": false,
"TransactionIdentifier": "Your GUID from the payload should be reflected here",
"TotalAmount": 1.00,
"CurrencyCode": "840",
"IsoResponseCode": "SP4",
"ResponseMessage": "SPI Preprocessing complete",
"OrderIdentifier": "Your order identifier from the payload should be reflected here",
"RedirectData": "<!DOCTYPE html><html><head></head><body>...</body></html>",
"SpiToken": "SPI TOKEN will be here"
}
The IsoResponseCode SP4, as referenced here, lets you know that the SPI Preprocessing was completed. The response generated from the /Auth endpoint will include "RedirectData" and a "SpiToken" that you will need for subsequent requests.

📘
Note !

It's important to note that the "SpiToken" lives for 5 minutes
Injecting RedirectData into CHB iFrame
Injecting RedirectData into CHB in iFrame

As step 1.4 (image above) indicated, we must take the RedirectData from the response and present it to the cardholder browser (CHB) inside an iFrame.

We can achieve this by rendering in the cardholder browser the following HTML code.

HTML

<iframe srcdoc="{RedirectData}" frameborder="0" width="100%" height="500"></iframe>
Once the RedirectData has been bound to the Iframe, the process will continue in the context of the Iframe.

The HPP form will appear in the iFrame, and the cardholder will enter credit card details and billing information.

Once the cardholder enters the required information and confirms payment, the Iframe context will post details to Powertranz.
Powertranz process the transaction and iFrame inside cardholder browser returns the response to the "MerchantResponseUrl" posted originally in spi/Auth payload. The response should look like below:
JSON

{
"TransactionType": 1,
"Approved": false,
"TransactionIdentifier": "Your TransactionIdentifier from the payload should be reflected here",
"TotalAmount": 2.0,
"CurrencyCode": "978",
"IsoResponseCode": "HP0",
"ResponseMessage": "HPP preprocessing complete",
"OrderIdentifier": "Your order identifier from the payload should be reflected here",
"SpiToken": "1gs2sfyhhi744o98f2uxmxd5w5jw7tbsflkth3rmvav520gqgto-iseenw5eb",
"BillingAddress": {
"FirstName": "John",
"LastName": "Smith",
"Line1": "17 Cherry Tree Lane",
"City": "London",
"PostalCode": "123456",
"CountryCode": "",
"EmailAddress": "",
"PhoneNumber": "555-5555"
}
}
At this stage, we are done with the cardholder browser and are currently located at point 1.6 from the integration flow.

We must now remove the iFrame as its lifespan is intended to be very short-lived and transparent to the cardholder browser.

Please note, iFrames, for security reasons, block multiple things, such as session cookies, etc... So it is essential to include a redirect to exit the iFrame.

For example, the following code would exit out of the MerchantResponseUrl in the iFrame to your final result page.

MerchantResponseUrl.html

<script>
window.onload = redirectParent;
function redirectParent() {
window.parent.location = './AuthenticationResult'; //Adjust the page location to your needs
}
</script>

What's next?

Now, we can proceed with payment request based on the response data.to complete the payment portion of the transaction, merchants should call "/payment" and pass the SpiToken in an HTTP Post request. PowerTranz will send the transaction to the relevant payment network and reply to the merchant.

📘
The payment completion request does not require PowerTranz-PowerTranzId and PowerTranz-PowerTranzPassword values in the header
For this request, the payload is just the SPI Token surrounded by quotes.

JSON

"SPI_TOKEN"
If successful, the response will look like this:

/Payment Response

{
"TransactionType": 1,
"Approved": true,
"AuthorizationCode": "123456",
"TransactionIdentifier": "Your TransactionIdentifier from the payload should be reflected here",
"TotalAmount": 1.00,
"CurrencyCode": "840",
"RRN": "307522590956",
"CardBrand": "Visa",
"IsoResponseCode": "00",
"ResponseMessage": "Transaction is approved",
"PanToken": "1glhritqi5ttv5cslkx5awmljha8cjrntjjnawagki4czpg9qap",
"OrderIdentifier": "Your order identifier from the payload should be reflected here"
}
If we take a look at the above response the approved flag is true and the IsoResponseCode is "00" . We can interpret this response as an approved authorization.

Don't forget to call "/Capture" for settlement.
