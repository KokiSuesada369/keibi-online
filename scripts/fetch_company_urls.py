import os
import re
import sys
import time
import random
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
    # 警備協会・業界団体（会員検索ページ）
    'hssa.or.jp', 'ksa.or.jp', 'css-s.or.jp', 'npa.go.jp',
    'keibikyo.or.jp', 'security.or.jp',
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'ja,en;q=0.9',
}

SLEEP_BASE = 10        # 通常インターバル（秒）
SLEEP_RATE_LIMIT = 120 # レート制限検知時の待機（秒）
MAX_RETRIES = 3        # 検索リトライ回数


def normalize_name(name: str) -> str:
    return re.sub(r'(株式会社|有限会社|合同会社|一般社団法人|公益財団法人)\s*', '', name).strip()


def is_excluded(url: str) -> bool:
    return any(domain in url for domain in EXCLUDE_DOMAINS)


def get_page_title(url: str) -> str | None:
    try:
        res = requests.get(url, headers=HEADERS, timeout=6, allow_redirects=True)
        if res.status_code != 200:
            return None
        res.encoding = res.apparent_encoding
        match = re.search(r'<title[^>]*>(.*?)</title>', res.text, re.IGNORECASE | re.DOTALL)
        if match:
            return re.sub(r'\s+', ' ', match.group(1)).strip()
        return None
    except Exception:
        return None


def is_company_page(url: str, company_name: str) -> bool:
    title = get_page_title(url)
    if not title:
        return False
    core = normalize_name(company_name)
    return core in title


def ddgs_search(query: str, max_results: int = 5) -> list:
    """DDGSで検索。レート制限エラー時は待機してリトライ"""
    for attempt in range(MAX_RETRIES):
        try:
            with DDGS() as ddgs:
                return list(ddgs.text(query, max_results=max_results))
        except Exception as e:
            err = str(e)
            if 'startpage' in err or 'RatelimitException' in err or 'rate' in err.lower():
                wait = SLEEP_RATE_LIMIT * (attempt + 1)
                print(f"  [レート制限] {wait}秒待機してリトライ ({attempt+1}/{MAX_RETRIES})...", flush=True)
                time.sleep(wait)
            else:
                print(f"  [検索エラー] {e}", flush=True)
                return []
    return []


def search_company_url(company_name: str, pref: str) -> str | None:
    query = f"{pref} 警備 {company_name}"
    results = ddgs_search(query)
    if not results:
        return None

    candidates = [r['href'] for r in results if not is_excluded(r['href'])]
    for url in candidates:
        if is_company_page(url, company_name):
            return url
    return None


def update_company_url(company_id: int, url: str) -> bool:
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
        print(f"  [更新エラー] {e}", flush=True)
        return False


def fetch_companies_without_url(offset: int, limit: int) -> list:
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
        print(f"取得エラー: {e}", flush=True)
        return []


def fetch_all():
    offset = 0
    batch_size = 100
    total_updated = 0

    while True:
        companies = fetch_companies_without_url(offset, batch_size)
        if not companies:
            print("処理完了（残件なし）", flush=True)
            break

        print(f"\n処理中: {offset + 1} 〜 {offset + len(companies)} 件目", flush=True)

        for company in companies:
            name = company['name']
            pref = company.get('pref', '')

            print(f"  検索中: {name} ({pref})", flush=True)
            found_url = search_company_url(name, pref)

            if found_url:
                success = update_company_url(company["id"], found_url)
                if success:
                    print(f"  [OK] {found_url}", flush=True)
                    total_updated += 1
                else:
                    print(f"  [NG] 更新失敗: {found_url}", flush=True)
            else:
                print(f"  [--] 見つからず", flush=True)

            # ランダムインターバルでレート制限を回避
            sleep_time = SLEEP_BASE + random.uniform(0, 3)
            time.sleep(sleep_time)

        offset += batch_size
        print(f"累計更新: {total_updated}件", flush=True)

    print(f"\n完了！合計 {total_updated} 件のURLを更新しました。")


if __name__ == "__main__":
    fetch_all()
