/** True when this page load asked for sample data. */
export function isMockQueryEnabled(href = ''): boolean {
  const target =
    href || (typeof window !== 'undefined' ? window.location.href : 'http://localhost/');
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return false;
  }
  if (url.searchParams.get('mock') === '1') return true;
  const queryAt = url.hash.indexOf('?');
  if (queryAt === -1) return false;
  return new URLSearchParams(url.hash.slice(queryAt + 1)).get('mock') === '1';
}
