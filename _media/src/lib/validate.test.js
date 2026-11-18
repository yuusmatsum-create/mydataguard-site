import { describe, it, expect } from 'vitest';
import { validateArticle } from './validate.js';

const base = () => ({
  data: {
    title: '【脆弱性】サンプル製品に深刻な脆弱性（CVE-2026-0001）',
    category: 'vulnerability',
    publishedAt: '2026-11-18',
    summary: '要約',
    insight: '境界装置の脆弱性は、修正版の公開から悪用まで数日しかない。パッチ適用の判断を月次の定例で行う運用では間に合わない。',
    sources: [{ title: 'JVN', url: 'https://jvn.jp/vu/JVNVU00000000/', date: '2026-11-17' }],
  },
  body: '## 要点\n\n- 修正版が公開された',
});

describe('validateArticle', () => {
  it('正しい記事はエラーも警告もない', () => {
    const r = validateArticle(base());
    expect(r.errors).toEqual([]);
    expect(r.warnings).toEqual([]);
  });

  it('F-202: 出典がない記事はエラー', () => {
    const a = base();
    a.data.sources = [];
    expect(validateArticle(a).errors).toContain('出典（sources）が1件もありません');
  });

  it('F-202: 出典URLが https でなければエラー', () => {
    const a = base();
    a.data.sources = [{ title: 'x', url: 'http://example.com', date: '2026-11-17' }];
    expect(validateArticle(a).errors.join()).toMatch(/https/);
  });

  it('F-302: 【要確認】が残っている記事はエラー（公開不可）', () => {
    const a = base();
    a.body += '\n漏えい件数は【要確認】約1万件';
    expect(validateArticle(a).errors.join()).toMatch(/要確認/);
  });

  it('F-303: メールアドレスを含むとエラー', () => {
    const a = base();
    a.body += '\n連絡先 taro.yamada@example.co.jp';
    expect(validateArticle(a).errors.join()).toMatch(/メールアドレス/);
  });

  it('F-303: 電話番号を含むとエラー', () => {
    const a = base();
    a.body += '\n電話 090-1234-5678';
    expect(validateArticle(a).errors.join()).toMatch(/電話番号/);
  });

  it('F-303: 12桁の番号（マイナンバーの可能性）を含むとエラー', () => {
    const a = base();
    a.body += '\n番号 123456789012';
    expect(validateArticle(a).errors.join()).toMatch(/12桁/);
  });

  it('F-303: CVE番号や日付は誤検知しない', () => {
    const a = base();
    a.body += '\nCVE-2026-123456789 は 2026-11-17 に公開。CVSS 9.8';
    expect(validateArticle(a).errors).toEqual([]);
  });

  it('F-304: 評価語（杜撰・隠蔽など）は警告', () => {
    const a = base();
    a.body += '\n同社の管理は杜撰だった';
    const r = validateArticle(a);
    expect(r.errors).toEqual([]);
    expect(r.warnings.join()).toMatch(/杜撰/);
  });

  it('示唆: 「MyDataGuard の視点」（insight）がない記事はエラー', () => {
    const a = base();
    delete a.data.insight;
    expect(validateArticle(a).errors.join()).toMatch(/視点/);
  });

  it('示唆: 視点が短すぎる（40字未満）記事はエラー', () => {
    const a = base();
    a.data.insight = '早めに対応しましょう。';
    expect(validateArticle(a).errors.join()).toMatch(/視点/);
  });

  it('示唆: 朝刊ダイジェストは視点を省略できる', () => {
    const a = base();
    a.data.category = 'digest';
    delete a.data.insight;
    expect(validateArticle(a).errors).toEqual([]);
  });

  it('事案記事は原因分類が必須', () => {
    const a = base();
    a.data.category = 'incident';
    expect(validateArticle(a).errors.join()).toMatch(/原因分類/);
    a.data.cause = 'ransomware';
    expect(validateArticle(a).errors).toEqual([]);
  });
});
