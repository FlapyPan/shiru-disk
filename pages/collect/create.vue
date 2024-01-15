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
    添加收集
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
