import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Password Generator",
  description: "A simple password generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
