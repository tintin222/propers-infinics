'use client'

import { deleteChat } from '@/lib/actions/chat'
import { Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MessageSquarePlus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from './ui/alert-dialog'
import { Button } from './ui/button'

interface ChatHistoryProps {
  chats: Chat[]
}

export function ChatHistory({ chats }: ChatHistoryProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (chatId: string) => {
    setIsDeleting(chatId)
    const result = await deleteChat(chatId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Chat deleted')
      if (pathname === `/search/${chatId}`) {
        router.push('/')
      } else {
        router.refresh()
      }
    }
    setIsDeleting(null)
  }

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
          <div key={chat.id} className="group relative">
            <Link
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete chat</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this chat? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(chat.id)}
                    className="bg-destructive hover:bg-destructive/90"
                    disabled={isDeleting === chat.id}
                  >
                    {isDeleting === chat.id ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  )
} 