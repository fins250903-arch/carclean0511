# LP CV改善 × AIO両立プラン（PDCA更新）

**ブランチ**: `cursor/lp-cv-hook-aio-balance-3bce`  
**目標**: Google広告 CTR 10% / クリックからの CVR 30%以上  
**制約**: FV基本構成・CTA（トップ/中央/ボトム）・問題提起・Q&Aは維持。

---

## PDCAループ結果（2026-08-06）

### Plan
- 顧客目線で「いくら？」「どう頼む？」をFVで完結
- AI検索（AIO）向け結論文・FAQ・スキーマ料金を現行価格に整合
- 「現在地から最短到着」など誤解表現を除去

### Do（本ラウンド実装）
1. FV価格フック＋トップCTA維持／KW別価格フック対応（匂い取り→消臭セット等）
2. 中央CTAを LINE/電話の2軸に集中（Instagramは補助リンク）
3. QuickFactsに「詳しい料金表を見る」アンカー追加
4. schema `priceRange` / Offer / HowTo / regionalPosts / serviceData の料金整合（18,000〜）
5. FAQ・診断表・サブエリア要約から「現在地／最短到着」を除去
6. Hero緊急文言「駆けつけます」→「お伺いします」

### Check（モバイル390px目視＋自動検証）
| ページ | FV価格 | FV CTA | 文言 | 見切れ | 固定CTA |
|--------|--------|--------|------|--------|---------|
| /regions/osaka/ | PASS（1シート18,000） | PASS | PASS | PASS | PASS |
| /regions/osaka/seat-cleaning/ | PASS | PASS | PASS | PASS | PASS |
| /regions/osaka/kuruma-nioitori/ | PASS（消臭セット26,000） | PASS | PASS | PASS | PASS |

- `現在地から` / `最短到着` : ページ本文になし
- Instagram主CTA : なし（補助リンクのみ）

### Act（次ラウンド候補・任意）
- 広告側RSAに「1シート18,000円から」を再掲しCTR連動を計測
- GTMで hero_top / quick_facts / main / closing / floating のクリック分離計測
- 地域LPでPricingをもう一段上に寄せるかはCVRデータ見て判断

---

## デプロイ後の検証チェックリスト

1. FVに価格フックが見える
2. LINE / 電話がFVと固定バーで押せる
3. 電話文言が「お急ぎの方は電話」
4. 問題提起・Q&A・3CTA構造が維持されている
5. 公開後1〜2週間 CTR/CVR をモニタリング
