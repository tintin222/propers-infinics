import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'

interface SuggestionsProps {
  suggestions: string[]
  onSuggestionSelect: (suggestion: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function Suggestions({
  suggestions,
  onSuggestionSelect,
  isOpen,
  onOpenChange
}: SuggestionsProps) {
  return (
    <div className="relative my-4">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <div className="flex items-center space-x-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-7 hover:bg-background"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              <span className="text-xs">Suggestions</span>
              {isOpen ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-2">
          <div className="flex flex-col space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start h-auto py-2 px-2 text-sm font-normal hover:bg-muted whitespace-normal text-left"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
} 