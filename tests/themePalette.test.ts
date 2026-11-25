import { describe, expect, test } from 'bun:test';
import { normalizeStoredTheme } from '@/types/common';

describe('stored theme migration', () => {
  test('older values land on Linear, and explicit Stripe choices stay', () => {
    expect(normalizeStoredTheme(undefined)).toBe('linear-dark');
    expect(normalizeStoredTheme('auto')).toBe('auto');
    expect(normalizeStoredTheme('dark')).toBe('linear-dark');
    expect(normalizeStoredTheme('light')).toBe('linear-light');
    expect(normalizeStoredTheme('white')).toBe('linear-light');
    expect(normalizeStoredTheme('stripe-dark')).toBe('stripe-dark');
    expect(normalizeStoredTheme('stripe-light')).toBe('stripe-light');
  });
});
