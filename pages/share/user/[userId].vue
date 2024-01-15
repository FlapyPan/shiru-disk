<script setup>
import { useDisplay } from 'vuetify'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { user } = useAuth()
const shareUserID = computed(() => route.params.userId || user.value._id)
const myShare = computed(() => route.params.userId === user.value._id)
const { mobile } = useDisplay()
const tableHeaders = computed(() =>
  mobile.value
    ? [
      { title: '标题', key: 'title' },
      { title: '操作', key: 'actions' },
    ]
    : [
      { title: '标题', key: 'title' },
      { title: '文件数量', key: 'size' },
      { title: '分享时间', key: 'createdAt' },
      { title: '操作', key: 'actions' },
    ],
)
const shareApi = useAsyncData(() => api.get(`/share/user/${shareUserID.value}`))
const files = computed(() => {
  const data = shareApi.data?.value ?? []
  return data.map((file) => ({
    ...file,
    ...fileTypeIcon(file.mimeType),
    size: file.fileIds.length,
    updatedAt: new Date(file.updatedAt).toLocaleString(),
    createdAt: new Date(file.createdAt).toLocaleString(),
  }))
})

function handleRowClick(_, { item }) {
  navigateTo(`/share/${item._id}`)
}

const removeDialog = ref(false)
const removeFileItem = reactive({
  _id: '',
  title: '',
})

function removeFile(event, item) {
  event.stopPropagation()
  removeFileItem._id = item._id
  removeFileItem.title = item.title
  removeDialog.value = true
}

async function submitRemoveFile() {
  await api.post(`/share/remove`, { _id: removeFileItem._id })
  removeDialog.value = false
  await shareApi.refresh()
}
</script>

<template>
  <div>
    <v-data-table-virtual :headers="tableHeaders" :item-value="(item) => item._id" :items="files" hover show-select
                          @click:row="handleRowClick">
      <template v-slot:item.filename="{ item }">
        <v-avatar :color="item.color" size="small">
          <v-icon color="white" size="small">{{ item.icon }}</v-icon>
        </v-avatar>
        <span class="ml-2">{{ item.filename }}</span>
      </template>
      <template v-slot:header.actions>
        <div class="text-end">操作</div>
      </template>
      <template #item.actions="{ item }">
        <div class="text-end">
          <v-btn v-if="myShare" color="red" icon="mdi-download" size="small" variant="text"
                 @click="removeFile($event,item)">
            取消
          </v-btn>
        </div>
      </template>
    </v-data-table-virtual>
    <v-dialog v-model="removeDialog" max-width="350">
      <v-card>
        <v-card-title>取消分享</v-card-title>
        <v-divider></v-divider>
        <v-card-item>{{ removeFileItem.title }}</v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="red" @click="submitRemoveFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>
