import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Trinity Engineering | Forensic Engineering Investigations & Expert Analysis",
  description: "Engineering detectives using science to determine root causes of property damage. Licensed PE engineers providing forensic investigations for structural failures, storm damage, water loss, and more. Serving insurance carriers and legal professionals nationwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-background-dark font-display text-gray-900 dark:text-gray-300 antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
