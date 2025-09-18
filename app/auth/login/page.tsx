"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, loginUser } from "../storage";

function getParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preset = getParam("email");
    if (preset) setEmail(preset);
    const u = getCurrentUser();
    if (u) {
      // already logged in, redirect to home
      window.location.href = "/";
    }
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = loginUser(email, password);
    if (!res.ok) {
      setError(res.error || "ログインに失敗しました");
      return;
    }
    window.location.href = "/";
  }

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">ログイン</h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm">メールアドレス</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border rounded px-3 py-2" placeholder="you@example.com" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">パスワード</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="border rounded px-3 py-2" />
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">ログイン</button>
      </form>
      <div className="text-sm">
        アカウントをお持ちでない場合は <Link href="/auth/register" className="text-blue-600 underline">会員登録</Link>
      </div>
    </div>
  );
}


