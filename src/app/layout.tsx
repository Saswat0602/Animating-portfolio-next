import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";
import Script from "next/script";

// Lazy load non-critical components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Saswat.Dev",
  description: "MERN/APP Developer",
};

// Preload critical tech icons to prevent layout shifts during initial load
const PRELOAD_IMAGES = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" // Fallback AWS icon
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Defer loading of non-critical JS */}
        <Script 
          src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" 
          strategy="lazyOnload"
        />
        
        {/* Preload critical assets */}
        {PRELOAD_IMAGES.map((url, index) => (
          <link 
            key={`preload-${index}`}
            rel="preload" 
            href={url} 
            as="image" 
            type="image/svg+xml" 
            crossOrigin="anonymous"
          />
        ))}
        {/* Add preconnect for faster icon loading */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        
        {/* Optimize text rendering */}
        <meta name="text-rendering" content="optimizeLegibility" />
        
        {/* Prevent layout shifts by setting viewport properly */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* Add resource hints to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Add meta tag to strip unknown attributes */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body 
        className={cn("min-h-screen bg-background antialiased", inter.className)}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
      
          
          <CustomCursor enabled={true} />
          
          <main className="overflow-hidden will-change-transform">
            {children}
          </main>
          
 
        </ThemeProvider>
      </body>
    </html>
  );
}
