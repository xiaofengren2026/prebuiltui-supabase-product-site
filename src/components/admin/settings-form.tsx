"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import { uploadImage } from "@/lib/image-upload";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";
import { toSettingsFormValues } from "@/lib/utils";

type SettingsFormProps = {
  settings: SiteSettings;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(toSettingsFormValues(settings));
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleHeroImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setStatus("");

    try {
      const url = await uploadImage(file, "hero", form.brand_name || "brand");
      updateField("hero_image", url);
      setStatus("首页主图上传完成。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "首页主图上传失败。");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      const supabase = createBrowserSupabaseClient();
      const payload = {
        ...form,
        updated_at: new Date().toISOString(),
      };

      if (settings.id) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", settings.id);

        if (error) {
          setStatus(error.message || "保存设置失败。");
          return;
        }
      } else {
        const { error } = await supabase.from("site_settings").insert(payload);

        if (error) {
          setStatus(error.message || "保存设置失败。");
          return;
        }
      }

      setStatus("网站设置已保存。");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "保存失败，请稍后再试。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">基础信息</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-foreground">
            品牌名
            <input
              className="field-input"
              value={form.brand_name}
              onChange={(event) => updateField("brand_name", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            联系邮箱
            <input
              type="email"
              className="field-input"
              value={form.contact_email}
              onChange={(event) => updateField("contact_email", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">首页 Hero 区</h2>
        <div className="mt-5 grid gap-5">
          <label className="grid gap-2 text-sm text-foreground">
            首页大标题
            <input
              className="field-input"
              value={form.hero_title}
              onChange={(event) => updateField("hero_title", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            首页副标题
            <textarea
              rows={4}
              className="field-input"
              value={form.hero_subtitle}
              onChange={(event) => updateField("hero_subtitle", event.target.value)}
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-foreground">
              主按钮文字
              <input
                className="field-input"
                value={form.hero_primary_button_text}
                onChange={(event) => updateField("hero_primary_button_text", event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground">
              次按钮文字
              <input
                className="field-input"
                value={form.hero_secondary_button_text}
                onChange={(event) => updateField("hero_secondary_button_text", event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_320px]">
            <label className="grid gap-2 text-sm text-foreground">
              首页主图地址
              <input
                className="field-input"
                value={form.hero_image}
                onChange={(event) => updateField("hero_image", event.target.value)}
              />
            </label>

            <label className="primary-button cursor-pointer self-end">
              {uploading ? "上传中..." : "上传首页主图"}
              <input type="file" accept="image/*" hidden onChange={handleHeroImageUpload} />
            </label>
          </div>

          <div className="section-card overflow-hidden">
            <div className="h-64">
              <ResponsiveImage src={form.hero_image} alt="首页主图预览" fallbackLabel="首页主图预览" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">品牌介绍</h2>
        <div className="mt-5 grid gap-5">
          <label className="grid gap-2 text-sm text-foreground">
            标题
            <input
              className="field-input"
              value={form.brand_intro_title}
              onChange={(event) => updateField("brand_intro_title", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            正文
            <textarea
              rows={6}
              className="field-input"
              value={form.brand_intro_text}
              onChange={(event) => updateField("brand_intro_text", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">品牌卖点</h2>
        <div className="mt-5 grid gap-5">
          {[
            ["feature_1_title", "feature_1_text", "卖点 1"],
            ["feature_2_title", "feature_2_text", "卖点 2"],
            ["feature_3_title", "feature_3_text", "卖点 3"],
          ].map(([titleKey, textKey, label]) => (
            <div key={label} className="grid gap-4 rounded-3xl border border-border px-4 py-4">
              <label className="grid gap-2 text-sm text-foreground">
                {label} 标题
                <input
                  className="field-input"
                  value={form[titleKey as keyof typeof form] as string}
                  onChange={(event) =>
                    updateField(titleKey as keyof typeof form, event.target.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm text-foreground">
                {label} 正文
                <textarea
                  rows={3}
                  className="field-input"
                  value={form[textKey as keyof typeof form] as string}
                  onChange={(event) =>
                    updateField(textKey as keyof typeof form, event.target.value)
                  }
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">联系方式与 Footer</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-foreground">
            Instagram 链接
            <input
              className="field-input"
              value={form.instagram_url}
              onChange={(event) => updateField("instagram_url", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            Kakao 链接
            <input
              className="field-input"
              value={form.kakao_url}
              onChange={(event) => updateField("kakao_url", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground md:col-span-2">
            WhatsApp 链接
            <input
              className="field-input"
              value={form.whatsapp_url}
              onChange={(event) => updateField("whatsapp_url", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground md:col-span-2">
            Footer 文案
            <textarea
              rows={4}
              className="field-input"
              value={form.footer_text}
              onChange={(event) => updateField("footer_text", event.target.value)}
            />
          </label>
        </div>
      </section>

      {status ? (
        <div className="rounded-2xl border border-border bg-white/24 px-4 py-3 text-sm text-accent">
          {status}
        </div>
      ) : null}

      <div>
        <button type="submit" disabled={saving} className="primary-button disabled:opacity-60">
          {saving ? "保存中..." : "保存网站设置"}
        </button>
      </div>
    </form>
  );
}
