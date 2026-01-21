import { AuthFlowProps } from "../types";
import { powertranzConfig } from "../client";

export interface AuthRequest {
  TransactionIdentifier: string;
  TotalAmount: number;
  CurrencyCode: string;
  ThreeDSecure: boolean;
  FraudCheck: boolean;
  OrderIdentifier: string;
  Source: {
    Token: string;
  };
  BillingAddress: {
    EmailAddress: string;
  };
  ExtendedData: {
    ThreeDSecure: {
      ChallengeWindowSize: number;
      ChallengeIndicator: string;
    };
    MerchantResponseUrl: string;
  };
}

export function buildAuthRequest(
  props: AuthFlowProps
): AuthRequest {
  return {
    TransactionIdentifier: props.transactionIdentifier,
    TotalAmount: Number(props.amount),
    CurrencyCode: powertranzConfig.defaultCurrency,
    ThreeDSecure: true,
    FraudCheck: true,
    OrderIdentifier: props.orderId,
    Source: {
      Token: props.token,
    },
    BillingAddress: {
      EmailAddress: props.email,
    },
    ExtendedData: {
      ThreeDSecure: {
        ChallengeWindowSize: 4,
        ChallengeIndicator: "01",
      },
      MerchantResponseUrl: `${props.siteRoot}/api/powertranz/${
        props.authOnly ? "auth-response" : "response"
      }`,
    },
  };
}
