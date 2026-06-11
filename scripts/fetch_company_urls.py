import os
import time
import requests
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.environ['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_KEY = os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY']
GOOGLE_API_KEY = os.environ['GOOGLE_CUSTOM_SEARCH_API_KEY']
GOOGLE_CX = os.environ['GOOGLE_CUSTOM_SEARCH_CX']

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def search_company_url(company_name: str, pref: str) -> str | None:
    """会社名でGoogle検索してURLを取得"""
    query = f"{company_name} {pref} 公式サイト"
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_API_KEY,
        "cx": GOOGLE_CX,
        "q": query,
        "num": 1,
        "gl": "jp",
        "hl": "ja",
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        data = res.json()
        if "items" in data and len(data["items"]) > 0:
            return data["items"][0]["link"]
        return None
    except Exception as e:
        print(f"検索エラー: {company_name} - {e}")
        return None

def fetch_all():
    """URL未登録の会社を取得してURLを補完"""
    # URL未登録の会社を取得（100件ずつ処理）
    offset = 0
    batch_size = 100
    total_updated = 0

    while True:
        result = supabase.table("companies")\
            .select("id, name, pref, city")\
            .or_("url.is.null,url.eq.")\
            .range(offset, offset + batch_size - 1)\
            .execute()

        companies = result.data
        if not companies:
            break

        print(f"\n処理中: {offset + 1} 〜 {offset + len(companies)} 件目")

        for company in companies:
            name = company['name']
            pref = company.get('pref', '')

            print(f"  検索中: {name} ({pref})")
            found_url = search_company_url(name, pref)

            if found_url:
                supabase.table("companies")\
                    .update({"url": found_url})\
                    .eq("id", company["id"])\
                    .execute()
                print(f"  ✅ 取得: {found_url}")
                total_updated += 1
            else:
                print(f"  ❌ 見つからず")

            # APIレート制限対策（1秒待機）
            time.sleep(1)

        offset += batch_size
        print(f"累計更新: {total_updated}件")

    print(f"\n完了！合計 {total_updated} 件のURLを更新しました。")

if __name__ == "__main__":
    fetch_all()
