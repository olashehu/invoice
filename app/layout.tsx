// @ts-ignore
import { Metadata } from 'next';
import {inter} from '@/app/ui/fonts';

import '@/app/ui/global.css';

export const metadata: Metadata = {
  title: 'Invoice Dashboard',
  description: 'Customer invoice Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
