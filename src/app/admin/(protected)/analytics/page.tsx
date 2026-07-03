import { BarChart3, Eye, FileText, Package2, Users } from "lucide-react";

import { getAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatReferrer(value: string | null) {
  if (!value) {
    return "直接访问";
  }

  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
}

function shortenVisitorId(value: string) {
  if (value.length <= 12) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsSummary();
  const maxTrendViews = Math.max(...analytics.trend.map((item) => item.views), 1);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="section-card px-5 py-6">
          <Eye className="text-accent" size={18} />
          <p className="mt-4 text-sm text-foreground-muted">今日浏览量</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{analytics.todayViews}</p>
        </article>
        <article className="section-card px-5 py-6">
          <BarChart3 className="text-accent" size={18} />
          <p className="mt-4 text-sm text-foreground-muted">总浏览量</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{analytics.totalViews}</p>
        </article>
        <article className="section-card px-5 py-6">
          <Users className="text-accent" size={18} />
          <p className="mt-4 text-sm text-foreground-muted">今日访客数</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{analytics.todayVisitors}</p>
        </article>
        <article className="section-card px-5 py-6">
          <Users className="text-accent" size={18} />
          <p className="mt-4 text-sm text-foreground-muted">总访客数</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{analytics.totalVisitors}</p>
        </article>
      </section>

      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">最近 7 天浏览趋势</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-7">
          {analytics.trend.map((item) => (
            <article key={item.date} className="rounded-[24px] border border-border/80 bg-background/70 p-4">
              <p className="text-sm text-foreground-muted">{item.label}</p>
              <div className="mt-4 flex h-36 items-end">
                <div
                  className="w-full rounded-full bg-accent/85 transition-all"
                  style={{
                    height: `${Math.max((item.views / maxTrendViews) * 100, item.views > 0 ? 12 : 0)}%`,
                  }}
                />
              </div>
              <p className="mt-4 font-serif text-3xl text-foreground">{item.views}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="section-card px-6 py-6">
          <div className="flex items-center gap-3">
            <FileText className="text-accent" size={18} />
            <h2 className="font-serif text-2xl text-foreground">热门页面排行</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {analytics.topPages.length > 0 ? (
              analytics.topPages.map((item, index) => (
                <div
                  key={`${item.path}-${item.page_type}`}
                  className="flex items-center justify-between gap-4 rounded-[22px] border border-border/80 bg-background/70 px-4 py-4"
                >
                  <div>
                    <p className="text-sm text-foreground-muted">#{index + 1}</p>
                    <p className="mt-1 text-sm text-foreground">{item.path}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-foreground-muted">
                      {item.page_type}
                    </p>
                  </div>
                  <p className="font-serif text-3xl text-foreground">{item.views}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-foreground-muted">暂时还没有访问数据。</p>
            )}
          </div>
        </article>

        <article className="section-card px-6 py-6">
          <div className="flex items-center gap-3">
            <Package2 className="text-accent" size={18} />
            <h2 className="font-serif text-2xl text-foreground">热门产品排行</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((item, index) => (
                <div
                  key={`${item.product_id ?? "unknown"}-${item.product_name ?? "unknown"}`}
                  className="flex items-center justify-between gap-4 rounded-[22px] border border-border/80 bg-background/70 px-4 py-4"
                >
                  <div>
                    <p className="text-sm text-foreground-muted">#{index + 1}</p>
                    <p className="mt-1 text-sm text-foreground">
                      {item.product_name || "未命名产品"}
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      {item.product_id || "未记录 product_id"}
                    </p>
                  </div>
                  <p className="font-serif text-3xl text-foreground">{item.views}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-foreground-muted">还没有产品访问记录。</p>
            )}
          </div>
        </article>
      </section>

      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">最近访问记录</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-foreground-muted">
              <tr className="border-b border-border/80">
                <th className="px-3 py-3 font-medium">时间</th>
                <th className="px-3 py-3 font-medium">页面</th>
                <th className="px-3 py-3 font-medium">类型</th>
                <th className="px-3 py-3 font-medium">产品</th>
                <th className="px-3 py-3 font-medium">访客</th>
                <th className="px-3 py-3 font-medium">来源</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentVisits.length > 0 ? (
                analytics.recentVisits.map((visit) => (
                  <tr key={visit.id} className="border-b border-border/60 align-top">
                    <td className="px-3 py-4 text-foreground-muted">
                      {formatDateTime(visit.created_at)}
                    </td>
                    <td className="px-3 py-4 text-foreground">{visit.path}</td>
                    <td className="px-3 py-4 text-foreground-muted">{visit.page_type}</td>
                    <td className="px-3 py-4 text-foreground">
                      {visit.product_name || "—"}
                    </td>
                    <td className="px-3 py-4 text-foreground-muted">
                      {shortenVisitorId(visit.visitor_id)}
                    </td>
                    <td className="px-3 py-4 text-foreground-muted">
                      {formatReferrer(visit.referrer)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-foreground-muted">
                    还没有访问记录。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
