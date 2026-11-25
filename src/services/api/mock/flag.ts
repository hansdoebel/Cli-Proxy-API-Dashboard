/** Set by the mock preview boot, which the production build does not include. */
export function isMockSession(): boolean {
  return typeof window !== 'undefined' && window.__CPA_MOCK_PREVIEW__ === true;
}
