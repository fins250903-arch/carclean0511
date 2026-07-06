# GTM 最終設定（コピペ用）— AW-17667339500

ラベル確定済み。GTM（GTM-WLNM4GWN）で以下をそのまま入力して **公開** してください。

---

## トリガー（2つ）

### TR - phone_click

| 項目 | 値 |
|---|---|
| 種類 | カスタムイベント |
| イベント名 | `phone_click` |

### TR - line_click

| 項目 | 値 |
|---|---|
| 種類 | カスタムイベント |
| イベント名 | `line_click` |

---

## タグ（3つ）

### ① Google広告 - コンバージョンリンカー

| 項目 | 値 |
|---|---|
| 種類 | コンバージョン リンカー |
| コンバージョンID | `AW-17667339500` |
| トリガー | All Pages |

### ② Google広告 - CV 電話問い合わせ

| 項目 | 値 |
|---|---|
| 種類 | Google 広告 コンバージョン トラッキング |
| コンバージョンID | `AW-17667339500` |
| コンバージョンラベル | `plLZCN-S0sscEOzpuOhB` |
| コンバージョンの値 | （空欄） |
| トリガー | TR - phone_click |

### ③ Google広告 - CV LINE問い合わせ

| 項目 | 値 |
|---|---|
| 種類 | Google 広告 コンバージョン トラッキング |
| コンバージョンID | `AW-17667339500` |
| コンバージョンラベル | `9Q7WCNu0t8scEOzpuOhB` |
| トリガー | TR - line_click |

---

## 公開後テスト

1. GTM **プレビュー** → `https://carinteriorcleaning.jp/regions/osaka/`
2. 電話タップ → Tags Fired: `Google広告 - CV 電話問い合わせ`
3. LINEタップ → Tags Fired: `Google広告 - CV LINE問い合わせ`
4. 右上 **公開**

## やってはいけないこと

- クリックURL（`tel:` / `lin.ee`）用トリガーを **追加しない**（CV二重計測になる）
- 公開を忘れない
