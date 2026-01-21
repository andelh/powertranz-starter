# PowerTranz Documentation

This collection doesn't have a description.

SpiTransactions

---

This folder doesn't have a description.

### POST[Auth](https://www.postman.com/red-shuttle-989410-1/powertranz/request/sav0add/auth)

[](https://www.postman.com/red-shuttle-989410-1/powertranz/request/sav0add/auth)

https://staging.ptranz.com/api/spi/auth

Auth (Autorización) - Realizar una autorización SPI, reservando fondos para posterior captura - Financiero - POST

Request Headers

Accept

application/json

PowerTranz-PowerTranzId

88803835

PowerTranz-PowerTranzPassword

nY5rJnPIGJOrg8aRR87BudEV1emDRIDCWgG3IqW5OPQQ8PZnJZMVu1

Content-Type

application/json;charset=utf-8

Connection

keep-alive

Bodyraw (json)

View More

json

```
{
	"TransacctionIdentifier": "f62c3e59-1983-4174-8535-fe5bb68754",
	"TotalAmount": 99.00,
	"CurrencyCode": "840",
	"ThreeDSecure": true,
	"Source": {
		"CardPan": "5115010000000001",
		"CardCvv": "234",
		"CardExpiration": "2512",
		"CardholderName": "Carlos Faustino"
	},
	"OrderIdentifier": "INT-235d0457-5170-406b-abb7-750aadce9720-Orc 3574",
	"BillingAddress": {
		"FirstName": "Carlos",
		"LastName": "Faustino",
		"Line1": "Colonia Costa Rica",
		"County": "El Salvador",
		"State": "San Salvador",
		"EmailAddress": "faustino.carlos@hotmail.com",
		"PhoneNumber": "79551970"
	},
	"AddressMatch": false,
	"ExtendedData": {
		"ThreeDSecure": {
			"ChallengeWindowSize": 4,
			"ChallengeIndicator": "01"
		},
	"MerchantResponseUrl": "https://webhook.site/f569946c-cab5-44d6-9e10-23e14057e725"
	}
}
```

### POST[Payment](https://www.postman.com/red-shuttle-989410-1/powertranz/request/56niges/payment)

[](https://www.postman.com/red-shuttle-989410-1/powertranz/request/56niges/payment)

https://staging.ptranz.com/api/spi/Payment

Auth (Autorización) - Realizar una autorización SPI, reservando fondos para posterior captura - Financiero - POST

Request Headers

Accept

text/plain

Content-Type

application/json-patch+json

Connection

keep-alive

Bodyraw (json)

json

```
"ltnlwvekj3d3xekuhk7m22im8acs009fkwvl0z6lg4yw2o97k-3plyg9wt7wz"
```

### POST[Capture](https://www.postman.com/red-shuttle-989410-1/powertranz/request/0vqq0yb/capture)

[](https://www.postman.com/red-shuttle-989410-1/powertranz/request/0vqq0yb/capture)

https://staging.ptranz.com/Api/capture

This request doesn't have a description.

Request Headers

Accept-Charset

PowerTranz-PowerTranzId

PowerTranz-PowerTranzPassword

Content-Type

Bodyraw (json)

json

```
{
 "TransactionIdentifier": "42__c3d488f05f59-Orc3511",
 "TotalAmount": 20
}

```

### GET[Alive](https://www.postman.com/red-shuttle-989410-1/powertranz/request/3u3zd3o/alive)

[](https://www.postman.com/red-shuttle-989410-1/powertranz/request/3u3zd3o/alive)

https://staging.ptranz.com/api/alive

Alive - Status de la pasarela - No financiero - GET
