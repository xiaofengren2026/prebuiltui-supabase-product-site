"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import { uploadImage } from "@/lib/image-upload";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import { slugify, splitTextList, toProductFormValues } from "@/lib/utils";

type ProductFormProps = {
  mode: "create" | "edit";
  product?: Product | null;
};

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const initialValues = toProductFormValues(product);
  const [form, setForm] = useState(initialValues);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const slugPreview = slugify(form.name) || "product-slug-preview";

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setUploading(true);
    setStatus("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadImage(file, "products", form.name || "product");
        uploadedUrls.push(url);
      }

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedUrls],
      }));
      setStatus("图片上传完成。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "图片上传失败。");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage(imageUrl: string) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((item) => item !== imageUrl),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const supabase = createBrowserSupabaseClient();
      const payload = {
        name: form.name.trim(),
        slug: slugPreview,
        price: Number(form.price || 0),
        short_description: form.short_description.trim() || null,
        description: form.description.trim() || null,
        material: form.material.trim() || null,
        size: form.size.trim() || null,
        color: form.color.trim() || null,
        tags: splitTextList(form.tags),
        images: form.images,
        is_active: form.is_active,
        is_featured: form.is_featured,
        sort_order: Number(form.sort_order || 0),
      };

      if (mode === "create") {
        const { error } = await supabase.from("products").insert(payload);
        if (error) {
          setStatus(error.message || "新增产品失败。");
          return;
        }
      } else if (product?.id) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);

        if (error) {
          setStatus(error.message || "更新产品失败。");
          return;
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "保存失败，请稍后再试。");
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <section className="section-card px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-foreground">
            产品名称
            <input
              required
              className="field-input"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            价格
            <input
              required
              type="number"
              min="0"
              step="0.01"
              className="field-input"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-white/18 px-4 py-3 text-sm text-foreground-muted">
          产品链接预览：<span className="text-foreground">/products/{slugPreview}</span>
        </div>

        <div className="mt-5 grid gap-5">
          <label className="grid gap-2 text-sm text-foreground">
            简短描述
            <textarea
              rows={3}
              className="field-input"
              value={form.short_description}
              onChange={(event) => updateField("short_description", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            详细描述
            <textarea
              rows={6}
              className="field-input"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="section-card px-6 py-6">
        <div className="grid gap-5 md:grid-cols-3">
          <label className="grid gap-2 text-sm text-foreground">
            材质
            <input
              className="field-input"
              value={form.material}
              onChange={(event) => updateField("material", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            尺寸
            <input
              className="field-input"
              value={form.size}
              onChange={(event) => updateField("size", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            颜色
            <input
              className="field-input"
              value={form.color}
              onChange={(event) => updateField("color", event.target.value)}
            />
          </label>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_200px]">
          <label className="grid gap-2 text-sm text-foreground">
            标签
            <input
              className="field-input"
              placeholder="东方美学, 手作质感, 礼物推荐"
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            排序
            <input
              type="number"
              className="field-input"
              value={form.sort_order}
              onChange={(event) => updateField("sort_order", event.target.value)}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-5">
          <label className="flex items-center gap-3 rounded-full border border-border px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => updateField("is_active", event.target.checked)}
            />
            上架显示
          </label>

          <label className="flex items-center gap-3 rounded-full border border-border px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(event) => updateField("is_featured", event.target.checked)}
            />
            设为推荐
          </label>
        </div>
      </section>

      <section className="section-card px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-foreground">产品图片</h2>
            <p className="mt-2 text-sm text-foreground-muted">
              支持多张图片，上传前会自动压缩到适合展示的尺寸。
            </p>
          </div>

          <label className="primary-button cursor-pointer">
            {uploading ? "上传中..." : "上传图片"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelect}
            />
          </label>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {form.images.length > 0 ? (
            form.images.map((imageUrl) => (
              <div key={imageUrl} className="section-card overflow-hidden">
                <div className="h-52">
                  <ResponsiveImage src={imageUrl} alt={form.name || "产品图片"} />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="truncate text-xs text-foreground-muted">{imageUrl}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(imageUrl)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-accent"
                  >
                    移除
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border px-5 py-10 text-center text-sm text-foreground-muted md:col-span-3">
              还没有上传图片。
            </div>
          )}
        </div>
      </section>

      {status ? (
        <div className="rounded-2xl border border-border bg-white/24 px-4 py-3 text-sm text-accent">
          {status}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="primary-button disabled:opacity-60">
          {submitting ? "保存中..." : mode === "create" ? "新增产品" : "保存修改"}
        </button>
        <Link href="/admin/products" className="secondary-button">
          返回列表
        </Link>
      </div>
    </form>
  );
}
