// @ts-check
import { defineConfig } from 'astro/config';

// 既存の公開サイト（GitHub Pages, リポジトリ直下）に /news/ として追加する。
// ビルド結果は ../news/ に出力してコミットする。ソース（_media/）は Jekyll が公開しない。
export default defineConfig({
  site: 'https://mydataguard.jp',
  base: '/news',
  outDir: process.env.ASTRO_OUT_DIR ?? '../news',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // 既定の "_astro" は Jekyll に除外されるため名前を変える
    assets: 'assets',
    inlineStylesheets: 'always',
  },
});
