<script setup>
import { useMagicKeys } from '@vueuse/core'

const { shareState, newShare, submitShare, removeShare, addShare } = useShare()
const { uploadState } = useUploader()

const selectDialog = ref(false)
const { current } = useMagicKeys()

function onSelect(file) {
  addShare(file)
  if (!current.has('control')) selectDialog.value = false
}
</script>

<template>
  <v-dialog v-model="shareState.dialog" max-height="70%" max-width="1000">
    <v-card>
      <v-card-title>创建分享</v-card-title>
      <v-divider></v-divider>
      <v-card-item>
        <v-text-field v-model="shareState.title" label="标题"></v-text-field>
        <v-text-field v-model="shareState.about" label="其他信息"></v-text-field>
      </v-card-item>
      <v-card-item>
        <template v-for="(file, i) in shareState.shareFiles" :key="file._id">
          <v-list-item :subtitle="`所在路径：${file.path}`" :title="file.filename" rounded="pill">
            <template v-slot:prepend>
              <v-avatar :color="fileTypeIcon(file.mimeType).color" size="small">
                <v-icon color="white" size="small">{{ fileTypeIcon(file.mimeType).icon }}</v-icon>
              </v-avatar>
            </template>
            <template #append>
              <v-btn color="red" icon="mdi-close" size="small" variant="text" @click="removeShare(i)"></v-btn>
            </template>
          </v-list-item>
        </template>
        <v-list-item prepend-icon="mdi-plus" rounded="pill" subtitle="添加文件" @click="selectDialog=true">
        </v-list-item>
      </v-card-item>
      <v-card-actions>
        <v-btn color="red" @click="newShare">重置</v-btn>
        <v-spacer />
        <v-btn :disabled="!shareState.title || !shareState.shareFiles.length" color="green" @click="submitShare">
          分享
        </v-btn>
        <v-btn color="primary" @click="shareState.dialog=false">关闭</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="selectDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>添加文件</span>
          <v-card-subtitle>
            按住ctrl多选
          </v-card-subtitle>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <file-selector @select="onSelect"></file-selector>
        </v-card-item>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<style scoped></style>
