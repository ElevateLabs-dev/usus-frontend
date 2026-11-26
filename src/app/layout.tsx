import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.meetusus.com/"),

  title: {
    default: "USUS Training Platform",
    template: "%s | USUS",
  },

  description:
    "USUS provides personalised AI-powered training and realistic simulations to help employees develop practical skills and prepare for real-world interactions.",

  applicationName: "USUS",

  keywords: [
    "USUS",
    "AI Training",
    "AI Simulation",
    "Workforce Training",
    "Roleplay Training",
    "Employee Development",
    "Workforce Skills",
  ],

  authors: [{ name: "USUS" }],

icons: {
  icon: [
    {
      url: "/favicon/favicon.ico",
      type: "image/x-icon",
    },
    {
      url: "/favicon/favicon.svg",
      type: "image/svg+xml",
    },
  ],
},

  openGraph: {
    title: "USUS | AI Simulation Environment",
    description:
      "Personalised AI-powered training with realistic simulations, practical procedures, and measurable progress.",
    url: "/",
    siteName: "USUS",
    images: [
      {
        url: "/og-image.png",
        width: 1648,
        height: 928,
        alt: "USUS AI Simulation Training Platform",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "USUS | AI Simulation Environment",
    description:
      "Prepare your workforce for real-world interactions with personalised AI-powered training.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};