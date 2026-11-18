import { getCollection } from 'astro:content';
import { validateArticle } from './validate.js';

const showDrafts = process.env.PREVIEW_DRAFTS === '1';
let cache;

// 公開対象の記事を新しい順に返す。機械検査でエラーがあればビルドを止める。
export async function getArticles() {
  if (cache) return cache;
  const all = await getCollection('news', (e) => showDrafts || !e.data.draft);
  const problems = [];
  for (const e of all) {
    const { errors, warnings } = validateArticle({ data: { ...e.data }, body: e.body ?? '' });
    for (const w of warnings) console.warn(`[警告] ${e.id}: ${w}`);
    for (const err of errors) problems.push(`${e.id}: ${err}`);
  }
  if (problems.length) throw new Error('記事の機械検査で公開できない問題が見つかりました\n' + problems.join('\n'));
  cache = all.sort((a, b) => b.data.publishedAt - a.data.publishedAt);
  return cache;
}

export const url = (path) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const fmtDate = (d) =>
  `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日`;
