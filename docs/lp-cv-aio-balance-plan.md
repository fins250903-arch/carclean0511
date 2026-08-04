# LP CV改善 × AIO両立プラン

**ブランチ**: `cursor/lp-cv-hook-aio-balance-3bce`  
**目標**: Google広告 CTR 10% / クリックからの CVR 30%以上  
**制約**: FV基本構成・CTA（トップ/中央/ボトム）・問題提起・Q&Aは維持。デプロイはユーザー判断。

---

## 問題仮説（ループエンジニアリング）

1. **AIO特化でFVの「即決材料」が薄い**  
   Answer-first / 定義 / 診断が Hero 直後に続き、広告流入ユーザーの「いくら？」「今すぐ頼める？」がFVで完結しない。
2. **価格フック「1シート 18,000円から」の消失**  
   `CAR_PRICING.seatSingleBasic = 18000` は残るが、現行 Hero に未表示。クリック動機・QS・期待整合が弱まる。
3. **トップCTA欠落**  
   旧 Hero（`44e2eb1`）にあった LINE/電話インラインCTAが消え、FloatingCTA頼みになっている。
4. **地域LPとキーワードLPの格差**  
   キーワードLPは `AdLpQuickFacts` で料金・時間・エリア＋CTAがある。地域LPは同等の近折り情報が薄い。

---

## 競合・高CVRパターン（要約）

- FVに **症状 × 即日 × 価格 × 電話/LINE** を同居させる
- 価格は最低額＋条件（税込・出張費・追加条件）をセット表示
- Answer-first は FV「直下」に置き、FV内は広告用の即決情報を優先
- CTAはトップ（緊急電話）／中央（料金後LINE）／ボトム（再掲）の3段

---

## 実装内容（本ブランチ）

| 優先 | 内容 | 変更ファイル |
|------|------|-------------|
| A | FVに価格フック帯を復活（**1シート 18,000円から**） | `Hero.astro` |
| A | FV内トップCTA（LINE＋電話）を復元 | `Hero.astro` |
| A | AIO Answer-first に座席1脚料金を自然に含める | `aioKeywordContent.ts` |
| A | 中央CTAに価格フック追記 | `CTA.astro` |
| B | 地域/サブエリアLPにも QuickFacts | `[region].astro` 他 |
| B | Campaign / Closing に中央・ボトムCTA補強 | `Campaign.astro` `Closing.astro` |
| B | AIO比較・FAQスニペットの料金先頭を1シートに | `pricingConstants.ts` `AIOContent.astro` |
| C | Reasonsの旧価格表記を更新 | `Reasons.astro` |

**やらなかったこと**: AnswerTarget / AIOContent / FAQ の大幅削除、セクション順序の大規模入れ替え。

---

## デプロイ後の検証チェックリスト

1. FVに「1シート 18,000円から」が見える（モバイル・PC）
2. FV内で LINE / 電話が押せる（FloatingCTAと併用）
3. AnswerTarget 結論文に料金が含まれる（AIO用）
4. 問題提起・Q&A・3CTA構造が崩れていない
5. 広告 CTR / CVR を1〜2週間モニタリング（目標 CTR10%・CVR30%）
