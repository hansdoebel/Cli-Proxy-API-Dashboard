// 共享提示：InfoTip / Tooltip 的静态标记契约，Input 把 hint 收进 InfoTip 的行为，以及共享 FieldLabel。
// 静态渲染只覆盖关闭态的结构与无障碍关联；悬停、聚焦、点按与定位需在浏览器里核对。

import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { InfoTip, Tooltip } from '@/components/ui/Tooltip';

const render = (element: ReturnType<typeof createElement>, lng = 'en') =>
  renderToStaticMarkup(
    createElement(I18nextProvider, { i18n: i18n.cloneInstance({ lng }) }, element)
  );
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const infoTipsOf = (markup: string) => markup.match(/<button\b[^>]*data-info-tip=""[^>]*>/g) ?? [];

describe('InfoTip', () => {
  test('is a real button named from i18n and described by a hidden copy of its content', () => {
    const markup = render(createElement(InfoTip, { content: 'Zero disables retries' }));
    const [button] = infoTipsOf(markup);
    expect(button).toContain('type="button"');
    expect(attr(button, 'aria-label')).toBe('More information');
    expect(attr(button, 'data-state')).toBe('closed');
    const id = attr(button, 'aria-describedby')!;
    expect(markup).toContain(`<span id="${id}" hidden="">Zero disables retries</span>`);
    // Closed: no tooltip bubble is rendered.
    expect(markup).not.toContain('role="tooltip"');
  });

  test('names itself after the label it explains, in every locale', () => {
    const named = (lng: string) =>
      attr(
        infoTipsOf(render(createElement(InfoTip, { content: 'x', label: 'Port' }), lng))[0],
        'aria-label'
      );
    expect(named('en')).toBe('More information about Port');
    expect(named('zh-CN')).toBe('关于「Port」的说明');
    for (const lng of ['zh-TW', 'ru', 'vi', 'ko', 'tr']) {
      const name = named(lng)!;
      expect(name).toContain('Port');
      expect(name).not.toContain('more_info');
    }
  });

  test('reuses an existing description element instead of rendering its own copy', () => {
    const markup = render(createElement(InfoTip, { content: 'Hint', descriptionId: 'field-hint' }));
    expect(attr(infoTipsOf(markup)[0], 'aria-describedby')).toBe('field-hint');
    expect(markup).not.toContain('hidden=""');
    expect(markup).not.toContain('Hint');
  });

  test('renders nothing without content', () => {
    expect(render(createElement(InfoTip, { content: '' }))).toBe('');
    expect(render(createElement(InfoTip, { content: null }))).toBe('');
  });
});

describe('Tooltip', () => {
  test('renders its trigger untouched apart from the wiring, and no bubble while closed', () => {
    const markup = render(
      createElement(
        Tooltip,
        { content: 'Copies the key' },
        createElement('button', { type: 'button', 'aria-label': 'Copy', className: 'icon' }, 'C')
      )
    );
    expect(markup).toBe('<button type="button" aria-label="Copy" class="icon">C</button>');
  });

  test("keeps the child's own aria-describedby", () => {
    const markup = render(
      createElement(
        Tooltip,
        { content: 'Explanation' },
        createElement('input', { 'aria-describedby': 'own-hint' })
      )
    );
    expect(attr(markup, 'aria-describedby')).toBe('own-hint');
  });

  test('without content it returns the child as is', () => {
    const child = createElement('a', { href: '#x' }, 'link');
    expect(render(createElement(Tooltip, { content: null }, child))).toBe('<a href="#x">link</a>');
  });
});

describe('Input hint', () => {
  test('a labelled hint is not rendered', () => {
    const markup = render(
      createElement(Input, { id: 'priority', label: 'Priority', hint: 'Larger runs first' })
    );
    const input = markup.match(/<input\b[^>]*>/)![0];
    expect(input).not.toContain('aria-describedby');
    expect(markup).toContain('<label for="priority">Priority</label>');
    expect(markup).not.toContain('Larger runs first');
    expect(infoTipsOf(markup)).toHaveLength(0);
  });

  test('a note stays visible and describes the input; the hint does not', () => {
    const markup = render(
      createElement(Input, {
        id: 'weight',
        label: 'Weight',
        hint: 'Defaults to 1',
        note: createElement('a', { href: '#/config' }, 'Enable weighting'),
      })
    );
    const input = markup.match(/<input\b[^>]*>/)![0];
    expect(attr(input, 'aria-describedby')).toBe('weight-note');
    expect(markup).not.toContain('Defaults to 1');
    expect(markup).toContain(
      '<div id="weight-note" class="hint"><a href="#/config">Enable weighting</a></div>'
    );
    expect(infoTipsOf(markup)).toHaveLength(0);
  });

  test('a note without a hint keeps the plain label', () => {
    const markup = render(
      createElement(Input, { id: 'note', label: 'Note', note: 'Stored in plain text' })
    );
    expect(markup).toContain('<label for="note">Note</label>');
    expect(markup).toContain('<div id="note-note" class="hint">Stored in plain text</div>');
    expect(infoTipsOf(markup)).toHaveLength(0);
    expect(markup).not.toContain('form-label-row');
  });

  test('a hint without a label is still omitted', () => {
    const markup = render(createElement(Input, { id: 'q', hint: 'Press Enter to search' }));
    expect(markup).not.toContain('Press Enter to search');
    expect(infoTipsOf(markup)).toHaveLength(0);
  });

  test('errors stay visible and describe the input', () => {
    const markup = render(
      createElement(Input, { id: 'w', label: 'Weight', hint: 'Defaults to 1', error: 'Too large' })
    );
    const input = markup.match(/<input\b[^>]*>/)![0];
    expect(attr(input, 'aria-describedby')).toBe('w-error');
    expect(input).toContain('aria-invalid="true"');
    expect(markup).toContain('<div id="w-error" class="error-box">Too large</div>');
    expect(markup).not.toContain('Defaults to 1');
  });
});

describe('FieldLabel', () => {
  test('without a hint it is a label row with no InfoTip', () => {
    expect(render(createElement(FieldLabel, { label: 'Mode', htmlFor: 'm' }))).toBe(
      '<div class="form-label-row"><label for="m">Mode</label></div>'
    );
  });

  test('without htmlFor the label is a span; `as` and the classes are honoured', () => {
    expect(render(createElement(FieldLabel, { label: 'Mode', id: 'l' }))).toBe(
      '<div class="form-label-row"><span id="l">Mode</span></div>'
    );
    expect(
      render(
        createElement(FieldLabel, {
          label: 'Mode',
          id: 'l',
          as: 'label',
          className: 'row',
          labelClassName: 'text',
        })
      )
    ).toBe('<div class="row"><label id="l" class="text">Mode</label></div>');
  });

  test('a hint is not rendered beside the label', () => {
    const markup = render(
      createElement(FieldLabel, { label: 'Mode', htmlFor: 'm', hint: 'Zero means off', hintId: 'h' })
    );
    expect(markup).toBe('<div class="form-label-row"><label for="m">Mode</label></div>');
  });

  test('a hint without hintId is still omitted', () => {
    const markup = render(createElement(FieldLabel, { label: 'Mode', hint: 'Zero means off' }));
    expect(markup).toBe('<div class="form-label-row"><span>Mode</span></div>');
  });
});
