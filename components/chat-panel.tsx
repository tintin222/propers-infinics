'use client'

import { cn } from '@/lib/utils'
import { Message } from 'ai'
import { ArrowUp, Plus, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { ModelSelector } from './model-selector'
import { Button } from './ui/button'

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: any) => void
}

export function ChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append
}: ChatPanelProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [enterDisabled, setEnterDisabled] = useState(false)

  const handleCompositionStart = () => setIsComposing(true)

  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => {
      setEnterDisabled(false)
    }, 300)
  }

  const handleNewChat = () => {
    setMessages([])
    router.push('/')
  }

  // Handle initial query if present
  useEffect(() => {
    if (query && query.trim()) {
      append({
        role: 'user',
        content: query
      })
    }
  }, [query, append])

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-3xl backdrop-blur-sm',
        messages.length > 0
          ? 'fixed bottom-0 left-0 right-0 bg-background/80 border-t shadow-lg'
          : 'fixed bottom-8 left-0 right-0 flex flex-col items-center justify-center'
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          'max-w-3xl mx-auto w-full',
          messages.length > 0 ? 'px-4 py-4' : 'px-6'
        )}
      >
        <div className="relative flex items-center w-full gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              className="shrink-0 rounded-full group hover:bg-primary/10 transition-colors"
              type="button"
            >
              <Plus className="size-4 group-hover:rotate-90 transition-all duration-200 ease-spring" />
            </Button>
          )}
          {messages.length === 0 && <ModelSelector />}
          <Textarea
            ref={inputRef}
            name="input"
            rows={1}
            maxRows={5}
            tabIndex={0}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="What is your product?"
            spellCheck={false}
            value={input}
            className="resize-none w-full min-h-12 rounded-full bg-muted/50 border-2 border-input/50 hover:border-input focus:border-primary pl-4 pr-12 pt-3 pb-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            onChange={e => {
              handleInputChange(e)
            }}
            onKeyDown={e => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !isComposing &&
                !enterDisabled
              ) {
                if (input.trim().length === 0) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                const textarea = e.target as HTMLTextAreaElement
                textarea.form?.requestSubmit()
              }
            }}
            onHeightChange={height => {
              if (!inputRef.current) return
              const initialHeight = 70
              const initialBorder = 32
              const multiple = (height - initialHeight) / 20
              const newBorder = initialBorder - 4 * multiple
              inputRef.current.style.borderRadius =
                Math.max(8, newBorder) + 'px'
            }}
          />
          <Button
            type={isLoading ? 'button' : 'submit'}
            size={'icon'}
            variant={'ghost'}
            className={cn(
              'absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-primary/10 transition-colors',
              isLoading && 'animate-pulse'
            )}
            disabled={input.length === 0 && !isLoading}
            onClick={isLoading ? stop : undefined}
          >
            {isLoading ? 
              <Square size={18} className="text-primary" /> : 
              <ArrowUp size={18} className="text-primary" />
            }
          </Button>
        </div>
      </form>
    </div>
  )
}
