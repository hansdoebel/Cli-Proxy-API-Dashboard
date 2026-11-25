/** Query names accepted for a one-time management key. Stripped after read. */
export const MANAGEMENT_KEY_QUERY_NAMES = ['key', 'managementKey', 'management-key'] as const;

export interface SessionBootstrapInput {
  wasLoggedIn: boolean;
  apiBase: string;
  managementKey: string;
  urlKey: string;
}

const readNamedParam = (search: string): string => {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  for (const name of MANAGEMENT_KEY_QUERY_NAMES) {
    const value = params.get(name)?.trim();
    if (value) return value;
  }
  return '';
};

export const readManagementKeyFromSearch = (search: string): string => readNamedParam(search);

export const readManagementKeyFromHash = (hash: string): string => {
  const queryIndex = hash.indexOf('?');
  if (queryIndex === -1) return '';
  return readNamedParam(hash.slice(queryIndex + 1));
};

export const readManagementKeyFromLocation = (
  location?: Pick<Location, 'search' | 'hash'>
): string => {
  try {
    const current = location ?? window.location;
    return readManagementKeyFromSearch(current.search) || readManagementKeyFromHash(current.hash);
  } catch {
    return '';
  }
};

/** Drop the key from the search string and the hash query without touching other params. */
export const stripManagementKeyFromHref = (href: string): string => {
  const url = new URL(href);
  let changed = false;
  for (const name of MANAGEMENT_KEY_QUERY_NAMES) {
    if (url.searchParams.has(name)) {
      url.searchParams.delete(name);
      changed = true;
    }
  }

  const hash = url.hash;
  const queryIndex = hash.indexOf('?');
  if (queryIndex !== -1) {
    const path = hash.slice(0, queryIndex);
    const params = new URLSearchParams(hash.slice(queryIndex + 1));
    for (const name of MANAGEMENT_KEY_QUERY_NAMES) {
      if (params.has(name)) {
        params.delete(name);
        changed = true;
      }
    }
    const rest = params.toString();
    url.hash = rest ? `${path}?${rest}` : path;
  }

  return changed ? url.toString() : href;
};

/** Read the key once and remove it from the address bar so it is not left in history. */
export const consumeManagementKeyFromLocation = (): string => {
  if (typeof window === 'undefined') return '';
  const key = readManagementKeyFromLocation();
  if (!key) return '';
  const next = stripManagementKeyFromHref(window.location.href);
  if (next !== window.location.href) {
    window.history.replaceState(window.history.state, '', next);
  }
  return key;
};

/**
 * Auto-connect when a key arrived in the URL, or when a previous visit remembered one.
 * An empty key never calls the API: CLIProxyAPI counts missing keys toward the failure ban.
 */
export const shouldBootstrapSession = ({
  wasLoggedIn,
  apiBase,
  managementKey,
  urlKey,
}: SessionBootstrapInput): boolean => {
  if (!apiBase) return false;
  if (urlKey.trim()) return true;
  return wasLoggedIn && Boolean(managementKey.trim());
};
