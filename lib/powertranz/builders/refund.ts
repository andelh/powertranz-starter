import { RefundProps } from "../types";
import { powertranzConfig } from "../client";

export interface RefundRequest {
  Refund: boolean;
  TransactionIdentifier: string;
  TotalAmount: number;
  CurrencyCode: string;
}

export function buildRefundRequest(
  props: RefundProps
): RefundRequest {
  return {
    Refund: true,
    TransactionIdentifier: props.transactionIdentifier,
    TotalAmount: Number(props.amount),
    CurrencyCode: props.currencyCode || powertranzConfig.defaultCurrency,
  };
}
