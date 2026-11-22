# 計測の現状（carinteriorcleaning.jp）

本番サイトは https://carinteriorcleaning.jp です。配信は Cloudflare Workers の静的サイトです。Vercel ではありません。

画面の操作手順は **[GTM-SETUP-WALKTHROUGH.md](./GTM-SETUP-WALKTHROUGH.md)** です。IDが揃ったあとに貼る欄は **[GTM-FINAL-COPYPASTE.md](./GTM-FINAL-COPYPASTE.md)** です。

2026年7月までの `AW-17667339500` 手順は使いません。記録だけ [GTM-TAG-SETTINGS-AW-17667339500.md](./GTM-TAG-SETTINGS-AW-17667339500.md) に残しています。

---

## 方針

| サイト | 計測 |
|---|---|
| carinteriorcleaning.jp | 専用の新しい GA4 プロパティ ＋ そのサイト用の Google 広告。IDはユーザーが管理画面で作る |
| insbs.net | GA4 のみ。このリポジトリの広告計測には使わない |

コードが読み込む GTM コンテナは、まだ **`GTM-NC9FX82V`** です。新しいコンテナができても、このリポジトリの ID はユーザーが `PUBLIC_GTM_ID` を変えるまで差し替えません。

2026-11-22 のタグ調査では、公開中の `GTM-NC9FX82V` は GA4 `G-LTFRTZY7FE`（プロパティ `510573829`、名前 `osak.insbs.net/wp1`）へ送っていました。これは INS と共用の古いプロパティです。carinteriorcleaning.jp の新しい測定 ID ではありません。新しい測定 ID は未定です（プレースホルダ `G-XXXXXXXXXX`）。

---

## コードが送る dataLayer

1回の操作につき、同じイベントは1回だけです。

| イベント | いつ | 主な項目 |
|---|---|---|
| `phone_click` | 店舗番号 `07084280866` の `tel:` リンクを1回タップ | `event_label`（CTAの位置） |
| `line_click` | `lin.ee` または予約フォームの `line.me/R/oaMessage` を1回タップ | `event_label` |
| `inquiry_submit` | 地域LPのお問い合わせが FormSubmit に受理されたときだけ | `form_location`、`page_path`。氏名・電話・メールは入れない |
| `form_submit` | `/reserve/` のチェックリスト送信が成功したとき | `event_label` は `contact_form` |

`event_label` の例: `hero_top_cta`、`main_cta`、`campaign_mid_cta`、`closing_bottom_cta`、`floating_cta_mobile`、`floating_cta_desktop`、`inquiry_bottom`、`reserve_form`、`pricing_cta`、`blog_cta`、`ad_quick_facts`、`answer_target`、`trouble_cta`、`operator_info`、`chat_widget`。位置が無いリンクは `sitewide` です。

電話と LINE のページ内リンクは `ConversionTracking.astro` だけが push します。チャット枠（Dialogflow）のボタンは影の中にあるため、`ChatWidget.astro` の `df-button-clicked` だけが `chat_widget` を push します。

GA4 の自動イベント `form_submit` はキーイベントにしないでください。ページを移動しない送信では発火せず、発火しても送信成功とは限りません。予約フォームの dataLayer イベントも同じ名前ですが、見るときは `event_label` が `contact_form` であることを確認します。

---

## GTM を読み込む場所

| ホスト | GTM |
|---|---|
| `carinteriorcleaning.jp` と `www.carinteriorcleaning.jp` | `gtm.js` を読み込む |
| `localhost`、`127.0.0.1`、`*.workers.dev`、それ以外 | 読み込まない |
| `/admin/`（ブログ管理） | コンテナを置かない |

静的HTMLはプレビューと本番で同じファイルです。noscript の iframe はホストを判定できないため、ページには出していません。JavaScript が動く本番アクセスは `gtm.js` を読みます。電話・LINE のイベントも JavaScript が必要です。

---

## 環境変数

```bash
PUBLIC_GTM_ID=GTM-NC9FX82V
```

空欄や `GTM-` 以外の値でも、コードは `GTM-NC9FX82V` に戻します。新しいコンテナ ID が決まるまで変更しません。
