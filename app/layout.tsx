import '#/styles/globals.css';
import { AddressBar } from '#/ui/address-bar';
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
          <div className="rounded-lg bg-white shadow-lg shadow-black/20">
            <AddressBar />
          </div>

          <div className="rounded-lg bg-white p-3.5 shadow-lg shadow-black/20 lg:p-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
