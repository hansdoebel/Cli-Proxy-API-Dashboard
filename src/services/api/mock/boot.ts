import axios from 'axios';
import { apiClient } from '@/services/api/client';
import { mockManagementAdapter } from './adapter';
import { isMockQueryEnabled } from './query';

/**
 * Turns on sample data for this page load.
 * The production build never imports this module.
 */
export function bootMockPreview(): void {
  const forced = import.meta.env.VITE_MOCK_DEFAULT === '1';
  if (!forced && !isMockQueryEnabled()) return;
  window.__CPA_MOCK_PREVIEW__ = true;
  apiClient.setRequestAdapter(mockManagementAdapter);
  axios.defaults.adapter = mockManagementAdapter;
}
