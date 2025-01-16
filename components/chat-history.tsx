'use client'

import { Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MessageSquarePlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

interface ChatHistoryProps {
  chats: Chat[]
}

export function ChatHistory({ chats }: ChatHistoryProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 h-screen bg-gradient-to-b from-background to-muted/20 border-r">
      <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
        <Link href="/">
          <Button 
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-0 transition-colors" 
            variant="outline"
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4 px-2 space-y-2">
        {chats.map(chat => (
          <Link
            key={chat.id}
            href={chat.path}
            className={cn(
              'block px-3 py-2 text-sm hover:bg-muted/80 rounded-lg transition-all duration-200',
              'border border-transparent hover:border-border/50',
              pathname === chat.path && 'bg-muted/70 border-border shadow-sm'
            )}
          >
            <div className="font-medium text-foreground/90 truncate">
              {chat.title || 'Untitled Chat'}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">
              {new Date(chat.createdAt).toLocaleDateString()} · {new Date(chat.createdAt).toLocaleTimeString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 