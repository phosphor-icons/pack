import "#/styles/globals.css";
import { Metadata } from "next";
import { Manrope } from "next/font/google";
import * as styles from "./layout.css";
import "#/styles/global.css.ts";
import "#/styles/global.css";

const manrope = Manrope({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Phosphor Pack",
    template: "%s | Phosphor Pack",
  },
  description: "A webfont stripping tool from the creators of Phosphor Icons.",
  openGraph: {
    title: "Pack",
    description:
      "A webfont stripping tool from the creators of Phosphor Icons.",
    images: [`/api/og?title=Next.js App Router`],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.className}>
      <body className={styles.body}>
        <main className={styles.main}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <h1 className={styles.name}>Phosphor Backpack</h1>
              <i className={`${styles.icon} ph-light ph-backpack`} />
            </div>
            <p className={styles.slug}>
              Take only the glyphs you need and save majorly on file size
            </p>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
