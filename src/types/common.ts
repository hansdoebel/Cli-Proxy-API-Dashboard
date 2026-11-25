/**
 * 通用类型定义
 */

export type Theme = 'linear-dark' | 'linear-light' | 'stripe-light' | 'stripe-dark' | 'auto';

/** Previous releases stored light/white/dark/auto. Auto was the implicit default, so it becomes Linear dark. */
export const normalizeStoredTheme = (theme: unknown): Theme => {
  switch (theme) {
    case 'linear-dark':
    case 'linear-light':
    case 'stripe-light':
    case 'stripe-dark':
    case 'auto':
      return theme;
    case 'light':
    case 'white':
      return 'linear-light';
    case 'dark':
      return 'linear-dark';
    default:
      return 'linear-dark';
  }
};

export type Language = 'zh-CN' | 'zh-TW' | 'en' | 'ru' | 'vi' | 'ko' | 'tr';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}
