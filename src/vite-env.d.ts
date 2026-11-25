/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCK?: string;
  readonly VITE_MOCK_DEFAULT?: string;
}

interface Window {
  __CPA_MOCK_PREVIEW__?: boolean;
}
