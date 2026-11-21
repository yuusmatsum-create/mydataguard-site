import { describe, it, expect } from 'vitest';
import { tagSlug } from './tags.js';

describe('tagSlug', () => {
  it('スラッシュを含むタグも1階層のURLにする', () => {
    expect(tagSlug('HTTP/2')).toBe('HTTP-2');
  });
  it('日本語や英数字はそのまま', () => {
    expect(tagSlug('仮想基盤')).toBe('仮想基盤');
    expect(tagSlug('KEV')).toBe('KEV');
  });
  it('空白・# ・? もURLで問題にならない形にする', () => {
    expect(tagSlug('Web サーバー')).toBe('Web-サーバー');
    expect(tagSlug('C#?')).toBe('C');
  });
});
