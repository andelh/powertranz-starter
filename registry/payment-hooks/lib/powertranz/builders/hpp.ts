import { HostedPageProps } from "../types";
import { powertranzConfig } from "../client";

export interface HppStartRequest {
  TransactionIdentifier: string;
  TotalAmount: number;
  CurrencyCode: string;
  ThreeDSecure: boolean;
  OrderIdentifier: string;
  AddressMatch: boolean;
  ExtendedData: {
    HostedPage: {
      PageSet: string;
      PageName: string;
    };
    MerchantResponseUrl: string;
  };
}

export function buildHppStartRequest(
  props: HostedPageProps
): HppStartRequest {
  return {
    TransactionIdentifier: props.transactionIdentifier,
    TotalAmount: Number(props.amount),
    CurrencyCode: powertranzConfig.defaultCurrency,
    ThreeDSecure: props.threeDSecure ?? false,
    OrderIdentifier: props.orderId,
    AddressMatch: false,
    ExtendedData: {
      HostedPage: {
        PageSet: props.pageSet,
        PageName: props.pageName,
      },
      MerchantResponseUrl: `${props.siteRoot}/api/powertranz/hpp/response`,
    },
  };
}
