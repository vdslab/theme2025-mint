import json

# 元データを読み込む
with open("precure.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 並び順の定義
SERIES_ORDER = [
    "Futari wa Pretty Cure",
    "Futari wa Pretty Cure Max Heart",
    "Futari wa Pretty Cure Splash Star",
    "Yes! Pretty Cure 5",
    "Yes! Pretty Cure 5 GoGo!",
    "Fresh Pretty Cure!",
    "HeartCatch Pretty Cure!",
    "Suite Pretty Cure♪",
    "Smile Pretty Cure!",
    "Doki Doki! Pretty Cure",
    "Happiness Charge Pretty Cure!",
    "Go! Princess Pretty Cure",
    "Mahou Tsukai Pretty Cure!",
    "KiraKira☆Pretty Cure A La Mode",
    "HUGtto! Pretty Cure",
    "Star☆Twinkle Pretty Cure",
    "Healin' Good♥Pretty Cure",
    "Tropical-Rouge! Pretty Cure",
    "Delicious Party♡Pretty Cure",
    "Hirogaru Sky! Pretty Cure",
    "Wonderful Precure!"
]

series_index = {name: i for i, name in enumerate(SERIES_ORDER)}

# ソート用関数
def first_series_order(seasons):
    if not seasons:
        return float("inf")
    return min(series_index.get(s, float("inf")) for s in seasons)

# ソート実行
data_sorted = sorted(
    data,
    key=lambda row: first_series_order(row.get("season"))
)

# 結果を書き出す
with open("precure_sorted.json", "w", encoding="utf-8") as f:
    json.dump(data_sorted, f, ensure_ascii=False, indent=2)

print("完了: precure_sorted.json を生成しました")
