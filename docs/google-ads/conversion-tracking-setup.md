# Google Ads コンバージョン計測 設置手順

**結論: はい、掲載LP（全ページ）に設置すべきです。**  
1LPだけではなく **サイト共通レイアウト（MainLayout）に1回設置** すれば、650 URL超すべてが計測対象になります。

---

## 現状（2026-06-12 実装済み）

| 項目 | 状態 |
|------|------|
| GTMスニペット | `MainLayout.astro` に追加（`PUBLIC_GTM_ID` 設定時のみ有効） |
| 電話クリック | `FloatingCTA.tsx` → `phone_click` イベント |
| LINEクリック | `FloatingCTA.tsx` → `line_click` イベント |
| フォーム送信 | `trackFormSubmit()` 用意済み（フォーム連携は今後） |

**コンテナID:** `GTM-WLNM4GWN`（`src/lib/analytics.ts` に設定済み）

**残りの作業:**

1. GTM管理画面で Google Ads コンバージョンタグを作成（下記トリガー）
2. （任意）Vercel 環境変数 `PUBLIC_GTM_ID=GTM-WLNM4GWN` で上書き可能
3. デプロイ後、Tag Assistant で発火確認

---

## なぜLP全体に設置するか

| 設置場所 | 結果 |
|---------|------|
| トップのみ | キーワードLP（`/regions/okinawa/kyuto-cleaning/` 等）のCVが計測されない |
| **MainLayout（全LP共通）** | **広告の最終URLがどのLPでもCVが取れる** |
| Google Adsのみ | サイト行動（電話タップ等）が計測できない |

広告はテーマ別LPへ誘導するため、**必ず全LPをカバーする設置が必要**です。

---

## GTM タグ設定（推奨）

### トリガー

| 名前 | 条件 |
|------|------|
| phone_click | カスタムイベント = `phone_click` |
| line_click | カスタムイベント = `line_click` |
| form_submit | カスタムイベント = `form_submit` |

### タグ

Google Ads → コンバージョン リンカー で各イベントに紐付け。

**優先CV（緊急トラブル広告の最適化に直結）:**

1. `phone_click` — 電話タップ
2. `line_click` — LINE友だち追加/タップ
3. `form_submit` — フォーム送信

---

## 環境変数

```bash
# .env（ローカル）または Vercel Dashboard（本番）
PUBLIC_GTM_ID=GTM-WLNM4GWN
```

ローカル確認: `npm run dev`（`.env` に設定済み）

---

## 検証手順

1. 本番またはプレビューURLを開く
2. 電話・LINEボタンをタップ → GTMプレビューで `phone_click` / `line_click` 確認
3. Google Ads → コンバージョン → 24時間以内に「未確認」表示
4. **CV計測開始後に Smart Bidding（目標CPA）へ移行**

---

## Phase 1 との関係

| 順序 | 作業 |
|------|------|
| 1 | **CVタグ設置・確認**（本手順） |
| 2 | `keywords-longtail.csv` をインポート |
| 3 | 手動CPCで2週間配信 |
| 4 | CV10件以上で目標CPAへ移行 |

CVなしで自動入札を使うと、表示回数は増えても**問い合わせ最適化ができません**。
