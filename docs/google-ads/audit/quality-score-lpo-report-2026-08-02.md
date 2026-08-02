# Google Ads 品質スコア監査 & LP改善レポート（2026-08-02）

**対象データ:** `docs/google-ads/exports/ads-editor-full-2026-08-02.tsv`  
**制約:** 各地区メインLPの FV構成・CTA位置は変更しない（キーワード掲載LPのみ改善）

---

## 結論

品質スコア付きKW **183件**（平均QS **4.16**）。最大ボトルネックは引き続き **Landing page experience Below average（129件 / Enabled 98件）**。

| 構成要素 | Below | Average | Above |
|---------|-------|---------|-------|
| Landing page experience | **129** | 54 | 0 |
| Expected CTR | 87 | 72 | 24 |
| Ad relevance | 33 | 54 | **96** |

最頻コンボ（40件）: `LPE=Below × CTR=Below × AdRel=Above`  
→ 広告関連性は相対的に強く、**着地LPの意図一致・比較材料・非緊急トーン**が不足。

### 前回（07-26）からの変化
- Path2「嘔吐ニオイ清掃」横断: 大量 → **残4件**（大幅改善）
- Enabled QSの空Final URL: **0**
- 平均QS・LPE Belowはほぼ横ばい（Ads修正後もLP体験が追いついていない）

---

## 競合比較で足りないもの

調査例: INS / カーピカ / 煌・ドラゴン / Dr.BAZOOKA / ピカらく / キーパー 等

| テーマ | 競合の強み | 自社ギャップ（改善前） | 本パス対応 |
|--------|-----------|----------------------|-----------|
| AC臭い | 工法差・料金差・フィルター vs エバポ比較 | QuickFactsのみで工法差が弱い | **IntentGuide工法比較** |
| 匂い取り/消臭 | 原因別メニュー・限界明記 | 嘔吐寄りの診断表が混在 | **ODOR診断表＋原因別ガイド** |
| 加齢臭/中古 | 付着場所・購入後チェック | AIOが薄い | **チェックリスト＋事例＋FAQ** |
| シート | 軽度/部分/全体の階層 | 階層が弱い | **階層表＋素材FAQ** |
| おしっこ/おもらし | 応急・NG・料金変動条件 | 汎用ペットチェック寄り | **尿チェック＋料金条件** |

---

## slug別ワースト（平均QS）

| slug | 平均QS | Enabled LPE Below | 本パスのLP対応 |
|------|--------|-------------------|---------------|
| `kareisyu` | 1.0 | 1 | IntentGuide・FAQ・事例 |
| `omorashi` | 1.0 | 1 | 尿特化・料金条件・事例 |
| `ac-nioi` | 2.3 | 8 | 工法比較ガイド |
| `kuruma-nioitori` | 2.3 | 9 | 原因別施工範囲・事例 |
| `kuruma-nioi-keshi` | 2.9 | 18 | メニュー階層・ODOR診断 |
| `car-ac-cleaning` | 2.9 | 7 | 含む/含まない明示 |
| `oshikko` | 3.0 | 1 | 尿チェック・FAQ |
| `shanai-shoshu` | 3.9 | 12 | 再発しない選び方 |
| `evaporator-senjo` | 4.1 | 4 | フィルター比較 |
| `seat-senjo` | 4.6 | 11 | 階層・素材FAQ |
| `interior-cleaning` | 5.5 | 7 | 基本≠消臭・lightトーン |

詳細: `qs-by-slug-2026-08-02.csv` / `quality-score-by-keyword-2026-08-02.csv`

---

## Ads Editor側の残り（少数）

1. Path2「嘔吐ニオイ清掃」残 **4件**（宮城/千葉 oshikko、千葉出張、群馬匂い消し）
2. トラック「臭い消し」が地域トラックHUB着地で LPE Below（愛知QS1 / 福岡QS3）→ 可能なら専用臭気LPへ

---

## 本リポジトリで実施したLP修正（メインFV/CTA非変更）

1. **`AdLpIntentGuide`** — QuickFacts直下にテーマ別比較/診断表（KW LPのみ）
2. **嘔吐トーン抑制** — 非緊急KWで嘔吐4日ルール/緊急ボイスライン/緊急バッジを抑制
3. **ODOR_SITUATION_DIAGNOSIS** — 臭い系の状況診断を嘔吐優先から症状優先へ
4. **加齢臭・中古・シート・おしっこ/おもらし** — FAQ/事例/チェック強化
5. **`shanai-nioi` / `chuko-kareisyu`** — mainTitle・QuickFacts追加
6. **`interior-cleaning`** — `troubleType: light` と基本/消臭の明示

---

## 期待効果

- LPE改善の再評価は **Ads流入後 2〜4週間**
- 優先モニタリング: `車の匂い取り` / `車 消臭` / `車 エアコン臭い` / `車 エアコンクリーニング` / `車シート 洗浄` / `車 加齢臭` / `車 おもらし`
