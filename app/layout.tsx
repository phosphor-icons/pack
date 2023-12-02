import '#/styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Pack',
    template: '%s | Pack',
  },
  description: 'A webfont stripping tool from the creators of Phosphor Icons.',
  openGraph: {
    title: 'Pack',
    description:
      'A webfont stripping tool from the creators of Phosphor Icons.',
    images: [`/api/og?title=Next.js App Router`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:light]">
      <body className="overflow-y-scroll bg-white bg-[url('/grid.svg')] pb-36">
        <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
          <div className="bg-white shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 p-3.5">
              <i className="ph-fill ph-backpack bg-backpack-pink text-backpack-navy rounded-md p-1 text-2xl" />
              <h1>pack</h1>
            </div>
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}
