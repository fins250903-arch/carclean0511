# ブログ編集（Decap CMS）

ブログ記事の作成・更新は **Decap CMS**（WordPress 風 UI）を使用します。  
記事は **carclean0511** リポジトリに直接 commit され、Vercel が本番サイトを再ビルドします。

| 機能 | 対応 |
|------|------|
| 日付 | 公開日フィールド + 一覧に日付表示 |
| 並び替え | 一覧上部で「新しい順 / 古い順」切替 |
| サムネイル | 一覧に coverImage / OGP 画像を表示 |
| 地域名称 | `areaName`（市区町村）入力フィールド |
| タイトル SEO | 32文字目安（meta_title） |
| スラッグ | 英字のみ → `2026-05-31-xxx` 形式 |
| 画像 | 本文へ貼り付け／ドラッグ。未設定時 1枚目をサムネイルに自動設定 |
| SAVE → 公開 | GitHub `fins250903-arch/carclean0511` に commit → Vercel 再デプロイ |

## 編集画面 URL

**https://carinteriorcleaning.jp/admin/**

（`robots: noindex` — 検索エンジンには非公開）

旧 URL `https://carclean2026blog.vercel.app/admin/` は本番 admin へリダイレクトされます。

## 初回セットアップ（1回だけ）

### 1. GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → New
2. Application name: `carclean0511-cms`（任意）
3. Homepage URL: `https://carinteriorcleaning.jp`
4. Callback URL: `https://carinteriorcleaning.jp/api/callback`
5. Client ID / Client Secret を控える

### 2. Vercel 環境変数（carclean0511 プロジェクト）

| 変数名 | 値 |
|--------|-----|
| `GITHUB_CLIENT_ID` | OAuth App の Client ID |
| `GITHUB_CLIENT_SECRET` | OAuth App の Client Secret |

設定後、プロジェクトを **Redeploy** してください。

OAuth App の GitHub リポジトリアクセスは `fins250903-arch/carclean0511` への write 権限が必要です。

## 記事の書き方

1. **公開日** を選ぶ
2. **タイトル** を入力
3. **URL用スラッグ** に英字のみ（例: `saitama4tontruck`）
4. **地域名称** に市区町村・エリア名（例: 横浜市、吹田市）を入力（任意）
5. **SEO対策** に meta_description 等を入力
6. **本文** に文章と画像（貼り付け可）
7. **Publish** → 数分後に https://carinteriorcleaning.jp/blog/ に反映

### 記事一覧の見方

`/admin/#/collections/blog` を開くと、拡張UIが表示されます。

- 各記事に **サムネイル画像** と **公開日** が表示されます（`public/admin/blog-index.json` から読み込み）
- 上部の **「新しい順 / 古い順」** ボタンで並び替えできます（設定はブラウザに保存）
- 地域名称がバッジ表示されます

サムネイル画像フィールドが空のとき、本文の最初の画像ファイル名が自動で `coverImage` になります（`public/admin/cms-hooks.js`）。

## 公開フロー（統合後）

```
/admin で Publish
  → GitHub: fins250903-arch/carclean0511 (main)
  → Vercel 自動ビルド
  → https://carinteriorcleaning.jp/blog/ に反映
```

**別リポジトリ（carclean2026blog）への同期は廃止しました。** 旧リポジトリには commit しないでください。

## ローカルで試す（任意）

```bash
npm install
npm run dev
# http://localhost:4321/admin/
```

本番 OAuth を使う場合は GitHub OAuth App の Callback に localhost を追加するか、`npx decap-server` でローカルプロキシを利用します。

## ファイル配置

| パス | 用途 |
|------|------|
| `public/admin/` | Decap CMS UI |
| `public/admin/blog-list-enhance.js` | 一覧サムネイル・日付・並び替えUI |
| `public/admin/blog-index.json` | 記事メタデータ（`npm run sync:blog-admin-index` で更新） |
| `public/admin/regions.json` | 地域ラベル（`npm run sync:admin-regions` で更新） |
| `api/auth.js`, `api/callback.js` | GitHub OAuth（Vercel Functions） |
| `src/content/blog/` | 記事 Markdown |
| `public/posts/` | 記事画像 |
