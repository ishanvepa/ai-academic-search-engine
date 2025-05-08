import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "AI Academic Search Engine",
  description:
    "AI research search engine. Uses RAG and LLM similarity search to aid academic research.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased relative min-h-screen overflow-hidden`}>
        {/* Global Blurred Orange Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400 opacity-30 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 opacity-40 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-yellow-400 opacity-30 rounded-full blur-[80px]" />
        </div>

        {/* Your actual app */}
        {children}
      </body>
    </html>
  );
}
