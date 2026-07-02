export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="section-card flex items-center gap-4 px-6 py-5">
        <div className="h-3 w-3 animate-pulse rounded-full bg-accent" />
        <p className="text-sm text-foreground-muted">页面加载中...</p>
      </div>
    </div>
  );
}
