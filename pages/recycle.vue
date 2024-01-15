<script setup>
import { useDisplay } from 'vuetify'

definePageMeta({
  middleware: 'auth',
})

const { mobile } = useDisplay()
const tableHeaders = computed(() =>
  mobile.value
    ? [
      { title: '位置', key: 'filename' },
      { title: '删除时间', key: 'updatedAt' },
      { title: '操作', key: 'actions' },
    ]
    : [
      { title: '位置', key: 'filename' },
      { title: '删除时间', key: 'updatedAt' },
      { title: '大小', key: 'size' },
      { title: '操作', key: 'actions' },
    ]
)

const pathItems = [{
  title: '回收站',
  to: '/recycle',
}]
const recycleApi = useAsyncData('recycle', () => api.get(`/recycle`))
const files = computed(() => {
  const data = recycleApi.data?.value ?? []
  return data.map((file) => ({
    ...file,
    ...(file.isDir ? ({ icon: 'mdi-folder', color: 'grey-lighten-1' }) : fileTypeIcon(file.mimeType)),
    filename: `${file.path === '/' ? '' : file.path}/${file.filename}`,
    size: formatSize(file.size),
    updatedAt: new Date(file.updatedAt).toLocaleString(),
  }))
})

const recoverDialog = ref(false)
const recoverFileItem = reactive({
  _id: '',
})

function recoverFile(item) {
  recoverFileItem._id = item._id
  recoverDialog.value = true
}

async function submitRecoverFile() {
  await api.post(`/recycle/recover`, { ...recoverFileItem })
  recoverDialog.value = false
  await recycleApi.refresh()
}

const removeDialog = ref(false)
const removeFileItem = reactive({
  _id: '',
})

function removeFile(item) {
  removeFileItem._id = item._id
  removeDialog.value = true
}

async function submitRemoveFile() {
  await api.post(`/recycle/remove`, { ...removeFileItem })
  removeDialog.value = false
  await recycleApi.refresh()
}
</script>

<template>
  <div>
    <v-breadcrumbs :items="pathItems"> </v-breadcrumbs>
    <v-data-table-virtual :headers="tableHeaders" :item-value="(item) => item._id" :items="files"
      height="calc(100vh - 130px)" hover show-select>
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
          <v-btn color="primary" icon="mdi-arrow-u-left-top" rounded="full" size="small" title="恢复" variant="text"
            @click="recoverFile(item)">
          </v-btn>
          <v-btn color="primary" icon="mdi-delete" rounded="full" size="small" title="彻底删除" variant="text"
            @click="removeFile(item)"></v-btn>
        </div>
      </template>
    </v-data-table-virtual>
    <v-dialog v-model="recoverDialog" max-width="350">
      <v-card>
        <v-card-title>恢复文件</v-card-title>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submitRecoverFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="removeDialog" max-width="350">
      <v-card>
        <v-card-title>确认彻底删除</v-card-title>
        <v-card-actions class="justify-end">
          <v-btn color="red" @click="submitRemoveFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>
