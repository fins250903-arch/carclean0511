# Cloudflare Workers へ移す手順（超初心者向け）

## いまの状態（公開済み）

サイト本体は Cloudflare Worker **carclean0511** に載っています。

**確認用 URL:** https://carclean0511.fins250903.workers.dev/regions/osaka/

JPRS のネームサーバーは Cloudflare に切り替わっています。

- `harlan.ns.cloudflare.com`
- `teagan.ns.cloudflare.com`

Cloudflare ゾーンは **active** です。Worker には `carinteriorcleaning.jp` と `www.carinteriorcleaning.jp` を接続済みです。

DNS キャッシュが残っている回線では、まだ Vercel の IP（`216.198.79.1`）に届くことがあります。反映は数分〜数時間です。

HTTPS の証明書がエッジに乗るまで、Cloudflare IP へ先に向いた端末では `https://` が一時的に開けないことがあります。開けないときは確認用 URL を使ってください。ダッシュボードの **SSL/TLS → Edge Certificates** が Active になれば本番 HTTPS も通ります。

ブログ管理の GitHub ログイン用に、Worker の Production Secrets へ `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` を入れてください。

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
| www / HTTPS / 旧パスの 301・確認用 URL の noindex | 同じ Worker（`workers/seo.js`） |

**やってはいけないこと**

- `npx astro add cloudflare` を実行しない
- `@astrojs/cloudflare` を `package.json` に足さない

これらは **SSR（アクセスのたびにサーバーで HTML を作る）用** です。このサイトは `output: 'static'` なので不要です。入れるとビルドが壊れます。

---

## 2. リポジトリ側で用意してあるもの

| ファイル | 役割 |
| --- | --- |
| `wrangler.jsonc` | Worker 名と `dist/` の公開設定。全リクエストを Worker が先に処理（SEO 転送 + `/api/*`） |
| `workers/github-oauth.js` | Decap CMS の GitHub ログイン（以前の `api/*.js` 相当） |
| `workers/seo.js` | www → 本番ドメインの 301、確認用 URL の noindex |
| `public/_redirects` | 旧パス → 新パスの 301（ビルドで `dist/_redirects` にコピーされる） |
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

## 4. ドメイン（ネームサーバー変更済み）

Worker には次を接続済みです。

- `carinteriorcleaning.jp`
- `www.carinteriorcleaning.jp`

Xserver 側のネームサーバーは次の 2 本です（JPRS に反映済み）。

- `harlan.ns.cloudflare.com`
- `teagan.ns.cloudflare.com`

### 切り替えたあとに見ること

1. ダッシュボードでゾーンが **Active** であること
2. **SSL/TLS → Edge Certificates** に証明書があること（初回は数分〜最大 24 時間）
3. `https://carinteriorcleaning.jp/regions/osaka/` の応答ヘッダが `server: cloudflare` になること
4. 確認用 URL と見た目が同じこと: https://carclean0511.fins250903.workers.dev/regions/osaka/

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
4. `http://www.carinteriorcleaning.jp/regions/osaka/` が `https://carinteriorcleaning.jp/regions/osaka/` へ **1回** 301 される
5. 旧キーワード URL（www 付きでも）が新 URL へ **1回** 301 される
6. 確認用 URL の HTML に `X-Robots-Tag: noindex, nofollow` が付く
7. `https://carinteriorcleaning.jp/admin/` で GitHub ログインできる
8. 電話・LINE・フォームの GTM 計測がこれまでどおり動く

ブログ記事を Publish すると GitHub の `main` に commit され、Cloudflare が再ビルドします（以前の Vercel 自動デプロイと同じ流れです）。

---

## 8. 検索を落とさない設定（AIO / SEO）

Google も AI 概要も、**同じ正規 URL** を見ます。本番はこれまでどおり次の 1 本です。

`https://carinteriorcleaning.jp/…`（末尾スラッシュあり）

| 信号 | Cloudflare 側の扱い |
| --- | --- |
| canonical | 全ページが `https://carinteriorcleaning.jp`（`src/lib/site.ts`）。ホストを変えていない |
| sitemap | `https://carinteriorcleaning.jp/sitemap-index.xml`（`robots.txt` と同じ） |
| 旧キーワード URL | Worker が 301（`workers/path-redirects.js`）。`public/_redirects` は予備 |
| `/` | `/regions/osaka/` へ 301 |
| www | Worker が `www.carinteriorcleaning.jp` → 本番ドメインへ 301 |
| HTTP → HTTPS | `FORCE_HTTPS=true`（apex の証明書は Active） |
| 末尾スラッシュ | `html_handling: force-trailing-slash`（Astro の `trailingSlash: 'always'` と一致） |
| 確認用 URL | `*.workers.dev` は `X-Robots-Tag: noindex` と `robots.txt` の `Disallow: /` |

www・HTTP・旧パスが重なっても **301 は 1 回** です（例: `http://www…/kyuto-cleaning/` → `https://carinteriorcleaning.jp/…/vomit-cleaning/`）。

**やってはいけないこと**

- 確認用 `workers.dev` を Search Console に登録しない
- 旧パスをまとめて全県 301 しない（例: 全市の `kyuto-cleaning`。Vercel と同じ行だけ 301 する。他県の旧スラッグは広告の最終 URL のまま）
- HSTS を Worker で二重に長くしない（Vercel 時代の HSTS が残っている端末はすでに HTTPS 専用）

### Search Console / AIO

1. プロパティは **`https://carinteriorcleaning.jp/`** だけ（www と workers.dev は使わない）
2. サイトマップ `https://carinteriorcleaning.jp/sitemap-index.xml` を再送信
3. 旧 URL の「URL 検査」で 301 先が正規 URL になっていること
4. `carclean2026.vercel.app` は Vercel 側が 404（`DEPLOYMENT_NOT_FOUND`）になっている。インデックスに残っていれば Search Console の削除を使う。Worker にも同じホスト 301 を入れてあり、Vercel に何かを載せ直した場合の受け皿になる

`www` の DNS がまだ Vercel（`*.vercel-dns.com`）のときは、Vercel の 308 で本番へ飛びます。Cloudflare の www カスタムドメインに切り替わったあとは Worker の 301 です。どちらも正規 URL は同じです。

---

## 9. Vercel はどうする？

apex は Cloudflare です。`www` の DNS がまだ Vercel の間は、www の 308 のために Vercel プロジェクトを残してください。www が Worker に切り替わったら Vercel は止めて構いません。
`carclean2026.vercel.app` はすでに 404 です。`vercel.json` と `api/*.js` は **切り戻し用に残してあります**。Cloudflare 側の本体は `wrangler.jsonc` と `workers/github-oauth.js` です。
