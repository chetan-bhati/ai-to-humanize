import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HumanizeAI | Convert AI Text to Human Writing",
  description: "Transform robotic AI-generated text into natural, human-like content that bypasses AI detectors and engages your audience.",
  keywords: ["AI humanizer", "bypass AI detection", "text converter", "AI to human text"],
  authors: [{ name: "HumanizeAI Team" }],
  openGraph: {
    title: "HumanizeAI | Convert AI Text to Human Writing",
    description: "The world's most advanced AI text humanizer.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
