"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Unable to sign in. Please try again.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-4 py-12 text-[#29251F]">
      <section className="w-full max-w-md rounded-3xl border border-[#D4AF37]/25 bg-white p-7 shadow-[0_24px_80px_-32px_rgba(47,39,24,0.3)] sm:p-10">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#70695D] transition hover:text-[#8A6B25]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to the wedding site
        </Link>

        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F1E2] text-[#A88739]">
          <Heart size={22} aria-hidden="true" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A88739]">
          Private access
        </p>
        <h1 className="font-serif text-3xl">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[#70695D]">
          Sign in to manage guests and wedding details. There is no public sign-up.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium" htmlFor="admin-email">
            Email address
            <input
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-[#E6E0D4] bg-[#FDFCF9] px-4 py-3 outline-none transition focus:border-[#A88739] focus:ring-2 focus:ring-[#A88739]/15"
              id="admin-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm font-medium" htmlFor="admin-password">
            Password
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-[#E6E0D4] bg-[#FDFCF9] px-4 py-3 outline-none transition focus:border-[#A88739] focus:ring-2 focus:ring-[#A88739]/15"
              id="admin-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#302B22] px-4 py-3 font-medium text-white transition hover:bg-[#514631] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            <LockKeyhole size={17} aria-hidden="true" />
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
