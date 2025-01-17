'use client'

import { Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Menu, PanelRight } from 'lucide-react'
import { useState } from 'react'
import { ChatHistory } from './chat-history'
import { PropositionLibrary } from './proposition-library'
import { Button } from './ui/button'

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
        {/* Chat History Sidebar */}
        <div className={cn(
          "fixed inset-y-16 left-0 z-40 transition-transform duration-200 ease-in-out transform",
          "md:relative md:inset-y-0 md:translate-x-0",
          showHistory ? "translate-x-0" : "-translate-x-full"
        )}>
          <ChatHistory chats={chats} />
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-auto relative",
          "md:px-0"
        )}>
          {children}
        </main>

        {/* Proposition Library Sidebar */}
        <div className={cn(
          "fixed inset-y-16 right-0 z-40 transition-transform duration-200 ease-in-out transform",
          "md:relative md:inset-y-0 md:translate-x-0 md:block md:flex-shrink-0",
          showPropositions ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}>
          <PropositionLibrary chats={chats} />
        </div>

        {/* Mobile Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-2 bg-background/80 backdrop-blur-sm border-b md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPropositions(!showPropositions)}
            className="hover:bg-muted"
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Backdrop for mobile */}
        {(showHistory || showPropositions) && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => {
              setShowHistory(false)
              setShowPropositions(false)
            }}
          />
        )}
      </div>
    </div>
  )
} 