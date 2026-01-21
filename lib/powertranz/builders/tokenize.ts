import { TokenizeCardProps } from "../types";
import { powertranzConfig } from "../client";

export interface TokenizeRequest {
  AddressMatch: boolean;
  CurrencyCode: string;
  TransactionIdentifier: string;
  TotalAmount: number;
  Tokenize: boolean;
  ThreeDSecure: boolean;
  OrderIdentifier: string;
  Source: {
    CardPan: string;
    CardCvv: string;
    CardExpiration: string;
    CardholderName: string;
  };
}

export function buildTokenizeRequest(
  props: TokenizeCardProps,
  transactionIdentifier: string,
  orderId: string
): TokenizeRequest {
  const expiration = `${props.expirationYear}${props.expirationMonth}`;
  return {
    AddressMatch: false,
    CurrencyCode: props.currencyCode || powertranzConfig.defaultCurrency,
    TransactionIdentifier: transactionIdentifier,
    TotalAmount: 0,
    Tokenize: true,
    ThreeDSecure: false,
    OrderIdentifier: orderId,
    Source: {
      CardPan: props.cardNumber,
      CardCvv: props.cvv,
      CardExpiration: expiration,
      CardholderName: props.cardholderName,
    },
  };
}
