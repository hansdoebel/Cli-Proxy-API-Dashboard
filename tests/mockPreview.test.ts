import { describe, expect, test } from 'bun:test';
import { isMockQueryEnabled } from '@/services/api/mock/query';
import { resolveMockBody } from '@/services/api/mock/fixtures';

describe('mock preview switch', () => {
  test('reads mock=1 from the page query or the hash query', () => {
    expect(isMockQueryEnabled('http://127.0.0.1:8317/management.html')).toBe(false);
    expect(isMockQueryEnabled('http://127.0.0.1:8317/management.html?mock=1')).toBe(true);
    expect(isMockQueryEnabled('http://127.0.0.1:8317/management.html?mock=1#/logs')).toBe(true);
    expect(isMockQueryEnabled('http://127.0.0.1:8317/management.html#/?mock=1')).toBe(true);
    expect(isMockQueryEnabled('http://127.0.0.1:8317/management.html#/config?mock=0')).toBe(false);
  });

  test('sample config masks nothing itself but uses obviously fake keys', () => {
    const config = resolveMockBody('get', 'http://127.0.0.1:8317/v8/management/config') as {
      access: { 'api-keys': string[] };
    };
    expect(config.access['api-keys'].every((key) => key.startsWith('sk-sample-'))).toBe(true);
    const usage = resolveMockBody(
      'get',
      'http://127.0.0.1:8317/v8/management/observability/usage/api-keys'
    ) as { gemini: Record<string, { success: number }> };
    expect(Object.values(usage.gemini)[0]?.success).toBeGreaterThan(0);
    const logs = resolveMockBody(
      'get',
      'http://127.0.0.1:8317/v8/management/observability/logs'
    ) as { lines: string[] };
    expect(logs.lines.length).toBeGreaterThan(0);
  });
});

function channel(hex: string, index: number): number {
  const value = parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function contrast(foreground: string, background: string): number {
  const lum = (hex: string) =>
    0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
  const left = lum(foreground);
  const right = lum(background);
  const [hi, lo] = left > right ? [left, right] : [right, left];
  return (hi + 0.05) / (lo + 0.05);
}

describe('dark text contrast', () => {
  test('Linear dark body and meta text clear WCAG AA on the canvas and on cards', () => {
    expect(contrast('#f7f8f8', '#08090a')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#a1a7b0', '#08090a')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#8e949e', '#08090a')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#8e949e', '#0f1011')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#6b6e76', '#0f1011')).toBeGreaterThanOrEqual(3);
  });

  test('Stripe dark meta text and input borders clear the same bars', () => {
    expect(contrast('#c5d0de', '#0a1628')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#a9b9cc', '#0a1628')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#a9b9cc', '#10213a')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#6d8aaf', '#10213a')).toBeGreaterThanOrEqual(3);
  });
});
