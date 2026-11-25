import type { ReactElement } from 'react';
import { ConnectionGate } from '@/components/session/ConnectionGate';

/**
 * The panel is served by CLIProxyAPI and talks to that same origin.
 * There is no login screen: ConnectionGate reuses a remembered key, a URL key,
 * or asks for the management key once when the server requires it.
 */
export function ProtectedRoute({ children }: { children: ReactElement }) {
  return <ConnectionGate>{children}</ConnectionGate>;
}
