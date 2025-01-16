import { ChatLayout } from '@/components/chat-layout'
import { Toaster } from '@/components/ui/sonner'
import { getChats } from '@/lib/actions/chat'
import { Analytics } from '@vercel/analytics/react'
import { GeistSans } from 'geist/font/sans'
import { Metadata } from 'next'
import './globals.css'

const meta = {
  title: 'Propers - Sales Proposition Generator',
  description: 'Create unique sales propositions for your products and services.'
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
        <ChatLayout chats={chats}>
          {children}
        </ChatLayout>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
