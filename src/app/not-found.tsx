import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="section-card w-full max-w-xl px-8 py-14 text-center">
        <span className="section-label">页面不存在</span>
        <h1 className="mt-6 font-serif text-4xl text-foreground">没有找到这个页面</h1>
        <p className="mt-4 text-base leading-8 text-foreground-muted">
          你访问的内容可能已经被移动，或者这个产品暂时不可见。
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className="primary-button">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
