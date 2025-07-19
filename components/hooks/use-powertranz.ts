import axios from "axios";
// import { stringify } from "flatted";
import { useState } from "react";

type AuthAndCaptureFlowProps = {
  orderId: string;
  amount: number;
  siteRoot: string;
  transactionIdentifier: string;
  token: string;
  authOnly: boolean;
  email: string;
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

const usePowertranz = () => {
  const [loading, setLoading] = useState(false);

  // Load FAC Auth Flow
  const loadPowertranzAuthAndCaptureFlow = async ({
    orderId,
    amount,
    siteRoot,
    transactionIdentifier,
    token,
    authOnly = false,
    email,
  }: AuthAndCaptureFlowProps) => {
    console.log({ orderId, amount, siteRoot });
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
        authOnly,
        email,
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

    // console.log(`Axios Response: ${stringify(response.data)}`); // data property of axios response object
    // console.log(`Axios Status: ${stringify(response.status)}`); // status property of axios response object
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

  return {
    loadPowertranzAuthAndCaptureFlow,
    loadPowertranzCardAuthFlow,
    loading,
  };
};
export default usePowertranz;
