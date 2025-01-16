'use client'

import { Chat } from '@/lib/types'
import { ChatHistory } from './chat-history'
import { PropositionLibrary } from './proposition-library'

interface ChatLayoutProps {
  children: React.ReactNode
  chats: Chat[]
}

export function ChatLayout({ children, chats }: ChatLayoutProps) {
  return (
    <div className="flex h-screen">
      <ChatHistory chats={chats} />
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
      <PropositionLibrary chats={chats} />
    </div>
  )
} 