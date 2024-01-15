<script setup>
const props = defineProps({})

const { uploadState } = useUploader()
</script>

<template>
  <v-dialog v-model="uploadState.dialog" max-width="800" max-height="70%">
    <v-card>
      <v-card-title>上传列表</v-card-title>
      <v-divider></v-divider>
      <v-card-item>
        <template v-for="(file, key) in uploadState.queue" :key="file._id">
          <v-list-item v-if="file.state === 'ok'" rounded="pill">
            <template v-slot:prepend>
              <v-avatar :color="fileTypeIcon(file.mimeType).color" size="small">
                <v-icon color="white" size="small">{{ fileTypeIcon(file.mimeType).icon }}</v-icon>
              </v-avatar>
            </template>
            <template #title>
              <div class="d-flex align-center mb-1">
                <span class="text-h6">{{ file.filename }}</span>
                <v-chip size="small" class="mx-2" color="green">成功</v-chip>
              </div>
            </template>
            <template #subtitle>
              <div>
                <v-progress-linear model-value="100" color="green"></v-progress-linear>
              </div>
            </template>
          </v-list-item>
          <v-list-item v-else-if="file.state" rounded="pill">
            <template v-slot:prepend>
              <v-avatar :color="fileTypeIcon(file.mimeType).color" size="small">
                <v-icon color="white" size="small">{{ fileTypeIcon(file.mimeType).icon }}</v-icon>
              </v-avatar>
            </template>
            <template #title>
              <div class="d-flex align-center mb-1">
                <span class="text-h6">{{ file.filename }}</span>
                <v-chip size="small" class="mx-2" color="red">{{ file.state }}</v-chip>
              </div>
            </template>
            <template #subtitle>
              <div>
                <v-progress-linear model-value="100" color="red"></v-progress-linear>
              </div>
            </template>
          </v-list-item>
          <v-list-item v-else rounded="pill">
            <template v-slot:prepend>
              <v-avatar :color="fileTypeIcon(file.mimeType).color" size="small">
                <v-icon color="white" size="small">{{ fileTypeIcon(file.mimeType).icon }}</v-icon>
              </v-avatar>
            </template>
            <template #title>
              <div class="d-flex align-center mb-1">
                <span class="text-h6">{{ file.filename }}</span>
                <v-chip size="small" class="mx-2" color="primary">上传中</v-chip>
              </div>
            </template>
            <template #subtitle>
              <div>
                <v-progress-linear indeterminate color="primary"></v-progress-linear>
              </div>
            </template>
          </v-list-item>
        </template>
      </v-card-item>
      <v-card-actions class="justify-end">
        <v-btn color="red" @click="uploadState.queue = {}">清空</v-btn>
        <v-btn color="primary" @click="uploadState.dialog = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
