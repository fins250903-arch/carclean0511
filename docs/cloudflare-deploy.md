# Cloudflare への公開手順（初心者向け）

このサイトは **完成した HTML をそのまま置く静的サイト** です。
Vercel の「サーバーでページを作る」機能は使っていません。

## 今回のエラーは何だったか

ログの途中までは **成功** しています。

1. `npm run build` → 約 1100 ページの生成完了（`Success: Build command completed`）
2. そのあと Cloudflare が `npx wrangler deploy` を実行
3. リポジトリに `wrangler.jsonc` が無かったため、Wrangler が「Astro のサーバー版としてセットアップし直す」と判断
4. `npx astro add cloudflare` が `@astrojs/cloudflare` をインストールしようとして失敗

`@astrojs/cloudflare` は **SSR（アクセスのたびにサーバーで HTML を作る）用** です。
このサイトは `output: 'static'` なので **不要** です。入れると逆に壊れます。

## この PR で入る修正

- `wrangler.jsonc` … `dist/` を静的ファイルとして公開する設定
- `public/_redirects` … 以前 `vercel.json` にあった URL の 301 転送

## Cloudflare ダッシュボードで確認すること

Workers のプロジェクト設定を、次のまま（または次に直して）再デプロイしてください。

| 項目 | 値 |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Output / build directory | `dist` |
| Node.js | 22 |

再デプロイ後のログに、次が出ていれば成功です。

- `Success: Build command completed`
- `Uploaded` / `Deployed`（`astro add cloudflare` は出ない）

次の文言が出たら、まだ古い設定で動いています。この PR が `main` に入っているか確認してください。

- `Configuring project for Astro with "astro add cloudflare"`
- `Error installing dependencies`

## ダッシュボード側でやらないこと

- 「Astro 用にセットアップしますか？」→ **No / 変更しない**
- `npx astro add cloudflare` を自分で実行しない
- `@astrojs/cloudflare` を `package.json` に足さない

## ドメイン（www と Vercel の旧 URL）

`_redirects` では **ホスト名ごとの転送はできません**。
次は Cloudflare の「Redirect Rules」か DNS で設定します。

- `www.carinteriorcleaning.jp` → `https://carinteriorcleaning.jp/...`
- `*.vercel.app` → 本番ドメイン（Vercel 側のリダイレクトを残してもよい）

## ブログ管理画面（Decap CMS）のログイン

`api/auth.js` と `api/callback.js` は **Vercel のサーバーレス関数** です。
静的ホストだけに移すと `/admin/` の GitHub ログインが動きません。

当面の選択肢:

1. サイト本体だけ Cloudflare、CMS ログインは Vercel に残す
2. あとから Cloudflare Worker で OAuth を作り直す

サイト公開そのものは 1 のままで進められます。
