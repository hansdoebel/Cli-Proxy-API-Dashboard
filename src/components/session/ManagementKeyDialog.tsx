import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { useAuthStore } from '@/stores';
import { ManagementKeyForm } from './ManagementKeyForm';

interface ManagementKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManagementKeyDialog({ open, onOpenChange }: ManagementKeyDialogProps) {
  const { t } = useTranslation();
  const apiBase = useAuthStore((state) => state.apiBase);
  const managementKey = useAuthStore((state) => state.managementKey);
  const rememberPassword = useAuthStore((state) => state.rememberPassword);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('session.change_title')}</DialogTitle>
          <DialogDescription>{t('session.change_description')}</DialogDescription>
        </DialogHeader>
        {open ? (
          <ManagementKeyForm
            mode="settings"
            initialBase={apiBase}
            initialKey={managementKey}
            rememberPassword={rememberPassword}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
