import { useTranslation } from 'react-i18next';
import { IconPlus, IconRefreshCw } from '@/components/ui/icons';
import { useRevealGroup } from '@/hooks/motion';
import styles from './ProvidersHeader.module.scss';

export interface ProvidersHeaderSummary {
  totalActive: number;
  totalResources: number;
  providerFamilies: number;
  updatedAtLabel: string;
}

interface ProvidersHeaderProps {
  title: string;
  summary?: ProvidersHeaderSummary;
  isFetching: boolean;
  onRefresh: () => void;
  /** Label of the primary action; the action is hidden when omitted. */
  newLabel?: string;
  newDisabled?: boolean;
  onNew?: () => void;
}

/**
 * Page header in the vault vocabulary: tight title, one mono telemetry line,
 * a quiet text action and a single ink pill for the primary action.
 */
export function ProvidersHeader({
  title,
  isFetching,
  onRefresh,
  newLabel,
  newDisabled = false,
  onNew,
}: ProvidersHeaderProps) {
  const { t } = useTranslation();
  const revealRef = useRevealGroup<HTMLElement>();
  const refreshLabel = isFetching
    ? t('providersPage.actions.syncing')
    : t('providersPage.actions.refresh');

  return (
    <header className={styles.header} ref={revealRef}>
      <div className={styles.copy}>
        <h1 className={styles.title} data-reveal>
          {title}
        </h1>
      </div>
      <div className={styles.actions} data-reveal>
        <button
          type="button"
          className={styles.ghostAction}
          onClick={onRefresh}
          disabled={isFetching}
          aria-busy={isFetching || undefined}
        >
          <IconRefreshCw size={14} className={isFetching ? styles.spinning : undefined} />
          {refreshLabel}
        </button>
        {newLabel && onNew ? (
          <button
            type="button"
            className={styles.primaryAction}
            onClick={onNew}
            disabled={newDisabled}
          >
            <IconPlus size={15} />
            {newLabel}
          </button>
        ) : null}
      </div>
    </header>
  );
}
