import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://denkraum-heidi.patrickoliverfischer.chatgpt.site'),
  title: 'Denkraum Heidi – textnah diskutieren',
  description: 'Eine interaktive Diskussionsplattform zu Johanna Spyris Heidi für die Sekundarstufe II.',
  openGraph: {
    title: 'Denkraum Heidi',
    description: 'Ein Roman. Sechs offene Fragen.',
    images: [`${process.env.BASE_PATH || ''}/og.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Denkraum Heidi',
    description: 'Ein Roman. Sechs offene Fragen.',
    images: [`${process.env.BASE_PATH || ''}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de-CH"><body>{children}</body></html>;
}
