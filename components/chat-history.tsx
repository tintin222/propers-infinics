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
    <div className="flex flex-col w-64 h-screen bg-muted/30 border-r">
      <div className="p-4 border-b">
        <Link href="/">
          <Button className="w-full" variant="outline">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {chats.map(chat => (
          <Link
            key={chat.id}
            href={chat.path}
            className={cn(
              'block px-4 py-2 text-sm hover:bg-muted/50 truncate',
              pathname === chat.path && 'bg-muted'
            )}
          >
            {chat.title || 'Untitled Chat'}
          </Link>
        ))}
      </div>
    </div>
  )
} 