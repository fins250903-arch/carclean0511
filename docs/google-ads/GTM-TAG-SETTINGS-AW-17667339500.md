# 旧設定の記録（使わない）

このファイルは 2026-07 頃の広告タグの記録です。**今の設定手順ではありません。** 作業は [GTM-SETUP-WALKTHROUGH.md](./GTM-SETUP-WALKTHROUGH.md) に従ってください。

ここに書いてあるコンバージョン ID とラベルを、新しい GTM タグへ貼らないでください。

---

## 当時の値

| 項目 | 値 |
|---|---|
| 当時のコンバージョン ID | `AW-17667339500` |
| 電話問い合わせ_CV のラベル | `plLZCN-S0sscEOzpuOhB` |
| LINE問い合わせ_CV のラベル | `9Q7WCNu0t8scEOzpuOhB` |
| そのタグが入っていた古いコンテナ | `GTM-WLNM4GWN` |

2026-10-22 のコード変更（commit `57517bf`）で、ページが読むコンテナは `GTM-WLNM4GWN` から `GTM-NC9FX82V` になりました。2026-11-22 の調査では、公開中の `GTM-NC9FX82V` に上記の Google 広告タグは無く、GA4 は古い共用プロパティ `G-LTFRTZY7FE` でした。

現在コードが読むコンテナは、引き続き `GTM-NC9FX82V` です。carinteriorcleaning.jp 用の新しい GA4 測定 ID と、新しい Google 広告のコンバージョンラベルは未定です。
