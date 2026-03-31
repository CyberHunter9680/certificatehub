"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ShieldCheck, Home } from "lucide-react";
import { loginAdminAction, type AdminActionState } from "@/app/admin/actions";
import SubmitButton from "@/app/components/SubmitButton";

const initialState: AdminActionState = {
  success: false,
};

export default function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAdminAction, initialState);

  return (
    <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
        <ShieldCheck size={30} />
      </div>

      <h1 className="mb-2 text-center text-3xl font-bold text-white">Admin Login</h1>
      <p className="mb-8 text-center text-sm text-gray-400">Sign in to manage certificates, categories, blog posts, and ads.</p>

      <form action={formAction} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-gray-300">Admin Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            placeholder="admin@coursehub.in"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            placeholder="Enter admin password"
          />
        </div>

        {state.message && !state.success && (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{state.message}</p>
        )}

        <SubmitButton pendingLabel="Signing in..." className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-cyan-400">
          Access Dashboard
        </SubmitButton>
      </form>

      <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-white">
        <Home size={14} />
        Back to website
      </Link>
    </div>
  );
}
