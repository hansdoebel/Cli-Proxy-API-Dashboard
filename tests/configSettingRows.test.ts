// 设置行原语：开关 / 输入 / 下拉 / 区块编辑器共用一副骨架，
// 两列网格的落单补整行逻辑，以及每种行的标签与描述关联。
// 说明文字默认收进标题后的 InfoTip，并以视觉隐藏副本留给 aria-describedby；
// keepDescriptionVisible 让它照旧作为可见的一行。

import { describe, expect, test } from 'bun:test';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import {
  BlockSetting,
  FieldShell,
  SelectSetting,
  SettingList,
  TextSetting,
  ToggleSetting,
} from '@/features/config/components/fields/FieldPrimitives';
import { resolveRowSpans } from '@/features/config/components/fields/rowSpans';
import { SectionCard } from '@/features/config/components/SectionCard';

const noop = () => {};
const translations = i18n.cloneInstance({ lng: 'en' });
const render = (element: ReturnType<typeof createElement>) =>
  renderToStaticMarkup(createElement(I18nextProvider, { i18n: translations }, element));
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const infoTipsOf = (markup: string) => markup.match(/<button\b[^>]*data-info-tip=""[^>]*>/g) ?? [];
/** The element carrying `id`, with its text content. */
const elementById = (markup: string, id: string) =>
  markup.match(new RegExp(`<(\\w+)\\b[^>]*\\bid="${id}"[^>]*>(.*?)</\\1>`))?.[0] ?? '';

/** 回显 SettingList 注入的 wide，用来观察补整行结果。 */
function Probe({ name, wide }: { name: string; wide?: boolean }) {
  return createElement('i', { 'data-name': name, 'data-wide': String(Boolean(wide)) });
}
const probe = (name: string, wide?: boolean) => createElement(Probe, { key: name, name, wide });
const spansOf = (markup: string) =>
  [...markup.matchAll(/data-name="([^"]+)" data-wide="(true|false)"/g)].map(
    ([, name, wide]) => `${name}:${wide}`
  );

describe('two-column row spans', () => {
  test('pairs rows and lets a trailing orphan fill its row', () => {
    expect(resolveRowSpans([false, false])).toEqual([false, false]);
    expect(resolveRowSpans([false, false, false])).toEqual([false, false, true]);
    expect(resolveRowSpans([false])).toEqual([true]);
    expect(resolveRowSpans([])).toEqual([]);
  });

  test('a row left alone before a full-width row spans instead of leaving a hole', () => {
    // a b / c [wide] / d → c 与 d 都会落单
    expect(resolveRowSpans([false, false, false, true, false])).toEqual([
      false,
      false,
      true,
      true,
      true,
    ]);
    // [wide] a b → 显式整行后重新从行首配对
    expect(resolveRowSpans([true, false, false])).toEqual([true, false, false]);
  });

  test('SettingList flattens fragments and injects wide only into orphans', () => {
    const markup = render(
      createElement(
        SettingList,
        null,
        probe('a'),
        probe('b'),
        createElement(Fragment, null, probe('c'), probe('d', true)),
        null,
        false,
        probe('e')
      )
    );
    expect(spansOf(markup)).toEqual(['a:false', 'b:false', 'c:true', 'd:true', 'e:true']);
  });

  test('renders an optional group heading without the explanatory description', () => {
    const markup = render(
      createElement(SettingList, { title: 'Codex', description: 'Group hint' }, probe('a'))
    );
    expect(markup).toContain('<h3');
    expect(markup).toContain('Codex');
    expect(markup).not.toContain('Group hint');
    expect(markup).not.toMatch(/<p\b/);
    expect(infoTipsOf(markup)).toHaveLength(0);
    expect(render(createElement(SettingList, null, probe('a')))).not.toContain('<h3');
  });

  test('keepDescriptionVisible keeps the group description as a visible line', () => {
    const markup = render(
      createElement(
        SettingList,
        { title: 'Codex', description: 'Group hint', keepDescriptionVisible: true },
        probe('a')
      )
    );
    expect(markup).toMatch(/<p\b[^>]*>Group hint<\/p>/);
    expect(infoTipsOf(markup)).toHaveLength(0);
  });
});

describe('setting row accessibility', () => {
  test('toggle rows label the switch and describe it with the hint', () => {
    const markup = render(
      createElement(ToggleSetting, {
        fieldId: 'debug',
        label: 'Debug',
        description: 'Verbose logs',
        checked: true,
        onChange: noop,
      })
    );
    expect(markup).toContain('id="cfg-field-debug"');
    const input = markup.match(/<input\b[^>]*type="checkbox"[^>]*>/)?.[0] ?? '';
    expect(input).toContain('checked=""');
    const id = attr(input, 'id');
    expect(id).toBeTruthy();
    expect(markup).toContain(`for="${id}"`);
    expect(input).not.toContain('aria-describedby');
    expect(markup).not.toContain('Verbose logs');
  });

  test('explanatory descriptions are omitted from the row', () => {
    const markup = render(
      createElement(ToggleSetting, {
        fieldId: 'debug',
        label: 'Debug',
        description: 'Verbose logs',
        checked: false,
        onChange: noop,
      })
    );
    expect(markup).toContain('Debug');
    expect(markup).not.toContain('Verbose logs');
    expect(infoTipsOf(markup)).toHaveLength(0);
  });

  test('keepDescriptionVisible renders the description as a visible line without an InfoTip', () => {
    const markup = render(
      createElement(TextSetting, {
        fieldId: 'authDir',
        label: 'Auth directory',
        description: 'Credentials are stored here in plain text',
        keepDescriptionVisible: true,
        value: '',
        onChange: noop,
      })
    );
    const input = markup.match(/<input\b[^>]*>/)?.[0] ?? '';
    const hintId = `${attr(input, 'id')}-hint`;
    expect(attr(input, 'aria-describedby')).toBe(hintId);
    const hint = elementById(markup, hintId);
    expect(hint).toContain('Credentials are stored here in plain text');
    expect(hint).not.toContain('visually-hidden');
    expect(infoTipsOf(markup)).toHaveLength(0);
  });

  test('rows without a description render no InfoTip and no hint element', () => {
    const markup = render(
      createElement(ToggleSetting, { fieldId: 'x', label: 'X', checked: false, onChange: noop })
    );
    expect(infoTipsOf(markup)).toHaveLength(0);
    expect(markup).not.toContain('-hint"');
    expect(markup).not.toContain('aria-describedby');
  });

  test('text rows put the error before the hint and flag the input invalid', () => {
    const markup = render(
      createElement(TextSetting, {
        fieldId: 'port',
        label: 'Port',
        description: 'Listen port',
        error: 'Invalid port',
        type: 'number',
        value: '',
        onChange: noop,
        disabled: true,
      })
    );
    const input = markup.match(/<input\b[^>]*>/)?.[0] ?? '';
    const id = attr(input, 'id');
    expect(markup).toContain(`for="${id}"`);
    expect(attr(input, 'aria-describedby')).toBe(`${id}-error`);
    expect(input).toContain('aria-invalid="true"');
    expect(input).toContain('type="number"');
    expect(input).toContain('disabled=""');
    expect(input).not.toContain('min=');
    const error = elementById(markup, `${id}-error`);
    expect(error).toContain('Invalid port');
    expect(error).not.toContain('visually-hidden');
    expect(markup).not.toContain('Listen port');
  });

  test('adornments render inside the control without replacing the value', () => {
    const markup = render(
      createElement(TextSetting, {
        fieldId: 'streamingKeepaliveSeconds',
        label: 'Keepalive',
        value: '0',
        adornment: 'Disabled',
        onChange: noop,
      })
    );
    expect(markup).toContain('value="0"');
    expect(markup).toContain('Disabled');
    expect(markup).not.toContain('aria-describedby');
  });

  test('select rows label the trigger button by id and by aria-labelledby', () => {
    const markup = render(
      createElement(SelectSetting, {
        fieldId: 'routingStrategy',
        label: 'Strategy',
        value: 'a',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ],
        onChange: noop,
      })
    );
    const button = markup.match(/<button\b[^>]*aria-haspopup="listbox"[^>]*>/)?.[0] ?? '';
    const id = attr(button, 'id');
    expect(markup).toContain(`for="${id}"`);
    const labelId = attr(button, 'aria-labelledby');
    expect(labelId).toContain('routingStrategy-label');
    expect(markup).toContain(`id="${labelId}"`);
    expect(markup).toContain('Alpha');
  });

  test('block rows wrap the editor in a named group and hand describedBy to it', () => {
    let received: { describedBy?: string; invalid: boolean } | undefined;
    const markup = render(
      createElement(BlockSetting, {
        fieldId: 'trustedProxies',
        label: 'Trusted proxies',
        description: 'CIDR list',
        error: 'Bad CIDR',
        children: (a11y: { describedBy?: string; invalid: boolean }) => {
          received = a11y;
          return createElement('textarea', { 'aria-describedby': a11y.describedBy });
        },
      })
    );
    const group = markup.match(/<div\b[^>]*role="group"[^>]*>/)?.[0] ?? '';
    const labelId = attr(group, 'aria-labelledby') ?? '';
    expect(labelId).toContain('trustedProxies-label');
    expect(markup).toContain(`id="${labelId}"`);
    expect(group).toContain('aria-invalid="true"');
    expect(received?.invalid).toBe(true);
    const ids = received?.describedBy?.split(' ') ?? [];
    expect(ids).toHaveLength(1);
    for (const id of ids) expect(markup).toContain(`id="${id}"`);
    expect(attr(group, 'aria-describedby')).toBe(received?.describedBy);
    expect(markup).toContain('Trusted proxies');
    expect(markup).not.toContain('CIDR list');
    expect(infoTipsOf(markup)).toHaveLength(0);
  });
});

describe('field shell hint', () => {
  test('drops an explanatory hint instead of showing an InfoTip', () => {
    const markup = render(
      createElement(FieldShell, {
        label: 'Protocol',
        htmlFor: 'proto',
        hint: 'Leave empty to match all',
        hintId: 'proto-hint',
        children: createElement('input', { id: 'proto' }),
      })
    );
    expect(markup).toContain('Protocol');
    expect(markup).not.toContain('Leave empty to match all');
    expect(infoTipsOf(markup)).toHaveLength(0);
  });

  test('without keepHintVisible the hint is omitted', () => {
    const markup = render(
      createElement(FieldShell, { label: 'Protocol', hint: 'Leave empty', children: null })
    );
    expect(infoTipsOf(markup)).toHaveLength(0);
    expect(markup).not.toContain('Leave empty');
  });

  test('keepHintVisible keeps the visible hint line', () => {
    const markup = render(
      createElement(FieldShell, {
        label: 'Protocol',
        hint: 'Leave empty',
        keepHintVisible: true,
        children: null,
      })
    );
    expect(infoTipsOf(markup)).toHaveLength(0);
    expect(markup).toContain('Leave empty');
    expect(markup).not.toContain('visually-hidden');
  });
});

describe('section card description', () => {
  test('omits the explanatory description under the title', () => {
    const markup = render(
      createElement(SectionCard, {
        title: 'Network',
        description: 'Proxy and retries',
        children: null,
      })
    );
    expect(markup).toContain('Network');
    expect(markup).not.toContain('Proxy and retries');
    expect(infoTipsOf(markup)).toHaveLength(0);
  });

  test('keepDescriptionVisible keeps the paragraph', () => {
    const markup = render(
      createElement(SectionCard, {
        title: 'Network',
        description: 'Proxy and retries',
        keepDescriptionVisible: true,
        children: null,
      })
    );
    expect(markup).toMatch(/<p\b[^>]*>Proxy and retries<\/p>/);
    expect(infoTipsOf(markup)).toHaveLength(0);
  });
});

describe('row aside', () => {
  test('renders visible, focusable content that does not describe the control', () => {
    const markup = render(
      createElement(TextSetting, {
        fieldId: 'proxyUrl',
        label: 'Proxy URL',
        aside: createElement('a', { href: 'https://example.test' }, 'Sponsor'),
        value: '',
        onChange: noop,
      })
    );
    expect(markup).toContain('<a href="https://example.test">Sponsor</a>');
    // Not hidden, not in an InfoTip, not part of the input's description.
    expect(markup).not.toContain('visually-hidden');
    expect(infoTipsOf(markup)).toHaveLength(0);
    const input = markup.match(/<input\b[^>]*>/)?.[0] ?? '';
    expect(input).not.toContain('aria-describedby');
  });

  test('keeps the aside and drops the explanatory description', () => {
    const markup = render(
      createElement(TextSetting, {
        fieldId: 'proxyUrl',
        label: 'Proxy URL',
        description: 'Explanation',
        aside: createElement('a', { href: 'https://example.test' }, 'Sponsor'),
        value: '',
        onChange: noop,
      })
    );
    expect(markup).toContain('<a href="https://example.test">Sponsor</a>');
    expect(markup).not.toContain('Explanation');
    expect(infoTipsOf(markup)).toHaveLength(0);
    const input = markup.match(/<input\b[^>]*>/)?.[0] ?? '';
    expect(input).not.toContain('aria-describedby');
  });
});
