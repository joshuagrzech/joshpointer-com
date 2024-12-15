import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Software Engineer Portfolio",
  description: "React Native & iOS Developer Portfolio",
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
