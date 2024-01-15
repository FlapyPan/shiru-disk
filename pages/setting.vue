<script setup>
definePageMeta({
  middleware: 'auth',
})
const { user, check } = useAuth()

const uploading = ref(false)
function uploadAvatar() {
  const inputElement = document.createElement('input')
  inputElement.type = 'file'
  // inputElement.multiple = true
  inputElement.accept = 'image/*'
  const onChange = async (event) => {
    uploading.value = true
    inputElement.removeEventListener('change', onChange)
    const selectedFile = event.target.files[0]
    const form = new FormData()
    form.set('file', selectedFile)
    await api.post(`/user/avatar`, form, false).finally(() => {
      uploading.value = false
    })
  }
  inputElement.addEventListener('change', onChange)
  inputElement.click()
}

const renameDialog = ref(false)
const nicknameForm = ref('')

function rename() {
  nicknameForm.value = user.value.nickname
  renameDialog.value = true
}

async function submitRename() {
  await api.post(`/user/rename`, { nickname: nicknameForm.value })
  renameDialog.value = false
  await check()
}
</script>

<template>
  <div class="setting">
    <div class="mb-2">个人资料</div>
    <v-card>
      <v-list>
        <v-list-item @click="uploadAvatar">
          <v-avatar color="grey-lighten-1" :image="uploading ? '' : user.avatar">
            <template #default>
              <v-icon color="white">mdi-account</v-icon>
            </template>
          </v-avatar>
          <span class="ml-4">头像</span>
          <template #append>
            <v-icon>mdi-arrow-right</v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-avatar>
            <v-icon>mdi-phone</v-icon>
          </v-avatar>
          <span class="ml-4">手机号</span>
          <template #append>
            <span>{{ user.phone }}</span>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="rename">
          <v-avatar>
            <v-icon>mdi-account-box</v-icon>
          </v-avatar>
          <span class="ml-4">昵称</span>
          <template #append>
            <span>{{ user.nickname }}</span>
            <v-icon>mdi-arrow-right</v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-avatar>
            <v-icon>mdi-account-group</v-icon>
          </v-avatar>
          <span class="ml-4">权限</span>
          <template #append>
            <span>{{ user.roleName }}</span>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-avatar>
            <v-icon>mdi-calendar</v-icon>
          </v-avatar>
          <span class="ml-4">注册时间</span>
          <template #append>
            <span>{{ new Date(user.createdAt).toLocaleDateString() }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
    <v-dialog v-model="renameDialog" max-width="350">
      <v-card>
        <v-card-title>修改昵称</v-card-title>
        <v-divider></v-divider>
        <v-card-item>
          <v-text-field v-model="nicknameForm"></v-text-field>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submitRename">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.setting {
  margin-inline: auto;
  max-width: 600px;
  padding-top: 20px;
}
</style>
