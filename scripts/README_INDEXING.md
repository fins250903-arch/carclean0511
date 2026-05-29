# Google インデックス登録（Indexing API）

**最新の手順は [docs/GOOGLE_SEARCH_CONSOLE_SETUP.md](../docs/GOOGLE_SEARCH_CONSOLE_SETUP.md) を参照してください。**

`main` へ push すると GitHub Actions が自動で:

- サイトマップを Search Console に送信
- 重点地域（千葉・愛知・大阪・兵庫・福岡）のキーワードLPを優先して Indexing API に通知
- すべてのブログ記事も含める

旧 `submit_indexing.py` は廃止済みです。
