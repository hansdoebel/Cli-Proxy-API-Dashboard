import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { resolveMockBody } from './fixtures';

const headers = {
  'content-type': 'application/json',
  'x-cpa-version': '8.4.0-mock',
  'x-cpa-build-date': '2026-11-25T00:00:00Z',
  'x-cpa-support-plugin': 'true',
};

export const mockManagementAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  const url = `${config.baseURL || ''}${config.url || ''}`;
  const body = resolveMockBody(config.method || 'get', url);
  const data =
    config.responseType === 'blob'
      ? new Blob([typeof body === 'string' ? body : JSON.stringify(body, null, 2)], {
          type: 'text/plain',
        })
      : body;

  return {
    data,
    status: 200,
    statusText: 'OK',
    headers,
    config,
  };
};
