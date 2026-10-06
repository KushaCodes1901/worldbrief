import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "WorldBrief — A world of stories",
    template: "%s | WorldBrief",
  },
  description:
    "An English news discovery portfolio project by Shkamb. Explore headlines and read the full stories at their original sources.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
