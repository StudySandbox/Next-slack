import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { JotaiProvider } from "@/components/jotai-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next Slack",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="ko">
        <body>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster
                position="top-center"
                duration={1500}
                className="bg-white"
              />
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
