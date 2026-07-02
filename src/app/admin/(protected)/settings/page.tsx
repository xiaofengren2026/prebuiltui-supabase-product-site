import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-6">
      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">网站设置</h2>
        <p className="mt-3 text-sm leading-7 text-foreground-muted">
          首页大标题、副标题、主图、品牌介绍、卖点和联系方式都从这里管理，不需要再改代码。
        </p>
      </section>

      <SettingsForm settings={settings} />
    </div>
  );
}
