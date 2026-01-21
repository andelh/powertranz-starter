import axios from "axios";

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

export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length <= 4) return "****";
  return "****" + cardNumber.slice(-4);
}

export function sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ["CardPan", "CardCvv", "cardNumber", "cvv", "panToken"];
  const sanitized = { ...obj };
  for (const field of sensitiveFields) {
    if (field in sanitized && typeof sanitized[field] === "string") {
      if (field === "CardPan" || field === "cardNumber") {
        sanitized[field] = maskCardNumber(sanitized[field] as string);
      } else {
        sanitized[field] = "***REDACTED***";
      }
    }
  }
  return sanitized;
}
