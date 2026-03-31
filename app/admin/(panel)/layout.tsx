import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Production-ready admin dashboard for managing CertFinder content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <header className="border-b border-white/10 bg-[#081224]/80 px-6 py-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Production Admin</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Manage your platform safely</h2>
              </div>
              <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:bg-white/10">
                <Home size={16} />
                View website
              </Link>
            </div>
          </header>
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
