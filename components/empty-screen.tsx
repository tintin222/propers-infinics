import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const exampleFlows = {
  product: {
    heading: 'Tell me about your product',
    message: `I have a new organic skincare line made with natural ingredients.`,
    examples: [
      "We've developed a mobile app that helps people track their daily water intake and stay hydrated",
      "I run a boutique digital marketing agency specializing in social media management",
      "We manufacture eco-friendly yoga mats made from recycled materials"
    ]
  },
  users: {
    heading: 'Describe your target users',
    message: 'My target users are women aged 25-45 who care about natural and sustainable beauty products.',
    examples: [
      "Small business owners who want to grow their social media presence but don't have time to manage it",
      "Health-conscious professionals aged 25-40 who want to build better wellness habits",
      "Yoga enthusiasts and fitness centers looking for sustainable exercise equipment"
    ]
  },
  competitor: {
    heading: 'Name a competitor',
    message: "One of our main competitors is The Ordinary skincare.",
    examples: [
      "Our main competitor is Hootsuite in the social media management space",
      "WaterMinder is our biggest competitor in the hydration tracking market",
      "Lululemon is our primary competitor in the yoga equipment sector"
    ]
  }
}

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  const [selectedExample, setSelectedExample] = useState<keyof typeof exampleFlows | null>(null)

  const handleExampleClick = (type: keyof typeof exampleFlows) => {
    setSelectedExample(type)
  }

  const handleMessageSelect = (message: string) => {
    submitMessage(message)
    setSelectedExample(null)
  }

  return (
    <div className={cn("mx-auto max-w-2xl px-4", className)}>
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Propers - Your Sales Proposition Generator
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          I'll help you create a unique and compelling sales proposition for your product or service by analyzing your competitors and identifying your key differentiators.
        </p>
        <p className="leading-normal text-muted-foreground mb-4">
          Start by telling me about your product or service, and I'll guide you through the process step by step.
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {Object.entries(exampleFlows).map(([key, flow]) => (
            <div key={key} className="w-full">
              <Button
                variant="link"
                className="h-auto p-0 text-base hover:no-underline"
                onClick={() => handleExampleClick(key as keyof typeof exampleFlows)}
              >
                <ArrowRight className="mr-2 text-muted-foreground" />
                {flow.heading}
              </Button>
              
              {selectedExample === key && (
                <div className="ml-8 mt-2 space-y-2 border-l-2 border-muted pl-4">
                  <p className="text-sm text-muted-foreground mb-2">Examples:</p>
                  {flow.examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-auto w-full justify-start p-2 text-sm font-normal hover:bg-muted whitespace-normal text-left"
                      onClick={() => handleMessageSelect(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
