import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata = {
  title: "Wash Fix Service Chennai | Washing Machine Repair",
  description:
    "Wash Fix Service Chennai offers fast washing machine repair at your doorstep with same-day support and clear pricing.",
  icons: {
    icon: "/images/WashFixLogoLatest.jpeg?v=1",
    shortcut: "/images/WashFixLogoLatest.jpeg?v=1",
    apple: "/images/WashFixLogoLatest.jpeg?v=1",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
