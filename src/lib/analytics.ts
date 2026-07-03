import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  AnalyticsSummary,
  AnalyticsTopPageItem,
  AnalyticsTopProductItem,
  AnalyticsTrendItem,
  PageView,
} from "@/lib/types";

const BATCH_SIZE = 1000;
const SHANGHAI_TIMEZONE = "Asia/Shanghai";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

type PageViewRow = {
  id?: string;
  path?: string;
  page_type?: string;
  product_id?: string | null;
  product_name?: string | null;
  visitor_id?: string;
  user_agent?: string | null;
  referrer?: string | null;
  created_at?: string;
};

function getShanghaiDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SHANGHAI_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTrendLabel(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00+08:00`);

  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: SHANGHAI_TIMEZONE,
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function getTodayRange() {
  const todayKey = getShanghaiDateKey(new Date());

  return {
    todayKey,
    startIso: new Date(`${todayKey}T00:00:00+08:00`).toISOString(),
    endIso: new Date(`${todayKey}T23:59:59.999+08:00`).toISOString(),
  };
}

function getRecentDateKeys(days: number) {
  const keys: string[] = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    keys.push(getShanghaiDateKey(new Date(Date.now() - index * DAY_IN_MS)));
  }

  return keys;
}

function mapPageViewRow(row: PageViewRow): PageView {
  return {
    id: String(row.id ?? ""),
    path: String(row.path ?? ""),
    page_type: String(row.page_type ?? ""),
    product_id: typeof row.product_id === "string" ? row.product_id : null,
    product_name: typeof row.product_name === "string" ? row.product_name : null,
    visitor_id: String(row.visitor_id ?? ""),
    user_agent: typeof row.user_agent === "string" ? row.user_agent : null,
    referrer: typeof row.referrer === "string" ? row.referrer : null,
    created_at: String(row.created_at ?? ""),
  };
}

async function fetchAllPageViews() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const rows: PageView[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("page_views")
      .select(
        "id, path, page_type, product_id, product_name, visitor_id, user_agent, referrer, created_at",
      )
      .order("created_at", { ascending: false })
      .range(from, from + BATCH_SIZE - 1);

    if (error || !data || data.length === 0) {
      break;
    }

    rows.push(...data.map(mapPageViewRow));

    if (data.length < BATCH_SIZE) {
      break;
    }

    from += BATCH_SIZE;
  }

  return rows;
}

function buildTrend(rows: PageView[]): AnalyticsTrendItem[] {
  const dateKeys = getRecentDateKeys(7);
  const counts = new Map<string, number>(dateKeys.map((dateKey) => [dateKey, 0]));

  rows.forEach((row) => {
    const dateKey = getShanghaiDateKey(new Date(row.created_at));

    if (counts.has(dateKey)) {
      counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
    }
  });

  return dateKeys.map((dateKey) => ({
    date: dateKey,
    label: getTrendLabel(dateKey),
    views: counts.get(dateKey) ?? 0,
  }));
}

function buildTopPages(rows: PageView[]): AnalyticsTopPageItem[] {
  const pageMap = new Map<string, AnalyticsTopPageItem>();

  rows.forEach((row) => {
    const key = `${row.path}::${row.page_type}`;
    const current = pageMap.get(key);

    if (current) {
      current.views += 1;
      return;
    }

    pageMap.set(key, {
      path: row.path,
      page_type: row.page_type,
      views: 1,
    });
  });

  return [...pageMap.values()].sort((left, right) => right.views - left.views).slice(0, 10);
}

function buildTopProducts(rows: PageView[]): AnalyticsTopProductItem[] {
  const productMap = new Map<string, AnalyticsTopProductItem>();

  rows.forEach((row) => {
    if (!row.product_id && !row.product_name) {
      return;
    }

    const key = `${row.product_id ?? "unknown"}::${row.product_name ?? "unknown"}`;
    const current = productMap.get(key);

    if (current) {
      current.views += 1;
      return;
    }

    productMap.set(key, {
      product_id: row.product_id,
      product_name: row.product_name,
      views: 1,
    });
  });

  return [...productMap.values()].sort((left, right) => right.views - left.views).slice(0, 10);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const rows = await fetchAllPageViews();
  const { todayKey } = getTodayRange();
  const todayRows = rows.filter(
    (row) => getShanghaiDateKey(new Date(row.created_at)) === todayKey,
  );

  return {
    todayViews: todayRows.length,
    totalViews: rows.length,
    todayVisitors: new Set(todayRows.map((row) => row.visitor_id)).size,
    totalVisitors: new Set(rows.map((row) => row.visitor_id)).size,
    trend: buildTrend(rows),
    topPages: buildTopPages(rows),
    topProducts: buildTopProducts(rows),
    recentVisits: rows.slice(0, 20),
  };
}

export async function getTodayPageViewCount() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return 0;
  }

  const { startIso, endIso } = getTodayRange();
  const { count } = await supabase
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startIso)
    .lte("created_at", endIso);

  return count ?? 0;
}
