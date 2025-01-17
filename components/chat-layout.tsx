'use client'

import { Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ChatHistory } from './chat-history'
import { PropositionLibrary } from './proposition-library'

interface ChatLayoutProps {
  children: React.ReactNode
  chats: Chat[]
}

export function ChatLayout({ children, chats }: ChatLayoutProps) {
  const [showHistory, setShowHistory] = useState(false)
  const [showPropositions, setShowPropositions] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="w-full flex-none">
        <div className="h-16" /> {/* Spacer for fixed header */}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-auto relative",
          "md:px-0"
        )}>
          {children}
        </main>

        {/* Hidden but preserved components */}
        <div className="hidden">
          <ChatHistory chats={chats} />
          <PropositionLibrary chats={chats} />
        </div>
      </div>
    </div>
  )
} 