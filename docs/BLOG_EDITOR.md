# ブログ編集（Decap CMS）

ブログ記事の作成・更新は **Decap CMS**（WordPress 風 UI）を使用します。  
記事は **carclean0511** リポジトリに直接 commit され、Vercel が本番サイトを再ビルドします。

| 機能 | 対応 |
|------|------|
| 日付 | 公開日フィールド + 一覧に日付表示 |
| 並び替え | 一覧上部で「新しい順 / 古い順」切替 |
| サムネイル | 一覧に coverImage / OGP 画像を表示 |
| 地域名称 | `areaName`（都道府県＋市区町村）入力フィールド |
| AIO要約 | `summary`（結論・車種・お悩み・施工内容・作業時間・費用） |
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
2. **タイトル** を入力（先頭に `【愛知県あま市】` のように地域を入れる）
3. **URL用スラッグ** に英字のみ（例: `saitama4tontruck`）
4. **地域名称** に「都道府県＋市区町村」（例: `愛知県あま市`、`神奈川県横浜市西区`）
5. **AIO要約** は基本そのまま空欄でOK（本文から自動生成されます）
6. **本文** はテンプレートの見出しを残して書く（下記「AIO対応テンプレート」参照）
7. **Publish** → 数分後に https://carinteriorcleaning.jp/blog/ に反映

## AIO（AI検索）対応テンプレート

新規作成時、本文には次の雛形が入ります。**見出しは消さずに中身を書き換えてください。**

```markdown
## ご相談内容

（いつ・どこで・何が起きたか。お客様の言葉をそのまま書くと強い記事になります）

## 現車確認でわかったこと

（汚れの範囲・染み込みの深さ・素材。写真で伝わらない判断根拠を書きます）

## 実際の作業

（使用した機材と洗浄剤、手順、気をつけた点）

## 作業時間と費用

作業時間：3時間 / 費用：28,000円

## お客様の声・仕上がり

（お客様の反応、シート交換を避けられた等の結果）
```

### なぜこの形式なのか

記事の先頭には、**Answer-First（結論）ブロック**が自動で表示されます。
「どこで・何のトラブルを・どう直し・何時間で・いくらだったか」を先に出す形式で、
Google の AI Overview や ChatGPT などが引用しやすい構造です。

自動生成には次のルールがあります。

| 項目 | 自動取得のルール |
|------|------------------|
| 施工エリア | `areaName`、なければタイトルの `【…】` |
| お悩み | タイトル・本文のキーワード（嘔吐／おもらし／灯油／タバコ 等） |
| 施工内容 | 本文のキーワード（リンサー／オゾン／スチーム 等） |
| 作業時間 | 本文の「作業時間：3時間」「約3時間ほど」など |
| 費用 | 本文の「費用：28,000円」「全部で28,000円でした」など |

**必ず本文に「作業時間」と「費用」を数字で書いてください。** 書かないとブロックに出ません。
自動生成が不自然なときだけ、AIO要約の各項目を手入力して上書きします。

### 地区LPへの自動掲載

`areaName` の都道府県名（またはタイトルの `【…】`）から地域を判定し、
該当する地区LP（例: `/regions/aichi/`）の「施工実例」に**新しい記事から自動で2件**掲載されます。
手作業でリストを更新する必要はありません。

対応都道府県名の表記が正しいか（例: `神奈川県`／`群馬県`）だけ確認してください。

### 書かない方がよいこと

- meta_description に本文の途中をそのまま貼り付ける（160文字を超えると自動要約に差し替わります）
- 「今回もありがとうございました」だけの短い日記（検索・AIから評価されません）
- 料金や作業時間を書かない（AIが引用できる事実がなくなります）

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
| `src/content/blog/` | 記事 Markdown（CMS が画像も同じフォルダに保存します） |
| `public/posts/` | 旧記事の画像（git 管理） |
| `public/blog-media/` | `src/content/blog` の画像を公開用にコピー（`npm run sync:blog-images` が自動生成・git 管理外） |

### 画像が表示されない場合

Decap CMS は画像を記事の Markdown と同じフォルダ（`src/content/blog/...`）に保存しますが、
Astro はこの場所を直接配信しません。`npm run dev` / `npm run build` の実行時に
`sync:blog-images` が `public/blog-media/` へ自動コピーするため、通常は意識不要です。

ローカルで画像が出ないときは `npm run sync:blog-images` を実行してください。
