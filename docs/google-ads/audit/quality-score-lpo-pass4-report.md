# Google Ads 品質スコア監査 Pass4（100並列分析 → LP修正）

**対象データ:** ユーザー提出 Ads Editor CSV（`ads-editor-full-2026-07-23.tsv` と同一ハッシュ）  
**実施日:** 2026-08-30  
**前提:** Pass1–3 で臭気/AC/尿系の H1・QuickFacts・ProcessGuide・共感分岐は投入済み  
**正本 PR:** #31（`cursor/ads-qs-lpo-pass4-63c7`）。**#17（pass2）は supersede クローズ** — pass2 固有変更は本ブランチに包含済み。

---

## 結論

品質スコア付き **187 KW** のうち、**Landing page experience = Below average が 131件（70%）**。  
Ad relevance は Above average が最多 → **最大ボトルネックは今も LPE**。  
ただし **Ads 側の Final URL 空（QS付き50件）・トラックハブ誤着地・Path2汚染** が残ると、LP改善だけでは QS が上がりにくい。

| 構成要素 | Below | Average | Above |
|---------|------|---------|-------|
| LPE | **131** | 56 | 0 |
| Expected CTR | 92 | 73 | 22 |
| Ad relevance | 33 | 61 | 93 |

最頻パターン: `LPE=Below × CTR=Below × AdRel=Above`（広告は合うが着地体験が弱い）

---

## 100並列エージェント分析の要約

- **LP監査（slug×観点）:** 主要ワーストslugの大半は Pass2–3 で QF/PG/H1 充足。残ギャップは `kyuto-cleaning` PG、`chuko-tabako`/`unko`/`specialist-cleaning` の QF+PG、トラックハブ誤着地。
- **競合比較:** 勝ちLPは「検索KW一致H1」「ファーストビュー近くの料金」「工程」「限界明記」「事例」。自社は緊急トーン過多・料金/工程の欠落slugが弱点だった（本Passで穴埋め）。
- **Adsミスマッチ:** Final URL空・通常清掃→地域ハブ・乗用車KW→`-truck`・Path2「嘔吐ニオイ清掃」横断が CTR/関連性を削る（LP外の必須修正）。

詳細生ログ: エージェント出力 `/tmp/agent-out/`（ローカル100マイクロ監査 + クラウド探索エージェント）

---

## Pass4 で実施した LP 修正

1. **QuickFacts 追加** — `chuko-tabako` / `tabako-yani` / `unko` / `pet-unko` / `specialist-cleaning` / `kodomo-kyuto` + alias
2. **ProcessGuide 追加** — `kyuto-cleaning` / `shanai-nioi` / `chuko-tabako` / `tabako-yani` / `unko` / `pet-unko` / `specialist-cleaning` / `kodomo-kyuto` + alias
3. **AIO強化** — `unko`・`chuko-tabako` に料金・FAQ・事例
4. **H1微修正** — 中古車タバコ臭に「煙草ヤニ」トークン
5. **地域ハブ LPE** — `HubIntentBridge`（料金ATF）+ ProcessGuide（interior-cleaning）+ Pricing の早期配置
6. **トラックハブ LPE** — キャビン料金ATF + 乗用車向け意図ブリッジ（誤着地時の救済）

Ads Editor 修正リスト: `ads-editor-remaining-fixes-pass4-2026-07-23.csv`

---

## Ads Editor 側（LP外・最優先）

1. QS付きKWの Final URL 空をテーマLPへ
2. 乗用車KWの `-truck` 着地を乗用車LPへ
3. 地域ルート着地の通常清掃系を `interior-cleaning` 等へ
4. Path2「嘔吐ニオイ清掃」のテーマ別置換（07-26再監査でも未完）
5. RSA説明文のテーマ汚染除去

---

## 計測

修正URLを Ads に再紐付け後 **2〜4週間** で QS / LPE を再確認。  
優先監視: `車の匂い取り` / `車 消臭` / `車 エアコン*` / `車シート 洗浄` / `車 加齢臭` / 通常清掃系（URL設定後）
