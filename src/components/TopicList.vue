<template>
  <el-button type="primary" @click="handleClickAddNew" class="add-button">Add Topic</el-button>
  <el-collapse :model-value="activeNames" @change="handleActiveNames">
    <el-collapse-item
      v-for="topic in topics"
      :key="topic.guid"
      :title="topic.name"
      :name="topic.guid"
    >
      <template #title>
        <h2>{{ topic.name }}</h2>
        <div class="action-wrapper">
          <el-button type="primary" :icon="Edit" circle @click="handleClickEditTopic(topic)" />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            @click="topicStore.removeTopic(topic.guid)"
          />
        </div>
      </template>
      <template #default>
        <CommentList :topic="topic" />
      </template>
    </el-collapse-item>
  </el-collapse>
  <el-pagination
    layout="prev, pager, next"
    :total="topicsTransformer.total"
    v-model:current-page="currentPage"
  ></el-pagination>
  <el-dialog
    v-model="showAddEditDialog"
    width="500px"
    :title="`${activeTopic.guid ? 'Edit' : 'Create'} Topic`"
  >
    <el-form label-position="top" :model="activeTopic" ref="formRef" @closed="activeTopic = {}">
      <el-form-item
        label="Name"
        prop="name"
        :rules="[{ message: 'This field is required.', required: true }]"
      >
        <el-input v-model="activeTopic.name" />
      </el-form-item>
      <div>
        <el-button
          type="primary"
          @click="handleSubmitForm(formRef)"
          :disabled="topicMetaStore.loading"
          >Save</el-button
        >
        <el-button @click="showAddEditDialog = false">Cancel</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { useTopicStore, useTopicMetaStore } from '../stores/topic'
import { onMounted, computed, ref } from 'vue'
import { fetchTopics } from '../repositories/topicRepository'
import PaginationTransformer from '../classes/pagination-transformer'
import CommentList from './CommentList.vue'
import type { Topic } from '../types'
import type { FormInstance } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'

const topicStore = useTopicStore()
const topicMetaStore = useTopicMetaStore()
const currentPage = ref<number>(1)
const showAddEditDialog = ref<boolean>(false)
const activeTopic = ref<Topic>({ name: '' })
const formRef = ref<FormInstance | null>(null)

const topicsTransformer = computed(() => {
  return PaginationTransformer.paginate(topicStore.topics, { page: currentPage.value })
})

const topics = computed(() => {
  return topicsTransformer.value.currentPageData
})

const activeNames = computed(() => {
  return topics.value.map((topic) => topic.guid)
})

const handleSubmitForm = (form: FormInstance | null) => {
  if (!form) return

  form.validate(async (valid: boolean) => {
    if (valid) {
      await topicMetaStore.submitForm(activeTopic.value)
      showAddEditDialog.value = false
    }
  })
}

const onChangeTopics = async () => {
  const response = await fetchTopics()
  const { topics, persons } = response

  topicStore.setTopics(topics, persons)
}

const handleClickEditTopic = (topic: Topic) => {
  activeTopic.value = { ...topic }
  showAddEditDialog.value = true
}

const handleActiveNames = (names: string[]) => {
  if (activeTopic.value.guid) {
    names.push(activeTopic.value.guid)
  }
}

const handleClickAddNew = () => {
  showAddEditDialog.value = true
  activeTopic.value = { name: '' }
}

onMounted(async () => {
  onChangeTopics()
})
</script>

<style scoped>
.add-button {
  margin-bottom: 20px;
  margin-left: auto;
  display: block;
}

h2 {
  font-weight: bold;
}

.action-wrapper {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
</style>
