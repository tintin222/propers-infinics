export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
}

export const models: Model[] = [
  {
    id: 'anthropic/claude-3-sonnet-20240229',
    name: 'Claude 3.5 Sonnet (OpenRouter)',
    provider: 'OpenRouter',
    providerId: 'openrouter'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerId: 'openai'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    providerId: 'openai'
  }
]
