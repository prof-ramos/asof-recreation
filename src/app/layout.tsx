import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | ASOF - Associação Nacional dos Oficiais de Chancelaria',
    default: 'ASOF - Associação Nacional dos Oficiais de Chancelaria',
  },
  description: 'A Associação Nacional dos Oficiais de Chancelaria (ASOF) representa e defende os interesses dos Oficiais de Chancelaria do Brasil.',
  keywords: ['ASOF', 'Associação', 'Oficiais de Chancelaria', 'Carreira Diplomática', 'Sindicato', 'Direitos', 'Advocacy'],
  authors: [{ name: 'ASOF - Associação Nacional dos Oficiais de Chancelaria' }],
  creator: 'ASOF',
  publisher: 'ASOF',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.asof.org.br'),
  openGraph: {
    title: 'ASOF - Associação Nacional dos Oficiais de Chancelaria',
    description: 'A Associação Nacional dos Oficiais de Chancelaria (ASOF) representa e defende os interesses dos Oficiais de Chancelaria do Brasil.',
    url: 'https://www.asof.org.br',
    siteName: 'ASOF',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ASOF - Associação Nacional dos Oficiais de Chancelaria'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASOF - Associação Nacional dos Oficiais de Chancelaria',
    description: 'A Associação Nacional dos Oficiais de Chancelaria (ASOF) representa e defende os interesses dos Oficiais de Chancelaria do Brasil.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token', // Substituir pelo token real
    yandex: 'yandex-verification-token',     // Substituir pelo token real
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#1e40af" />
        <meta name="application-name" content="ASOF" />
        <meta name="apple-mobile-web-app-title" content="ASOF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/critical-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ASOF - Associação Nacional dos Oficiais de Chancelaria',
              alternateName: ['ASOF', 'Associação dos Oficiais de Chancelaria'],
              url: 'https://www.asof.org.br',
              logo: 'https://www.asof.org.br/logo.png',
              foundingDate: '1995', // Substituir pela data real
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'SCS Quadra 2, Bloco C, 4º Andar, sala 403',
                addressLocality: 'Brasília',
                addressRegion: 'DF',
                postalCode: '70302-900',
                addressCountry: 'BR'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+55 61 3223-7300',
                contactType: 'customer service',
                areaServed: 'BR',
                availableLanguage: 'pt-BR'
              },
              sameAs: [
                'https://www.facebook.com/asof.br',
                'https://www.twitter.com/asof_oficiais',
                'https://www.instagram.com/asof_oficiais',
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RegisterServiceWorker />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
