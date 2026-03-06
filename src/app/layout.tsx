import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UrgeStop — Recovery Support",
  description: "CBT and DBT-based addiction recovery companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
