import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trinity Engineering | Forensic Engineering Detectives",
  description: "The global standard for forensic engineering. Meticulous investigation, evidence-based analysis, and absolute structural clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className="bg-background-dark font-display text-gray-300 antialiased">
        {children}
      </body>
    </html>
  );
}
