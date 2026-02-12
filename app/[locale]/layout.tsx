import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from 'sonner';
import { IBM_Plex_Sans } from 'next/font/google';
import { Cairo } from 'next/font/google';
import "../globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"

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
    // 👇 التعديل هنا: ضفنا suppressHydrationWarning في تاج الـ html
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${ibmPlex.variable} ${cairo.variable} ${isArabic ? 'font-cairo' : 'font-ibm'}`}
      // 👆 شلناها من هنا خلاص مالهاش لازمة في الـ body مع next-themes
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>

            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors closeButton />
            </AuthProvider>

          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}