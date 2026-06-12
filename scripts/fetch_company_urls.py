import os
import sys
import time
import requests
from dotenv import load_dotenv
from ddgs import DDGS

sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env.local')

SUPABASE_URL = os.environ['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_KEY = os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY']

EXCLUDE_DOMAINS = [
    'baseconnect.in', 'houjin.goo.to', 'ja.wikipedia.org', 'en.wikipedia.org',
    'indeed.com', 'recruit.co.jp', 'mynavi.jp', 'rikunabi.com', 'doda.jp',
    'hello-work.mhlw.go.jp', 'hellowork.mhlw.go.jp', 'jobscouter.com',
    'townwork.net', 'baitoru.com', 'froma.com', 'type.jp', 'en-gage.net',
    'workpro.jp', 'greens.co.jp', 'minagaru.jp', 'kaigo.or.jp',
    'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'youtube.com',
    'keiei-support.com', 'houjinbangou.nta.go.jp', 'nta.go.jp',
    'tnc-net.co.jp', 'j-net21.smrj.go.jp', 'biz-map.jp',
    'minato-search.com', 'telewave.co.jp', 'itp.ne.jp', 'navi-search.com',
    'mapion.co.jp', 'navitime.co.jp', 'google.com', 'goo.ne.jp',
    'itszai.jp', 'clients.itszai.jp',
]

def is_official_url(url: str) -> bool:
    return not any(domain in url for domain in EXCLUDE_DOMAINS)

def search_company_url(company_name: str, pref: str) -> str | None:
    """会社名でDuckDuckGo検索してURLを取得"""
    query = f"{company_name} {pref} 公式サイト"
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
            for r in results:
                if is_official_url(r['href']):
                    return r['href']
        return None
    except Exception as e:
        print(f"検索エラー: {company_name} - {e}")
        return None

def update_company_url(company_id: int, url: str) -> bool:
    """Supabase REST APIで直接URLを更新"""
    endpoint = f"{SUPABASE_URL}/rest/v1/companies?id=eq.{company_id}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    try:
        res = requests.patch(endpoint, json={"url": url}, headers=headers, timeout=10)
        return res.status_code in [200, 204]
    except Exception as e:
        print(f"更新エラー: {e}")
        return False

def fetch_companies_without_url(offset: int, limit: int) -> list:
    """Supabase REST APIでURL未登録の会社を取得"""
    endpoint = f"{SUPABASE_URL}/rest/v1/companies"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    params = {
        "select": "id,name,pref,city",
        "or": "(url.is.null,url.eq.)",
        "offset": offset,
        "limit": limit,
    }
    try:
        res = requests.get(endpoint, headers=headers, params=params, timeout=10)
        return res.json() if res.status_code == 200 else []
    except Exception as e:
        print(f"取得エラー: {e}")
        return []

def fetch_all():
    offset = 0
    batch_size = 100
    total_updated = 0

    while True:
        companies = fetch_companies_without_url(offset, batch_size)
        if not companies:
            break

        print(f"\n処理中: {offset + 1} 〜 {offset + len(companies)} 件目")

        for company in companies:
            name = company['name']
            pref = company.get('pref', '')

            print(f"  検索中: {name} ({pref})")
            found_url = search_company_url(name, pref)

            if found_url:
                success = update_company_url(company["id"], found_url)
                if success:
                    print(f"  [OK] 取得・更新: {found_url}")
                    total_updated += 1
                else:
                    print(f"  [NG] 取得したが更新失敗: {found_url}")
            else:
                print(f"  [--] 見つからず")

            time.sleep(2)

        offset += batch_size
        print(f"累計更新: {total_updated}件")

    print(f"\n完了！合計 {total_updated} 件のURLを更新しました。")

if __name__ == "__main__":
    fetch_all()
