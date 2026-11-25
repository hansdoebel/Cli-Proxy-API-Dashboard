import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import i18n from '@/i18n';
import { ManagementKeyForm } from '@/components/session/ManagementKeyForm';
import { handleSessionUnauthorized, useAuthStore } from '@/stores/useAuthStore';
import {
  readManagementKeyFromHash,
  readManagementKeyFromSearch,
  shouldBootstrapSession,
  stripManagementKeyFromHref,
} from '@/utils/managementEntry';

describe('management key entry', () => {
  test('reads a key from the search string or the hash query and drops only that param', () => {
    expect(readManagementKeyFromSearch('?key=abc&tab=providers')).toBe('abc');
    expect(readManagementKeyFromSearch('?management-key=from-dash')).toBe('from-dash');
    expect(readManagementKeyFromHash('#/logs?managementKey=from-hash&x=1')).toBe('from-hash');
    expect(readManagementKeyFromHash('#/logs')).toBe('');

    const stripped = stripManagementKeyFromHref(
      'http://127.0.0.1:8317/management.html?key=secret&lang=en#/quota?managementKey=other&tab=1'
    );
    expect(stripped).toBe('http://127.0.0.1:8317/management.html?lang=en#/quota?tab=1');
    expect(stripped).not.toContain('secret');
    expect(stripped).not.toContain('other');
  });

  test('connects automatically for a url key or a remembered session, never with an empty key', () => {
    expect(
      shouldBootstrapSession({
        wasLoggedIn: false,
        apiBase: 'http://127.0.0.1:8317',
        managementKey: '',
        urlKey: 'from-url',
      })
    ).toBe(true);
    expect(
      shouldBootstrapSession({
        wasLoggedIn: true,
        apiBase: 'http://127.0.0.1:8317',
        managementKey: 'saved',
        urlKey: '',
      })
    ).toBe(true);
    expect(
      shouldBootstrapSession({
        wasLoggedIn: false,
        apiBase: 'http://127.0.0.1:8317',
        managementKey: 'saved',
        urlKey: '',
      })
    ).toBe(false);
    expect(
      shouldBootstrapSession({
        wasLoggedIn: true,
        apiBase: '',
        managementKey: 'saved',
        urlKey: 'from-url',
      })
    ).toBe(false);
  });

  test('a rejected login keeps the typed key and will not retry itself', () => {
    const values = new Map<string, string>();
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    });
    values.set('isLoggedIn', 'true');
    useAuthStore.setState({
      isAuthenticated: false,
      connectionStatus: 'connecting',
      apiBase: 'http://127.0.0.1:8317',
      managementKey: 'typed-key',
      rememberPassword: true,
    });

    handleSessionUnauthorized();

    expect(useAuthStore.getState().managementKey).toBe('typed-key');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().connectionStatus).toBe('error');
    expect(useAuthStore.getState().hasRestorableSession()).toBe(false);

    useAuthStore.setState({ isAuthenticated: true, connectionStatus: 'connected' });
    handleSessionUnauthorized();
    expect(useAuthStore.getState().managementKey).toBe('');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });

  test('the entry form masks the key and submits with Enter', async () => {
    const previous = i18n.language;
    await i18n.changeLanguage('en');
    const markup = renderToStaticMarkup(
      createElement(ManagementKeyForm, {
        mode: 'entry',
        initialKey: 'secret-value',
        initialBase: 'http://127.0.0.1:8317',
      })
    );
    expect(markup).toContain('type="password"');
    expect(markup).toContain('value="secret-value"');
    expect(markup).toContain('<form');
    expect(markup).toContain(i18n.t('session.submit'));
    expect(markup).toContain(i18n.t('login.show_key'));
    expect(markup).not.toContain('type="text"');
    await i18n.changeLanguage(previous);
  });
});
