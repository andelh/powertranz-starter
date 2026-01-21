export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; isoCode?: string; raw?: unknown } };

export interface TokenizeCardProps {
  cardNumber: string;
  expirationYear: string;
  expirationMonth: string;
  cvv: string;
  cardholderName: string;
  currencyCode?: string;
}

export interface TokenizeCardResponse {
  TransactionType: number;
  TotalAmount: number;
  Approved: boolean;
  TransactionIdentifier: string;
  IsoResponseCode: string;
  PanToken?: string;
  ResponseMessage: string;
  OrderIdentifier: string;
  Errors?: Array<{ Code: string; Message: string }>;
  CardBrand?: string;
  CurrencyCode?: string;
}

export interface CapturePaymentProps {
  transactionIdentifier: string;
  amount: number;
}

export interface CapturePaymentResponse {
  OriginalTrxnIdentifier: string;
  TransactionType: number;
  Approved: boolean;
  TransactionIdentifier: string;
  TotalAmount: number;
  CurrencyCode: string;
  RRN: string;
  IsoResponseCode: string;
  ResponseMessage: string;
  OrderIdentifier: string;
}

export interface AuthFlowProps {
  orderId: string;
  amount: number;
  siteRoot: string;
  transactionIdentifier: string;
  token: string;
  email: string;
  authOnly?: boolean;
}

export interface CardAuthFlowProps {
  orderId: string;
  amount: number;
  siteRoot: string;
  transactionIdentifier: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  cardholderName: string;
}

export interface DirectSaleProps {
  orderId: string;
  amount: number;
  transactionIdentifier: string;
  cardNumber: string;
  cardCvv: string;
  cardExpiration: string;
  cardholderName: string;
  currencyCode?: string;
}

export interface RefundProps {
  transactionIdentifier: string;
  amount: number;
  currencyCode?: string;
}

export interface HostedPageProps {
  orderId: string;
  amount: number;
  transactionIdentifier: string;
  pageSet: string;
  pageName: string;
  siteRoot: string;
  threeDSecure?: boolean;
}

export interface RecurringSetupProps {
  orderId: string;
  amount: number;
  transactionIdentifier: string;
  cardToken?: string;
  cardPan?: string;
  cardCvv?: string;
  cardExpiration?: string;
  cardholderName?: string;
  email?: string;
  currencyCode?: string;
  startDate: string;
  expiryDate: string;
  frequency: "D" | "W" | "F" | "M" | "B" | "Q" | "S" | "Y";
  threeDSecure?: boolean;
}

export interface RecurringCancelProps {
  recurringIdentifier: string;
}

export interface VoidProps {
  transactionIdentifier: string;
}
