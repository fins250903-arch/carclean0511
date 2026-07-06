# Google Ads コンバージョン計測 設置手順

**結論: はい、掲載LP（全ページ）に設置すべきです。**  
1LPだけではなく **サイト共通レイアウト（MainLayout）に1回設置** すれば、650 URL超すべてが計測対象になります。

詳細な画面操作手順は **[GTM-SETUP-WALKTHROUGH.md](./GTM-SETUP-WALKTHROUGH.md)** を参照してください。

---

## 現状

| 項目 | 状態 |
|------|------|
| GTMスニペット | `MainLayout.astro`（`GTM-WLNM4GWN`） |
| 全ボタン計測 | `ConversionTracking.astro` → `phone_click` / `line_click` |
| FloatingCTA | 同上イベント（二重送信なし・1クリック1イベント） |
| GTM側タグ | **要設定**（リンカー + 電話CV + LINE CV） |
| Google広告CVアクション | **要確認**（ID・ラベル取得） |

---

## dataLayer イベント（GTMトリガー用）

| イベント名 | 発火タイミング |
|---|---|
| `phone_click` | `tel:07084280866` 等の電話リンクをクリック |
| `line_click` | `https://lin.ee/Xs8Orp2` のLINEリンクをクリック |

GTMでは **カスタムイベント** トリガーで各イベント名と完全一致させてください。

---

## GTM タグ設定（最小構成）

| タグ名 | 種類 | トリガー |
|---|---|---|
| Google広告 - コンバージョンリンカー | コンバージョン リンカー | All Pages |
| Google広告 - CV 電話問い合わせ | Google 広告 コンバージョン | `phone_click` |
| Google広告 - CV LINE問い合わせ | Google 広告 コンバージョン | `line_click` |

---

## 環境変数

```bash
PUBLIC_GTM_ID=GTM-WLNM4GWN
```

---

## 検証手順

1. GTMプレビューで https://carinteriorcleaning.jp/ を接続
2. 電話・LINEボタンをクリック → `phone_click` / `line_click` + CVタグ発火
3. GTMを公開
4. Google広告 → コンバージョン → 24時間以内に記録確認

---

## Phase 1 との関係

| 順序 | 作業 |
|------|------|
| 1 | **CVタグ設置・確認**（本手順） |
| 2 | キーワードCSVインポート |
| 3 | 手動CPCで2週間配信 |
| 4 | CV10件以上で目標CPAへ移行 |
