# prebuiltui-supabase-product-site

一个全新的产品展示网站项目，前台用于展示产品，后台用于管理产品、首页文案、联系方式和图片。

## 已实现

- Next.js 16 + Tailwind CSS 4
- 东方淡绿色 + 水墨灰的完整前台风格
- 产品列表首页
- 产品详情页
- `/admin/login` 后台登录页
- `/admin/dashboard` 后台首页
- `/admin/products` 产品管理页
- `/admin/products/new` 新增产品页
- `/admin/products/[id]/edit` 编辑产品页
- `/admin/settings` 网站设置页
- Supabase Database / Storage / Auth 接口层
- Cloudflare OpenNext 配置文件

## 本地运行

1. 复制 `.env.local.example` 为 `.env.local`
2. 填写 Supabase 环境变量
3. 安装依赖
4. 运行开发环境

推荐命令：

```bash
pnpm install
pnpm dev
```

标准构建：

```bash
pnpm build
```

## Cloudflare 部署说明

当前项目已经带上：

- `open-next.config.ts`
- `wrangler.jsonc`
- `preview` / `deploy` / `cf-typegen` 脚本

注意：

- 这是一个带后台登录和动态数据的 Next.js 项目。
- Cloudflare 当前官方文档对这类项目推荐的是 **Workers + OpenNext** 路线。
- 在 Windows 本地，`opennextjs-cloudflare build` 可能因为符号链接权限报错；用 WSL、Linux 或 Cloudflare CI 更稳。

## Supabase 文件

- `supabase/schema.sql`
- `supabase/storage.sql`
- `.env.local.example`
