"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Send } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="relative bg-[#1a1a2e]/80 backdrop-blur-md pt-20 pb-8 mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                CF
              </div>
              <div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CertFinder</h3>
                <p className="text-[10px] text-gray-400 leading-none">Find Your Achievements</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover and verify your professional certificates from various platforms in one centralized location. Build your portfolio with confidence.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com/abhisharma5757" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="https://www.instagram.com/cyber_abhisharma?igsh=MWl4a3ZwM3o3OG5wMQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="https://www.linkedin.com/in/abhi-sharma7766?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">Home</Link>
              <Link href="/about" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">About Us</Link>
              <Link href="/blog" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">Blog</Link>
              <Link href="/contact" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">Contact</Link>
              <Link href="/certificates" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">All Certificates</Link>
              <Link href="/disclaimer" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">Disclaimer</Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all text-sm w-fit">Terms of Service</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Contact & Info
            </h4>
            <div className="flex flex-col gap-4">
              <p className="text-gray-400 text-sm flex items-center gap-3"><MapPin size={18} className="text-purple-400" /> Jaipur, Rajasthan, India</p>
              <p className="text-gray-400 text-sm flex items-center gap-3"><Phone size={18} className="text-purple-400" /> +91 9680895044</p>
              <p className="text-gray-400 text-sm flex items-center gap-3"><Mail size={18} className="text-purple-400" /> cyberabhisharma@gmail.com</p>
              
              <div className="mt-4 space-y-2">
                <p className="text-gray-400 text-xs"><span className="text-purple-400 font-medium">Developer:</span> Abhishek Sharma</p>
                <p className="text-gray-400 text-xs"><span className="text-purple-400 font-medium">Owner:</span> Abhishek Sharma</p>
              </div>
              
              <div className="mt-4 flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/5 border border-white/10 rounded-l-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-full"
                />
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 rounded-r-full hover:from-indigo-600 hover:to-purple-700 transition">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} CertFinder. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-white transition text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition text-sm">Terms of Service</Link>
            <Link href="/disclaimer" className="text-gray-500 hover:text-white transition text-sm">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
