import { ChatLayout } from '@/components/chat-layout'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { getChats } from '@/lib/actions/chat'
import { Analytics } from '@vercel/analytics/react'
import { GeistSans } from 'geist/font/sans'
import { Metadata } from 'next'
import './globals.css'

const meta = {
  title: 'Propers - Benzersiz Teklif Botu',
  description: 'Ürün ve hizmetleriniz için benzersiz satış teklifleri oluşturun.',
  metadataBase: new URL('https://propers.ai'),
  openGraph: {
    title: 'Propers - Benzersiz Teklif Botu',
    description: 'Ürün ve hizmetleriniz için benzersiz satış teklifleri oluşturun.',
    type: 'website',
    url: 'https://propers.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Propers - Benzersiz Teklif Botu'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Propers - Benzersiz Teklif Botu',
    description: 'Ürün ve hizmetleriniz için benzersiz satış teklifleri oluşturun.',
    images: ['/og-image.png']
  }
}

export const metadata: Metadata = {
  ...meta,
  title: {
    default: meta.title,
    template: `%s - ${meta.title}`
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const chats = await getChats('anonymous')

  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <Header />
        <ChatLayout chats={chats}>
          {children}
        </ChatLayout>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
