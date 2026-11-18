import { getArticles } from '../lib/articles.js';

const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

export async function GET(context) {
  const items = (await getArticles()).slice(0, 50);
  const base = new URL(import.meta.env.BASE_URL, context.site);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>MyDataGuard ニュース</title>
<link>${base}</link>
<description>漏えい・脆弱性・脅威を、毎朝3分で。</description>
<language>ja</language>
${items.map((e) => `<item><title>${esc(e.data.title)}</title><link>${new URL(`${e.id}/`, base)}</link><guid>${new URL(`${e.id}/`, base)}</guid><pubDate>${e.data.publishedAt.toUTCString()}</pubDate><description>${esc(e.data.summary)}</description></item>`).join('\n')}
</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
