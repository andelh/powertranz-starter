/**
 * Generic result type for all hook operations.
 * Use pattern matching to handle success and error cases.
 *
 * @example
 * const result = await tokenizeCard(props);
 * if (result.ok) {
 *   console.log('Token:', result.data.PanToken);
 * } else {
 *   console.error('Error:', result.error.message);
 * }
 */
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; isoCode?: string; raw?: unknown } };

/**
 * Props for tokenizing a card (storing it securely with PowerTranz).
 * Returns a PanToken that can be used for subsequent transactions.
 */
export interface TokenizeCardProps {
  /** The card number to tokenize */
  cardNumber: string;
  /** 4-digit expiration year (e.g., "2025") */
  expirationYear: string;
  /** 2-digit expiration month (e.g., "12" for December) */
  expirationMonth: string;
  /** 3-4 digit CVV code */
  cvv: string;
  /** Name on the card */
  cardholderName: string;
  /** Optional ISO 4217 currency code (defaults to TTD/780) */
  currencyCode?: string;
}

/** Response from card tokenization */
export interface TokenizeCardResponse {
  TransactionType: number;
  TotalAmount: number;
  Approved: boolean;
  TransactionIdentifier: string;
  IsoResponseCode: string;
  /** Secure token representing the card - store this, not the card number */
  PanToken?: string;
  ResponseMessage: string;
  OrderIdentifier: string;
  Errors?: Array<{ Code: string; Message: string }>;
  CardBrand?: string;
  CurrencyCode?: string;
}

/** Props for capturing a previously authorized transaction */
export interface CapturePaymentProps {
  /** Transaction identifier from the authorization response */
  transactionIdentifier: string;
  /** Amount to capture (must be <= authorized amount) */
  amount: number;
}

/** Response from capture operation */
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

/**
 * Props for the 3D Secure authentication flow.
 * Use after tokenizing a card to authenticate the transaction.
 */
export interface AuthFlowProps {
  /** Your unique order identifier */
  orderId: string;
  /** Transaction amount */
  amount: number;
  /** Root URL of your site (including protocol) for callbacks */
  siteRoot: string;
  /** PowerTranz transaction identifier */
  transactionIdentifier: string;
  /** PanToken from tokenizeCard response */
  token: string;
  /** Cardholder email for 3DS */
  email: string;
  /** If true, only authorize (don't capture). Capture separately. */
  authOnly?: boolean;
}

/** @deprecated Use TokenizeCardProps with startAuth instead */
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

/**
 * Props for a direct sale (auth + capture in one step).
 * Use when you don't need to store the card for later use.
 */
export interface DirectSaleProps {
  /** Your unique order identifier */
  orderId: string;
  /** Transaction amount */
  amount: number;
  /** PowerTranz transaction identifier */
  transactionIdentifier: string;
  /** Raw card number (not tokenized) */
  cardNumber: string;
  /** Card CVV */
  cardCvv: string;
  /** Card expiration in MMYY format */
  cardExpiration: string;
  /** Name on the card */
  cardholderName: string;
  /** Optional ISO 4217 currency code */
  currencyCode?: string;
}

/** Props for refunding a previous transaction */
export interface RefundProps {
  /** Transaction identifier from the original sale/capture */
  transactionIdentifier: string;
  /** Amount to refund (can be partial) */
  amount: number;
  /** Optional ISO 4217 currency code */
  currencyCode?: string;
}

/**
 * Props for starting a Hosted Payment Page (HPP) session.
 * Returns an iframe-compatible HTML blob for secure payment collection.
 */
export interface HostedPageProps {
  /** Your unique order identifier */
  orderId: string;
  /** Transaction amount */
  amount: number;
  /** PowerTranz transaction identifier */
  transactionIdentifier: string;
  /** PowerTranz page set name */
  pageSet: string;
  /** PowerTranz page name */
  pageName: string;
  /** Root URL of your site for callbacks */
  siteRoot: string;
  /** Whether to require 3D Secure */
  threeDSecure?: boolean;
}

/**
 * Props for setting up a managed recurring payment schedule.
 * Requires either a cardToken or raw card details.
 */
export interface RecurringSetupProps {
  /** Your unique order identifier */
  orderId: string;
  /** Amount to charge each period */
  amount: number;
  /** PowerTranz transaction identifier */
  transactionIdentifier: string;
  /** Existing PanToken from previous tokenization */
  cardToken?: string;
  /** Raw card number (mutually exclusive with cardToken) */
  cardPan?: string;
  /** Required if using cardPan */
  cardCvv?: string;
  /** Required if using cardPan, format MMYY */
  cardExpiration?: string;
  /** Required if using cardPan */
  cardholderName?: string;
  /** Cardholder email for receipts */
  email?: string;
  /** ISO 4217 currency code */
  currencyCode?: string;
  /** First charge date in YYYY-MM-DD format */
  startDate: string;
  /** Last charge date in YYYY-MM-DD format */
  expiryDate: string;
  /** Payment frequency: D=Daily, W=Weekly, F=Fortnightly, M=Monthly, B=Bimonthly, Q=Quarterly, S=Semi-annually, Y=Yearly */
  frequency: "D" | "W" | "F" | "M" | "B" | "Q" | "S" | "Y";
  /** Whether to require 3D Secure for initial transaction */
  threeDSecure?: boolean;
}

/** Props for canceling a recurring payment schedule */
export interface RecurringCancelProps {
  /** RecurringIdentifier returned from setupManagedRecurring */
  recurringIdentifier: string;
}

/** Props for voiding an authorization before capture */
export interface VoidProps {
  /** Transaction identifier to void */
  transactionIdentifier: string;
}
