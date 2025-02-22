import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
