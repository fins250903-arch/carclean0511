#!/usr/bin/env python3
"""Build anonymized chatbot knowledge from the internal order workbook.

Reads monthly order sheets and aggregates car model, soil type, price, and
prefecture. Names, phone numbers, emails, postal codes, street addresses, and
free-text notes are never written. Output is for internal chatbot grounding
and must stay out of the public site and out of git.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import stat
import sys
import unicodedata
import zipfile
from collections import Counter, defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}
WB_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"

ORDER_SHEETS = {
    "12月",
    "2601",
    "2602",
    "2603",
    "2604",
    "2605",
    "2606",
    "2607",
    "2608",
    "2609",
    "2610",
}
RESERVATION_SHEETS = {"予約 内容"}
SKIP_REASONS = {
    "2609集計用": "working copy of 2609",
    "原本": "template sheet",
    "加盟一覧": "partner contact directory",
    "集計一覧": "partner contact and payment sheet",
    "価格": "rate card, not orders",
}

# Internal rate card from the 価格 sheet. Not customer data.
MENU = {
    "single_seat": {"basic": 18000, "deodorize_add": 5000},
    "rear_seat": {"basic": 22000, "deodorize_add": 5000},
    "full_kei": {"basic": 22000, "deodorize_add": 3000},
    "full_regular": {"basic": 28000, "deodorize_add": 4000},
    "full_large": {"basic": 36000, "deodorize_add": 5000},
    "floor": {"basic": 9000, "deodorize_add": 7000},
    "trunk": {"basic": 8000, "deodorize_add": 7000},
    "truck_cab": {"basic": 35000, "deodorize_add": None},
    "ozone": 5000,
    "generator": 5000,
    "ceiling": 12000,
    "kerosene_per_seat": 30000,
    "pet_hair": 5000,
    "leather": 5000,
    "ac": 10000,
}

MIN_PRICE = 3000
MAX_PRICE = 300_000
MIN_PATTERN = 3

PREFECTURES = (
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
)

# City / ward names that identify one prefecture. Ambiguous names are omitted.
CITY_TO_PREFECTURE = {
    "名古屋市": "愛知県",
    "北名古屋市": "愛知県",
    "岡崎市": "愛知県",
    "豊田市": "愛知県",
    "春日井市": "愛知県",
    "刈谷市": "愛知県",
    "碧南市": "愛知県",
    "一宮市": "愛知県",
    "豊橋市": "愛知県",
    "安城市": "愛知県",
    "西尾市": "愛知県",
    "小牧市": "愛知県",
    "稲沢市": "愛知県",
    "瀬戸市": "愛知県",
    "半田市": "愛知県",
    "津島市": "愛知県",
    "犬山市": "愛知県",
    "江南市": "愛知県",
    "長久手市": "愛知県",
    "日進市": "愛知県",
    "みよし市": "愛知県",
    "蒲郡市": "愛知県",
    "豊川市": "愛知県",
    "知立市": "愛知県",
    "高浜市": "愛知県",
    "岩倉市": "愛知県",
    "清須市": "愛知県",
    "大府市": "愛知県",
    "東海市": "愛知県",
    "知多市": "愛知県",
    "常滑市": "愛知県",
    "東大阪市": "大阪府",
    "大阪市": "大阪府",
    "堺市": "大阪府",
    "豊中市": "大阪府",
    "枚方市": "大阪府",
    "貝塚市": "大阪府",
    "守口市": "大阪府",
    "高槻市": "大阪府",
    "岸和田市": "大阪府",
    "門真市": "大阪府",
    "箕面市": "大阪府",
    "茨木市": "大阪府",
    "吹田市": "大阪府",
    "八尾市": "大阪府",
    "寝屋川市": "大阪府",
    "松原市": "大阪府",
    "和泉市": "大阪府",
    "泉大津市": "大阪府",
    "富田林市": "大阪府",
    "河内長野市": "大阪府",
    "柏原市": "大阪府",
    "羽曳野市": "大阪府",
    "藤井寺市": "大阪府",
    "大阪狭山市": "大阪府",
    "阪南市": "大阪府",
    "交野市": "大阪府",
    "四條畷市": "大阪府",
    "大東市": "大阪府",
    "摂津市": "大阪府",
    "高石市": "大阪府",
    "泉南市": "大阪府",
    "泉佐野市": "大阪府",
    "池田市": "大阪府",
    "神戸市": "兵庫県",
    "姫路市": "兵庫県",
    "尼崎市": "兵庫県",
    "西宮市": "兵庫県",
    "明石市": "兵庫県",
    "加古川市": "兵庫県",
    "宝塚市": "兵庫県",
    "伊丹市": "兵庫県",
    "川西市": "兵庫県",
    "三田市": "兵庫県",
    "芦屋市": "兵庫県",
    "京都市": "京都府",
    "宇治市": "京都府",
    "長岡京市": "京都府",
    "亀岡市": "京都府",
    "横浜市": "神奈川県",
    "川崎市": "神奈川県",
    "相模原市": "神奈川県",
    "藤沢市": "神奈川県",
    "横須賀市": "神奈川県",
    "平塚市": "神奈川県",
    "鎌倉市": "神奈川県",
    "茅ヶ崎市": "神奈川県",
    "厚木市": "神奈川県",
    "小田原市": "神奈川県",
    "大和市": "神奈川県",
    "海老名市": "神奈川県",
    "千葉市": "千葉県",
    "船橋市": "千葉県",
    "松戸市": "千葉県",
    "市川市": "千葉県",
    "柏市": "千葉県",
    "浦安市": "千葉県",
    "習志野市": "千葉県",
    "八千代市": "千葉県",
    "流山市": "千葉県",
    "我孫子市": "千葉県",
    "成田市": "千葉県",
    "佐倉市": "千葉県",
    "市原市": "千葉県",
    "木更津市": "千葉県",
    "東金市": "千葉県",
    "さいたま市": "埼玉県",
    "川口市": "埼玉県",
    "川越市": "埼玉県",
    "所沢市": "埼玉県",
    "越谷市": "埼玉県",
    "草加市": "埼玉県",
    "春日部市": "埼玉県",
    "上尾市": "埼玉県",
    "熊谷市": "埼玉県",
    "新座市": "埼玉県",
    "狭山市": "埼玉県",
    "入間市": "埼玉県",
    "朝霞市": "埼玉県",
    "戸田市": "埼玉県",
    "蕨市": "埼玉県",
    "和光市": "埼玉県",
    "桶川市": "埼玉県",
    "久喜市": "埼玉県",
    "八潮市": "埼玉県",
    "三郷市": "埼玉県",
    "吉川市": "埼玉県",
    "富士見市": "埼玉県",
    "ふじみ野市": "埼玉県",
    "坂戸市": "埼玉県",
    "鶴ヶ島市": "埼玉県",
    "飯能市": "埼玉県",
    "東松山市": "埼玉県",
    "鴻巣市": "埼玉県",
    "深谷市": "埼玉県",
    "本庄市": "埼玉県",
    "行田市": "埼玉県",
    "加須市": "埼玉県",
    "幸手市": "埼玉県",
    "白岡市": "埼玉県",
    "蓮田市": "埼玉県",
    "北本市": "埼玉県",
    "志木市": "埼玉県",
    "静岡市": "静岡県",
    "浜松市": "静岡県",
    "沼津市": "静岡県",
    "富士市": "静岡県",
    "焼津市": "静岡県",
    "藤枝市": "静岡県",
    "掛川市": "静岡県",
    "磐田市": "静岡県",
    "島田市": "静岡県",
    "福岡市": "福岡県",
    "北九州市": "福岡県",
    "久留米市": "福岡県",
    "春日市": "福岡県",
    "大野城市": "福岡県",
    "太宰府市": "福岡県",
    "筑紫野市": "福岡県",
    "那覇市": "沖縄県",
    "浦添市": "沖縄県",
    "沖縄市": "沖縄県",
    "うるま市": "沖縄県",
    "宜野湾市": "沖縄県",
    "豊見城市": "沖縄県",
    "糸満市": "沖縄県",
    "名護市": "沖縄県",
    "熊本市": "熊本県",
    "仙台市": "宮城県",
    "奈良市": "奈良県",
    "和歌山市": "和歌山県",
    "海南市": "和歌山県",
    "岐阜市": "岐阜県",
    "大垣市": "岐阜県",
    "各務原市": "岐阜県",
    "多治見市": "岐阜県",
    "四日市市": "三重県",
    "津市": "三重県",
    "鈴鹿市": "三重県",
    "桑名市": "三重県",
    "大津市": "滋賀県",
    "草津市": "滋賀県",
    "彦根市": "滋賀県",
    "福井市": "福井県",
    "佐賀市": "佐賀県",
    "宇部市": "山口県",
    "下関市": "山口県",
    "山口市": "山口県",
    "水戸市": "茨城県",
    "つくば市": "茨城県",
    "土浦市": "茨城県",
    "古河市": "茨城県",
    "取手市": "茨城県",
    "守谷市": "茨城県",
    "ひたちなか市": "茨城県",
    "日立市": "茨城県",
    "宇都宮市": "栃木県",
    "小山市": "栃木県",
    "栃木市": "栃木県",
    "足利市": "栃木県",
    "前橋市": "群馬県",
    "高崎市": "群馬県",
    "太田市": "群馬県",
    "伊勢崎市": "群馬県",
    "桐生市": "群馬県",
    "広島市": "広島県",
    "岡山市": "岡山県",
    "金沢市": "石川県",
    "新潟市": "新潟県",
    "長野市": "長野県",
    "松本市": "長野県",
    "世田谷区": "東京都",
    "渋谷区": "東京都",
    "新宿区": "東京都",
    "中野区": "東京都",
    "杉並区": "東京都",
    "練馬区": "東京都",
    "板橋区": "東京都",
    "豊島区": "東京都",
    "荒川区": "東京都",
    "足立区": "東京都",
    "葛飾区": "東京都",
    "江戸川区": "東京都",
    "江東区": "東京都",
    "墨田区": "東京都",
    "台東区": "東京都",
    "文京区": "東京都",
    "千代田区": "東京都",
    "品川区": "東京都",
    "目黒区": "東京都",
    "大田区": "東京都",
    "八王子市": "東京都",
    "町田市": "東京都",
    "武蔵野市": "東京都",
    "三鷹市": "東京都",
    "調布市": "東京都",
    "立川市": "東京都",
    "国分寺市": "東京都",
    "国立市": "東京都",
    "西東京市": "東京都",
}

# (canonical, class, aliases). Longer aliases are matched first globally.
VEHICLES = [
    ("アルファード", "minivan", ["アルファード", "アルファー", "アルファード"]),
    ("ヴェルファイア", "minivan", ["ヴェルファイア", "ベルファイア", "vellfire"]),
    ("エスクワイア", "minivan", ["エスクワイア", "エスクァイア", "エスクヮイア", "エスクワィア"]),
    ("ヴォクシー", "minivan", ["ヴォクシー", "ボクシー", "ボキシー", "voxy"]),
    ("ノア", "minivan", ["noah", "ノア"]),
    ("シエンタ", "minivan", ["シエンタ"]),
    ("ステップワゴン", "minivan", ["ステップワゴン", "stepwgn", "ステップワゴン"]),
    ("フリード", "minivan", ["フリード"]),
    ("セレナ", "minivan", ["セレナ"]),
    ("エルグランド", "minivan", ["エルグランド"]),
    ("オデッセイ", "minivan", ["オデッセイ"]),
    ("エスティマ", "minivan", ["エスティマ"]),
    ("デリカ", "minivan", ["デリカ"]),
    ("ビアンテ", "minivan", ["ビアンテ"]),
    ("プレマシー", "minivan", ["プレマシー"]),
    ("ラフェスタ", "minivan", ["ラフェスタ"]),
    ("アイシス", "minivan", ["アイシス"]),
    ("ウィッシュ", "minivan", ["ウィッシュ"]),
    ("グランエース", "van", ["グランエース"]),
    ("ハイエース", "van", ["ハイエース", "ハイエースワイド"]),
    ("レジアスエース", "van", ["レジアスエース", "レジアス"]),
    ("キャラバン", "van", ["キャラバン", "nv350"]),
    ("ボンゴ", "van", ["ボンゴ"]),
    ("タウンエース", "van", ["タウンエース"]),
    ("プリウスα", "minivan", ["プリウスα", "プリウスアルファ", "プリウスa"]),
    ("プリウス", "regular", ["プリウス"]),
    ("ハリアー", "regular", ["ハリアー", "ハリア"]),
    ("ヤリスクロス", "regular", ["ヤリスクロス"]),
    ("カローラクロス", "regular", ["カローラクロス"]),
    ("カローラツーリング", "regular", ["カローラツーリング"]),
    ("カローラ", "regular", ["カローラ"]),
    ("ヤリス", "regular", ["ヤリス"]),
    ("アクア", "regular", ["アクア"]),
    ("ライズ", "regular", ["ライズ"]),
    ("ルーミー", "regular", ["ルーミー"]),
    ("タンク", "regular", ["タンク"]),
    ("パッソ", "regular", ["パッソ"]),
    ("ヴィッツ", "regular", ["ヴィッツ", "ビッツ"]),
    ("クラウン", "regular", ["クラウン"]),
    ("カムリ", "regular", ["カムリ"]),
    ("ランドクルーザープラド", "regular", ["ランドクルーザープラド", "プラド"]),
    ("ランドクルーザー", "regular", ["ランドクルーザー", "ランクル"]),
    ("ハイラックス", "regular", ["ハイラックス"]),
    ("RAV4", "regular", ["rav4"]),
    ("C-HR", "regular", ["c-hr", "chr"]),
    ("クラウン", "regular", ["クラウン"]),
    ("レクサス", "regular", ["レクサス", "lexus"]),
    ("ノート", "regular", ["ノートオーラ", "ニッサンオーラ", "オーラ", "ノート"]),
    ("リーフ", "regular", ["リーフ", "leaf"]),
    ("キックス", "regular", ["キックス"]),
    ("エクストレイル", "regular", ["エクストレイル"]),
    ("マーチ", "regular", ["マーチ"]),
    ("キューブ", "regular", ["キューブ"]),
    ("アクセラ", "regular", ["アクセラ"]),
    ("CX-60", "regular", ["cx-60", "cx60"]),
    ("CX-8", "regular", ["cx-8", "cx8"]),
    ("CX-5", "regular", ["cx-5", "cx5"]),
    ("CX-30", "regular", ["cx-30", "cx30"]),
    ("CX-3", "regular", ["cx-3", "cx3"]),
    ("デミオ", "regular", ["デミオ", "mazda2"]),
    ("アテンザ", "regular", ["アテンザ", "mazda6"]),
    ("インプレッサ", "regular", ["インプレッサ"]),
    ("フォレスター", "regular", ["フォレスター", "フォレスタ"]),
    ("レヴォーグ", "regular", ["レヴォーグ", "レボーグ"]),
    ("レガシィ", "regular", ["レガシィ", "レガシー"]),
    ("アウトバック", "regular", ["アウトバック"]),
    ("フィット", "regular", ["フィット", "fit"]),
    ("ヴェゼル", "regular", ["ヴェゼル", "ベゼル"]),
    ("シャトル", "regular", ["シャトル"]),
    ("シビック", "regular", ["シビック"]),
    ("インサイト", "regular", ["インサイト"]),
    ("CR-V", "regular", ["cr-v", "crv"]),
    ("ムーヴキャンバス", "kei", ["ムーヴキャンバス", "ムーブキャンバス", "ムーヴキャンバ", "キャンバス", "キャンバ"]),
    ("タント", "kei", ["タント"]),
    ("タフト", "kei", ["タフト"]),
    ("ミライース", "kei", ["ミライース"]),
    ("ウェイク", "kei", ["ウェイク"]),
    ("コペン", "kei", ["コペン"]),
    ("アトレー", "kei", ["アトレー"]),
    ("ハイゼット", "kei", ["ハイゼット"]),
    ("ムーヴ", "kei", ["ムーヴ", "ムーブ"]),
    ("N-BOX", "kei", ["n-box", "nbox", "nボックス"]),
    ("N-WGN", "kei", ["n-wgn", "nwgn", "nワゴン"]),
    ("N-ONE", "kei", ["n-one"]),
    ("N-VAN", "kei", ["n-van", "nvan"]),
    ("スペーシア", "kei", ["スペーシア", "スペイシア", "スペーシアギア"]),
    ("ハスラー", "kei", ["ハスラー"]),
    ("ソリオ", "kei", ["ソリオ"]),
    ("スイフト", "kei", ["スイフト"]),
    ("ワゴンR", "kei", ["ワゴンr", "ワゴンｒ"]),
    ("エブリイ", "kei", ["エブリイ", "エブリィ", "エブリー", "エブリワゴン"]),
    ("ジムニー", "kei", ["ジムニー"]),
    ("クロスビー", "kei", ["クロスビー"]),
    ("アルト", "kei", ["アルト"]),
    ("ラパン", "kei", ["ラパン"]),
    ("キャリー", "kei", ["キャリイ", "キャリー"]),
    ("デイズ", "kei", ["デイズ"]),
    ("ルークス", "kei", ["ルークス"]),
    ("フレア", "kei", ["フレアワゴン", "フレア"]),
    ("ステラ", "kei", ["ステラ"]),
    ("プレオ", "kei", ["プレオ", "スバルレオ"]),
    ("eK", "kei", ["ekワゴン", "ekクロス", "ekスペース", "ek"]),
    ("スクラム", "kei", ["スクラム"]),
    ("クリッパー", "kei", ["クリッパーバン", "クリッパー"]),
    ("オッティ", "kei", ["オッティ"]),
    ("ライフ", "kei", ["ライフ"]),
    ("スマイル", "kei", ["スズキスマイル", "スマイル"]),
    ("ミニキャブ", "kei", ["ミニキャブ"]),
    ("サクラ", "kei", ["サクラ"]),
    ("アウトランダー", "regular", ["アウトランダー"]),
    ("ベンツ", "regular", ["メルセデス", "ベンツ", "benz"]),
    ("BMW", "regular", ["bmw"]),
    ("アウディ", "regular", ["アウディ", "audi"]),
    ("ゴルフ", "regular", ["ゴルフ"]),
    ("ミニ", "regular", ["ミニクーパー"]),
    ("テスラ", "regular", ["モデルy", "モデル3", "テスラ"]),
    ("ボルボ", "regular", ["ボルボ"]),
    ("シトロエン", "regular", ["シトロエン", "ベルランゴ"]),
    ("プジョー", "regular", ["プジョー"]),
    ("ルノー", "regular", ["カングー", "ルノー"]),
    ("ポルシェ", "regular", ["パナメーラ", "ポルシェ"]),
    ("スカイライン", "regular", ["スカイライン"]),
    ("アリオン", "regular", ["アリオン"]),
    ("ウイングロード", "regular", ["ウイングロード"]),
    ("ジャパンタクシー", "regular", ["ジャパンタクシー"]),
    ("ランドローバー", "regular", ["ランドローバー"]),
    ("プロボックス", "van", ["プロボックス"]),
    ("サクシード", "van", ["サクシード"]),
    ("バネット", "van", ["バネット"]),
    ("カムロード", "van", ["カムロード"]),
    ("ジープ", "regular", ["ジープ", "ラングラー"]),
    ("コースター", "bus", ["コースター"]),
    ("ローザ", "bus", ["ローザ"]),
    ("リエッセ", "bus", ["リエッセ"]),
    ("シビリアン", "bus", ["シビリアン"]),
    ("マイクロバス", "bus", ["マイクロバス"]),
    ("バス", "bus", ["バス"]),
    ("プロフィア", "truck", ["プロフィア"]),
    ("クオン", "truck", ["クオン"]),
    ("スーパーグレート", "truck", ["スーパーグレート"]),
    ("ギガ", "truck", ["ギガ"]),
    ("レンジャー", "truck", ["レンジャー"]),
    ("フォワード", "truck", ["フォワード"]),
    ("ファイター", "truck", ["ファイター"]),
    ("キャンター", "truck", ["キャンター"]),
    ("エルフ", "truck", ["エルフ"]),
    ("デュトロ", "truck", ["デュトロ"]),
    ("ダイナ", "truck", ["ダイナ"]),
    ("アトラス", "truck", ["アトラス"]),
    ("トラック", "truck", ["トラック", "トレーラー"]),
]

CLASS_LABEL = {
    "kei": "軽自動車",
    "regular": "普通車",
    "minivan": "ミニバン",
    "van": "バン",
    "truck": "トラック",
    "bus": "バス",
    "unknown": "車格不明",
}
SCOPE_LABEL = {
    "single_seat": "座席1脚",
    "rear_seat": "後部座席",
    "full_kei": "軽自動車の車内全体",
    "full_regular": "普通車の車内全体",
    "full_large": "大型車の車内全体",
    "truck_cab": "トラックキャビン",
    "trunk": "トランク・荷室",
    "floor": "床・マット",
    "deadening": "デッドニング",
    "glass": "ガラスリペア",
    "unknown": "範囲の記載なし",
}
STAIN_LABEL = {
    "嘔吐": "嘔吐",
    "尿": "尿・おもらし",
    "便": "便",
    "ペット": "ペット",
    "タバコ": "タバコ・ヤニ",
    "水没": "水没・浸水",
    "灯油": "灯油・油",
    "血液": "血液",
    "食べこぼし": "食べこぼし・飲料",
    "カビ": "カビ",
    "芳香剤": "芳香剤",
    "泥砂": "泥・砂ぼこり",
    "none": "汚れ種類の記載なし",
}
SERVICE_LABEL = {
    "cleaning": "車内清掃",
    "deadening": "デッドニング",
    "glass": "ガラスリペア",
    "ac": "エアコン洗浄",
}

STAIN_RULES = [
    ("灯油", ["灯油", "ガソリン", "燃料漏れ", "エンジンオイル", "油汚れ", "オイル汚れ"]),
    ("血液", ["血液", "血痕", "出血", "鼻血"]),
    ("水没", ["水没", "浸水", "冠水", "床上浸水", "水につか", "水に浸", "雨水"]),
    ("便", ["うんち", "うんこ", "糞", "下痢", "排便", "大便", "糞便"]),
    ("尿", ["おもらし", "オシッコ", "おしっこ", "失禁", "粗相", "尿", "小便"]),
    ("嘔吐", ["嘔吐", "げろ", "ゲロ", "おうと", "戻した", "吐き"]),
    ("ペット", ["ペット", "愛犬", "飼い犬", "わんちゃん", "ワンちゃん", "犬の", "猫の", "ネコ", "にゃん", "肛門腺"]),
    ("タバコ", ["タバコ", "たばこ", "煙草", "ヤニ"]),
    ("食べこぼし", ["食べこぼ", "こぼし", "コーヒー", "ジュース", "牛乳", "食べ物", "飲み物"]),
    ("カビ", ["カビ", "黴"]),
    ("芳香剤", ["芳香剤"]),
    ("泥砂", ["砂ぼこり", "砂埃", "泥汚れ", "土ぼこり", "土埃"]),
]
STAIN_PRIORITY = [name for name, _ in STAIN_RULES]

SCOPE_RULES = [
    ("deadening", ["デッドニング", "デドニング"]),
    ("glass", ["ウインドリペア", "ウィンドリペア", "飛び石", "ガラスリペア"]),
    ("truck_cab", ["キャビン", "10t", "4t", "2t", "トラック"]),
    ("single_seat", ["独立1シート", "独立１シート", "1シートのみ", "シート単体", "シートのみ"]),
    ("rear_seat", ["後部座席", "2連席", "２連席", "2列目", "3列目"]),
    ("trunk", ["トランク", "荷室", "リアトランク"]),
    ("floor", ["床マット", "マット床", "フロア床", "床のみ"]),
    ("full_large", ["大型"]),
    ("full_kei", ["軽四", "軽自動車", "軽・小型", "軽小型"]),
    ("full_regular", ["普通車", "車内全清掃", "車内全体", "全体洗浄", "全室", "全車"]),
]

DEODORIZE_STAINS = {"嘔吐", "尿", "便", "血液", "灯油", "水没", "ペット", "タバコ", "カビ"}
PHONE_RE = re.compile(r"(?:0\d{1,4})[-\s]?\d{1,4}[-\s]?\d{3,4}")
EMAIL_RE = re.compile(r"[\w.+-]+@[\w.-]+\.\w+")
POSTAL_RE = re.compile(r"\d{3}-\d{4}")
LONG_DIGIT_RE = re.compile(r"\d{8,}")

HEADER_FIELDS = {
    "受注日": "order_date",
    "希望日": "hope_date",
    "要望": "request",
    "種類": "request",
    "車種": "vehicle",
    "車種（サイズ）": "vehicle",
    "車種(サイズ)": "vehicle",
    "概算": "quote",
    "受注金額": "revenue",
    "聞取り内容": "hearing",
    "備考": "note",
    "住所": "address",
    "スペース": "space",
    "電源と水": "power",
}

BLOCKED_HEADERS = {
    "顧客名",
    "連絡先",
    "郵便番号",
    "番地",
    "メール",
    "代表者",
    "名称",
    "契約書",
}


def nfkc(value) -> str:
    return unicodedata.normalize("NFKC", "" if value is None else str(value))


def fold(value) -> str:
    text = nfkc(value).lower()
    text = text.replace("ヴォ", "ボ").replace("ヴ", "ブ")
    return re.sub(r"\s+", "", text)


def norm_header(value) -> str:
    return re.sub(r"[\s　]+", "", nfkc(value))


def _alias_index():
    rows = []
    for canonical, klass, aliases in VEHICLES:
        for alias in aliases:
            rows.append((fold(alias), canonical, klass))
    rows.sort(key=lambda item: len(item[0]), reverse=True)
    # Drop aliases that are prefixes of a longer alias only at match time.
    return rows


ALIASES = _alias_index()


def strip_contacts(value) -> str:
    text = nfkc(value)
    text = EMAIL_RE.sub(" ", text)
    text = PHONE_RE.sub(" ", text)
    text = POSTAL_RE.sub(" ", text)
    return text


def accept_amount(value):
    if isinstance(value, bool) or value is None:
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number != number:  # NaN
        return None
    number = int(round(number))
    if number >= 500_000:
        return ("large", number)
    if MIN_PRICE <= number <= MAX_PRICE:
        return ("ok", number)
    return None


def parse_money(value):
    """Parse a price cell. Returns ('ok'| 'large', amount) or ('none', None)."""
    if value is None or value == "":
        return ("none", None)
    if isinstance(value, bool):
        return ("none", None)
    if isinstance(value, (int, float)):
        hit = accept_amount(value)
        return hit if hit else ("none", None)
    text = strip_contacts(value)
    compact = re.sub(r"\s+", "", text)
    if re.fullmatch(r"[\d,]+(\+[\d,]+)+", compact):
        total = sum(int(part.replace(",", "")) for part in compact.split("+"))
        hit = accept_amount(total)
        return hit if hit else ("none", None)
    stated = re.search(r"(?:概算合計|合計|税込|金額)\D{0,8}(\d[\d,]{3,})", text)
    if stated:
        hit = accept_amount(int(stated.group(1).replace(",", "")))
        return hit if hit else ("none", None)
    numbers = [int(part.replace(",", "")) for part in re.findall(r"\d[\d,]{2,}", text)]
    parsed = [accept_amount(number) for number in numbers]
    ok = [item[1] for item in parsed if item and item[0] == "ok"]
    large = [item[1] for item in parsed if item and item[0] == "large"]
    if ok and len(ok) <= 4 and ("+" in compact or len(ok) >= 2):
        hit = accept_amount(sum(ok))
        if hit:
            return hit
    if len(ok) == 1:
        return ("ok", ok[0])
    if large and not ok:
        return ("large", large[0])
    return ("none", None)


def prefecture_of(address) -> str | None:
    text = nfkc(address)
    if not text.strip():
        return None
    for name in sorted(PREFECTURES, key=len, reverse=True):
        if name in text:
            return name
    for city, pref in sorted(CITY_TO_PREFECTURE.items(), key=lambda item: len(item[0]), reverse=True):
        if city in text:
            return pref
    if "名古屋" in text:
        return "愛知県"
    return None


def match_vehicle(text: str):
    folded = fold(text)
    for alias, canonical, klass in ALIASES:
        if alias and alias in folded:
            return canonical, klass
    if re.search(r"(10|4|2)\s*t", folded) or "キャビン" in folded:
        return "トラック", "truck"
    if "軽四" in folded or "軽自動車" in folded:
        return None, "kei"
    if "普通車" in folded:
        return None, "regular"
    if "大型" in folded or "ミニバン" in folded:
        return None, "minivan"
    return None, "unknown"


def match_stains(text: str) -> list[str]:
    folded = fold(strip_contacts(text))
    found = []
    for name, words in STAIN_RULES:
        if any(fold(word) in folded for word in words):
            found.append(name)
    return found


def match_scope(request: str, vehicle: str) -> str:
    for source in (request, vehicle):
        folded = fold(source)
        if not folded:
            continue
        for scope, words in SCOPE_RULES:
            if any(fold(word) in folded for word in words):
                return scope
    return "unknown"


def match_service(scope: str, text: str) -> str:
    if scope == "deadening":
        return "deadening"
    if scope == "glass":
        return "glass"
    folded = fold(text)
    if "エアコン" in folded or "エバポ" in folded:
        if scope == "unknown" and "車内" not in folded and "シート" not in folded:
            return "ac"
    return "cleaning"


def _flag(text: str, words: list[str]) -> bool:
    folded = fold(strip_contacts(text))
    return any(fold(word) in folded for word in words)


def classify_row(row: dict) -> dict | None:
    """Return category fields only. Free text is not copied onto the result."""
    request = row.get("request") or ""
    vehicle = row.get("vehicle") or ""
    hearing = row.get("hearing") or ""
    note = row.get("note") or ""
    quote_state, quote = parse_money(row.get("quote"))
    revenue_state, revenue = parse_money(row.get("revenue"))
    if quote_state == "none":
        quote_state, quote = parse_money_from_note(hearing)
    blob = " ".join(nfkc(part) for part in (request, vehicle, hearing, note))
    if not fold(blob) and quote is None and revenue is None:
        return None
    model, klass = match_vehicle(f"{vehicle} {request}")
    if klass == "unknown":
        hinted = fold(blob)
        if re.search(r"(10|4|2)t", hinted) or "キャビン" in hinted or "トラック" in hinted:
            model, klass = "トラック", "truck"
        elif "マイクロバス" in hinted or "コースター" in hinted:
            model, klass = "マイクロバス", "bus"
    stains = match_stains(blob)
    primary = next((name for name in STAIN_PRIORITY if name in stains), "none")
    scope = match_scope(request, vehicle)
    if scope == "unknown":
        scope = match_scope(blob, "")
    if scope == "unknown" and any(word in fold(vehicle) for word in ("助手席", "運転席", "座面")):
        scope = "single_seat"
    service = match_service(scope, blob)
    if service == "deadening":
        scope = "deadening"
    if service == "glass":
        scope = "glass"
    power = fold(row.get("power") or "")
    return {
        "sheet": str(row.get("sheet") or ""),
        "segment": row.get("segment") or "orders",
        "model": model,
        "vehicle_class": klass,
        "stains": stains,
        "primary_stain": primary,
        "scope": scope,
        "service": service,
        "prefecture": prefecture_of(row.get("address")),
        "quote": quote if quote_state == "ok" else None,
        "revenue": revenue if revenue_state == "ok" else None,
        "large_quote": quote_state == "large" or revenue_state == "large",
        "insurance": _flag(
            blob,
            ["個賠", "個人賠償", "車両保険", "火災保険", "保険使用", "保険利用", "保険適応", "保険適用", "保険対応", "賠償保険"],
        ),
        "third_party": _flag(blob, ["第三者", "友人", "他人", "同僚"]),
        "child": _flag(blob, ["子供", "子ども", "園児", "息子", "娘"]),
        "elder": _flag(blob, ["高齢者", "高齢", "祖父", "祖母", "おじい", "おばあ"]),
        "ozone": _flag(blob, ["オゾン"]),
        "generator": _flag(blob, ["発電機", "電源持込", "外部電源"]),
        "leather": _flag(blob, ["本皮", "革張り", "レザー", "本革"]),
        "pet_hair": _flag(blob, ["ペット毛", "抜け毛"]),
        "ceiling": _flag(blob, ["天井"]),
        "ac": _flag(blob, ["エアコン", "エバポ"]),
        "power_no": power in {"no", "なし", "無し"} or "電源無" in fold(blob),
        "power_known": bool(power) or "電源" in fold(blob),
        "order_date": nfkc(row.get("order_date") or ""),
        "hope_date": nfkc(row.get("hope_date") or ""),
    }


def parse_money_from_note(value):
    if not value:
        return ("none", None)
    text = strip_contacts(value)
    stated = re.search(r"(?:概算合計|合計|税込)\D{0,8}(\d[\d,]{3,})", text)
    if not stated:
        return ("none", None)
    hit = accept_amount(int(stated.group(1).replace(",", "")))
    return hit if hit else ("none", None)


def _percentile(values: list[int], ratio: float) -> int | None:
    if not values:
        return None
    ordered = sorted(values)
    index = (len(ordered) - 1) * ratio
    low = int(index)
    high = min(low + 1, len(ordered) - 1)
    weight = index - low
    return int(round(ordered[low] * (1 - weight) + ordered[high] * weight))


def price_stats(values: list[int]) -> dict | None:
    if len(values) < MIN_PATTERN:
        return None
    return {
        "n": len(values),
        "p25": _percentile(values, 0.25),
        "median": _percentile(values, 0.5),
        "p75": _percentile(values, 0.75),
    }


def menu_hint(scope: str, stain: str) -> str | None:
    if stain == "灯油":
        return f"メニュー目安 灯油専用洗浄 {MENU['kerosene_per_seat']:,}円/席"
    band = MENU.get(scope)
    if not band:
        return None
    basic = band["basic"]
    extra = band["deodorize_add"]
    if stain in DEODORIZE_STAINS and extra:
        return f"メニュー目安 {basic + extra:,}円（基本{basic:,}円＋消臭{extra:,}円）"
    return f"メニュー目安 {basic:,}円"


def _share(count: int, total: int) -> float:
    if total <= 0:
        return 0.0
    return round(count / total, 3)


def _pattern_label(stain: str, klass: str, scope: str) -> str:
    return f"{STAIN_LABEL.get(stain, stain)} / {CLASS_LABEL.get(klass, klass)} / {SCOPE_LABEL.get(scope, scope)}"


def _guide(pattern: dict) -> str:
    price = pattern.get("price")
    menu = pattern.get("menu_hint")
    bits = [
        f"「{_pattern_label(pattern['stain'], pattern['vehicle_class'], pattern['scope'])}」は{pattern['count']}件（この区分の{round(pattern['share'] * 100)}%）。"
    ]
    if menu:
        bits.append(menu + "。")
    if price:
        bits.append(
            f"見積・受注の中央値は{price['median']:,}円（{price['n']}件、四分位 {price['p25']:,}〜{price['p75']:,}円）。"
        )
    else:
        bits.append("件数が少ないため金額はメニューを案内し、現地で幅を見る。")
    if pattern.get("insurance_share", 0) >= 0.25:
        bits.append("個人賠償・車両保険の相談がこのパターンに混ざる。保険利用でも作業範囲と実費の説明が先。")
    if pattern["stain"] in DEODORIZE_STAINS:
        bits.append("オゾン消臭（5,000円）と、電源が無い場合の発電機持込（5,000円）を別枠で確認する。")
    if pattern["stain"] == "灯油":
        bits.append("灯油は1席あたり30,000円の専用洗浄。通常のシート単価に載せない。")
    bits.append("回答に氏名、電話、メール、通りの住所は出さない。場所は都道府県まで。")
    return "".join(bits)


def aggregate(rows: list[dict]) -> dict:
    usable = [row for row in rows if row]
    total = len(usable)
    models = Counter(row["model"] for row in usable if row["model"])
    classes = Counter(row["vehicle_class"] for row in usable)
    stains = Counter(row["primary_stain"] for row in usable)
    scopes = Counter(row["scope"] for row in usable)
    services = Counter(row["service"] for row in usable)
    regions = Counter(row["prefecture"] for row in usable if row["prefecture"])
    sheets = Counter(row["sheet"] for row in usable)

    def price_of(row):
        return row["revenue"] or row["quote"]

    prices = [price_of(row) for row in usable if price_of(row)]
    by_scope = defaultdict(list)
    by_stain = defaultdict(list)
    by_class = defaultdict(list)
    by_pattern = defaultdict(list)
    insurance_by_pattern = defaultdict(list)
    for row in usable:
        amount = price_of(row)
        key = (row["primary_stain"], row["vehicle_class"], row["scope"])
        insurance_by_pattern[key].append(row["insurance"])
        if amount:
            by_scope[row["scope"]].append(amount)
            by_stain[row["primary_stain"]].append(amount)
            by_class[row["vehicle_class"]].append(amount)
            by_pattern[key].append(amount)

    patterns = []
    for key, flagged in insurance_by_pattern.items():
        stain, klass, scope = key
        count = len(flagged)
        if count < MIN_PATTERN:
            continue
        stats = price_stats(by_pattern.get(key, []))
        patterns.append(
            {
                "stain": stain,
                "stain_label": STAIN_LABEL.get(stain, stain),
                "vehicle_class": klass,
                "vehicle_class_label": CLASS_LABEL.get(klass, klass),
                "scope": scope,
                "scope_label": SCOPE_LABEL.get(scope, scope),
                "count": count,
                "share": _share(count, total),
                "price": stats,
                "menu_hint": menu_hint(scope, stain),
                "insurance_share": _share(sum(1 for item in flagged if item), count),
            }
        )
    patterns.sort(key=lambda item: (-item["count"], item["stain"], item["vehicle_class"], item["scope"]))
    for pattern in patterns:
        pattern["answer_guide"] = _guide(pattern)

    def counter_rows(counter: Counter, label_map=None, key_name="key"):
        rows_out = []
        for key, count in counter.most_common():
            item = {key_name: key, "count": count, "share": _share(count, total)}
            if label_map is not None:
                item["label"] = label_map.get(key, key)
            rows_out.append(item)
        return rows_out

    def grouped_prices(groups, label_map, key_name):
        out = []
        for key, values in groups.items():
            stats = price_stats(values)
            if not stats:
                continue
            item = {key_name: key, **stats}
            if label_map is not None:
                item["label"] = label_map.get(key, key)
            out.append(item)
        out.sort(key=lambda item: item["n"], reverse=True)
        return out

    known_power = [row for row in usable if row["power_known"]]
    return {
        "jobs": total,
        "sheets": [{"sheet": name, "jobs": count} for name, count in sheets.most_common()],
        "vehicle_models": [
            {"model": name, "count": count, "share": _share(count, total)}
            for name, count in models.most_common(30)
        ],
        "vehicle_classes": counter_rows(classes, CLASS_LABEL, "vehicle_class"),
        "stains": counter_rows(stains, STAIN_LABEL, "stain"),
        "scopes": counter_rows(scopes, SCOPE_LABEL, "scope"),
        "services": counter_rows(services, SERVICE_LABEL, "service"),
        "prefectures": [
            {"prefecture": name, "count": count, "share": _share(count, total)}
            for name, count in regions.most_common()
        ],
        "unlocated_jobs": sum(1 for row in usable if not row["prefecture"]),
        "prices": {
            "overall": price_stats(prices),
            "by_scope": grouped_prices(by_scope, SCOPE_LABEL, "scope"),
            "by_stain": grouped_prices(by_stain, STAIN_LABEL, "stain"),
            "by_vehicle_class": grouped_prices(by_class, CLASS_LABEL, "vehicle_class"),
            "large_quote_jobs": sum(1 for row in usable if row["large_quote"]),
        },
        "flags": {
            "insurance_share": _share(sum(1 for row in usable if row["insurance"]), total),
            "third_party_share": _share(sum(1 for row in usable if row["third_party"]), total),
            "child_share": _share(sum(1 for row in usable if row["child"]), total),
            "elder_share": _share(sum(1 for row in usable if row["elder"]), total),
            "ozone_share": _share(sum(1 for row in usable if row["ozone"]), total),
            "leather_share": _share(sum(1 for row in usable if row["leather"]), total),
            "ceiling_share": _share(sum(1 for row in usable if row["ceiling"]), total),
            "ac_share": _share(sum(1 for row in usable if row["ac"]), total),
            "pet_hair_share": _share(sum(1 for row in usable if row["pet_hair"]), total),
            "power_unavailable_share": _share(
                sum(1 for row in known_power if row["power_no"]),
                len(known_power),
            ),
            "power_known_jobs": len(known_power),
        },
        "common_patterns": patterns[:15],
    }


def build_knowledge(classified: list[dict], sheets_seen: list[str]) -> dict:
    orders = [row for row in classified if row and row["segment"] == "orders"]
    reservations = [row for row in classified if row and row["segment"] == "reservations"]
    order_stats = aggregate(orders)
    guides = [
        pattern["answer_guide"]
        for pattern in order_stats["common_patterns"]
        if pattern["stain"] != "none" or pattern["scope"] in {"deadening", "glass", "truck_cab"}
    ][:8]
    return {
        "schema_version": 1,
        "privacy": (
            "Aggregate only. Prefecture is the finest location. "
            "Names, phones, emails, postal codes, street addresses, and free-text notes are not stored."
        ),
        "use": "Internal chatbot grounding. Do not publish on the site or commit this file.",
        "source_sheets_present": sheets_seen,
        "sheets_used": sorted(ORDER_SHEETS) + sorted(RESERVATION_SHEETS),
        "sheets_excluded": SKIP_REASONS,
        "rate_card_yen": {
            "note": "価格 sheet menu, tax included. Deodorize is extra for vomit, urine, feces, blood, kerosene, flood, pet, and tobacco.",
            "menu": MENU,
        },
        "orders": order_stats,
        "reservations": aggregate(reservations),
        "answer_policy": [
            "見積はメニューを先に出し、件数3件以上の中央値があるときだけ実勢の幅を添える。",
            "嘔吐・尿・便・血液・灯油・水没・ペット・タバコは消臭を別料金にする。灯油は1席30,000円。",
            "保険案件は作業範囲と実費の説明を先にし、保険会社名や担当者名は答えない。",
            "電源が無い駐車場は発電機持込5,000円を確認する。",
            "氏名、電話、メール、郵便番号、通りの住所、建物名は回答にもログの再利用にも出さない。地域は都道府県まで。",
        ],
        "answer_guides": guides,
    }


def _col_index(cell_ref: str) -> int:
    match = re.match(r"[A-Z]+", cell_ref or "")
    if not match:
        return 0
    index = 0
    for char in match.group(0):
        index = index * 26 + (ord(char) - 64)
    return index - 1


def _cell_text(cell, shared: list[str]) -> str:
    kind = cell.attrib.get("t")
    if kind == "inlineStr":
        return "".join(node.text or "" for node in cell.iter(f"{{{NS['m']}}}t"))
    value = cell.find("m:v", NS)
    if value is None or value.text is None:
        return ""
    if kind == "s":
        try:
            return shared[int(value.text)]
        except (IndexError, ValueError):
            return ""
    return value.text


def read_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    strings = []
    for item in root.findall("m:si", NS):
        strings.append("".join(node.text or "" for node in item.iter(f"{{{NS['m']}}}t")))
    return strings


def sheet_paths(archive: zipfile.ZipFile) -> list[tuple[str, str]]:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {}
    for rel in rels.findall("r:Relationship", REL_NS):
        target = rel.attrib.get("Target", "")
        if not target.startswith("xl/"):
            target = "xl/" + target.lstrip("/")
        targets[rel.attrib.get("Id")] = target
    sheets = []
    for sheet in workbook.findall("m:sheets/m:sheet", NS):
        name = sheet.attrib.get("name", "")
        rel_id = sheet.attrib.get(f"{{{WB_REL}}}id")
        path = targets.get(rel_id)
        if path:
            sheets.append((name, path))
    return sheets


def read_sheet_rows(archive: zipfile.ZipFile, path: str, shared: list[str], sheet_name: str, segment: str):
    root = ET.fromstring(archive.read(path))
    header_map = None
    rows = []
    for row in root.findall("m:sheetData/m:row", NS):
        values = {}
        for cell in row.findall("m:c", NS):
            ref = cell.attrib.get("r", "")
            values[_col_index(ref)] = _cell_text(cell, shared)
        if not any(str(value).strip() for value in values.values()):
            continue
        if header_map is None:
            labels = {norm_header(value) for value in values.values()}
            if "車種" in labels or "車種（サイズ）" in labels or "車種(サイズ)" in labels:
                header_map = {}
                for index, value in values.items():
                    label = norm_header(value)
                    if label in BLOCKED_HEADERS:
                        continue
                    field = HEADER_FIELDS.get(label)
                    if field and field not in header_map.values():
                        header_map[index] = field
            continue
        record = {"sheet": sheet_name, "segment": segment}
        for index, field in header_map.items():
            record[field] = values.get(index, "")
        if any(str(record.get(key) or "").strip() for key in ("request", "vehicle", "hearing", "note", "quote", "revenue")):
            rows.append(record)
    return rows


def load_workbook(path: Path):
    with zipfile.ZipFile(path) as archive:
        shared = read_shared_strings(archive)
        present = []
        records = []
        for name, sheet_path in sheet_paths(archive):
            present.append(name)
            if name in ORDER_SHEETS:
                segment = "orders"
            elif name in RESERVATION_SHEETS:
                segment = "reservations"
            else:
                continue
            records.extend(read_sheet_rows(archive, sheet_path, shared, name, segment))
    return present, records


def dedupe(rows: list[dict]) -> tuple[list[dict], int]:
    seen = set()
    kept = []
    removed = 0
    for row in rows:
        if row is None:
            continue
        key = (
            row["sheet"],
            row["segment"],
            row["order_date"],
            row["hope_date"],
            row["model"] or "",
            row["vehicle_class"],
            row["primary_stain"],
            row["scope"],
            row["prefecture"] or "",
            row["quote"] or 0,
            row["revenue"] or 0,
        )
        if key in seen:
            removed += 1
            continue
        seen.add(key)
        public = {key: value for key, value in row.items() if key not in {"order_date", "hope_date"}}
        kept.append(public)
    return kept, removed


def assert_safe_tree(value, trail="root"):
    if isinstance(value, dict):
        for key, item in value.items():
            assert_safe_tree(key, trail)
            assert_safe_tree(item, f"{trail}.{key}")
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            assert_safe_tree(item, f"{trail}[{index}]")
        return
    if value is None or isinstance(value, (int, float, bool)):
        return
    text = str(value)
    if PHONE_RE.search(text) or EMAIL_RE.search(text) or POSTAL_RE.search(text) or LONG_DIGIT_RE.search(text):
        raise ValueError(f"Refusing to write contact-like data at {trail}")
    if "@" in text or "丁目" in text or "番地" in text or "様" in text:
        raise ValueError(f"Refusing to write identifying text at {trail}")
    if len(text) > 400:
        raise ValueError(f"Refusing to write a long free-text field at {trail}")


def assert_internal_output(out_path: Path, root: Path):
    resolved = out_path.resolve()
    for name in ("src", "public", "dist"):
        blocked = (root / name).resolve()
        if resolved == blocked or blocked in resolved.parents:
            raise ValueError(f"Refusing to write chatbot knowledge into {name}/")
    return resolved


def write_knowledge(payload: dict, out_path: Path, root: Path):
    assert_safe_tree(payload)
    target = assert_internal_output(out_path, root)
    target.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    assert_safe_tree(json.loads(text))
    target.write_text(text + "\n", encoding="utf-8")
    os.chmod(target, stat.S_IRUSR | stat.S_IWUSR)
    return target


def build_from_xlsx(xlsx_path: Path) -> dict:
    present, records = load_workbook(xlsx_path)
    classified = [classify_row(record) for record in records]
    deduped, removed = dedupe([row for row in classified if row])
    payload = build_knowledge(deduped, present)
    payload["row_flow"] = {
        "rows_with_a_kept_column": len(records),
        "rows_classified": sum(1 for row in classified if row),
        "duplicates_removed": removed,
        "jobs_in_output": payload["orders"]["jobs"] + payload["reservations"]["jobs"],
    }
    assert_safe_tree(payload)
    return payload


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build anonymized internal chatbot knowledge from an order workbook.")
    parser.add_argument("--xlsx", required=True, help="Private workbook path. The file is not copied into the repo.")
    parser.add_argument(
        "--out",
        default="tools/chatbot-knowledge/output/knowledge.json",
        help="Gitignored JSON path. Refuses src/, public/, and dist/.",
    )
    args = parser.parse_args(argv)
    root = Path(__file__).resolve().parents[2]
    payload = build_from_xlsx(Path(args.xlsx))
    target = write_knowledge(payload, Path(args.out), root)
    orders = payload["orders"]["jobs"]
    reservations = payload["reservations"]["jobs"]
    print(f"Wrote internal knowledge for {orders} order jobs and {reservations} reservation jobs to {target}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
