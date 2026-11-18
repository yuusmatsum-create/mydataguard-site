// 表示だけに使う整形。記事データ（title など）自体は変えない。

// 見出し先頭の【脆弱性】などはカテゴリ表示と重複するので、画面上の見出しからは外す。
// <title> や RSS には元のタイトルを使う。
export const displayTitle = (t = '') => t.replace(/^【[^】]{1,8}】\s*/, '');

// 示唆の1文目を「見出し」、残りを「本文」として分ける
export function splitInsight(s = '') {
  const i = s.indexOf('。');
  if (i < 0 || i === s.length - 1) return { head: s, rest: '' };
  return { head: s.slice(0, i + 1), rest: s.slice(i + 1) };
}

export const PRIO = {
  now: { label: '今すぐ対応', short: '今すぐ', level: 3 },
  week: { label: '1週間以内に対応', short: '1週間以内', level: 2 },
  planned: { label: '計画的に対応', short: '計画的に', level: 1 },
};

export const WEEKDAY = ['日', '月', '火', '水', '木', '金', '土'];

// 概要表から「深刻度」「悪用状況」などを1行で拾う
export const factOf = (data, label) => data.facts?.find((f) => f.label === label)?.value;
