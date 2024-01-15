<script setup>
import { useDisplay } from 'vuetify'

const settingStore = useSettingStore()

const { mobile } = useDisplay()
watch(mobile, () => (settingStore.value.sideBarOpened = false))

const { user } = useAuth()
const { uploadState } = useUploader()
const { shareState, openOrNewShare } = useShare()
</script>

<template>
  <v-navigation-drawer v-model="settingStore.sideBarOpened" border="none" class="side" color="#fdfeff" location="left">
    <v-list :nav="true" density="comfortable">
      <v-list-subheader>文件</v-list-subheader>
      <v-list-item :active="$router.currentRoute.value.name === 'disk-path'" color="primary" rounded="xl" to="/disk">
        <template #prepend>
          <v-avatar color="primary" size="30">
            <v-icon class="text-body-1" color="white"> mdi-file</v-icon>
          </v-avatar>
        </template>
        所有文件
      </v-list-item>
      <v-list-item :active="uploadState.dialog" color="orange" rounded="xl"
                   @click="uploadState.dialog = !uploadState.dialog">
        <template #prepend>
          <v-avatar color="orange" size="30">
            <v-icon class="text-body-1" color="white"> mdi-cloud-upload</v-icon>
          </v-avatar>
        </template>
        上传列表
      </v-list-item>
      <v-list-item color="blue-grey" rounded="xl" to="/recycle">
        <template #prepend>
          <v-avatar color="blue-grey" size="30">
            <v-icon class="te xt-body-1" color="white"> mdi-delete</v-icon>
          </v-avatar>
        </template>
        回收站
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item color="green" rounded="xl" to="/disk-category/image">
        <template #prepend>
          <v-avatar color="green" size="30">
            <v-icon class="text-body-1" color="white"> mdi-image</v-icon>
          </v-avatar>
        </template>
        我的图片
      </v-list-item>
      <v-list-item color="blue" rounded="xl" to="/disk-category/video">
        <template #prepend>
          <v-avatar color="blue" size="30">
            <v-icon class="text-body-1" color="white"> mdi-video</v-icon>
          </v-avatar>
        </template>
        我的视频
      </v-list-item>
      <v-list-item color="red" rounded="xl" to="/disk-category/audio">
        <template #prepend>
          <v-avatar color="red" size="30">
            <v-icon class="text-body-1" color="white">mdi-music</v-icon>
          </v-avatar>
        </template>
        我的音频
      </v-list-item>
      <v-list-item color="light-blue" rounded="xl" to="/disk-category/doc">
        <template #prepend>
          <v-avatar color="light-blue" size="30">
            <v-icon class="text-body-1" color="white"> mdi-clipboard-text</v-icon>
          </v-avatar>
        </template>
        我的文档
      </v-list-item>
      <v-list-item color="grey" rounded="xl" to="/disk-category/other">
        <template #prepend>
          <v-avatar color="grey" size="30">
            <v-icon class="text-body-1" color="white"> mdi-file</v-icon>
          </v-avatar>
        </template>
        其他文件
      </v-list-item>
      <v-divider></v-divider>
      <v-list-subheader>分享</v-list-subheader>
      <v-list-item :to="`/share/user/${user._id}`" color="purple" rounded="xl">
        <template #prepend>
          <v-avatar color="purple" size="30">
            <v-icon class="text-body-1" color="white">mdi-share-variant</v-icon>
          </v-avatar>
        </template>
        我的分享
      </v-list-item>
      <v-list-item :active="shareState.dialog" color="green" rounded="xl" @click="openOrNewShare">
        <template #prepend>
          <v-avatar color="green" size="30">
            <v-icon class="text-body-1" color="white">mdi-plus</v-icon>
          </v-avatar>
        </template>
        创建分享
      </v-list-item>
      <v-divider></v-divider>
      <v-list-subheader>文件收集</v-list-subheader>
      <v-list-item color="cyan" rounded="xl" to="/collect">
        <template #prepend>
          <v-avatar color="cyan" size="30">
            <v-icon class="text-body-1" color="white"> mdi-file-upload</v-icon>
          </v-avatar>
        </template>
        文件收集
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.side {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}
</style>
