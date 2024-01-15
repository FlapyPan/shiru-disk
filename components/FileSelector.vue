<script setup>
const emits = defineEmits(['select'])

const path = ref('/')
const diskApi = useAsyncData(
  'file-select',
  () => api.get(`/disk${path.value}`),
  { immediate: false, watch: [path] },
)
onMounted(() => diskApi.execute())
const files = computed(() => {
  const data = diskApi.data?.value ?? []
  return data.map((file) => ({
    ...file,
    ...file.isDir ? ({ icon: 'mdi-folder', color: 'grey-lighten-1' }) : fileTypeIcon(file.mimeType),
  }))
})

function back() {
  const splitPaths = path.value.split('/')
  if (splitPaths.length <= 2) {
    path.value = '/'
    return
  }
  path.value = splitPaths.slice(0, splitPaths.length - 1).join('/')
}

function handleRowClick(file) {
  if (file.isDir) {
    path.value = `${file.path === '/' ? '' : file.path}/${file.filename}`
  } else {
    emits('select', { ...file })
  }
}
</script>

<template>
  <v-list>
    <slot name="before" />
    <v-list-item :disabled="path==='/'" rounded="pill" title="上一级" @click="back">
    </v-list-item>
    <v-list-item v-for="file in files" :key="file._id" :title="file.filename" rounded="pill"
                 @click="handleRowClick(file)">
      <template v-slot:prepend>
        <v-avatar :color="file.color" size="small">
          <v-icon color="white" size="small">{{ file.icon }}</v-icon>
        </v-avatar>
      </template>
    </v-list-item>
    <slot name="after" />
  </v-list>
</template>

<style scoped>

</style>
