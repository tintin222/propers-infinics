'use client'

import { Chat } from '@/lib/types'
import { Book, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from './ui/collapsible'

interface PropositionLibraryProps {
  chats: Chat[]
}

function getMessageContent(content: any): string {
  if (typeof content === 'string') {
    return content
  }
  if (Array.isArray(content)) {
    return content
      .map(item => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'text' in item) return item.text
        return ''
      })
      .join('')
  }
  if (content && typeof content === 'object' && 'text' in content) {
    return content.text
  }
  return ''
}

function findFinalProposition(messages: any[]) {
  // First, find the user's category selection message
  let categoryIndex = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    const content = getMessageContent(messages[i].content)
    if (messages[i].role === 'user' && content.includes('-Focused')) {
      categoryIndex = i
      break
    }
  }

  if (categoryIndex === -1) {
    console.log('No category selection found')
    return null
  }

  // Look for the next assistant message after the category selection
  let lastAssistantMessage = null
  for (let i = messages.length - 1; i > categoryIndex; i--) {
    const message = messages[i]
    if (message.role === 'assistant') {
      const content = getMessageContent(message.content)
      console.log('Checking assistant message:', content)
      
      // Store the last assistant message we find
      if (!lastAssistantMessage && content && content.length > 0) {
        lastAssistantMessage = content
      }

      // Check if this looks like a proposition
      if (content &&
          !content.includes('🔵') && // Not a question
          !content.includes('Features of the competitor') && // Not competitor analysis
          !content.includes('Based on the search results')) { // Not search analysis
        console.log('Found proposition:', content)
        return content.trim()
      }
    }
  }

  // If we didn't find a clear proposition, return the last assistant message
  if (lastAssistantMessage) {
    console.log('Using last assistant message as proposition:', lastAssistantMessage)
    return lastAssistantMessage.trim()
  }

  console.log('No proposition found')
  return null
}

function getCategoryFromMessages(messages: any[]) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message.role === 'user') {
      const content = getMessageContent(message.content)
      if (content.includes('Feature-Focused') ||
          content.includes('Benefit-Focused') ||
          content.includes('Target Audience-Focused') ||
          content.includes('Problem-Solving Focused') ||
          content.includes('Quality-Focused') ||
          content.includes('Price-Focused') ||
          content.includes('Service-Focused') ||
          content.includes('Experience-Focused') ||
          content.includes('Process-Focused') ||
          content.includes('Results-Focused')) {
        console.log('Found category:', content)
        const category = content.split('-Focused')[0].trim()
        return category + '-Focused'
      }
    }
  }
  console.log('No category found')
  return 'Uncategorized'
}

export function PropositionLibrary({ chats }: PropositionLibraryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter chats that have final propositions
  const propositionChats = chats.filter(chat => 
    findFinalProposition(chat.messages)
  )

  // Group propositions by category
  const propositionsByCategory = propositionChats.reduce((acc, chat) => {
    const category = getCategoryFromMessages(chat.messages)
    if (!acc[category]) {
      acc[category] = []
    }
    const proposition = findFinalProposition(chat.messages)
    if (proposition) {
      acc[category].push({
        id: chat.id,
        title: chat.title,
        proposition,
        path: chat.path
      })
    }
    return acc
  }, {} as Record<string, Array<{id: string; title: string; proposition: string; path: string}>>)

  return (
    <div className="flex flex-col w-64 h-screen bg-gradient-to-b from-muted/20 to-muted/30 border-l">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-between p-4 border-b hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center">
              <Book className="mr-2 h-4 w-4 text-primary" />
              <span className="font-semibold">Proposition Library</span>
            </div>
            {isOpen ? 
              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 p-2">
          {Object.entries(propositionsByCategory).map(([category, propositions]) => (
            <div key={category} className="space-y-2">
              <div 
                className="flex items-center px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {selectedCategory === category ? 
                  <ChevronDown className="h-4 w-4 mr-1" /> : 
                  <ChevronUp className="h-4 w-4 mr-1" />
                }
                {category.replace('-Focused', '')}
                <span className="ml-auto text-xs text-muted-foreground">
                  {propositions.length}
                </span>
              </div>
              {selectedCategory === category && (
                <div className="pl-6 space-y-3">
                  {propositions.map((prop) => (
                    <a
                      key={prop.id}
                      href={prop.path}
                      className="block text-sm hover:text-primary transition-colors"
                    >
                      <div className="font-medium mb-1 line-clamp-2 text-foreground/80 hover:text-foreground">
                        {prop.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-3">
                        {prop.proposition}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
} 