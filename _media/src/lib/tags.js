// タグをURLの1階層に収まる形にする（"HTTP/2" → "HTTP-2"）。表示にはタグそのものを使う。
export const tagSlug = (tag) =>
  String(tag).trim().replace(/[\/\s]+/g, '-').replace(/[#?%&]+/g, '').replace(/-+$/g, '');
