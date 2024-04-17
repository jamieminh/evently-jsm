import { ClerkProvider } from "@clerk/nextjs";
import { Provider as RollbarProvider } from "@rollbar/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Evently",
  description: "Join events from all over the world",
  icons: {
    icon: ["/assets/images/logo.svg"],
  },
};

const rollbarConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: "local",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RollbarProvider config={rollbarConfig}>
      <ClerkProvider>
        <html lang="en">
          <body className={poppins.className}>
            {children}
            <SpeedInsights />
          </body>
        </html>
      </ClerkProvider>
    </RollbarProvider>
  );
}
