"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Database } from "@/lib/database.types";
import type { Product } from "@/lib/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

type ProductsTableProps = {
  initialProducts: Product[];
};

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function toggleField(product: Product, field: "is_active" | "is_featured") {
    setBusyId(product.id);
    setMessage("");

    try {
      const supabase = createBrowserSupabaseClient();
      const nextValue = !product[field];
      const updates: Pick<
        Database["public"]["Tables"]["products"]["Update"],
        "is_active" | "is_featured"
      > = {
        [field]: nextValue,
      } as Pick<
        Database["public"]["Tables"]["products"]["Update"],
        "is_active" | "is_featured"
      >;
      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", product.id);

      if (error) {
        setMessage(error.message || "更新失败。");
        return;
      }

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, [field]: nextValue } : item,
        ),
      );
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(`确认删除“${product.name}”吗？`);
    if (!confirmed) {
      return;
    }

    setBusyId(product.id);
    setMessage("");

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from("products").delete().eq("id", product.id);

      if (error) {
        setMessage(error.message || "删除失败。");
        return;
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="section-card overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <h2 className="font-serif text-2xl text-foreground">产品列表</h2>
          <p className="mt-2 text-sm text-foreground-muted">可以在这里查看、编辑和删除产品。</p>
        </div>
        <Link href="/admin/products/new" className="primary-button px-4 py-2 text-sm">
          新增产品
        </Link>
      </div>

      {message ? (
        <div className="border-b border-border bg-white/20 px-6 py-3 text-sm text-accent">
          {message}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/16 text-foreground-muted">
            <tr>
              <th className="px-6 py-4 font-medium">产品</th>
              <th className="px-6 py-4 font-medium">价格</th>
              <th className="px-6 py-4 font-medium">上架</th>
              <th className="px-6 py-4 font-medium">推荐</th>
              <th className="px-6 py-4 font-medium">排序</th>
              <th className="px-6 py-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border/80">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{product.name}</div>
                  <div className="mt-1 text-xs text-foreground-muted">{product.slug}</div>
                </td>
                <td className="px-6 py-4 text-foreground">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => toggleField(product, "is_active")}
                    disabled={busyId === product.id}
                    className={`rounded-full px-3 py-1 text-xs ${
                      product.is_active
                        ? "bg-accent text-button-text"
                        : "bg-tag text-foreground-muted"
                    }`}
                  >
                    {product.is_active ? "已上架" : "已下架"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => toggleField(product, "is_featured")}
                    disabled={busyId === product.id}
                    className={`rounded-full px-3 py-1 text-xs ${
                      product.is_featured
                        ? "bg-accent text-button-text"
                        : "bg-tag text-foreground-muted"
                    }`}
                  >
                    {product.is_featured ? "已推荐" : "普通"}
                  </button>
                </td>
                <td className="px-6 py-4 text-foreground">{product.sort_order}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="secondary-button px-4 py-2 text-xs"
                    >
                      编辑
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product)}
                      disabled={busyId === product.id}
                      className="rounded-full border border-border px-4 py-2 text-xs text-accent transition hover:bg-white/25 disabled:opacity-60"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
