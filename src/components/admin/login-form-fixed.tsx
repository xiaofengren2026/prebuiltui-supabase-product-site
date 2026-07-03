"use client";

import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type SessionRouteResponse = {
  error?: string;
  ok?: boolean;
};

export function LoginFormFixed() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasSupabaseEnv()) {
      setError("Supabase env is missing. Check .env.local.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(`Supabase login failed: ${signInError.message}`);
        return;
      }

      if (!data.session?.access_token) {
        setError("/auth/session failed: missing access_token");
        return;
      }

      if (!data.session?.refresh_token) {
        setError("/auth/session failed: missing refresh_token");
        return;
      }

      const response = await fetch("/auth/session", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      });

      const payload = (await response.json().catch(() => null)) as SessionRouteResponse | null;

      if (!response.ok) {
        setError(`/auth/session failed: ${payload?.error || `HTTP ${response.status}`}`);
        return;
      }

      if (!payload?.ok) {
        setError("/auth/session failed: response is not ok: true");
        return;
      }

      window.location.replace("/admin/dashboard");
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? `/auth/session request failed: ${unknownError.message}`
          : "/auth/session request failed: unknown error",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm text-foreground">
        Email
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
        Password
        <input
          type="password"
          required
          className="field-input"
          placeholder="Enter password"
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
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
