"use client";

export type UserRecord = {
  email: string;
  passwordHash: string; // mock only; not secure
  createdAt: number;
};

const USERS_KEY = "mock_auth_users_v1";
const SESSION_KEY = "mock_auth_session_v1";

function readUsers(): Record<string, UserRecord> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, UserRecord>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPasswordMock(password: string): string {
  // Non-cryptographic mock hash for demo purposes only
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (h * 31 + password.charCodeAt(i)) >>> 0;
  }
  return `h${h.toString(16)}`;
}

export function registerUser(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers();
  const key = email.toLowerCase();
  if (users[key]) return { ok: false, error: "すでに登録されています" };
  users[key] = { email, passwordHash: hashPasswordMock(password), createdAt: Date.now() };
  writeUsers(users);
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers();
  const rec = users[email.toLowerCase()];
  if (!rec) return { ok: false, error: "メールまたはパスワードが違います" };
  if (rec.passwordHash !== hashPasswordMock(password)) return { ok: false, error: "メールまたはパスワードが違います" };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: rec.email, at: Date.now() }));
  return { ok: true };
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): { email: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s?.email ? { email: s.email } : null;
  } catch {
    return null;
  }
}

export function evaluatePasswordStrength(password: string): { score: number; label: string; hints: string[] } {
  let score = 0;
  const hints: string[] = [];
  if (password.length >= 8) score++; else hints.push("8文字以上にしてください");
  if (/[A-Z]/.test(password)) score++; else hints.push("大文字を含めてください");
  if (/[a-z]/.test(password)) score++; else hints.push("小文字を含めてください");
  if (/[0-9]/.test(password)) score++; else hints.push("数字を含めてください");
  if (/[^A-Za-z0-9]/.test(password)) score++; else hints.push("記号を含めてください");
  const labels = ["とても弱い", "弱い", "普通", "強い", "とても強い"];
  const label = labels[Math.min(labels.length - 1, Math.max(0, score - 1))];
  return { score, label, hints };
}


