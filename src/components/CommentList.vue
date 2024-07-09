<template>
  <h3 class="comments-title">Comments</h3>
  <div class="comments-wrapper">
    <ul class="comment-items" v-for="(comment, i) in topic.comments" :key="`${topic.guid}-${i}`">
      <li class="comment-item">
        <div class="comment-content">
          <span>{{ comment.date }}</span>
          <p v-if="!comment.isEdit">{{ comment.comment }}</p>
          <el-input
            v-else
            v-model="comment.comment"
            type="textarea"
            :rows="3"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </div>
        <div class="comment-action">
          <el-button type="text" @click="topicStore.removeComment(topic.guid as string, i)"
            >Delete</el-button
          >
        </div>
      </li>
    </ul>
    <span v-if="topic.comments && topic.comments.length === 0">No comments</span>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import type { Topic } from '../types/topic'
import { useTopicStore } from '../stores/topic'

const props = defineProps<{
  topic: Topic
}>()
const { topic } = toRefs(props)
const topicStore = useTopicStore()
</script>

<style scoped>
.comments-title {
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.comment-item {
  padding-right: 30px;
}
</style>
