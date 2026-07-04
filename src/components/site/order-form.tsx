"use client";

import Link from "next/link";
import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Order, Product } from "@/lib/types";
import { formatCurrency, joinTextList } from "@/lib/utils";

type OrderFormProps = {
  product: Product;
};

const LOCAL_ORDER_STORAGE_KEY = "qinglan-local-orders";

function generateOrderId() {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QL-${Date.now().toString().slice(-8)}-${random}`;
}

function saveLocalOrder(order: Order) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = window.localStorage.getItem(LOCAL_ORDER_STORAGE_KEY);
  const currentOrders = existing ? (JSON.parse(existing) as Order[]) : [];
  window.localStorage.setItem(LOCAL_ORDER_STORAGE_KEY, JSON.stringify([order, ...currentOrders]));
}

export function OrderForm({ product }: OrderFormProps) {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const orderId = generateOrderId();
    const fallbackOrder: Order = {
      id: `local-${orderId}`,
      order_id: orderId,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      category: product.category,
      materials: product.materials,
      customer_name: form.customerName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      note: form.note.trim() || null,
      payment_status: "未付款",
      shipping_status: "未发货",
      payment_method: "pending",
      payment_id: null,
      tracking_company: null,
      tracking_number: null,
      admin_note: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from("orders").insert({
        order_id: fallbackOrder.order_id,
        product_id: fallbackOrder.product_id,
        product_name: fallbackOrder.product_name,
        price: fallbackOrder.price,
        category: fallbackOrder.category,
        materials: fallbackOrder.materials,
        customer_name: fallbackOrder.customer_name,
        email: fallbackOrder.email,
        phone: fallbackOrder.phone,
        address: fallbackOrder.address,
        note: fallbackOrder.note,
        payment_status: fallbackOrder.payment_status,
        shipping_status: fallbackOrder.shipping_status,
        payment_method: fallbackOrder.payment_method,
        payment_id: fallbackOrder.payment_id,
      });

      if (error) {
        saveLocalOrder(fallbackOrder);
        setMessage("订单已暂存到本地，可继续测试完整流程。");
      } else {
        setMessage("订单已提交，我们会尽快与你联系。");
      }

      setSuccessOrderId(orderId);
      setForm({
        customerName: "",
        email: "",
        phone: "",
        address: "",
        note: "",
      });
    } catch {
      saveLocalOrder(fallbackOrder);
      setSuccessOrderId(orderId);
      setMessage("当前数据库未连接，订单已自动保存到本地。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="section-card px-6 py-7 md:px-7">
        <p className="section-label">订单确认</p>
        <h2 className="mt-4 font-serif text-3xl text-foreground">{product.name}</h2>
        <p className="mt-4 text-2xl font-semibold text-accent">{formatCurrency(product.price)}</p>

        <div className="mt-6 grid gap-3 text-sm text-foreground-muted">
          <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
            <span>分类</span>
            <span className="text-right text-foreground">{joinTextList(product.category, "、")}</span>
          </div>
          <div className="flex items-start justify-between gap-3 border-t border-border/80 pt-3">
            <span>材质</span>
            <span className="text-right text-foreground">
              {joinTextList(product.materials, "、") || "待确认"}
            </span>
          </div>
        </div>

        <div className="mt-6 text-sm leading-7 text-foreground-muted">
          {product.short_description || "提交订单后，后台会保存客户信息与发货状态，方便后续人工跟进。"}
        </div>
      </aside>

      <form onSubmit={handleSubmit} className="section-card grid gap-5 px-6 py-7 md:px-7">
        <div>
          <p className="section-label">轻量订单</p>
          <h1 className="mt-4 font-serif text-3xl text-foreground">填写收货信息</h1>
          <p className="mt-3 text-sm leading-7 text-foreground-muted">
            当前先提交订单记录，付款方式预留为后续接入 PayPal 的结构。
          </p>
        </div>

        <label className="grid gap-2 text-sm text-foreground">
          姓名
          <input
            required
            className="field-input"
            value={form.customerName}
            onChange={(event) => updateField("customerName", event.target.value)}
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-foreground">
            邮箱
            <input
              required
              type="email"
              className="field-input"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            电话
            <input
              required
              className="field-input"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-foreground">
          收货地址
          <textarea
            required
            rows={4}
            className="field-input"
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm text-foreground">
          备注
          <textarea
            rows={4}
            className="field-input"
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
          />
        </label>

        {message ? (
          <div className="rounded-2xl border border-border bg-white/18 px-4 py-3 text-sm text-accent">
            {message}
            {successOrderId ? <span className="ml-2 text-foreground">订单号：{successOrderId}</span> : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={submitting} className="primary-button disabled:opacity-60">
            {submitting ? "提交中..." : "提交订单"}
          </button>
          <Link href={`/products/${product.slug}`} className="secondary-button">
            返回产品详情
          </Link>
        </div>
      </form>
    </div>
  );
}
