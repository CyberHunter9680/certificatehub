"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Award, FolderTree, Newspaper, BadgeDollarSign, Settings, LogOut } from "lucide-react";
import { logoutAdminAction } from "@/app/admin/actions";
import SubmitButton from "@/app/components/SubmitButton";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/ads", label: "Ads", icon: BadgeDollarSign },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const currentPath = usePathname();

  return (
    <aside className="w-full max-w-xs shrink-0 border-r border-white/10 bg-[#0f172a] p-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-300">Admin Panel</p>
        <h1 className="mt-3 text-2xl font-bold text-white">CertFinder Control</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = currentPath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "border border-blue-500/30 bg-blue-500/15 text-blue-200"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-gray-300">Manage certificates, categories, blog posts, and ad placements from one place.</p>
      </div>

      <form action={logoutAdminAction} className="mt-6">
        <SubmitButton pendingLabel="Signing out..." className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-medium text-red-200 transition hover:bg-red-500/20">
          <LogOut size={16} />
          Logout
        </SubmitButton>
      </form>
    </aside>
  );
}
