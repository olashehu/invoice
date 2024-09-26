// @ts-ignore
import { Metadata } from 'next';
import {inter} from '@/app/ui/fonts';
// import { SpeedInsights } from "@vercel/speed-insights/next";

import '@/app/ui/global.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Invoice Dashboard',
    default: 'Invoice Dashboard'
  },
  description: 'Invoce Dashboard by Olashehu',
  // metadataBase: new URL('customer-invoice.vercel.app')
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
