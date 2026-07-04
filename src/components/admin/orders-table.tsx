"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Order } from "@/lib/types";
import { formatCurrency, joinTextList } from "@/lib/utils";

const PAYMENT_STATUS_OPTIONS = ["未付款", "已付款", "已退款"] as const;
const SHIPPING_STATUS_OPTIONS = ["未发货", "已发货"] as const;
const LOCAL_ORDER_STORAGE_KEY = "qinglan-local-orders";

type OrdersTableProps = {
  initialOrders: Order[];
};

type EditableOrderField =
  | "payment_status"
  | "shipping_status"
  | "tracking_company"
  | "tracking_number"
  | "admin_note";

function readLocalOrders() {
  if (typeof window === "undefined") {
    return [];
  }

  const existing = window.localStorage.getItem(LOCAL_ORDER_STORAGE_KEY);
  if (!existing) {
    return [];
  }

  try {
    const parsed = JSON.parse(existing) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalOrders(orders: Order[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_ORDER_STORAGE_KEY, JSON.stringify(orders));
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const localOrders = readLocalOrders();
    if (localOrders.length === 0) {
      return;
    }

    setOrders((current) => {
      const ids = new Set(current.map((item) => item.order_id));
      const merged = [...current];

      localOrders.forEach((item) => {
        if (!ids.has(item.order_id)) {
          merged.unshift(item);
        }
      });

      return merged;
    });
  }, []);

  function updateLocalOrder(id: string, field: EditableOrderField, value: string) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, [field]: value, updated_at: new Date().toISOString() } : order,
      ),
    );
  }

  async function saveOrder(order: Order) {
    setBusyId(order.id);
    setMessage("");

    if (order.id.startsWith("local-")) {
      const localOrders = readLocalOrders().map((item) =>
        item.id === order.id ? { ...order, updated_at: new Date().toISOString() } : item,
      );
      writeLocalOrders(localOrders);
      setMessage(`本地订单 ${order.order_id} 已保存。`);
      setBusyId(null);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: order.payment_status,
          shipping_status: order.shipping_status,
          tracking_company: order.tracking_company || null,
          tracking_number: order.tracking_number || null,
          admin_note: order.admin_note || null,
        })
        .eq("id", order.id);

      if (error) {
        setMessage(error.message || "订单更新失败。");
        return;
      }

      setMessage(`订单 ${order.order_id} 已保存。`);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteOrder(order: Order) {
    const confirmed = window.confirm(`确认删除订单 ${order.order_id} 吗？`);
    if (!confirmed) {
      return;
    }

    setBusyId(order.id);
    setMessage("");

    if (order.id.startsWith("local-")) {
      const nextLocalOrders = readLocalOrders().filter((item) => item.id !== order.id);
      writeLocalOrders(nextLocalOrders);
      setOrders((current) => current.filter((item) => item.id !== order.id));
      setMessage(`本地订单 ${order.order_id} 已删除。`);
      setBusyId(null);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from("orders").delete().eq("id", order.id);

      if (error) {
        setMessage(error.message || "订单删除失败。");
        return;
      }

      setOrders((current) => current.filter((item) => item.id !== order.id));
      setMessage(`订单 ${order.order_id} 已删除。`);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="还没有订单"
        description="前台提交订单后会显示在这里。即使数据库未连接，也会优先读取本地暂存订单。"
      />
    );
  }

  return (
    <div className="section-card overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <h2 className="font-serif text-2xl text-foreground">订单列表</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          在这里手动维护付款状态、发货状态、快递信息和订单备注。
        </p>
      </div>

      {message ? (
        <div className="border-b border-border bg-white/18 px-6 py-3 text-sm text-accent">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 p-4 md:p-6">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[28px] border border-border bg-white/10 p-5">
            <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
              <div className="grid gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-foreground-muted">
                      {order.order_id}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-foreground">{order.product_name}</h3>
                  </div>
                  <span className="text-sm font-semibold text-accent">
                    {formatCurrency(order.price)}
                  </span>
                </div>

                <div className="grid gap-3 text-sm text-foreground-muted">
                  <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
                    <span>客户</span>
                    <span className="text-right text-foreground">{order.customer_name}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
                    <span>联系方式</span>
                    <span className="text-right text-foreground">
                      {order.email}
                      <br />
                      {order.phone}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
                    <span>地址</span>
                    <span className="text-right text-foreground">{order.address}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
                    <span>分类 / 材质</span>
                    <span className="text-right text-foreground">
                      {joinTextList(order.category, "、")}
                      {!!order.materials.length ? ` / ${joinTextList(order.materials, "、")}` : ""}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
                    <span>支付预留</span>
                    <span className="text-right text-foreground">
                      {order.payment_method}
                      <br />
                      {order.payment_id || "尚未生成 paymentId"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
                    <span>客户备注</span>
                    <span className="text-right text-foreground">{order.note || "无"}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    付款状态
                    <select
                      className="field-input"
                      value={order.payment_status}
                      onChange={(event) =>
                        updateLocalOrder(order.id, "payment_status", event.target.value)
                      }
                    >
                      {PAYMENT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    发货状态
                    <select
                      className="field-input"
                      value={order.shipping_status}
                      onChange={(event) =>
                        updateLocalOrder(order.id, "shipping_status", event.target.value)
                      }
                    >
                      {SHIPPING_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    快递公司
                    <input
                      className="field-input"
                      value={order.tracking_company || ""}
                      onChange={(event) =>
                        updateLocalOrder(order.id, "tracking_company", event.target.value)
                      }
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    快递单号
                    <input
                      className="field-input"
                      value={order.tracking_number || ""}
                      onChange={(event) =>
                        updateLocalOrder(order.id, "tracking_number", event.target.value)
                      }
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm text-foreground">
                  订单备注
                  <textarea
                    rows={5}
                    className="field-input"
                    value={order.admin_note || ""}
                    onChange={(event) => updateLocalOrder(order.id, "admin_note", event.target.value)}
                  />
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-foreground-muted">
                    创建时间：{new Date(order.created_at).toLocaleString("zh-CN")}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => deleteOrder(order)}
                      disabled={busyId === order.id}
                      className="rounded-full border border-border px-4 py-2 text-sm text-accent transition hover:bg-white/20 disabled:opacity-60"
                    >
                      {busyId === order.id ? "处理中..." : "删除订单"}
                    </button>
                    <button
                      type="button"
                      onClick={() => saveOrder(order)}
                      disabled={busyId === order.id}
                      className="primary-button px-4 py-2 text-sm disabled:opacity-60"
                    >
                      {busyId === order.id ? "处理中..." : "保存订单"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
