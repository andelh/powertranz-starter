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
  ZeroDollarAuthProps,
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

const usePowertranz = () => {
  const [loading, setLoading] = useState(false);

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

  const capture = async (props: CapturePaymentProps): Promise<Result<CapturePaymentResponse>> => {
    return handleApiCall<CapturePaymentResponse>("/api/powertranz/capture", props, setLoading);
  };

  const tokenizeCard = async (props: TokenizeCardProps): Promise<Result<TokenizeCardResponse>> => {
    return handleApiCall<TokenizeCardResponse>("/api/powertranz/tokenize", props, setLoading);
  };

  const directSale = async (props: DirectSaleProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/sale", props, setLoading);
  };

  const refund = async (props: RefundProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/refund", props, setLoading);
  };

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

  const setupManagedRecurring = async (props: RecurringSetupProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/recurring/setup", props, setLoading);
  };

  const cancelManagedRecurring = async (props: RecurringCancelProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/recurring/cancel", props, setLoading);
  };

  const voidAuthorization = async (props: VoidProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/void", props, setLoading);
  };

  const zeroDollarAuth = async (props: ZeroDollarAuthProps): Promise<Result<unknown>> => {
    return handleApiCall("/api/powertranz/zero-dollar-auth", props, setLoading);
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
    zeroDollarAuth,
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
  ZeroDollarAuthProps,
};
