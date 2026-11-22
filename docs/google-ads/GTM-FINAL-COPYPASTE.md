# GTM に貼る値（IDが決まってから）

コードのコンテナは、まだ `GTM-NC9FX82V` です。新しいコンテナへ変える作業は、ユーザーが管理画面の ID を決めたあとです。このファイルの `AW-` と `G-` はプレースホルダです。実在の ID をここに書かないでください。

古い `AW-17667339500` のラベルは [旧設定の記録](./GTM-TAG-SETTINGS-AW-17667339500.md) にあります。新しいタグには貼りません。

---

## トリガー

| 名前 | 種類 | イベント名 |
|---|---|---|
| TR - phone_click | カスタムイベント | `phone_click` |
| TR - line_click | カスタムイベント | `line_click` |
| TR - inquiry_submit | カスタムイベント | `inquiry_submit` |

クリック URL のトリガーは追加しないでください。

---

## タグ

| タグ | 入れる値 | トリガー |
|---|---|---|
| GA4 設定 | 測定 ID `G-XXXXXXXXXX`（新しいプロパティ。ユーザーが管理画面で設定） | All Pages |
| コンバージョンリンカー | コンバージョン ID `AW-XXXXXXXXXX` | All Pages |
| Google 広告 - 電話 | 同じ `AW-` と、電話用ラベル（ユーザーが管理画面で設定） | TR - phone_click |
| Google 広告 - LINE | 同じ `AW-` と、LINE用ラベル（ユーザーが管理画面で設定） | TR - line_click |
| GA4 イベント inquiry_submit | イベント名 `inquiry_submit` | TR - inquiry_submit |

`G-LTFRTZY7FE` は、2026-11-22 時点で公開コンテナが送っていた古い共用プロパティです。新しい GA4 設定タグには入れません。

---

## 公開前

1. GTM プレビューで https://carinteriorcleaning.jp/regions/osaka/ を開く
2. 電話を1回タップし、`phone_click` が1回だけであることを確認する
3. LINE を1回タップし、`line_click` が1回だけであることを確認する
4. 公開する
