import { VoidProps } from "../types";
import { powertranzConfig } from "../client";

export interface VoidRequest {
  Void: boolean;
  TransactionIdentifier: string;
  CurrencyCode?: string;
}

export function buildVoidRequest(
  props: VoidProps
): VoidRequest {
  return {
    Void: true,
    TransactionIdentifier: props.transactionIdentifier,
    CurrencyCode: powertranzConfig.defaultCurrency,
  };
}
