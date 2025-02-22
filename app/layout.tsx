import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope-sans',
  subsets: ['latin'],
});

const space_grotesk = Space_Grotesk({
  variable: '--font-space_grotesk-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ROM House Technologies',
  description: "Africa's leading Starlink technology provider",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${space_grotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
