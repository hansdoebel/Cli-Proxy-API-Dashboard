import { useId, useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { useAuthStore, useNotificationStore } from '@/stores';
import { detectApiBaseFromLocation, normalizeApiBase } from '@/utils/connection';
import { formatManagementError } from '@/utils/managementError';
import styles from './ManagementKeyForm.module.scss';

export interface ManagementKeyFormProps {
  mode: 'entry' | 'settings';
  initialBase?: string;
  initialKey?: string;
  rememberPassword?: boolean;
  serverError?: string;
  onDone?: () => void;
}

export function ManagementKeyForm({
  mode,
  initialBase = '',
  initialKey = '',
  rememberPassword = true,
  serverError = '',
  onDone,
}: ManagementKeyFormProps) {
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const detectedBase = detectApiBaseFromLocation();
  const baseId = useId();
  const keyId = useId();
  const errorId = useId();
  const [apiBase, setApiBase] = useState(initialBase);
  const [managementKey, setManagementKey] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);
  const [remember, setRemember] = useState(rememberPassword);
  const [editingBase, setEditingBase] = useState(
    Boolean(initialBase) && normalizeApiBase(initialBase) !== normalizeApiBase(detectedBase)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(serverError);
  const toggleLabel = showKey ? t('login.hide_key') : t('login.show_key');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const trimmedKey = managementKey.trim();
    if (!trimmedKey) {
      setError(t('session.missing'));
      return;
    }

    const baseToUse = normalizeApiBase(editingBase ? apiBase : apiBase || detectedBase);
    setSubmitting(true);
    setError('');
    try {
      await login({
        apiBase: baseToUse || detectedBase,
        managementKey: trimmedKey,
        rememberPassword: remember,
      });
      if (mode === 'settings') {
        showNotification(t('session.saved'), 'success');
        onDone?.();
      }
    } catch (submitError: unknown) {
      setError(formatManagementError(submitError, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <Label htmlFor={keyId}>{t('login.management_key_label')}</Label>
        </div>
        <div className={styles.keyRow}>
          <Input
            id={keyId}
            name="cpa-management-key"
            type={showKey ? 'text' : 'password'}
            autoComplete="current-password"
            autoFocus
            spellCheck={false}
            value={managementKey}
            placeholder={t('login.management_key_placeholder')}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? errorId : undefined}
            disabled={submitting}
            onChange={(event) => {
              setManagementKey(event.target.value);
              if (error) setError('');
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-pressed={showKey}
            aria-label={toggleLabel}
            title={toggleLabel}
            disabled={submitting}
            onClick={() => setShowKey((current) => !current)}
          >
            {showKey ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      <label className={styles.remember}>
        <input
          type="checkbox"
          checked={remember}
          disabled={submitting}
          onChange={(event) => setRemember(event.target.checked)}
        />
        <span>{t('session.remember')}</span>
      </label>

      <div className={styles.server}>
        <button
          type="button"
          className={styles.serverToggle}
          aria-expanded={editingBase}
          aria-controls={baseId}
          disabled={submitting}
          onClick={() => setEditingBase((current) => !current)}
        >
          {t('session.server')}
        </button>
        {editingBase ? (
          <div className={styles.field}>
            <Label htmlFor={baseId}>{t('login.custom_connection_label')}</Label>
            <Input
              id={baseId}
              type="url"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              value={apiBase}
              placeholder={detectedBase || t('login.custom_connection_placeholder')}
              disabled={submitting}
              onChange={(event) => setApiBase(event.target.value)}
            />
            <p className={styles.hint}>{t('session.server_hint')}</p>
          </div>
        ) : (
          <p className={styles.readout} id={baseId}>
            {apiBase || detectedBase}
          </p>
        )}
      </div>

      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.actions}>
        <Button type="submit" disabled={submitting} className={styles.submit}>
          {submitting ? t('session.submitting') : t('session.submit')}
        </Button>
        {mode === 'settings' ? (
          <Button
            type="button"
            variant="ghost"
            disabled={submitting}
            onClick={() => {
              logout();
              onDone?.();
            }}
          >
            {t('session.forget')}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
