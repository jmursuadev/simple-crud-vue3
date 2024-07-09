export type Topic = {
  name?: string
  guid?: string
  comments?: Comments
  isEdit?: boolean
}

export type Topics = Topic[]

export type Comment = {
  comment: string
  date: string
  by: string
  isEdit?: boolean
}

export type Comments = Comment[]

export type TopicResponse = {
  topics: Topics
  persons: Persons
}

export type Person = {
  email: string
  guid: string
  first: string
  last: string
}

export type Persons = Person[]