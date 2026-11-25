/** Fictitious preview data. Keys are samples and are masked in the UI. */

const now = Date.now();

const buckets = (seed: number) =>
  Array.from({ length: 12 }, (_, index) => {
    const success = 8 + ((seed + index * 3) % 17);
    const failed = index % 5 === 0 ? 2 : index % 7 === 0 ? 1 : 0;
    return {
      time: new Date(now - (11 - index) * 10 * 60 * 1000).toISOString(),
      success,
      failed,
    };
  });

export const mockConfig = {
  'config-version': 8,
  server: { host: '0.0.0.0', port: 8317, 'server-id': 'pi-preview' },
  management: { 'allow-remote': false },
  access: {
    'api-keys': ['sk-sample-client-a1b2c3', 'sk-sample-client-d4e5f6'],
  },
  'api-keys': {
    gemini: [
      {
        name: 'Studio',
        'base-url': 'https://generativelanguage.googleapis.com',
        keys: [{ 'api-key': 'sk-sample-gemini-7f3a9c', prefix: 'gemini', weight: 1 }],
      },
    ],
    claude: [
      {
        keys: [{ 'api-key': 'sk-sample-claude-19c2aa', prefix: 'claude', weight: 1 }],
      },
    ],
    'openai-compatibility': [
      {
        name: 'Example gateway',
        'base-url': 'https://example.invalid/v1',
        keys: [{ 'api-key': 'sk-sample-gateway-04e1b8', weight: 1 }],
      },
    ],
  },
  routing: {
    strategy: 'round-robin',
    'force-model-prefix': false,
    retry: { 'request-retry': 2 },
  },
  requests: { 'proxy-url': '' },
  oauth: { providers: { aistudio: { 'ws-auth': false } } },
  observability: {
    logs: {
      debug: false,
      'request-log': true,
      'logging-to-file': true,
    },
  },
};

export const mockConfigYaml = `config-version: 8
server:
  host: 0.0.0.0
  port: 8317
access:
  api-keys:
    - sk-sample-client-a1b2c3
    - sk-sample-client-d4e5f6
routing:
  strategy: round-robin
observability:
  logs:
    logging-to-file: true
`;

export const mockCredentials = {
  files: [
    {
      name: 'claude-team.json',
      type: 'claude',
      email: 'ada@example.com',
      disabled: false,
      unavailable: false,
      success: 842,
      failed: 18,
      recent_requests: buckets(3),
      auth_index: 'claude:ada@example.com',
      modified: Math.floor(now / 1000) - 3600,
    },
    {
      name: 'codex-personal.json',
      type: 'codex',
      email: 'lin@example.com',
      disabled: true,
      unavailable: false,
      success: 126,
      failed: 9,
      recent_requests: buckets(8),
      auth_index: 'codex:lin@example.com',
      modified: Math.floor(now / 1000) - 86400,
    },
    {
      name: 'gemini-studio.json',
      type: 'gemini',
      email: 'studio@example.com',
      disabled: false,
      unavailable: false,
      success: 510,
      failed: 7,
      recent_requests: buckets(1),
      auth_index: 'gemini:studio@example.com',
      modified: Math.floor(now / 1000) - 7200,
    },
  ],
};

export const mockUsage = {
  gemini: {
    'https://generativelanguage.googleapis.com|sk-sample-gemini-7f3a9c': {
      success: 1284,
      failed: 22,
      recent_requests: buckets(2),
    },
  },
  claude: {
    'https://api.anthropic.com|sk-sample-claude-19c2aa': {
      success: 966,
      failed: 14,
      recent_requests: buckets(5),
    },
  },
  'openai-compatibility': {
    'https://example.invalid/v1|sk-sample-gateway-04e1b8': {
      success: 240,
      failed: 11,
      recent_requests: buckets(9),
    },
  },
};

export const mockLogLines = [
  '2026-11-25T06:40:01Z INFO request id=req_8f3a model=claude-sonnet-4.5 status=200 latency=842ms',
  '2026-11-25T06:40:06Z INFO request id=req_8f3e model=gemini-2.5-pro status=200 latency=1204ms',
  '2026-11-25T06:40:11Z WARN request id=req_8f41 model=gpt-4.1 status=429 provider=example-gateway retry=1',
  '2026-11-25T06:40:18Z INFO request id=req_8f44 model=claude-haiku-4.5 status=200 latency=310ms',
  '2026-11-25T06:40:27Z ERROR request id=req_8f4b model=gpt-4.1 status=502 provider=example-gateway',
  '2026-11-25T06:41:02Z INFO request id=req_8f55 model=gemini-2.5-flash status=200 latency=188ms',
];

export const mockErrorLogs = {
  files: [
    { name: 'error-2026-11-25.log', size: 4096, modified: Math.floor(now / 1000) - 600 },
  ],
};

export const mockModels = {
  data: [
    { id: 'claude-sonnet-4.5' },
    { id: 'claude-haiku-4.5' },
    { id: 'gemini-2.5-pro' },
    { id: 'gemini-2.5-flash' },
    { id: 'gpt-4.1' },
  ],
};

export const mockPlugins = {
  plugins_enabled: true,
  plugins_dir: 'plugins',
  plugins: [
    {
      id: 'request-logger',
      path: 'plugins/request-logger',
      configured: true,
      registered: true,
      enabled: true,
      effective_enabled: true,
      metadata: {
        name: 'Request logger',
        description: 'Sample plugin that records request metadata.',
        version: '1.2.0',
      },
    },
  ],
};

export function resolveMockBody(method: string, url: string): unknown {
  const path = pathnameOf(url);
  const verb = method.toLowerCase();
  if (verb !== 'get' && verb !== 'head') {
    return { status: 'ok' };
  }
  if (path.endsWith('/config.yaml')) return mockConfigYaml;
  if (path.endsWith('/config')) return mockConfig;
  if (path.endsWith('/credentials')) return mockCredentials;
  if (path.endsWith('/observability/usage/api-keys')) return mockUsage;
  if (path.endsWith('/observability/logs/errors')) return mockErrorLogs;
  if (path.endsWith('/observability/logs')) {
    return {
      lines: mockLogLines,
      'latest-timestamp': Math.floor(now / 1000),
      'next-cursor': '',
    };
  }
  if (path.endsWith('/plugins/store')) {
    return { plugins_enabled: true, plugins_dir: 'plugins', plugins: [], source_errors: [] };
  }
  if (path.endsWith('/plugins')) return mockPlugins;
  if (path.endsWith('/v1/models') || path.endsWith('/models')) return mockModels;
  return {};
}

function pathnameOf(url: string): string {
  try {
    return new URL(url, 'http://127.0.0.1').pathname.replace(/\/+$/, '') || '/';
  } catch {
    return url;
  }
}
