import axios from "axios";
import { sanitizeForLogging } from "./utils";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const powertranzConfig = {
  baseUrl: getEnv("POWERTRANZ_BASE_URL"),
  merchantId: getEnv("POWERTRANZ_MERCHANT_ID"),
  password: getEnv("POWERTRANZ_PROCESSING_PASSWORD"),
  defaultCurrency: process.env.POWERTRANZ_DEFAULT_CURRENCY || "780",
};

export const createPowertranzClient = () => {
  return axios.create({
    baseURL: powertranzConfig.baseUrl,
    headers: {
      "PowerTranz-PowerTranzId": powertranzConfig.merchantId,
      "PowerTranz-PowerTranzPassword": powertranzConfig.password,
      "Content-Type": "application/json; charset=utf-8",
    },
    timeout: 30000,
  });
};

export const createAdminClient = () => {
  const adminBaseUrl = process.env.POWERTRANZ_ADMIN_BASE_URL || powertranzConfig.baseUrl;
  return axios.create({
    baseURL: adminBaseUrl,
    headers: {
      "PowerTranz-PowerTranzId": powertranzConfig.merchantId,
      "PowerTranz-PowerTranzPassword": powertranzConfig.password,
      "Content-Type": "application/json; charset=utf-8",
    },
    timeout: 30000,
  });
};

export { sanitizeForLogging };
