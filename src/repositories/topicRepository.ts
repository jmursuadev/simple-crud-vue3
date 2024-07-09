import { useFetch } from '@/lib/fetch'
import type { TopicResponse } from '@/types'

export const fetchTopics = async function () {
  const response = await useFetch<TopicResponse>(
    'https://atillc.blob.core.windows.net/data-collector/icode/test-data/topics.json',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  )

  return response
}
