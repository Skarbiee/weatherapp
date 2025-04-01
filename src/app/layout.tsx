import type React from "react";
import type {Metadata} from "next";
import "./globals.css"
import {AppProvider} from "@/context/app-context";

export const metadata: Metadata = {
  title: "Application Météo",
  description: "Une application météo simple"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}