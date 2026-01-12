import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext"
import { ThemeProvider } from "@/app/context/ThemeContext"

export const metadata: Metadata = {
  title: "Sayara - Car Rental",
  description: "Premium car rental service",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                const html = document.documentElement;
                html.classList.toggle('dark', theme === 'dark');
                html.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

