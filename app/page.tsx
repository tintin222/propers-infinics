import { Chat } from '@/components/chat'
import { generateId } from 'ai'

export default function HomePage() {
  const id = generateId()
  return <Chat id={id} />
}
