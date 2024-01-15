<script setup>
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const path = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})
const diskApi = useAsyncData(
  'dir-select',
  () => api.get(`/disk${path.value}`),
  { immediate: false, watch: [path] },
)
onMounted(() => diskApi.execute())
const files = computed(() => {
  const data = diskApi.data?.value ?? []
  return data.filter((file) => file.isDir).map((file) => ({
    ...file,
    icon: 'mdi-folder',
    color: 'grey-lighten-1',
    size: formatSize(file.size),
    updatedAt: new Date(file.updatedAt).toLocaleString(),
    createdAt: new Date(file.createdAt).toLocaleString(),
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
</script>

<template>
  <v-list>
    <slot name="before" />
    <v-list-item :disabled="path==='/'" rounded="pill" title="上一级" @click="back">
    </v-list-item>
    <v-list-item v-for="file in files" :key="file._id" :title="file.filename" rounded="pill"
                 @click="path=`${file.path === '/' ? '' : file.path}/${file.filename}`">
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
