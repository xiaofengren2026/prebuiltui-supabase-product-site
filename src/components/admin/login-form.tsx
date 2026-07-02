"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasSupabaseEnv()) {
      setError("还没有填写 Supabase 环境变量，请先完成 .env.local 配置。");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "登录失败，请检查邮箱或密码。");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (unknownError) {
      setError(
        unknownError instanceof Error ? unknownError.message : "登录失败，请稍后再试。",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm text-foreground">
        邮箱
        <input
          type="email"
          required
          className="field-input"
          placeholder="your@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="grid gap-2 text-sm text-foreground">
        密码
        <input
          type="password"
          required
          className="field-input"
          placeholder="请输入密码"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error ? (
        <div className="rounded-2xl border border-border bg-white/30 px-4 py-3 text-sm text-accent">
          {error}
        </div>
      ) : null}

      <button type="submit" disabled={loading} className="primary-button mt-2 disabled:opacity-60">
        {loading ? "登录中..." : "登录后台"}
      </button>
    </form>
  );
}
