import { describe, it, expect } from 'vitest';
import { sanitizeForLogging, maskCardNumber } from '../utils';

describe('sanitizeForLogging', () => {
  it('should mask card numbers', () => {
    const result = sanitizeForLogging({ cardNumber: '4111111111111111' });
    expect(result.cardNumber).toBe('****1111');
  });

  it('should mask CVV', () => {
    const result = sanitizeForLogging({ cvv: '123' });
    expect(result.cvv).toBe('***');
  });

  it('should mask card expiration', () => {
    const result = sanitizeForLogging({ cardExpiration: '1225' });
    expect(result.cardExpiration).toBe('****');
  });

  it('should mask token', () => {
    const result = sanitizeForLogging({ token: 'ptz-token-abc123' });
    expect(result.token).toBe('********');
  });

  it('should pass through non-sensitive fields', () => {
    const result = sanitizeForLogging({ amount: 100, orderId: 'order-123' });
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe('order-123');
  });

  it('should handle nested objects', () => {
    const result = sanitizeForLogging({
      source: {
        cardNumber: '4111111111111111',
        cvv: '123',
      },
    });

    expect(result.source?.cardNumber).toBe('****1111');
    expect(result.source?.cvv).toBe('***');
  });

  it('should handle mixed sensitive and non-sensitive nested fields', () => {
    const result = sanitizeForLogging({
      transactionIdentifier: 'txn-123',
      source: {
        CardPan: '4111111111111111',
        CardCvv: '456',
        CardholderName: 'John Doe',
      },
    });

    expect(result.transactionIdentifier).toBe('txn-123');
    expect(result.source?.CardPan).toBe('****1111');
    expect(result.source?.CardCvv).toBe('***');
    expect(result.source?.CardholderName).toBe('John Doe');
  });

  it('should handle empty object', () => {
    const result = sanitizeForLogging({});
    expect(result).toEqual({});
  });
});

describe('maskCardNumber', () => {
  it('should mask full card number', () => {
    expect(maskCardNumber('4111111111111111')).toBe('****1111');
  });

  it('should handle short card numbers', () => {
    expect(maskCardNumber('1234')).toBe('****');
  });

  it('should handle empty string', () => {
    expect(maskCardNumber('')).toBe('****');
  });
});
