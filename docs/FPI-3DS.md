# FPI 3DS

Introduction

# [](https://developer.powertranz.com/docs/integration-types#introduction)

This document is intended as a resource for developers seeking to integrate Powertranz payment processing functionalities into a merchant's website infrastructure. Tailored to technical audiences, this integration guide delves into the intricacies of a full 3DS integration method for executing 3DS e-commerce transactions.

E-Commerce with 3D-Secure

# [](https://developer.powertranz.com/docs/integration-types#e-commerce-with-3d-secure)

The Powertranz gateway supports EMV 3D-Secure versions 2.x for cardholder authentication and sends financial requests (authorization, sale, refund, or void) to the payment networks for cardholder authorization.

A 3D-Secure Request is initiated using the Auth, Sale, or RiskMgmt API methods with the 3D-Secure flag enabled. The FPI 3DS integration method will give you complete control to handle the required interactions for a 3DS 2.0 authentication.

There are different possible flows for browser-based 3DS 2.X authentications. The flow to take is determined by the response received in the pre-authentication step, which will guide you on what to do next.

1.  Challenge flow where the cardholder is redirected to the issuing bank ACS server to complete one or more\
    challenge requests.
2.  Frictionless, where there is no interaction between the cardholder and the issuing bank

Device FingerPrinting

# [](https://developer.powertranz.com/docs/integration-types#device-fingerprinting)

Device fingerprinting refers to the process of uniquely identifying a user's device based on various attributes. This identification helps to ensure that the transaction is being initiated from a trusted or known device.

Issuing banks, might require "Device Fingerprint" to help them decide whether to authenticate the cardholder through frictionless or challenge flow.

Powertranz will handle and facilitate interactions required to submit "Device FingerPrint" to issuer.

Available endpoints

# [](https://developer.powertranz.com/docs/integration-types#available-endpoints)

|

Endpoint

|

Description

|

Type

|

Method

|

URL

|  |
|  |

|

**Alive**

|

Gateway status

|

Non-financial

|

GET

|

[<API Root>/api/alive](https://powertranz.readme.io/reference/get_alive)

|
|

**Auth**

|

Performs an authorization securing funds for later capture.

|

Financial

|

POST

|

[<API Root>/api/auth](https://powertranz.readme.io/reference/post_auth)

|
|

**Sale**

|

Performs an authorization with capture.

|

Financial

|

POST

|

[<API Root>/api/sale](https://powertranz.readme.io/reference/post_sale)

|
|

**RiskMgmt**

|

Non-financial transaction. Used for 3DS authentication only or to tokenize a card.

|

Non-financial

|

POST

|

[<API Root>/api/riskmgmt](https://powertranz.readme.io/reference/post_riskmgmt)

|
|

**3DS2/Authenticate**

|

This must be called only if device fingerprint is required

|

Financial

|

POST

|

[<API Root>/api/3DS2/Authenticate](https://powertranz.readme.io/reference/post_3ds2-authenticate)

|
|

**Payment**

|

Payment Completion for\
3DS pre-authenticated\
sale or authorization\
transactions.

|

Financial

|

POST

|

[<API Root>/api/Payment](https://developer.powertranz.com/reference/post_payment)

|
|

**Capture**

|

Capture a previously authorized transaction.

|

Financial

|

POST

|

[<API Root>/api/capture](https://powertranz.readme.io/reference/post_capture)

|
|

**Refund**

|

Refund a previously authorized transaction

|

Financial

|

POST

|

[<API Root>/api/refund](https://powertranz.readme.io/reference/post_refund)

|
|

**Void**

|

Void an authorization.

|

Financial

|

POST

|

[<API Root>/api/void](https://powertranz.readme.io/reference/post_void)

|

Transaction Flow

# [](https://developer.powertranz.com/docs/integration-types#transaction-flow)

|

Step

|

Description

|  |
|  |

|

**1.1**

|

The merchant web server displays the finalized shopping cart to the cardholder.

|
|

**1.2**

|

The cardholder checks out.

|
|

**1.3**

|

The merchant collects the cardholder payment information, billing address, **Browser Information** and **preferred challenge window size**, then sends an Auth, Sale, or RiskMgmt request with the 3DS flag enabled.

|
|

**1.4**

|

Using the card number provided in the request, Powertranz will inquire whether the card supports 3D-Secure. If it is, the system will also check issuer bank's capabilities and whether they require device fingerprinting.

- \*IsoResponseCode\*\* returned in the response will carry important information about next steps.
- \*3D0**: it means issuer completed 3DS authentication using**frictionless flow\*\* and no further cardholder interaction is required.
- \*3D5\*\*: This Response code mandates a request for device fingerprinting. after this step, issuer decides about frictionless or challenge flow.
- \*3D6\*\*: this means issuer wants to continue with authentication using challenge fllow.

|
|

**1.4.1**

|

**Device Fingerprinting (3D5)**

If you receive a 3D5 response, it means that the ACS server has requested a device fingerprinting/3DS Method. You will need to obtain the cardholder's 3DS 2 device fingerprint and send this to the ACS server in a hidden iframe (more details about iFrame are described in the next section).

|
|

**1.4.2**

|

After fingerprinting, 3DS2/Authenticate should be called to continue with 3DS 2.X authentication process. You should pass the SpiToken to the authenticate endpoint.

|
|

**1.5**

|

The Powertranz 3DS server contacts the relevant Directory Server to obtain 3DS Authentication results.\
The Powertranz response will include an IsoResponseCode.

|
|

**1.5.1**

|

**Frictionless flow (IsoResponseCode = 3D0)**

If the IsoResponseCode returned is 3D0, the transaction is considered frictionless and the authentication status will be present in the response message, meaning that 3DS2 authentication is completed.

|
|

**1.5.2**

|

**Challenge flow (IsoResponseCode = 3D6)**

If a challenge flow is required by issuer bank, Powertranz will facilitate it by sending a Java Script code in "RedirectData" within the response. When passed on to the cardholder browser in an iFrame, cardholder browser will interact with issuer bank ACS.

|
|

**1.5.2.1**

|

The cardholder will be prompted to complete one or many challenges presented by the issuing bank ACS server and once the challenge is complete, the results will be posted back to Powertranz by issuer.

|
|

**1.5.2.2**

|

Powertranz posts the result to MerchantResponseURL and merchant will remove the iFrame and present the cardholder with the final 3DS result.

|

![FPI Flow](https://files.readme.io/073553f-image.png)

FPI Flow

Examples

# [](https://developer.powertranz.com/docs/integration-types#examples)

Now let's go through a few example cases with sample request and responses.

> 📘
>
> ###
>
> Requirements
>
> Make sure to include the [required headers](https://developer.powertranz.com/docs/api-keys).

1- Authorization request with 3DS2 Authentication (Frictionless)

## [](https://developer.powertranz.com/docs/integration-types#1--authorization-request-with-3ds2-authentication-frictionless)

Here's an example of calling the "/Auth" endpoint. In FPI integration method, you should collect browser info and preferred challenge window size and include it in the request.

JSON

`

{
"transactionIdentifier": "",
"totalAmount": 1.0,
"currencyCode": "978",
"threeDSecure": true,
"source": {
"cardPan": "4012000000020071",
"cardCvv": "123",
"cardExpiration": "2512"
},
"externalIdentifier": "Fully Frictionless",
"orderIdentifier": "Your Order Identifier",
"extendedData": {

    "threeDSecure": {
      "merchantResponseUrl": "https://Your.Merchant.Website/MerchantResponse",
      "challengeWindowSize": 0
    },
    "browserInfo": {

      "language": "en-US",
      "screenHeight": "1024",
      "screenWidth": "1280",
      "timeZone": "180",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
      "ip": "::1",
      "javaEnabled": false,
      "javascriptEnabled": true,
      "colorDepth": "24"
    }

}
}

`

The JavaScript cod snippet below collects Browser information.

###

Browser Details Collection Sample (JavaScript)

[](https://developer.powertranz.com/docs/integration-types#browser-details-collection-sample-javascript)

JavaScript

`

function GetBrowserInfo() {
const screenWidth = window && window.screen ? window.screen.width : '';
const screenHeight = window && window.screen ? window.screen.height : '';
const colorDepth = window && window.screen ? window.screen.colorDepth : '';
const userAgent = window && window.navigator ? window.navigator.userAgent : '';
const javaEnabled = window && window.navigator ? navigator.javaEnabled() : false;
const javascriptEnabled = true;
let language = '';
if (window && window.navigator) {
language = window.navigator.language ? window.navigator.language :
window.navigator.browserLanguage;
}
const d = new Date();
const timeZoneOffset = d.getTimezoneOffset();
const browserInfo = {
screenWidth,
screenHeight,
colorDepth,
userAgent,
timeZoneOffset,
language,
javaEnabled,
javascriptEnabled
};
return browserInfo;
};

`

Powertranz processes the request and connects to issuer bank via payment network Directory Server. If the issuer succefully authenticates the cardholder using a frictionless flow, the response returned from Powertranz contains authentication results similar to below

JSON

`

{
"TransactionType": 1,
"Approved": false,
"TransactionIdentifier": "2ed71b39-1c7a-4bca-9c60-62be8025ff00",
"TotalAmount": 1.00,
"CurrencyCode": "978",
"CardBrand": "Visa",
"IsoResponseCode": "3D0",
"ResponseMessage": "3DS complete",
"RiskManagement": {
"ThreeDSecure": {
"Eci": "05",
"Cavv": "AJkBCQIGiIYplVGQaQaIAAAAAAA=",
"Xid": "8b76969f-18ee-4556-b467-4c296dd02ca7",
"AuthenticationStatus": "Y",
"Token": "47rhzxpsykleuqskmvf42xp2yejqubz9ozmennje9i41hgje1-iseenw5eb",
"ProtocolVersion": "2.1.0",
"FingerprintIndicator": "U",
"DsTransId": "935cbb83-3483-497f-b2dd-c9029128efdd",
"ResponseCode": "3D0"
}
},
"ExternalIdentifier": "Fully Frictionless",
"OrderIdentifier": "Your Order Identifier",
"SpiToken": "47rhzxpsykleuqskmvf42xp2yejqubz9ozmennje9i41hgje1-iseenw5eb"
}

`

If we take a look at the response , it contains an IsoResponseCode of "3D0" ( 3DS authentication completed) , an AuthenticationStatus of "Y" (Authenticated) , the ECI value of value "05" and a Cavv value . We can interpret this response as successful 3DS authentication.

To complete the financial portion of the transaction, integrators should call "/payment" and pass the SpiToken in an HTTP Post request. Powertranz will send the transaction to the relevant payment network and reply to the merchant.

> 📘
>
> ###
>
> The payment completion request does not require PowerTranz-PowerTranzId and Powertranz-PowerTranzPassword values in the header

For this request, the payload is just the SPI Token surrounded by quotes.

JSON

`

"47rhzxpsykleuqskmvf42xp2yejqubz9ozmennje9i41hgje1-iseenw5eb"

`

If successful, the response will look like this:

JSON

`

{
"TransactionType": 1,
"Approved": true,
"AuthorizationCode": "123456",
"TransactionIdentifier": "2ed71b39-1c7a-4bca-9c60-62be8025ff00",
"TotalAmount": 1.00,
"CurrencyCode": "978",
"RRN": "323716677043",
"CardBrand": "Visa",
"IsoResponseCode": "00",
"ResponseMessage": "Transaction is approved",
"ExternalIdentifier": "Fully Frictionless",
"OrderIdentifier": "Your Order Identifier"
}

`

Above response has approved flag as true and the IsoResponseCode is "00" . We can interpret this response as an approved authorization.

2- Authorization request with 3DS2 Authentication (Device FingerPrinting + Challenge)

## [](https://developer.powertranz.com/docs/integration-types#2--authorization-request-with-3ds2-authentication-device-fingerprinting--challenge)

First, you send a request to the "/Auth" endpoint, same as we demonstrated in the previous example.

JSON

`

{
"transactionIdentifier": "",
"totalAmount": 1.0,
"currencyCode": "978",
"threeDSecure": true,
"source": {
"cardPan": "4012010000020005",
"cardCvv": "123",
"cardExpiration": "2512"
},
"externalIdentifier": "Challenge + Device FP",
"orderIdentifier": "Your Order Identifier",
"extendedData": {

    "threeDSecure": {
      "merchantResponseUrl": "https://Your.MerchantResponse.URL/",
      "challengeWindowSize": 0
    },

    "browserInfo": {

      "language": "en-US",
      "screenHeight": "1024",
      "screenWidth": "1280",
      "timeZone": "180",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
      "ip": "::1",
      "javaEnabled": false,
      "javascriptEnabled": true,
      "colorDepth": "24"
    }

}
}

`

Powertranz processes the request which includes checking issuer bank capabilities maintained locally. If issuer bank requires Device Fingerprint, Powertranz will return "3D5" in "IsoResponseCode" with instructions to complete Device Fingerprinting. this instruction is contained within "RedirectData" which is piece of Java Script code that handles posting "**ThreeDSMethodData**" to issuer bank. lets have a look to the sample response.

JSON

`

{
"TransactionType": 1,
"Approved": false,
"TransactionIdentifier": "fcc24499-ebc8-4297-952f-e052f69ed544",
"TotalAmount": 1.00,
"CurrencyCode": "978",
"CardBrand": "Visa",
"IsoResponseCode": "3D5",
"ResponseMessage": "Fingerprint device",
"RiskManagement": {
"ThreeDSecure": {
"Xid": "e317f166-1943-44ba-a990-50b3155bb7de",
"Token": "2juw6dynij2agajibjiwfm47u0112f3e3f09talhy6o7i9mxdy-iseenw5eb",
"RedirectData": "<!DOCTYPE html>

<html>
	<head></head>
	<body>
		<form id="fingerprintdevice" name="fingerprintdevice" action="https://powertranztestframeworkdsacssimulator.azurewebsites.net/acs/fingerprint" method="POST">
			<input name="threeDSMethodData" id="threeDSMethodData" type="hidden" value="eyJ0aHJlZURTTWV0aG9kTm90aWZpY2F0aW9uVVJMIjoiaHR0cHM6Ly9kZXYucHRyYW56LmNvbS9hcGkvM0RTMi9NZXRob2ROb3RpZnkiLCJ0aHJlZURTU2VydmVyVHJhbnNJRCI6ImUzMTdmMTY2LTE5NDMtNDRiYS1hOTkwLTUwYjMxNTViYjdkZSJ9">
		</form>
		<script>window.onload=submitForm;function submitForm() {document.getElementById('fingerprintdevice').submit();}</script>
	</body>
</html>",
      "AuthenticateUrl": "https://staging.ptranz.com/api/3DS2/Authenticate",
      "ResponseCode": "3D5"
    }
  },
 "externalIdentifier": "Challenge + Device FP",
  "orderIdentifier": "Your Order Identifier",
  "SpiToken": "2juw5dynij2agajibjiwfm47u0112e3e3f09talhy6o7i9mxdy-iseenw5eb"
}

`

You should inject "RedirectData" in an hidden iFrame and the code will POST required data to issuer bank. after this POST, device fingerprinting is complete and you don't have to wait for response from issuer bank, however according to EMV 3DS2 standard issuer bank should reply to you with a HTTP 200 OK response without reposne body.

now, we should continue with 3DS2 authentication by POSTing **SpiToken** to "/3DS2/Authenticate".

JSON

`

"2juw6dynij2agajibjiwfm47u0112e3e3f09talhy6o7i9mxdy-iseenw5eb"

`

Powertranz communicates with issuer bank, and returns the response. If the cardholder and their card are in good status with issuer bank systems, issuer either completes authentication (Frictionless Flow) or decides to challenge cardholder (Challenge Flow). In the challenge flow the response returned from Powertranz looks similar to below snippet. As you can see the response has "IsoResponseCode" as 3D6 and "AuthenticationStatus" as C. This indicates the issuer wants to continue with Challenge Flow.

JSON

`

{
"TransactionType": 1,
"Approved": false,
"TransactionIdentifier": "fcc24499-ebc8-4297-952f-e052f69ed544",
"TotalAmount": 1.00,
"CurrencyCode": "978",
"CardBrand": "Visa",
"IsoResponseCode": "3D6",
"ResponseMessage": "Challenge payer",
"RiskManagement": {
"ThreeDSecure": {
"Eci": "05",
"Xid": "e317f166-1943-44ba-a990-50b3155bb7de",
"AuthenticationStatus": "C",
"Token": "2juw6dynij2agajibjiwfm47u0112e3e3f09talhy6o7i9mxdy-iseenw5eb",
"RedirectData": "<!DOCTYPE html>

<html>
	<head></head>
	<body>
		<form id="challengepayer" name="challengepayer" action="https://powertranztestframeworkdsacssimulator.azurewebsites.net/acs/vts" method="POST">
			<input name="creq" id="creq" type="hidden" value="eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiJlMzE3ZjE2Ni0xOTQzLTQ0YmEtYTk5MC01MGIzMTU1YmI3ZGUiLCJhY3NUcmFuc0lEIjoiNmVkZTQ4ODYtZjI1My00MTRlLTg0NTQtNGUwODc5ZGQyNjdjIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAxIiwidHJhbnNUeXBlIjoiMDEifQ">
			<input name="threeDSSessionData" id="threeDSSessionData" type="hidden" value="Mmp1dzZkeW5pajJhZ2FqaWJqaXdmbTQ3dTAxMTJlM2UzZjA5dGFsaHk2bzdpOW14ZHktaXNlZW53NWVi">
		</form>
		<script>window.onload=submitForm;function submitForm() {document.getElementById('challengepayer').submit();}</script>
	</body>
</html>",
      "ProtocolVersion": "2.1.0",
      "FingerprintIndicator": "Y",
      "DsTransId": "f407e1f8-e030-4bab-bcc1-de982cc79fc3",
      "ResponseCode": "3D6",
      "CardholderInfo": "Additional authentication is needed for this transaction, please contact(Issuer Name) at xxx - xxx - xxxx."
    }
  },
   "externalIdentifier": "Challenge + Device FP",
  "orderIdentifier": "Your Order Identifier",
  "SpiToken": "2juw6dynij2agajibgiwfm47u0112e3e3f09talhy6o7i9mxdy-iseenw5eb"
}

`

Now, to start challenge flow, you should inject HTML code returned in "RedirectData" into card holder browser. below code snippets shows how you may create an iFrame and bind it to "RedirectData".

###

iFrame Creation

[](https://developer.powertranz.com/docs/integration-types#iframe-creation)

iFrame Creation

`

<iframe id="threedsIframe" height="520" width="870" allowtransparency="true" frameborder="0"
style="borderstyle:solid;border-width:0px;padding-left:5%;background-color:none transparent">
</iframe>

`

###

Redirect

[](https://developer.powertranz.com/docs/integration-types#redirect)

Redirect

`

<script type="text/javascript">
	$(document).ready(function() {
      document.getElementById("threedsIframe").srcdoc = "@Html.Raw(HtmlEncode(RedirectData))";
  })
</script>

`

After this, the process will continue in the context of the IFrame. The cardholder will be challenged to add further authentication. For example a form will appear in the iFrame, and the cardholder should enter additional information.

For instance, let's consider the following challenge generated by our test card. In order to proceed, you will need to input the password "3ds2" (without the quotation marks).

![Sample Challenge Form](https://files.readme.io/6897fde-image.png)

Sample Challenge Form

Please note iFrame within cardholder browser directly interacts with issuer ACS, and once the challenge is completed, issuer bank notifies Powertranz with challenge results. Powertranz processes the issuer bank's response and returns it to "MerchantReponseURL" originally posted in the request. Powertranz response at this stage looks like below

JSON

`

{
"TransactionType": 1,
"Approved": false,
"TransactionIdentifier": "fcc24499-ebc8-4297-952f-e052f69ed544",
"TotalAmount": 1,
"CurrencyCode": "978",
"CardBrand": "Visa",
"IsoResponseCode": "3D0",
"ResponseMessage": "3DS complete",
"RiskManagement": {
"ThreeDSecure": {
"Eci": "05",
"Cavv": "AJkBCQIGiIYplVGQaQaIAAAAAAA=",
"Xid": "e317f166-1943-44ba-a990-50b3155bb7de",
"AuthenticationStatus": "Y",
"Token": "2juw6dynij2agajibjiwfm47u0112e3e3f09talhy6o7i9mxdy-iseenw5eb",
"ProtocolVersion": "2.1.0",
"FingerprintIndicator": "Y",
"DsTransId": "f407e1f8-e030-4bab-bcc1-de982cc79fc3",
"ResponseCode": "3D0"
}
},
"externalIdentifier": "Challenge + Device FP",
"orderIdentifier": "Your Order Identifier",
"SpiToken": "2juw6dynij2agajibjiwfm47u0112e3e3f09talhy6o7i9mxdy-iseenw5eb"
}

`

Response contains an IsoResponseCode of "3D0" ( 3DS authentication completed) , an AuthenticationStatus of "Y" (Authenticated) , an ECI value of "05" and Cavv. We can interpret this response as successful 3DS authentication result .

We must now remove the iFrame as its lifespan is intended to be very short-lived and transparent to the cardholder browser. Please note, iFrames, for security reasons, block multiple things, such as session cookies, etc... So it is essential to include a redirect to exit the iFrame. below code snippet might give you an idea how to complete this step.

###

Removal and Redirect

[](https://developer.powertranz.com/docs/integration-types#removal-and-redirect)

Removal and Redirect

`

<script>
window.onload = redirectParent;
function redirectParent() {
window.parent.location = './AuthenticationResult'; //Adjust the page location to your needs
}
</script>

`

To complete the payment portion of the transaction, merchants should call "/payment" and pass the SpiToken in an HTTP Post request. PowerTranz will send the transaction to the relevant payment network and reply to the merchant.

> 📘
>
> ###
>
> The payment completion request does not require PowerTranz-PowerTranzId and PowerTranz-PowerTranzPassword values in the header

> 📘
>
> ###
>
> The payment completion request will be declined by default if the 3DS authentication is unsuccessful. Consequently, there is no need to initiate the payment completion if the 3DS authentication is unsuccessful.

For this request, the payload is just the SPI Token surrounded by quotes.

JSON

`

"SPI_TOKEN"

`

If successful, the response will look like this:

JSON

`

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
"PanToken": "1glhritqittv5cslkx5awmljha8cjrntjjnawagki4czpg9qap",
"OrderIdentifier": "Your order identifier from the payload should be reflected here"
}

`

The above response has approved flag as true and the IsoResponseCode is "00" . We can interpret this response as an approved authorization.
