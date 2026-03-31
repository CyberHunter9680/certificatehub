"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogIn, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ role: string; email?: string } | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Login form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check auth status
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser({ role: data.role });
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setUser(null);
    router.refresh();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, requestedRole: "USER" }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          setUser({ role: "USER" });
          setLoginModalOpen(false);
          router.refresh();
        } else {
          alert("Registration successful. You can now login.");
          setIsLogin(true);
        }
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isAdminPage) return null;

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "bg-dark/95 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
                CF
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CertFinder</h1>
                <p className="text-[10px] text-gray-400 leading-none">Find Your Achievements</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className={`text-sm font-medium transition-colors hover:text-purple-400 ${pathname === '/' ? 'text-purple-400' : 'text-gray-300'}`}>Home</Link>
              <Link href="/blog" className={`text-sm font-medium transition-colors hover:text-purple-400 ${pathname.startsWith('/blog') ? 'text-purple-400' : 'text-gray-300'}`}>Blog</Link>
              <Link href="/about" className={`text-sm font-medium transition-colors hover:text-purple-400 ${pathname === '/about' ? 'text-purple-400' : 'text-gray-300'}`}>About</Link>
              <Link href="/contact" className={`text-sm font-medium transition-colors hover:text-purple-400 ${pathname === '/contact' ? 'text-purple-400' : 'text-gray-300'}`}>Contact</Link>
              <Link href="/disclaimer" className={`text-sm font-medium transition-colors hover:text-purple-400 ${pathname === '/disclaimer' ? 'text-purple-400' : 'text-gray-300'}`}>Disclaimer</Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <User size={16} />
                    <span>{user.role === 'ADMIN' ? 'Admin' : 'Student'}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center gap-1">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setLoginModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all backdrop-blur-md flex items-center gap-2"
                >
                  <LogIn size={16} /> Student Login
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[70px] bg-[#1a1a2e]/95 backdrop-blur-xl border-b border-white/5 p-4 z-50 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-gray-200 p-2 hover:bg-white/5 rounded" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/blog" className="text-gray-200 p-2 hover:bg-white/5 rounded" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/about" className="text-gray-200 p-2 hover:bg-white/5 rounded" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" className="text-gray-200 p-2 hover:bg-white/5 rounded" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/disclaimer" className="text-gray-200 p-2 hover:bg-white/5 rounded" onClick={() => setMobileMenuOpen(false)}>Disclaimer</Link>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              {user ? (
                <>
                  <div className="text-gray-400 p-2 text-sm flex items-center gap-2"><User size={16} /> Logged in as: {user.role}</div>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left p-2 text-red-400 flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }} 
                  className="bg-indigo-600 text-white p-3 rounded-lg flex justify-center items-center gap-2"
                >
                  <LogIn size={18} /> Student Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl"
            >
              <button 
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <User size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {isLogin ? "Sign in to access your student portal" : "Sign up to track your learning journey"}
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-purple-400 font-medium hover:text-purple-300 hover:underline"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
