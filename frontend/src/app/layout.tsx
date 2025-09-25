// 13-9-2025 Authprovidr in  secure user allow suriya 
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/app/context/AuthContext";  

export const metadata: Metadata = {
  title: "HMS",
  description: "Hotel Management Software",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
   
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
