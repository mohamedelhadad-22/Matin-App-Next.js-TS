import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from 'sonner';
import { IBM_Plex_Sans } from 'next/font/google';
import { Cairo } from 'next/font/google';
import "../globals.css";

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // import messages from next-intl
  const messages = await getMessages();

  const isArabic = locale === 'ar';

  return (
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'}>
      <body
        className={`${ibmPlex.variable} ${cairo.variable} ${isArabic ? 'font-cairo' : 'font-ibm'}`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>

          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors
              closeButton />
          </AuthProvider>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}