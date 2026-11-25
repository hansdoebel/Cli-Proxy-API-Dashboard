import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/shadcn/alert';
import { isMockSession } from '@/services/api/mock/flag';

/** Sample-data notice. Renders nothing unless a mock build was switched on. */
export function MockPreviewBanner() {
  const { t } = useTranslation();
  if (!isMockSession()) return null;
  return <Alert className="mock-preview-banner">{t('mock.banner')}</Alert>;
}
