import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/cart-context';
import { Header } from '@/components/layout/Header';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Toast } from '@/components/layout/Toast';
import { TweaksPanel } from '@/components/layout/TweaksPanel';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
});

export const metadata: Metadata = {
  title: 'Ayira Mini Mart',
  description: 'Your neighbourhood minimart in Al Khor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${hanken.variable} antialiased`} suppressHydrationWarning>
        <StoreProvider>
          <div className="min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />
            {children}
            <Footer />
            <CartDrawer />
            <MobileMenu />
            <TweaksPanel />
            <Toast />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
