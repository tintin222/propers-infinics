'use client'

import { deleteProposition, getPropositions, saveProposition } from '@/lib/actions/propositions'
import { Chat } from '@/lib/types'
import { generateId } from 'ai'
import { Book, ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Textarea } from './ui/textarea'

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
    return null
  }

  // Look for the next assistant message after the category selection
  let lastAssistantMessage = null
  for (let i = messages.length - 1; i > categoryIndex; i--) {
    const message = messages[i]
    if (message.role === 'assistant') {
      const content = getMessageContent(message.content)
      
      // Store the last assistant message we find
      if (!lastAssistantMessage && content && content.length > 0) {
        lastAssistantMessage = content
      }

      // Check if this looks like a proposition
      if (content &&
          !content.includes('🔵') && // Not a question
          !content.includes('Features of the competitor') && // Not competitor analysis
          !content.includes('Based on the search results')) { // Not search analysis
        return content.trim()
      }
    }
  }

  // If we didn't find a clear proposition, return the last assistant message
  if (lastAssistantMessage) {
    return lastAssistantMessage.trim()
  }

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
        const category = content.split('-Focused')[0].trim()
        return category + '-Focused'
      }
    }
  }
  return 'Uncategorized'
}

const categories = [
  'Feature-Focused',
  'Benefit-Focused',
  'Target Audience-Focused',
  'Problem-Solving Focused',
  'Quality-Focused',
  'Price-Focused',
  'Service-Focused',
  'Experience-Focused',
  'Process-Focused',
  'Results-Focused'
]

export function PropositionLibrary({ chats }: PropositionLibraryProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProposition, setEditingProposition] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [savedPropositions, setSavedPropositions] = useState<any[]>([])

  // Load saved propositions
  useEffect(() => {
    const loadPropositions = async () => {
      const props = await getPropositions()
      setSavedPropositions(props)
    }
    loadPropositions()
  }, [isEditing, isDeleting])

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
        path: chat.path,
        fromChat: true
      })
    }
    return acc
  }, {} as Record<string, Array<any>>)

  // Add saved propositions to the categories
  savedPropositions.forEach(prop => {
    if (!propositionsByCategory[prop.category]) {
      propositionsByCategory[prop.category] = []
    }
    propositionsByCategory[prop.category].push({
      id: prop.id,
      title: prop.title,
      proposition: prop.content,
      path: prop.chatId ? `/search/${prop.chatId}` : undefined,
      fromChat: false
    })
  })

  const handleSave = async (formData: FormData) => {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const id = editingProposition?.id || generateId()

    const result = await saveProposition({
      id,
      title,
      content,
      category,
      createdAt: new Date().toISOString(),
      chatId: editingProposition?.chatId
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(editingProposition ? 'Proposition updated' : 'Proposition saved')
      setIsEditing(false)
      setEditingProposition(null)
      // Reload propositions
      const props = await getPropositions()
      setSavedPropositions(props)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const result = await deleteProposition(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Proposition deleted')
      // Reload propositions
      const props = await getPropositions()
      setSavedPropositions(props)
    }
    setIsDeleting(null)
  }

  return (
    <div className="flex flex-col w-64 h-screen bg-gradient-to-b from-background to-muted/20 border-l">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-between p-4 border-b hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center">
              <Book className="mr-2 h-4 w-4 text-primary" />
              <span className="font-semibold">Benzersiz Teklifler</span>
            </div>
            {isOpen ? 
              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 p-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-0 transition-colors mb-4" 
                variant="outline"
                onClick={() => {
                  setEditingProposition(null)
                  setIsEditing(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Proposition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form action={handleSave}>
                <DialogHeader>
                  <DialogTitle>{editingProposition ? 'Edit' : 'Add'} Proposition</DialogTitle>
                  <DialogDescription>
                    {editingProposition ? 'Edit your sales proposition below.' : 'Add a new sales proposition to your library.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter a title"
                      defaultValue={editingProposition?.title}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Enter your proposition"
                      defaultValue={editingProposition?.proposition}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue={editingProposition?.category || categories[0]}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.replace('-Focused', '')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProposition ? 'Save Changes' : 'Add Proposition'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

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
                    <div key={prop.id} className="group relative">
                      {prop.path ? (
                        <a
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
                      ) : (
                        <div className="block text-sm">
                          <div className="font-medium mb-1 line-clamp-2 text-foreground/80">
                            {prop.title}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-3">
                            {prop.proposition}
                          </div>
                        </div>
                      )}
                      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault()
                            setEditingProposition({
                              id: prop.id,
                              title: prop.title,
                              proposition: prop.proposition,
                              category,
                              chatId: prop.path?.split('/').pop()
                            })
                            setIsEditing(true)
                          }}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete proposition</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this proposition? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(prop.id)}
                                className="bg-destructive hover:bg-destructive/90"
                                disabled={isDeleting === prop.id}
                              >
                                {isDeleting === prop.id ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
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