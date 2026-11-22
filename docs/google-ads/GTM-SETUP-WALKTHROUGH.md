# carinteriorcleaning.jp の計測セットアップ

対象: https://carinteriorcleaning.jp  
コードに入っているコンテナ: `GTM-NC9FX82V`（新しい ID が決まるまでこのまま）  
電話: `070-8428-0866`（`tel:07084280866`）  
LINE: `https://lin.ee/Xs8Orp2`  
予約フォームの LINE: `https://line.me/R/oaMessage/...`

この手順は、2026-11-22 以降の方針です。古い広告 ID `AW-17667339500` は使いません。あの手順は [旧設定の記録](./GTM-TAG-SETTINGS-AW-17667339500.md) に移しました。

管理画面の作成はユーザーが行います。このリポジトリは dataLayer と、本番ホストだけで GTM を読むコードだけを持ちます。

---

## 先に決めること

| サイト | やること |
|---|---|
| carinteriorcleaning.jp | 新しい GA4 プロパティを作る。Google 広告のコンバージョンも、このサイト用の口座に作る |
| insbs.net | GA4 のままにする。このリポジトリから Google 広告タグは送らない |

新しい GA4 の測定 ID は、まだリポジトリにありません。管理画面に表示された `G-` で始まる ID を使ってください。プレースホルダは `G-XXXXXXXXXX` です。

2026-11-22 時点で、公開中の `GTM-NC9FX82V` は古い共用プロパティ `G-LTFRTZY7FE`（`510573829` / `osak.insbs.net/wp1`）へ送っていました。新しいプロパティの ID と取り違えないでください。

---

## 作業の順番

| 順番 | どこ | 内容 |
|:---:|---|---|
| 1 | GA4 | carinteriorcleaning.jp 用の新しいプロパティとウェブストリームを作る |
| 2 | Google 広告 | 電話・LINE のコンバージョンアクションを作り、ID とラベルを控える |
| 3 | GTM | 下のタグを作り、プレビューで1クリック1イベントを確認してから公開する |
| 4 | コード | コンテナを変えるときだけ `PUBLIC_GTM_ID` を更新する。今は `GTM-NC9FX82V` のまま |

本番の入れ先は Cloudflare です。Vercel の環境変数画面は使いません。

---

## 1. GA4

1. https://analytics.google.com/ を開く
2. carinteriorcleaning.jp 専用のプロパティを新規作成する
3. ウェブストリームの URL は `https://carinteriorcleaning.jp` にする
4. 測定 ID（`G-` で始まる）を控える。この値はユーザーが管理画面で設定する
5. キーイベントの候補は `phone_click`、`line_click`、`inquiry_submit`。自動の `form_submit` はキーイベントにしない

insbs.net の既存ストリーム（例: `G-J9WESXCNSK`）は、このサイトの広告コンバージョンに使わないでください。

---

## 2. Google 広告

1. https://ads.google.com/ で、carinteriorcleaning.jp 用の口座を開く
2. **目標** → **コンバージョン** → **新しいコンバージョンアクション** → **ウェブサイト**
3. 電話用と LINE 用を1つずつ作る

| 項目 | 電話 | LINE |
|---|---|---|
| 名前の例 | 電話問い合わせ | LINE問い合わせ |
| カウント | 1回 | 1回 |
| タグ | Google タグマネージャー | Google タグマネージャー |

4. 画面に出た次の2つを控える。値はユーザーが管理画面で設定する

```text
コンバージョンID: AW-XXXXXXXXXX
電話のコンバージョンラベル: （管理画面の値）
LINEのコンバージョンラベル: （管理画面の値）
```

`AW-17667339500` と、その古いラベルは貼らないでください。

問い合わせフォームも広告のコンバージョンにする場合は、同じ手順で3つ目を作り、トリガーは `inquiry_submit` だけにします。

---

## 3. GTM

https://tagmanager.google.com/ を開きます。コードが今読んでいるコンテナは `GTM-NC9FX82V` です。新しいコンテナを別に作った場合は、公開したコンテナ ID をユーザーが `PUBLIC_GTM_ID` に入れてからデプロイします。IDが決まるまでコードは変えません。

タグは次だけにします。クリック URL（`tel:` や `lin.ee`）のトリガーは作りません。dataLayer とクリック URL の両方があると、1タップが2コンバージョンになります。

| タグ | 種類 | トリガー |
|---|---|---|
| GA4 設定 | Google タグ。タグ ID は新しい測定 ID | All Pages |
| コンバージョンリンカー | コンバージョン リンカー。ID は手順2の `AW-` | All Pages |
| 電話 CV | Google 広告コンバージョン。電話ラベル | カスタムイベント `phone_click` |
| LINE CV | Google 広告コンバージョン。LINEラベル | カスタムイベント `line_click` |
| 問い合わせ | GA4 イベント。イベント名 `inquiry_submit` | カスタムイベント `inquiry_submit` |

GA4 のイベントパラメータに、dataLayer の `event_label`、`form_location`、`page_path` を渡すと、どのボタンかを後から見られます。

`inquiry_submit` には氏名・電話番号・メールアドレスを変数として追加しないでください。

予約フォーム成功の `form_submit` を広告の主コンバージョンにはしないでください。名前が GA4 の自動イベントと同じです。使う場合は `event_label` が `contact_form` のときだけにします。

### 公開前のプレビュー

1. GTM の **プレビュー** で `https://carinteriorcleaning.jp/regions/osaka/` を開く
2. 電話を1回タップする。`phone_click` が1回だけ増える
3. LINE を1回タップする。`line_click` が1回だけ増える
4. 電話 CV と LINE CV が、それぞれその1回で Tags Fired になる
5. 問題なければ右上の **公開**

ローカル（`localhost` / `127.0.0.1`）と `*.workers.dev` では、ページが GTM を読み込みません。プレビューは本番の URL で行ってください。`/admin/` にも GTM はありません。

---

## 4. ブラウザでの確認

本番、または GTM プレビューを接続した本番 URL で行います。

1. DevTools の Console に `dataLayer` と入力する
2. 電話リンクを1回押す。`event` が `phone_click` の行が、そのタップの分だけ1つ増える
3. LINE リンクを1回押す。`line_click` が1つ増える
4. Network に `gtm.js?id=GTM-NC9FX82V`（または公開した新しいコンテナ）が出る
5. `http://127.0.0.1:4321/regions/osaka/` や `*.workers.dev` では、`gtm.js` も `ns.html` も出ない
6. `/admin/` の HTML に `googletagmanager.com` が無い

地域ページ用のテンプレートへ、GTM や `G-` / `AW-` を直書きしないでください。共通レイアウトが本番ホストだけで読み込みます。

---

## insbs.net

insbs.net は GA4 のみです。このリポジトリの Google 広告タグの送り先にしません。

2026-11-22 の調査では、`insbs.net/ok2`（`G-J9WESXCNSK`）が別の広告口座 `7393206354` と 2025-09-07 にリンクされていました。広告との切り離しは、GA4 と Google 広告の管理画面でユーザーが行います。コード変更ではありません。

ページに無かったストリームの記録: `hyg.insbs.net/wp1` `G-0YJSS8RWDV`、`hyg.insbs.net` `G-5GHCPHWNRX`、`kago` `G-M5RM8LCG3W`。
