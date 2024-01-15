<script setup>
import { useLocalStorage } from '@vueuse/core'
import { useDisplay } from 'vuetify'

definePageMeta({
  middleware: 'auth',
})

const { mobile } = useDisplay()
const tableHeaders = computed(() =>
  mobile.value
    ? [
      { title: '文件名', key: 'filename' },
      { title: '操作', key: 'actions' },
    ]
    : [
      { title: '文件名', key: 'filename' },
      { title: '修改时间', key: 'updatedAt' },
      { title: '大小', key: 'size' },
      { title: '操作', key: 'actions' },
    ],
)

const route = useRoute()
const auth = useAuth()
const { addShare } = useShare()
const path = computed(() => route.params.path || [])
const pathItems = computed(() => {
  const resultArray = [
    {
      title: '根目录',
      to: '/disk',
    },
  ]
  let currentPath = ''
  path.value.forEach((part, index) => {
    currentPath += index === 0 ? part : `/${part}`
    resultArray.push({
      title: part,
      to: `/disk/${currentPath}`,
    })
  })
  return resultArray
})
const diskApi = useAsyncData('disk', () => api.get(`/disk/${path.value.join('/')}`))
const files = computed(() => {
  const data = diskApi.data?.value ?? []
  return data.map((file) => ({
    ...file,
    ...file.isDir ? ({ icon: 'mdi-folder', color: 'grey-lighten-1' }) : fileTypeIcon(file.mimeType),
    size: formatSize(file.size),
    updatedAt: new Date(file.updatedAt).toLocaleString(),
    createdAt: new Date(file.createdAt).toLocaleString(),
  }))
})

function handleRowClick(_, { item }) {
  if (item.isDir) {
    recentOpens.value = item
    navigateTo(`/disk${item.path === '/' ? '' : item.path}/${item.filename}`)
  } else {
    previewFile.value = item
    previewDialog.value = true
  }
}

const previewDialog = ref(false)
const previewFile = ref(null)

function share(file) {
  previewDialog.value = false
  setTimeout(() => addShare(file), 200)
}

function downloadFile(item) {
  const a = document.createElement('a')
  a.href = `/api/disk/download/${item._id}`
  a.target = '_blank'
  a.download = item.filename
  a.click()
}

const copyDialog = ref(false)
const copyFileItem = reactive({
  _id: '',
  path: '',
})

function copyFile(item) {
  copyFileItem._id = item._id
  copyFileItem.path = item.path
  copyDialog.value = true
}

async function submitCopyFile() {
  await api.post(`/disk/copy`, { ...copyFileItem })
  copyDialog.value = false
  await diskApi.refresh()
}

const moveDialog = ref(false)
const moveFileItem = reactive({
  _id: '',
  path: '',
})

function moveFile(item) {
  moveFileItem._id = item._id
  moveFileItem.path = item.path
  moveDialog.value = true
}

async function submitMoveFile() {
  await api.post(`/disk/move`, { ...moveFileItem })
  moveDialog.value = false
  await diskApi.refresh()
}

const renameDialog = ref(false)
const renameFileItem = reactive({
  originFilename: '',
  _id: '',
  filename: '',
})

function renameFile(item) {
  renameFileItem.originFilename = item.filename
  renameFileItem.filename = item.filename
  renameFileItem._id = item._id
  renameDialog.value = true
}

async function submitRenameFile() {
  await api.post(`/disk/rename`, { ...renameFileItem })
  renameDialog.value = false
  await diskApi.refresh()
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
  await api.post(`/disk/remove`, { ...removeFileItem })
  removeDialog.value = false
  await diskApi.refresh()
}

const newDirDialog = ref(false)
const newDirFilename = ref('')

function newDir() {
  newDirFilename.value = '新建文件夹'
  newDirDialog.value = true
}

async function submitNewDir() {
  await api.post(`/disk/create`, {
    filename: newDirFilename.value,
    path: `/${path.value.join('/')}`,
    isDir: true,
  })
  newDirDialog.value = false
  await diskApi.refresh()
}

const uploader = useUploader()

async function uploadFile() {
  await uploader.upload(`/${path.value.join('/')}`)
  await diskApi.refresh()
}

const recentOpensStorage = useLocalStorage(`${auth.user.value._id}:disk:recent-opens`, [])
const recentOpens = computed({
  get: () => recentOpensStorage.value,
  set: (value) => {
    const index = recentOpensStorage.value.findIndex(({ _id }) => value._id === _id)
    if (index >= 0) {
      if (index === 0) return
      const tmp = recentOpensStorage.value[index]
      recentOpensStorage.value[index] = recentOpensStorage.value[0]
      recentOpensStorage.value[0] = tmp
      return
    }
    if (recentOpensStorage.value.length === 10) recentOpensStorage.value.pop()
    recentOpensStorage.value.unshift(value)
  },
})
</script>

<template>
  <div>
    <v-breadcrumbs :items="pathItems"></v-breadcrumbs>
    <v-data-table-virtual
      :headers="tableHeaders"
      :item-value="(item) => item._id"
      :items="files"
      hover
      show-select
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
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                icon="mdi-dots-horizontal"
                rounded="full"
                size="small"
                v-bind="props"
                variant="text"
              >
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item title="复制" @click="copyFile(item)"></v-list-item>
              <v-list-item title="移动" @click="moveFile(item)"></v-list-item>
              <v-list-item title="重命名" @click="renameFile(item)"></v-list-item>
              <v-divider />
              <v-list-item title="删除" @click="removeFile(item)"></v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-data-table-virtual>
    <v-dialog v-model="previewDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon :color="previewFile.color" :icon="previewFile.icon" size="small"></v-icon>
          <span class="ml-2">{{ previewFile.filename }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-item> 文件大小：{{ previewFile.size }}</v-card-item>
        <v-card-item> 所在目录：{{ previewFile.path }}</v-card-item>
        <v-card-item> 修改时间：{{ previewFile.updatedAt }}</v-card-item>
        <v-card-item> 创建时间：{{ previewFile.createdAt }}</v-card-item>
        <v-card-item v-show="previewFile.mimeType"> 文件类型：{{ previewFile.mimeType }}</v-card-item>
        <v-card-actions class="justify-end">
          <!-- <v-btn color="orange" @click="previewDialog = false" prepend-icon="mdi-eye">预览</v-btn> -->
          <v-btn color="red" prepend-icon="mdi-share" @click="share(previewFile)">分享</v-btn>
          <v-btn color="green" prepend-icon="mdi-download" @click="downloadFile(previewFile)">下载</v-btn>
          <v-btn color="primary" prepend-icon="mdi-close" @click="previewDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="copyDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>复制到</span>
          <v-chip variant="text">{{ copyFileItem.path }}</v-chip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <dir-selector v-model="copyFileItem.path"></dir-selector>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submitCopyFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="moveDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>移动到</span>
          <v-chip variant="text">{{ moveFileItem.path }}</v-chip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <dir-selector v-model="moveFileItem.path"></dir-selector>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submitMoveFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="renameDialog" max-width="350">
      <v-card>
        <v-card-title>重命名</v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <v-text-field v-model="renameFileItem.filename" :placeholder="renameFileItem.originFilename"></v-text-field>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submitRenameFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="removeDialog" max-width="350">
      <v-card>
        <v-card-title> 确认删除</v-card-title>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <v-btn color="red" @click="submitRemoveFile">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="newDirDialog" max-width="350">
      <v-card>
        <v-card-title> 新建文件夹</v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <v-text-field v-model="newDirFilename" placeholder="新建文件夹"></v-text-field>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submitNewDir">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="float-btn">
      <v-btn
        color="secondary"
        icon="mdi-folder-plus"
        rounded="full"
        title="新建文件夹"
        variant="tonal"
        @click="newDir"
      ></v-btn>
      <v-btn
        color="primary"
        icon="mdi-file-upload"
        rounded="full"
        title="上传文件"
        variant="tonal"
        @click="uploadFile"
      ></v-btn>
    </div>
    <v-navigation-drawer border="none" class="side px-2" color="#fdfeff" location="right">
      <v-list>
        <v-list-subheader class="d-flex align-center" inset>
          <span class="mr-2">最近访问</span>
          <v-btn color="red" icon="mdi-close" size="small" variant="text" @click="recentOpensStorage=[]"></v-btn>
        </v-list-subheader>
        <template v-for="recent in recentOpens" :key="recent._id">
          <v-list-item
            :title="recent.filename"
            :to="`/disk${recent.path === '/' ? '' : recent.path}/${recent.filename}`"
            rounded="pill"
            @click="recentOpens = recent"
          >
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-1" size="small">
                <v-icon color="white" size="small">mdi-folder</v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.side {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

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
