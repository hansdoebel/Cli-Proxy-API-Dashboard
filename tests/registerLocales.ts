/**
 * Test-only locale bundles. The app bundle registers English alone.
 */
import i18n from '@/i18n';
import zhCN from '@/i18n/locales/zh-CN.json';
import zhTW from '@/i18n/locales/zh-TW.json';
import ru from '@/i18n/locales/ru.json';
import vi from '@/i18n/locales/vi.json';
import ko from '@/i18n/locales/ko.json';
import tr from '@/i18n/locales/tr.json';

const bundles = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ru,
  vi,
  ko,
  tr,
} as const;

for (const [language, translation] of Object.entries(bundles)) {
  i18n.addResourceBundle(language, 'translation', translation, true, true);
}
