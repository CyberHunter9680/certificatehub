import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/app/admin/components/AdminLoginForm";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure login for the CertFinder admin panel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-4 py-10">
      <div className="absolute left-[10%] top-[15%] h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[10%] right-[12%] h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]" />
      <AdminLoginForm />
    </div>
  );
}
