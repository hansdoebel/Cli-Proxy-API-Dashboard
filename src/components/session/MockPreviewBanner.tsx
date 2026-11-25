import { useTranslation } from 'react-i18next';
import { isMockSession } from '@/services/api/mock/flag';

/** Sample-data notice. Renders nothing unless a mock build was switched on. */
export function MockPreviewBanner() {
  const { t } = useTranslation();
  if (!isMockSession()) return null;
  return (
    <div className="mock-preview-banner" role="status">
      {t('mock.banner')}
    </div>
  );
}
