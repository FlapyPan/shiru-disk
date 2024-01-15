<script setup>
import { useClipboard } from '@vueuse/core'

const { uploadState } = useUploader()

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { user } = useAuth()
const shareId = computed(() => route.params._id)
const shareFileApi = useAsyncData(`share-file`, () => api.get(`/share/${shareId.value}`))
const data = computed(() => shareFileApi.data.value || {})

const copied = ref(false)

function copyLink() {
  useClipboard({ legacy: true })
    .copy(`${location.href}`)
    .then(() => {
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
    })
}

function downloadFile(item) {
  const a = document.createElement('a')
  a.href = `/api/disk/download/${item._id}`
  a.target = '_blank'
  a.download = item.filename
  a.click()
}

const saveDialog = ref(false)
const savePath = reactive({
  parent: '/',
  dirName: '',
})

function saveFile() {
  savePath.dirName = data.value.title
  savePath.parent = '/'
  saveDialog.value = true
}

async function submitSaveFile() {
  const filesPath = `${savePath.parent === '/' ? '' : savePath.parent}/${savePath.dirName}`
  const tasks = data.value.shareFiles.map((file) => api.post(`/disk/create`, {
    ...file,
    path: filesPath,
  }))
  tasks.push(api.post(`/disk/create`, {
    filename: savePath.dirName,
    path: savePath.parent,
    isDir: true,
  }))
  await Promise.all(tasks)
  saveDialog.value = false
  navigateTo(`/disk${filesPath}`)
}
</script>

<template>
  <div class="share-file">
    <v-btn class="mb-2" prepend-icon="mdi-arrow-left" variant="text" @click="$router.back()">返回</v-btn>
    <template v-if="data._id">
      <v-card>
        <v-card-title class="d-flex">
          <span>{{ data.title }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <v-list>
            <v-list-item :title="data.user">
              <template #prepend>
                <v-avatar :image="`/api/user/avatar/${data.userId}`" color="grey-lighten-1" size="small">
                  <template #default>
                    <v-icon color="white">mdi-account</v-icon>
                  </template>
                </v-avatar>
              </template>
            </v-list-item>
            <v-list-item :title="`描述：${data.about || '无'}`"></v-list-item>
            <v-list-item :title="`创建时间：${new Date(data.createdAt).toLocaleString()}`"></v-list-item>
          </v-list>
        </v-card-item>
        <v-card-text>
          <v-btn v-if="copied" color="primary" prepend-icon="mdi-check" variant="text">复制成功</v-btn>
          <v-btn v-else color="orange" prepend-icon="mdi-share" variant="text" @click="copyLink">复制链接</v-btn>
        </v-card-text>
        <template v-if="data.shareFiles.length">
          <v-card-item>
            <v-list-subheader class="pl-4">文件列表</v-list-subheader>
            <template v-for="(file, i) in data.shareFiles" :key="file._id">
              <v-list-item :title="file.filename" rounded="pill">
                <template v-slot:prepend>
                  <v-avatar :color="fileTypeIcon(file.mimeType).color" size="small">
                    <v-icon color="white" size="small">{{ fileTypeIcon(file.mimeType).icon }}</v-icon>
                  </v-avatar>
                </template>
                <template #append>
                  <v-btn color="primary" icon="mdi-download" size="small" variant="text"
                         @click="downloadFile(file)"></v-btn>
                </template>
              </v-list-item>
            </template>
          </v-card-item>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" @click="saveFile">保存为我的文件</v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <v-card-subtitle class="text-center">
            你来晚啦，原文件已被删除
          </v-card-subtitle>
          <v-card-text></v-card-text>
        </template>
      </v-card>
    </template>
    <v-card v-else>
      <v-card-text>
        分享不存在或被取消
      </v-card-text>
    </v-card>
    <v-dialog v-model="saveDialog" max-width="800">
      <v-card>
        <v-card-title>
          <span>保存到</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title class="d-flex align-center">
          <v-text-field v-model="savePath.dirName" single-line>
            <template #prepend>
              {{ savePath.parent === '/' ? '' : savePath.parent }}/
            </template>
          </v-text-field>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <dir-selector v-model="savePath.parent"></dir-selector>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submitSaveFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.share-file {
  max-width: 800px;
  padding-top: 20px;
  margin-inline: auto;
}
</style>
