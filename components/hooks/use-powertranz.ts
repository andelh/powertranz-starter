import axios from "axios";
import { useState } from "react";

export type AuthAndCaptureFlowProps = {
  orderId: string;
  amount: number;
  siteRoot: string;
  transactionIdentifier: string;
  token: string;
  email: string;
  authOnly?: boolean;
};

type CardAuthFlowProps = {
  orderId: string;
  amount: number;
  siteRoot: string;
  transactionIdentifier: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  cardholderName: string;
};

export type TokenizeCardProps = {
  cardNumber: string;
  expirationYear: string; // YY
  expirationMonth: string; // MM
  cvv: string;
  cardholderName: string;
  currencyCode?: string;
};

type TokenizeCardResponse = {
  TransactionType: number;
  TotalAmount: number;
  Approved: boolean;
  TransactionIdentifier: string;
  IsoResponseCode: string;
  PanToken?: string;
  ResponseMessage: string;
  OrderIdentifier: string;
  Errors?: [{ Code: string; Message: string }];
  CardBrand?: string;
  CurrencyCode?: string;
};

export type CapturePaymentProps = {
  transactionIdentifier: string;
  amount: number;
};

export type CapturePaymentResponse = {
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
};

const usePowertranz = () => {
  const [loading, setLoading] = useState(false);

  // Load FAC Auth (and Capture) Flow
  const loadPowertranzAuthAndCaptureFlow = async ({
    orderId,
    amount,
    siteRoot,
    transactionIdentifier,
    token,
    email,
    authOnly = false,
  }: AuthAndCaptureFlowProps) => {
    // Only attempt to load HPP if in browser, and not when SSR is running
    if (!siteRoot) {
      throw new Error("Running in SSR mode");
    }
    let config = {
      method: "post",
      url: `/api/powertranz/auth`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      data: {
        orderId,
        amount,
        siteRoot,
        transactionIdentifier,
        token,
        email,
        authOnly,
      },
    };
    setLoading(true);
    const response = await axios(config); // api call to fetch fac hosted page html
    setLoading(false);
    console.log("@loadPowertranzAuthAndCaptureFlow response: ");
    console.log(response.data);
    if (response.data.ResponseMessage === "Duplicate transaction") {
      console.error(
        "This checkout has already been processed. Please go back and try your order again."
      );
      throw new Error("Duplicate transaction");
    }

    return response.data.RedirectData;
  };

  // Load FAC Zero Dollar Auth Flow
  const loadPowertranzCardAuthFlow = async ({
    orderId,
    amount,
    siteRoot,
    transactionIdentifier,
    cardNumber,
    expiration,
    cvv,
    cardholderName,
  }: CardAuthFlowProps) => {
    console.log({ orderId, amount, siteRoot });
    // Only attempt to load HPP if in browser, and not when SSR is running
    if (!siteRoot) {
      throw new Error("Running in SSR mode");
    }
    let config = {
      method: "post",
      url: `/api/powertranz/zero-dollar-auth`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      data: {
        orderId,
        amount,
        siteRoot,
        transactionIdentifier,
        cardNumber,
        expiration,
        cvv,
        cardholderName,
      },
    };
    setLoading(true);
    const response = await axios(config); // api call to fetch fac hosted page html
    setLoading(false);
    console.log(response.data);
    if (response.data.ResponseMessage === "Duplicate transaction") {
      console.error(
        "This checkout has already been processed. Please go back and try your order again."
      );
      throw new Error("Duplicate transaction");
    }

    // console.log(`Axios Response: ${stringify(response.data)}`); // data property of axios response object
    // console.log(`Axios Status: ${stringify(response.status)}`); // status property of axios response object
    return response.data.RedirectData;
  };

  // Tokenize a Card
  const tokenizeCard = async ({
    cardNumber,
    expirationYear,
    expirationMonth,
    cvv,
    cardholderName,
    currencyCode,
  }: TokenizeCardProps): Promise<TokenizeCardResponse> => {
    try {
      setLoading(true);
      const response = await axios.post("/api/powertranz/tokenize", {
        cardNumber,
        expirationYear,
        expirationMonth,
        cvv,
        cardholderName,
        currencyCode,
      });
      return response.data;
    } catch (error) {
      console.error("Tokenization error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const capturePayment = async ({
    transactionIdentifier,
    amount,
  }: CapturePaymentProps): Promise<CapturePaymentResponse> => {
    try {
      setLoading(true);
      const response = await axios.post("/api/powertranz/capture", {
        transactionIdentifier,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error("Tokenization error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loadPowertranzAuthAndCaptureFlow,
    loadPowertranzCardAuthFlow,
    tokenizeCard,
    capturePayment,
    loading,
  };
};
export default usePowertranz;
