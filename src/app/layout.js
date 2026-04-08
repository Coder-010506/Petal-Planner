import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "Petal Planner",
  description: "A soft, dreamy, aesthetic personal planner.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans relative">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
