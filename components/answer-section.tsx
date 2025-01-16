'use client'

import { Text } from 'lucide-react'
import { ChatShare } from './chat-share'
import { CollapsibleMessage } from './collapsible-message'
import { DefaultSkeleton } from './default-skeleton'
import { BotMessage } from './message'

export type AnswerSectionProps = {
  content: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatId?: string
}

export function AnswerSection({
  content,
  isOpen,
  onOpenChange,
  chatId
}: AnswerSectionProps) {
  const enableShare = process.env.NEXT_PUBLIC_ENABLE_SHARE === 'true'

  const header = (
    <div className="flex items-center gap-2 text-primary/80">
      <Text size={16} className="text-primary" />
      <div className="font-medium">Answer</div>
    </div>
  )
  const message = content ? (
    <div className="flex flex-col gap-2 transition-all duration-200">
      <div className="bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <BotMessage message={content} />
      </div>
      {enableShare && chatId && (
        <ChatShare chatId={chatId} className="self-end mt-1" />
      )}
    </div>
  ) : (
    <DefaultSkeleton />
  )
  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showBorder={false}
    >
      {message}
    </CollapsibleMessage>
  )
}
