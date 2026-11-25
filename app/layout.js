import { DM_Sans, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  preload: true,
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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18366938544"
          strategy="beforeInteractive"
        />
        <Script id="google-ads-tag" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18366938544');`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
