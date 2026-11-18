// 記事の機械検査（要件 F-202 / F-302 / F-303 / F-304）
// errors が1件でもあればビルドを止める。warnings は朝の確認で人が判断する。

export const CATEGORIES = {
  incident: '漏えい・インシデント',
  vulnerability: '脆弱性',
  threat: '脅威動向',
  digest: '朝刊ダイジェスト',
};

export const CAUSES = {
  ransomware: 'ランサムウェア',
  'unauthorized-vuln': '不正アクセス（脆弱性悪用）',
  'unauthorized-cred': '不正アクセス（認証情報）',
  misconfig: '設定ミス・公開設定',
  'misdelivery-loss': '誤送信・紛失',
  insider: '内部不正',
  'supply-chain': '委託先・サプライチェーン',
  unknown: 'その他・不明',
};

const PII_RULES = [
  { label: 'メールアドレス', re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/ },
  { label: '電話番号', re: /(?<![\d-])0\d{1,4}-\d{1,4}-\d{3,4}(?![\d-])/ },
  { label: '12桁の番号（マイナンバーの可能性）', re: /(?<![\d-])\d{4}\s?\d{4}\s?\d{4}(?![\d-])/ },
  { label: 'クレジットカード番号らしき数字', re: /(?<![\d-])\d{4}[ -]\d{4}[ -]\d{4}[ -]\d{4}(?![\d-])/ },
];

const LOADED_WORDS = ['杜撰', 'ずさん', '隠蔽', '隠ぺい', '怠慢', '無責任', '最悪', '言語道断', 'お粗末'];

export function validateArticle({ data = {}, body = '' }) {
  const errors = [];
  const warnings = [];
  // 出典URLは本文に載るのでPII検査から除外する
  const text = [data.title, data.summary, data.insight, body].filter(Boolean).join('\n');

  if (!data.title) errors.push('タイトル（title）がありません');
  if (!CATEGORIES[data.category]) errors.push(`カテゴリ（category）が不正です: ${data.category}`);
  if (!data.summary) errors.push('要約（summary）がありません');

  const sources = data.sources ?? [];
  if (sources.length === 0) errors.push('出典（sources）が1件もありません');
  for (const s of sources) {
    if (!s?.url || !/^https:\/\//.test(s.url)) errors.push(`出典URLは https で始まる必要があります: ${s?.url}`);
    if (!s?.title) errors.push(`出典の名前（title）がありません: ${s?.url}`);
  }

  // 示唆: 事実の要約だけで終わらせず「何が言えるか」を必ず書く
  if (data.category !== 'digest' && (data.insight ?? '').trim().length < 40) {
    errors.push('「MyDataGuard の視点」（insight）を40字以上で書いてください。この件から読者が何を学べるか');
  }

  if (data.category === 'incident' && !CAUSES[data.cause]) {
    errors.push(`事案記事には原因分類（cause）が必要です: ${Object.keys(CAUSES).join(' / ')}`);
  }

  if (text.includes('【要確認】')) errors.push('【要確認】が残っています。確認して消してから公開してください');

  for (const { label, re } of PII_RULES) {
    const m = text.match(re);
    if (m) errors.push(`個人情報の可能性: ${label}（${m[0]}）`);
  }

  // 表記ルール
  if (/^【[^】]*】/.test(data.title ?? '')) warnings.push('タイトル先頭の【】（カテゴリ名）は付けません。カテゴリは画面に別に表示されます');
  if (text.includes('漏洩')) warnings.push('「漏洩」は「漏えい」にそろえてください');

  for (const w of LOADED_WORDS) {
    if (text.includes(w)) warnings.push(`評価語「${w}」があります。事実の記述に置き換えられないか確認してください`);
  }

  return { errors, warnings };
}
