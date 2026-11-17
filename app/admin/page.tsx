import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin dashboard | A Celebration of Love",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AuthenticatedAdminDashboard />
    </Suspense>
  );
}

async function AuthenticatedAdminDashboard() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminDashboard admin={{ name: admin.name, email: admin.email }} />;
}

function AdminLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-4 text-sm text-[#70695D]">
      Checking admin session...
    </main>
  );
}
