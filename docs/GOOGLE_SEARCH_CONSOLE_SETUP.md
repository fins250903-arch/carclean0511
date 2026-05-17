# Google Search Console / Indexing API 自動化セットアップ

`main` ブランチへ push するたびに GitHub Actions が次を実行します。

1. **サイトをビルド**（`sitemap-index.xml` を生成）
2. **Search Console にサイトマップを送信**
3. **Indexing API** で `URL_UPDATED`（Publish/update URL）を送信  
   - **優先**: 千葉・愛知・大阪・兵庫・福岡のキーワードLP（115 URL）  
   - **次**: その他地域のキーワードLP → メイン・トラック → コーティング  
   - **1回あたり最大 180 URL**（Google の日次上限 200 の余裕を見て設定）

Vercel への本番デプロイは従来どおり Vercel の Git 連携が担当します。本 workflow は SEO 登録専用です。

---

## あなたが準備するもの（チェックリスト）

### 1. Google Cloud プロジェクト

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成（または既存を使用）
2. 次の API を **有効化**:
   - **Google Search Console API**（Webmasters API）
   - **Indexing API**
   - （初回のみ）**Site Verification API**

### 2. サービスアカウント

1. **IAM と管理** → **サービスアカウント** → **作成**
2. 名前例: `carclean-search-console`
3. **鍵** → **鍵を追加** → **JSON** をダウンロード  
   → この JSON の中身を **GitHub Secret** に登録します（リポジトリにコミットしない）

### 3. Google Search Console

1. [Search Console](https://search.google.com/search-console) で  
   プロパティ **`https://carinteriorcleaning.jp`** を確認済みにする
2. **設定** → **ユーザーと権限** → **ユーザーを追加**
3. サービスアカウントのメール（JSON 内の `client_email`）を **所有者** で追加  
   例: `carclean-search-console@xxxx.iam.gserviceaccount.com`

### 4. GitHub リポジトリ（`fins250903-arch/carclean0511`）

**Secrets**（Settings → Secrets and variables → Actions → Secrets）

| 名前 | 内容 |
|------|------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | ダウンロードした JSON を **1行のまま** 全文コピー |

**Variables**（Settings → Secrets and variables → Actions → Variables）

| 名前 | 推奨値 |
|------|--------|
| `SITE_URL` | `https://carinteriorcleaning.jp` |
| `SITEMAP_URL` | `https://carinteriorcleaning.jp/sitemap-index.xml` |
| `INDEXING_DAILY_QUOTA` | `180`（省略時も 180） |

---

## 登録スケジュールの目安

| フェーズ | 内容 | URL数（目安） |
|----------|------|----------------|
| 1 | 重点5地域 × キーワードLP | 115 |
| 2 | その他16地域 × キーワードLP | 368 |
| 3 | 重点5地域メイン・トラック | 10 |
| 4 | その他メイン・トラック | 32 |
| 5 | コーティング | 1 |
| **合計** | | **約 526** |

- 1日目（push 1回）: フェーズ1 完了 + フェーズ2 の一部  
- フェーズ2 完了まで: 約 3 日（180件/日）  
- 全体完了まで: 約 **3〜4 日**（push のたびに続きから送信）

進捗は Actions の **Artifact `google-indexing-state`** に保存されます。

---

## 手動実行

Actions タブ → **Google Search Console & Indexing** → **Run workflow**

- サイトマップだけ送りたい: `skip_indexing` = `true`

---

## ローカル確認

```powershell
cd base_template
npm ci
npm run gsc:queue        # キュー件数の確認
npm run build
$env:GOOGLE_SERVICE_ACCOUNT_JSON = Get-Content -Raw path\to\key.json
$env:SITE_URL = "https://carinteriorcleaning.jp"
$env:SITEMAP_URL = "https://carinteriorcleaning.jp/sitemap-index.xml"
$env:SKIP_GSC_VERIFICATION = "true"
npm run gsc:sync
npm run gsc:index
```

---

## トラブルシューティング

| 症状 | 対処 |
|------|------|
| `403 Permission denied` | サービスアカウントを Search Console **所有者** に追加 |
| `Indexing API has not been used` | Cloud Console で Indexing API を有効化 |
| `Quota exceeded` | 翌日まで待つか `INDEXING_DAILY_QUOTA` を下げる |
| サイトマップは成功するが URL がインデックスされない | サイトマップ送信と Indexing API は別。数日前後かかることがあります |

---

## 関連ファイル

- `.github/workflows/google-search-console-indexing.yml`
- `scripts/google/ensure-search-console.mjs`
- `scripts/google/submit-indexing-queue.mjs`
- `scripts/google/build-indexing-queue.mjs`
