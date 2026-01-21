# Test Cards and Cases

There are two primary process flows for 3DS - frictionless and challenge. Frictionless occurs when no cardholder interaction is required during the authentication process. Challenge flow involves redirecting the cardholder browser to the issuer bank ACS server to complete one or more "challenges" before the authentication result is returned. Support for fingerprinting is determined by the issuer bank ACS server, and this can be included in both frictionless and challenge flows. The test cards will determine the 3DS authentication and authorization results.

Authorizations will approve for the following test cases

## [](https://developer.powertranz.com/docs/integration-types#authorizations-will-approve-for-the-following-test-cases)

| Test Case  | Card Number      | 3DS Version | PW   | Notes                                    |
| ---------- | ---------------- | ----------- | ---- | ---------------------------------------- |
| V2-01-YA   | 4012000000020071 | 2.x.x       |      | Frictionless, Status=Y                   |
| V2-02-AA   | 4012000000020089 | 2.x.x       |      | Frictionless, Status=A                   |
| M2-01-YA   | 5100270000000023 | 2.x.x       |      | Frictionless, Status=Y                   |
| V2-03-YA   | 4012000000020006 | 2.x.x       | 3ds2 | Challenge, Status=Y                      |
| M2-03-YA   | 5100270000000031 | 2.x.x       | 3ds2 | Challenge, Status=Y                      |
| V2-04-YA   | 4012010000020070 | 2.x.x       |      | Frictionless, Fingerprinting, Status=Y   |
| V2-05-AA   | 4012010000020088 | 2.x.x       |      | Frictionless, Fingerprinting, Status=A   |
| M2-04-YA   | 5100271000000120 | 2.x.x       |      | Frictionless, Fingerprinting, Status=Y   |
| V2-06-YA   | 4012010000020005 | 2.x.x       | 3ds2 | Challenge, Fingerprinting, Status=Y      |
| VI-01-0A   | 4333333333332222 | non-3DS     |      | Non-3DS Visa                             |
| MC-01-0A   | 5333333333332222 | non-3DS     |      | Non-3DS Mastercard                       |
| A2-01-YA\* | 341111000000009  | 2.x.x       |      | Frictionless, Status=Y                   |
| A2-02-AA   | 341111000000011  | 2.x.x       |      | Frictionless, Status=A                   |
| A2-03-YA   | 341112000000001  | 2.x.x       | 3ds2 | 3ds2 Challenge, Fingerprinting, Status=Y |
| A2-04-YA   | 341111000000037  | 2.x.x       | 3ds2 | 3ds2 Challenge, Status=Y                 |
| A2-05-YA   | 341112000008012  | 2.x.x       |      | Frictionless, Fingerprinting, Status=Y   |
| AX-01-0A   | 343333333333335  | non-3DS     |      | Non-3DS AMEX                             |
| DS-01-0A   | 6011111111111111 | non-3DS     |      | Discover                                 |
| JC-01-0A   | 3528111111111108 | non-3DS     |      | JCB                                      |

Authorizations will decline or not be available for the following test cases

## [](https://developer.powertranz.com/docs/integration-types#authorizations-will-decline-or-not-be-available-for-the-following-test-cases)

| Test Case | Card Number      | 3DS Version | PW   | Notes                                                                       |
| --------- | ---------------- | ----------- | ---- | --------------------------------------------------------------------------- |
| V2-01- ND | 4012000000020121 | 2.x.x       |      | Frictionless, Status=N, Payment Completion not permitted (response code 12) |
| M2-01-ND  | 5100270000000098 | 2.x.x       |      | Frictionless, Status=N, Payment Completion not permitted (response code 12) |
| M2-02-ND  | 5100270000000056 | 2.x.x       |      | Challenge, Status=N, Payment Completion not permitted (response code 12)    |
| M2-02-RA  | 5100270000000072 | 2.x.x       |      | Frictionless, Status=R                                                      |
| V2-02-AD  | 4666666666662222 | 2.x.x       |      | Frictionless, Status = A, ISO Response Code = 05, CVV Response = N          |
| M2-03-UD  | 5555666666662222 | 2.x.x       |      | Frictionless, Status=U, ISO Response Code = 05                              |
| V2-03-AD  | 4111111111119999 | 2.x.x       |      | Frictionless, Status = A, ISO Response Code = 98                            |
| M2-04-AD  | 5111111111113333 | 2.x.x       |      | Frictionless, Status = A, ISO Response Code = 05                            |
| V2-04-YD  | 4111111111110000 | 2.x.x       | 3ds2 | Challenge, Status =Y, ISO Response Code = 91                                |
| M2-05-YD  | 5111111111110000 | 2.x.x       | 3ds2 | Challenge, Status=Y, ISO Response Code = 91                                 |
| A2-01-ND  | 341111000000029  | 2.x.x       |      | Frictionless, Status=N, Payment Completion not permitted (response code 12) |
| DS-01-0D  | 6011111111111152 | non-3DS     |      | Discover                                                                    |
| JC-01-0D  | 3528111111111157 | non-3DS     |      | JCB                                                                         |

- [Validate with the Powertranz team](mailto:support@fac.bm) if AMEX 3DS is currently supported for your account. Many acquirers only have 3DS2 support for Mastercard and Visa.

\*For 3DS2 cardholder challenges: to bypass the challenge window generated by our test card, you will need to input the password "3ds2" (no quotation marks).

![](https://files.readme.io/1a49a0dc5e77e8530e217597b8037b2d14a51f84742d78f6625df291d4c70ab4-image.png)
