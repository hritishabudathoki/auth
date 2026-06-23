import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getUserData } from "@/lib/cookies";
import { AuthProvider } from "@/lib/providers/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExploreEase",
  description: "Discover your next adventure with ExploreEase",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserData();
  const authProviderKey = user?._id ?? "guest";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas">
        <AuthProvider key={authProviderKey} initialUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
