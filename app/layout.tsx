import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import FloatingSubmitButton from "@/components/FloatingSubmitButton";
import { mulish } from "@/lib/fonts/mulish";

export const metadata: Metadata = {
  title: "Trinity Engineering | Forensic Engineering Investigations & Expert Analysis",
  description: "The most trusted and thorough professional forensic engineering inspections and structural design. The highest quality storm data research reports and industry training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mulish.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/hero-background.png" as="image" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.add(theme);
              } catch (e) {}
              try {
                var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                var slow = c && (c.saveData || /^(slow-2g|2g)$/.test(c.effectiveType || '') || (c.effectiveType === '3g' && c.downlink > 0 && c.downlink < 1.5));
                if (!slow) {
                  var v = document.createElement('link');
                  v.rel = 'preload';
                  v.href = '/hero-video.mp4';
                  v.as = 'video';
                  v.type = 'video/mp4';
                  document.head.appendChild(v);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${mulish.className} bg-white dark:bg-background-dark font-sans text-gray-900 dark:text-gray-300 antialiased max-lg:overflow-x-clip`}>
        <ThemeProvider>
          {children}
          <FloatingSubmitButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
