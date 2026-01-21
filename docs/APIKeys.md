# API Keys

All requests to endpoints are HTTP POST requests over TLS with JSON payloads in the body. The HTTP header must include merchant authentication parameters (PowerTranzId and Password).

|

Header Name

|

Required

|

Notes

|  |
|  |

|

PowerTranz-PowerTranzPassword

|

✅

|

This is the merchant's unique\
processing password.

|
|

PowerTranz-PowerTranzId

|

✅

|

Merchant identifier for the merchant's\
account with PowerTranz.\
Example: 99901066

|
|

PowerTranz-GatewayKey

|

❌

|

Additional token

- \*Do not include until the value is provided by\
  PowerTranz\*\*

|

> 📘
>
> ###
>
> Note
>
> Please reach out to Powertranz support team to get your API keys.
