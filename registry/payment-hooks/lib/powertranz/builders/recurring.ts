import { RecurringSetupProps } from "../types";
import { powertranzConfig } from "../client";

export interface RecurringRequest {
  TransactionIdentifier: string;
  TotalAmount: number;
  CurrencyCode: string;
  ThreeDSecure: boolean;
  RecurringInitial: boolean;
  OrderIdentifier: string;
  Source: {
    Token?: string;
    CardPan?: string;
    CardCvv?: string;
    CardExpiration?: string;
    CardholderName?: string;
  };
  BillingAddress?: {
    EmailAddress?: string;
  };
  ExtendedData: {
    Recurring: {
      Managed: boolean;
      StartDate: string;
      ExpiryDate: string;
      Frequency: "D" | "W" | "F" | "M" | "B" | "Q" | "S" | "Y";
    };
    ThreeDSecure?: {
      ChallengeWindowSize?: number;
      ChallengeIndicator?: string;
    };
  };
}

export function buildRecurringSetupRequest(
  props: RecurringSetupProps,
  isToday: boolean
): RecurringRequest {
  const request: RecurringRequest = {
    TransactionIdentifier: props.transactionIdentifier,
    TotalAmount: Number(props.amount),
    CurrencyCode: props.currencyCode || powertranzConfig.defaultCurrency,
    ThreeDSecure: props.threeDSecure ?? true,
    RecurringInitial: true,
    OrderIdentifier: props.orderId,
    Source: {},
    ExtendedData: {
      Recurring: {
        Managed: true,
        StartDate: props.startDate,
        ExpiryDate: props.expiryDate,
        Frequency: props.frequency,
      },
    },
  };

  if (props.cardToken) {
    request.Source.Token = props.cardToken;
  } else if (props.cardPan) {
    request.Source = {
      CardPan: props.cardPan,
      CardCvv: props.cardCvv!,
      CardExpiration: props.cardExpiration!,
      CardholderName: props.cardholderName!,
    };
  }

  if (props.email) {
    request.BillingAddress = { EmailAddress: props.email };
  }

  if (isToday && props.threeDSecure) {
    request.ExtendedData.ThreeDSecure = {
      ChallengeWindowSize: 4,
      ChallengeIndicator: "01",
    };
  }

  return request;
}
