import { useState } from "react";
import type {
  Result,
  TokenizeCardProps,
  TokenizeCardResponse,
  CapturePaymentProps,
  CapturePaymentResponse,
  AuthFlowProps,
  DirectSaleProps,
  RefundProps,
  HostedPageProps,
  RecurringSetupProps,
  RecurringCancelProps,
  VoidProps,
} from "@/lib/powertranz";

async function handleApiCall<T>(
  url: string,
  data: unknown,
  setLoading: (loading: boolean) => void
): Promise<Result<T>> {
  try {
    setLoading(true);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: {
          message: result.message || "API request failed",
          isoCode: result.IsoResponseCode,
          raw: result,
        },
      };
    }

    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        raw: error,
      },
    };
  } finally {
    setLoading(false);
  }
}

/**
 * PowerTranz payment hook for React components.
 * Provides methods for all payment operations with built-in loading and error handling.
 *
 * @example
 * const { tokenizeCard, capture, loading, error } = usePowertranz();
 *
 * const handleSubmit = async () => {
 *   const result = await tokenizeCard({ cardNumber: "...", ... });
 *   if (result.ok) {
 *     // Success - use result.data.PanToken
 *   }
 * };
 *
 * @returns Object containing payment methods and loading state
 */
const usePowertranz = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Start a 3D Secure authentication flow.
   * Use after tokenizing a card to authenticate the transaction.
   *
   * @param props - Authentication flow parameters
   * @returns Result containing redirectData (HTML blob) and spiToken
   */
  const startAuth = async (props: AuthFlowProps): Promise<Result<{ redirectData: string; spiToken: string }>> => {
    if (!props.siteRoot) {
      return { ok: false, error: { message: "Running in SSR mode" } };
    }

    const result = await handleApiCall<{ RedirectData: string; SpiToken: string }>(
      "/api/powertranz/auth",
      props,
      setLoading
    );

    if (result.ok && result.data) {
      return { ok: true, data: { redirectData: result.data.RedirectData, spiToken: result.data.SpiToken } };
    }

    if (!result.ok && result.error) {
      return { ok: false, error: result.error };
    }

    return { ok: false, error: { message: "Unknown error" } };
  };

  /**
   * Capture a previously authorized transaction.
   * Call this after successful 3D Secure authentication.
   *
   * @param props - Capture parameters (transactionIdentifier, amount)
   * @returns Capture response with approval details
   */
  const capture = async (props: CapturePaymentProps): Promise<Result<CapturePaymentResponse>> => {
    return handleApiCall<CapturePaymentResponse>("/api/powertranz/capture", props, setLoading);
  };

  /**
   * Tokenize a card for secure storage.
   * Returns a PanToken that can be safely stored and used for future transactions.
   *
   * @param props - Card details to tokenize
   * @returns Tokenization response with PanToken
   */
  const tokenizeCard = async (props: TokenizeCardProps): Promise<Result<TokenizeCardResponse>> => {
    return handleApiCall<TokenizeCardResponse>("/api/powertranz/tokenize", props, setLoading);
  };

  /**
   * Perform a direct sale (authorization + capture in one step).
   * Use when you don't need to store the card for later use.
   *
   * @param props - Sale parameters including raw card details
   * @returns Sale response with approval details
   */
  const directSale = async (props: DirectSaleProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/sale", props, setLoading);
  };

  /**
   * Refund a previous transaction.
   * Can refund partial or full amount.
   *
   * @param props - Refund parameters
   * @returns Refund response
   */
  const refund = async (props: RefundProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/refund", props, setLoading);
  };

  /**
   * Start a Hosted Payment Page (HPP) session.
   * Returns an iframe-compatible HTML blob for secure payment collection.
   * Use PowertranzIframe component to display.
   *
   * @param props - HPP session parameters
   * @returns Result with redirectData (HTML blob) and spiToken
   */
  const startHostedPageSession = async (props: HostedPageProps): Promise<Result<{ redirectData: string; spiToken: string }>> => {
    const result = await handleApiCall<{ RedirectData: string; SpiToken: string }>(
      "/api/powertranz/hpp/start",
      props,
      setLoading
    );

    if (result.ok && result.data) {
      return { ok: true, data: { redirectData: result.data.RedirectData, spiToken: result.data.SpiToken } };
    }

    if (!result.ok && result.error) {
      return { ok: false, error: result.error };
    }

    return { ok: false, error: { message: "Unknown error" } };
  };

  /**
   * Set up a managed recurring payment schedule.
   * Charges the card on a recurring basis according to the configured schedule.
   *
   * @param props - Recurring setup parameters
   * @returns Response with RecurringIdentifier
   */
  const setupManagedRecurring = async (props: RecurringSetupProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/recurring/setup", props, setLoading);
  };

  /**
   * Cancel an existing recurring payment schedule.
   *
   * @param props - Cancel parameters with RecurringIdentifier
   * @returns Cancellation response
   */
  const cancelManagedRecurring = async (props: RecurringCancelProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/recurring/cancel", props, setLoading);
  };

  /**
   * Void an authorization before capture.
   * Use to cancel an authorization without charging the card.
   *
   * @param props - Void parameters with transactionIdentifier
   * @returns Void response
   */
  const voidAuthorization = async (props: VoidProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/void", props, setLoading);
  };

  return {
    startAuth,
    capture,
    tokenizeCard,
    directSale,
    refund,
    startHostedPageSession,
    setupManagedRecurring,
    cancelManagedRecurring,
    voidAuthorization,
    loading,
  };
};

export default usePowertranz;

export type {
  TokenizeCardProps,
  TokenizeCardResponse,
  CapturePaymentProps,
  CapturePaymentResponse,
  AuthFlowProps,
  DirectSaleProps,
  RefundProps,
  HostedPageProps,
  RecurringSetupProps,
  RecurringCancelProps,
  VoidProps,
};
