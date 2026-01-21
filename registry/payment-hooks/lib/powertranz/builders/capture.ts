import { CapturePaymentProps } from "../types";
import { powertranzConfig } from "../client";

export interface CaptureRequest {
  TransactionIdentifier: string;
  TotalAmount: number;
  CurrencyCode?: string;
}

export function buildCaptureRequest(
  props: CapturePaymentProps
): CaptureRequest {
  return {
    TransactionIdentifier: props.transactionIdentifier,
    TotalAmount: Number(props.amount),
    CurrencyCode: powertranzConfig.defaultCurrency,
  };
}
