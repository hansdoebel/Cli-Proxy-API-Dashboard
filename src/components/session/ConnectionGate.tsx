import { useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { useAuthStore } from '@/stores';
import { formatManagementError } from '@/utils/managementError';
import { ManagementKeyForm } from './ManagementKeyForm';
import styles from './ConnectionGate.module.scss';

/**
 * Same-origin entry. The management API always requires a key, including from localhost,
 * so the panel asks only when none is remembered and none was passed in the URL.
 */
export function ConnectionGate({ children }: { children: ReactElement }) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const apiBase = useAuthStore((state) => state.apiBase);
  const managementKey = useAuthStore((state) => state.managementKey);
  const rememberPassword = useAuthStore((state) => state.rememberPassword);
  const lastEntryError = useAuthStore((state) => state.lastEntryError);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    restoreSession().finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [restoreSession]);

  if (isAuthenticated) return children;

  const serverError =
    ready && lastEntryError ? formatManagementError(lastEntryError, t) : '';

  return (
    <div className={styles.gate}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>{t('session.title')}</CardTitle>
          <CardDescription>{ready ? t('session.description') : t('session.connecting')}</CardDescription>
        </CardHeader>
        <CardContent>
          {ready ? (
            <ManagementKeyForm
              mode="entry"
              initialBase={apiBase}
              initialKey={managementKey}
              rememberPassword={rememberPassword || !managementKey}
              serverError={serverError}
            />
          ) : (
            <div className={styles.pending} role="status">
              <LoadingSpinner />
              <span>{t('session.connecting')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
