import json

# 読み込み
with open("aaaaa.json", "r", encoding="utf-8") as f:
    base_data = json.load(f)

with open("bbbbb.json", "r", encoding="utf-8") as f:
    scores_data = json.load(f)

# name -> scores の辞書を作る
scores_map = {
    item["name"]: item["scores"]
    for item in scores_data
}

# マージ処理
not_found = []
for char in base_data:
    name = char.get("name")

    if name in scores_map:
        char["scores"] = scores_map[name]
    else:
        char["scores"] = None
        not_found.append(name)

# 保存
with open("precure_profile_with_scores.json", "w", encoding="utf-8") as f:
    json.dump(base_data, f, ensure_ascii=False, indent=2)

# ログ
print("✅ マージ完了: precure_profile_with_scores.json を生成")
if not_found:
    print("⚠ scores が見つからなかったキャラ:")
    for n in not_found:
        print(" -", n)
