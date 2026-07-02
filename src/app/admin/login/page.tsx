import { LoginFormFixed } from "@/components/admin/login-form-fixed";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="section-card w-full max-w-lg px-6 py-8 md:px-8">
        <span className="section-label">/admin 登录</span>
        <h1 className="mt-5 font-serif text-4xl text-foreground">进入网站后台</h1>
        <p className="mt-4 text-sm leading-8 text-foreground-muted">
          使用你在 Supabase Auth 创建的管理员邮箱登录。登录后即可管理产品、首页文案、联系方式和图片。
        </p>
        <div className="mt-8">
          <LoginFormFixed />
        </div>
      </div>
    </main>
  );
}
