"use client";

import Link from "next/link";
import { useState } from "react";
import { evaluatePasswordStrength, registerUser } from "../storage";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { score, label, hints } = evaluatePasswordStrength(password);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("メールアドレスの形式が正しくありません");
      return;
    }
    if (score < 3) {
      setError("パスワードの強度が足りません");
      return;
    }
    const res = registerUser(email, password);
    if (!res.ok) {
      setError(res.error || "登録に失敗しました");
      return;
    }
    window.location.href = `/auth/registered?email=${encodeURIComponent(email)}`;
  }

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">会員登録</h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm">メールアドレス</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border rounded px-3 py-2" placeholder="you@example.com" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">パスワード</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="border rounded px-3 py-2" placeholder="8文字以上、大文字・小文字・数字・記号を推奨" />
          <div className="text-xs text-gray-600">強度: {label}</div>
          {hints.length > 0 && (
            <ul className="text-xs text-gray-500 list-disc ml-5">
              {hints.map((h) => (<li key={h}>{h}</li>))}
            </ul>
          )}
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">登録して次へ</button>
      </form>
      <div className="text-sm">
        すでにアカウントをお持ちですか？ <Link href="/auth/login" className="text-blue-600 underline">ログイン</Link>
      </div>
    </div>
  );
}


