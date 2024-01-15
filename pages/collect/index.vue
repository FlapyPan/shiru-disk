<script setup>
import { useDisplay } from 'vuetify'

definePageMeta({
  middleware: 'auth',
})

const { mobile } = useDisplay()
const tableHeaders = computed(() =>
  mobile.value
    ? [
      { title: '标题', key: 'title' },
      { title: '操作', key: 'actions' },
    ]
    : [
      { title: '标题', key: 'title' },
      { title: '收集状态', key: 'state' },
      { title: '截止日期', key: 'expireAt' },
      { title: '操作', key: 'actions' },
    ],
)
const shareApi = useAsyncData(() => Promise.resolve([
  {
    _id: '123',
    title: '收期末作业',
    about: '请大家提交期末作业，按格式要求填写信息',
    totalSize: 50,
    receivedCount: 2,
    createdAt: '2024-01-01 10:00:00',
    expireAt: '2024-02-01 10:00:00',
  },
]))
const files = computed(() => {
  const data = shareApi.data?.value ?? []
  return data.map((file) => ({
    ...file,
    state: `${file.receivedCount}/${file.totalSize}`,
    createdAt: new Date(file.createdAt).toLocaleString(),
    expireAt: new Date(file.expireAt).toLocaleString(),
  }))
})

function handleRowClick(_, { item }) {
  // todo: 查看收集的文件
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
  // todo: 取消收集
  await api.post(`/collect/remove`, { _id: removeFileItem._id })
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
          <v-btn color="red" icon="mdi-download" size="small" variant="text" @click="removeFile($event,item)">
            取消
          </v-btn>
        </div>
      </template>
    </v-data-table-virtual>
    <v-dialog v-model="removeDialog" max-width="350">
      <v-card>
        <v-card-title>取消收集</v-card-title>
        <v-divider></v-divider>
        <v-card-item>{{ removeFileItem.title }}</v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="red" @click="submitRemoveFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="float-btn">
      <v-btn
        color="primary"
        icon="mdi-plus"
        rounded="full"
        title="添加收集"
        variant="tonal"
        @click="navigateTo('/collect/create')"
      ></v-btn>
    </div>
  </div>
</template>

<style scoped>
.float-btn {
  position: fixed;
  bottom: 50px;
  left: 50%;
  display: flex;
  align-items: center;
  transform: translateX(-50%);
  gap: 12px;
}
</style>
