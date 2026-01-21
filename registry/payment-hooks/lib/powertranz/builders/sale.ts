import { DirectSaleProps } from "../types";
import { powertranzConfig } from "../client";

export interface SaleRequest {
  TransactionIdentifier: string;
  TotalAmount: number;
  CurrencyCode: string;
  ThreeDSecure: boolean;
  OrderIdentifier: string;
  Source: {
    CardPan: string;
    CardCvv: string;
    CardExpiration: string;
    CardholderName: string;
  };
  ExtendedData?: {
    MerchantResponseUrl?: string;
  };
}

export function buildSaleRequest(
  props: DirectSaleProps,
  merchantResponseUrl?: string
): SaleRequest {
  return {
    TransactionIdentifier: props.transactionIdentifier,
    TotalAmount: Number(props.amount),
    CurrencyCode: props.currencyCode || powertranzConfig.defaultCurrency,
    ThreeDSecure: false,
    OrderIdentifier: props.orderId,
    Source: {
      CardPan: props.cardNumber,
      CardCvv: props.cardCvv,
      CardExpiration: props.cardExpiration,
      CardholderName: props.cardholderName,
    },
    ...(merchantResponseUrl && {
      ExtendedData: {
        MerchantResponseUrl: merchantResponseUrl,
      },
    }),
  };
}
