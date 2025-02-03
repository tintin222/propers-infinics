import { Chat } from '@/components/chat'
import { getChat } from '@/lib/actions/chat'
import { convertToUIMessages } from '@/lib/utils'
import { notFound, redirect } from 'next/navigation'

export const maxDuration = 60

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getChat(id, 'anonymous')
  const title = chat?.title.toString().slice(0, 50) || 'Propers - Benzersiz Teklif Botu'
  
  return {
    title,
    description: 'Ürün ve hizmetleriniz için benzersiz satış teklifleri oluşturun.',
    openGraph: {
      title,
      description: 'Ürün ve hizmetleriniz için benzersiz satış teklifleri oluşturun.',
      type: 'website',
      url: `https://propers.ai/search/${id}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'Ürün ve hizmetleriniz için benzersiz satış teklifleri oluşturun.',
      images: ['/og-image.png']
    }
  }
}

export default async function SearchPage(props: {
  params: Promise<{ id: string }>
}) {
  const userId = 'anonymous'
  const { id } = await props.params
  const chat = await getChat(id, userId)
  // convertToUIMessages for useChat hook
  const messages = convertToUIMessages(chat?.messages || [])

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== userId) {
    notFound()
  }

  return <Chat id={id} savedMessages={messages} />
}
