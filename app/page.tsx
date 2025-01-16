import { Chat } from '@/components/chat'
import { generateId } from 'ai'

export default function HomePage() {
  const id = generateId()
  return (
    <div className="flex flex-col w-full max-w-3xl pt-10 pb-20 mx-auto stretch">
      <Chat id={id} />
    </div>
  )
}
