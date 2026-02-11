import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from 'sonner';
import "../globals.css";

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

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body suppressHydrationWarning={true}>
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