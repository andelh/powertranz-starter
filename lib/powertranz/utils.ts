export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length <= 4) return "****";
  return "****" + cardNumber.slice(-4);
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return sanitizeForLogging(value as Record<string, unknown>);
  }
  return value;
}

export function sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ["CardPan", "CardCvv", "cardNumber", "cvv", "panToken", "token", "cardExpiration"];
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.includes(key) && typeof value === "string") {
      if (key === "CardPan" || key === "cardNumber") {
        sanitized[key] = maskCardNumber(value);
      } else if (key === "token") {
        sanitized[key] = "********";
      } else if (key === "cardExpiration") {
        sanitized[key] = "****";
      } else {
        sanitized[key] = "***";
      }
    } else {
      sanitized[key] = sanitizeValue(value);
    }
  }
  
  return sanitized;
}
