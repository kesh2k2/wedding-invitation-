import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import LoginForm from "@/components/AdminLoginForm";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in | A Celebration of Love",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <AdminLoginContent />
    </Suspense>
  );
}

async function AdminLoginContent() {
  const admin = await getAuthenticatedAdmin();
  if (admin) redirect("/admin");

  return <LoginForm />;
}

function LoginLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-4 text-sm text-[#70695D]">
      Checking admin session...
    </main>
  );
}
