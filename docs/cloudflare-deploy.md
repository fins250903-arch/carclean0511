# Cloudflare Workers へ移す手順（超初心者向け）

## いまの状態（公開済み）

サイト本体は Cloudflare に載っています。

**確認用 URL:** https://carclean0511.fins250903.workers.dev/regions/osaka/

本番の `https://carinteriorcleaning.jp` は、DNS がまだ Xserver / Vercel のため **今も Vercel のまま** です。広告やお客様向け URL は変えていません。

残作業は「ドメインを Cloudflare に向ける」だけです。手順は下の「4. ドメイン」を見てください。

---

このサイトは **Astro で先に HTML を全部作っておく静的サイト** です。
Vercel の「アクセスのたびにサーバーでページを作る」機能は使っていません。

Vercel の容量・転送量が増えたので、同じ HTML を **Cloudflare Workers** から配信します。

---

## 1. 全体像（3つの箱）

```
① GitHub のソースコード（Astro）
        ↓  npm run build
② dist/ フォルダ（完成した HTML・画像・CSS）
        ↓  wrangler deploy
③ Cloudflare Worker「carclean0511」が世界中に配信
```

| 役割 | どこがやるか |
| --- | --- |
| ページを HTML にする | パソコンまたは Cloudflare のビルド（`npm run build`） |
| HTML を置く・配る | Cloudflare Worker（静的ファイル） |
| ブログ管理の GitHub ログイン | 同じ Worker の `/api/auth` と `/api/callback` |

**やってはいけないこと**

- `npx astro add cloudflare` を実行しない
- `@astrojs/cloudflare` を `package.json` に足さない

これらは **SSR（アクセスのたびにサーバーで HTML を作る）用** です。このサイトは `output: 'static'` なので不要です。入れるとビルドが壊れます。

---

## 2. リポジトリ側で用意してあるもの

| ファイル | 役割 |
| --- | --- |
| `wrangler.jsonc` | Worker 名と `dist/` の公開設定。`/api/*` だけプログラムを動かす |
| `workers/github-oauth.js` | Decap CMS の GitHub ログイン（以前の `api/*.js` 相当） |
| `public/_redirects` | 旧 URL → 新 URL の 301 転送（ビルドで `dist/_redirects` にコピーされる） |
| `package.json` の `cf:dev` / `cf:deploy` | 手元での確認と公開コマンド |

Astro の設定（`astro.config.mjs` の `output: 'static'`）は **変えません**。

---

## 3. Cloudflare ダッシュボードでの Worker 設定

GitHub 連携はすでに Worker 名 **carclean0511** でつながっています。
ダッシュボードで次を確認してください。

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Workers & Pages** → **carclean0511** を開く
3. **Settings → Build**（ビルド設定）

| 項目 | 値 |
| --- | --- |
| Git repository | `fins250903-arch/carclean0511` |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production deploy | `npx wrangler versions upload`（そのままで可） |
| Root directory | （空＝リポジトリの一番上） |
| Node.js | **22** |

4. **Settings → Variables and Secrets** に次を入れる

**ビルド用（Build）** — `npm run build` のときにだけ使う

| 名前 | 種類 | 値 |
| --- | --- | --- |
| `PUBLIC_GTM_ID` | Text | `GTM-WLNM4GWN`（未設定でもコード側の初期値で入ります） |

**本番用（Runtime / Production）** — ブログ管理のログインに必須

| 名前 | 種類 | 値 |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | Secret | GitHub OAuth App の Client ID |
| `GITHUB_CLIENT_SECRET` | Secret | GitHub OAuth App の Client Secret |

GitHub OAuth App の Callback URL はこれまでどおりです。

`https://carinteriorcleaning.jp/api/callback`

---

## 4. ドメインを Worker につなぐ（いまここ）

Worker には次を接続済みです。

- `carinteriorcleaning.jp`
- `www.carinteriorcleaning.jp`

ゾーンはまだ **pending** です。インターネット上のネームサーバーが Xserver のままなので、お客様向け URL はまだ Vercel です。

### 次にやること（Xserver のネームサーバー変更）

1. Xserver サーバーパネルにログイン: https://secure.xserver.ne.jp/xapanel/login/xserver/
2. **ドメイン** → **ネームサーバー設定**
3. `carinteriorcleaning.jp` を選ぶ
4. 「その他のネームサーバーを使う」にして、次の 2 本だけ入れる（3本目以降は空）
   - `harlan.ns.cloudflare.com`
   - `teagan.ns.cloudflare.com`
5. 変更を保存する

反映まで数分〜数時間かかることがあります。このチャットに「ネームサーバー変えた」と送ってください。こちらで本番 URL が Cloudflare になったか確認します。

切り替え中も、確認用 URL は使えます: https://carclean0511.fins250903.workers.dev/regions/osaka/

---

## 5. デプロイの流れ（普段）

`main` に push すると Cloudflare が自動で:

1. `npm run build`（約 900〜1100 ページを `dist/` に生成）
2. `npx wrangler deploy`（Worker + 静的ファイルを公開）

成功ログの目安:

- `Success: Build command completed`
- `Uploaded` / `Deployed`

失敗の目安（まだ古い設定）:

- `Configuring project for Astro with "astro add cloudflare"`
- `Error installing dependencies`

---

## 6. 自分のパソコンから試す場合

Node.js 22 が必要です（`.nvmrc`）。

```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
# .dev.vars に GitHub OAuth の値を書く（ログイン試験をするときだけ）

npm install
npm run build
npm run cf:dev
```

ブラウザで `http://127.0.0.1:8787/regions/osaka/` を開きます。
`/` は `/regions/osaka/` へ 301 されます。

本番アカウントへ直接上げる場合（API トークンが必要）:

```bash
npx wrangler login
npm run cf:deploy
```

ブログ管理の秘密情報だけ後から入れる場合:

```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

---

## 7. 切り替えたあとの確認リスト

1. `https://carinteriorcleaning.jp/regions/osaka/` が開く
2. `https://carinteriorcleaning.jp/` が大阪ページへ飛ぶ
3. 旧キーワード URL（例: `/regions/osaka/kyuto-cleaning/`）が新 URL へ 301 される
4. `https://carinteriorcleaning.jp/admin/` で GitHub ログインできる
5. 電話・LINE・フォームの GTM 計測がこれまでどおり動く

ブログ記事を Publish すると GitHub の `main` に commit され、Cloudflare が再ビルドします（以前の Vercel 自動デプロイと同じ流れです）。

---

## 8. Vercel はどうする？

DNS を Cloudflare に向けて、数日問題ないことを確認してから Vercel プロジェクトを止めてください。
`vercel.json` と `api/*.js` は **切り戻し用に残してあります**。Cloudflare 側の本体は `wrangler.jsonc` と `workers/github-oauth.js` です。
