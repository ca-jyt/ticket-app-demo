"use client";

import Link from "next/link";

function getParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export default function RegisteredPage() {
  const email = getParam("email") || "";
  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">登録完了</h1>
      <div className="border rounded p-4">
        <p className="mb-2">確認メールを送信しました（モック）。</p>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <div className="font-medium">件名: 会員登録のご確認</div>
          <div>宛先: {email}</div>
          <div className="mt-2">本文: 以下のボタンからログインしてください。</div>
        </div>
      </div>
      <Link href={`/auth/login?email=${encodeURIComponent(email)}`} className="bg-green-600 text-white rounded px-4 py-2 text-center">ログインへ進む</Link>
    </div>
  );
}


