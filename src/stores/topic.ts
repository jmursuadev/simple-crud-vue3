import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Persons, Topic, Topics } from '@/types'

export const useTopicStore = defineStore('topic', () => {
  const topics = ref<Topics>([])
  const persons = ref<Persons>([])

  function setTopics(_topics: Topics = [], _persons: Persons = []) {
    topics.value = _topics
    persons.value = _persons
  }

  function updateTopic(guid: string, topicData: Topic) {
    const index = topics.value.findIndex((t) => t.guid === guid)
    if (index !== -1) {
      Object.keys(topicData).forEach((key: string) => {
        // @ts-ignore
        if (topics.value[index][key] !== undefined) {
          // @ts-ignore
          topics.value[index][key] = topicData[key]
        }
      })
    }
  }

  function removeTopic(guid: string) {
    const index = topics.value.findIndex((t) => t.guid === guid)
    if (index !== -1) {
      topics.value.splice(index, 1)
    }
  }

  function addTopic(topic: Topic) {
    topic.guid = Math.random().toString(36).substring(2, 8)
    topic.comments = []
    topics.value.unshift(topic)
  }

  function removeComment(guid: string, commentKey: number) {
    const index = topics.value.findIndex((t) => t.guid === guid)
    if (index !== -1) {
      topics.value[index].comments?.splice(commentKey, 1)
    }
  }

  return { topics, persons, setTopics, updateTopic, addTopic, removeTopic, removeComment }
})

export const useTopicMetaStore = defineStore('topicMeta', () => {
  const topicStore = useTopicStore()
  const { updateTopic, addTopic } = topicStore

  const loading = ref<boolean>(false)

  const submitForm = (topic: Topic) => {
    setLoading(true)

    return new Promise((resolve, reject) => {
      try {
        if (topic.guid) {
          updateTopic(topic.guid!, topic)
        } else {
          console.log('Adding topic', topic)
          addTopic(topic)
        }

        setLoading(false)
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  const setLoading = (value: boolean) => (loading.value = value)

  return { submitForm, setLoading, loading }
})
