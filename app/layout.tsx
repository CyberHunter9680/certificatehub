import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AdSlot from "./components/AdSlot";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ClientEnhancements from "./components/ClientEnhancements";
import PublicOnly from "./components/PublicOnly";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://certfinder.vercel.app"),
  title: {
    default: "CertFinder - Discover Online Certificates",
    template: "%s | CertFinder",
  },
  description: "Discover valuable online certificates from trusted platforms. Verify your achievements and build your portfolio.",
  keywords: ["online certificates", "cybersecurity", "courses", "education", "portfolio", "IT certifications"],
  authors: [{ name: "Abhishek Sharma" }],
  creator: "Abhishek Sharma",
  publisher: "Abhishek Sharma",
  openGraph: {
    title: "CertFinder - Discover Online Certificates",
    description: "Discover valuable online certificates from trusted platforms. Verify your achievements and build your portfolio.",
    type: "website",
    siteName: "CertFinder",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head><script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wbyghr9uyj");
</script></head>
      <body
        className={`${poppins.variable} antialiased bg-[#0e0e1a] text-white min-h-screen flex flex-col`}
      >
        <Navbar />
        <PublicOnly>
          <div className="px-4 pb-4 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <AdSlot placement="HEADER" />
            </div>
          </div>
          <ClientEnhancements />
        </PublicOnly>
        <main className="flex-1">
          {children}
        </main>
        <PublicOnly>
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <AdSlot placement="FOOTER" />
            </div>
          </div>
          <Footer />
        </PublicOnly>
        <Analytics />
        <SpeedInsights />
      </body>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5278574901328003"
     crossOrigin="anonymous"></script>
    </html>
  );
}
