'use server'

import { getRedisClient } from '@/lib/redis/config'
import { revalidatePath } from 'next/cache'

const PROPOSITION_VERSION = 'v1'
function getPropositionKey(userId: string) {
  return `user:${PROPOSITION_VERSION}:propositions:${userId}`
}

export interface Proposition {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  chatId?: string
}

export async function saveProposition(
  proposition: Proposition,
  userId: string = 'anonymous'
): Promise<{ error?: string }> {
  try {
    const redis = await getRedisClient()
    const key = `proposition:${proposition.id}`
    
    await redis.hmset(key, proposition)
    await redis.zadd(getPropositionKey(userId), Date.now(), key)
    
    revalidatePath('/')
    return {}
  } catch (error) {
    return { error: 'Failed to save proposition' }
  }
}

export async function deleteProposition(
  id: string,
  userId: string = 'anonymous'
): Promise<{ error?: string }> {
  try {
    const redis = await getRedisClient()
    const key = `proposition:${id}`
    const propositionKey = getPropositionKey(userId)

    const pipeline = redis.pipeline()
    pipeline.del(key)
    pipeline.zrem(propositionKey, key)
    await pipeline.exec()

    revalidatePath('/')
    return {}
  } catch (error) {
    return { error: 'Failed to delete proposition' }
  }
}

export async function getPropositions(userId: string = 'anonymous'): Promise<Proposition[]> {
  try {
    const redis = await getRedisClient()
    const propositionKey = getPropositionKey(userId)
    const propositionKeys = await redis.zrange(propositionKey, 0, -1, { rev: true })

    if (!propositionKeys.length) {
      return []
    }

    const propositions = await Promise.all(
      propositionKeys.map(async key => {
        const data = await redis.hgetall(key)
        if (!data || !data.id) return null
        return data as unknown as Proposition
      })
    )

    return propositions.filter((p): p is Proposition => p !== null)
  } catch (error) {
    return []
  }
} 