<script setup>
import logo from '../assets/img/logo.png'

definePageMeta({
  layout: 'login',
})
const route = useRoute()
const auth = useAuth()
if (auth.isLogin.value) navigateTo('/disk')

const dialog = ref(false)

const loginForm = reactive({
  phone: '',
  captcha: '',
})
const sendPhone = ref('')
const captchaSent = ref(false)
const captchaWaitTime = ref(0)
let captchaInterval = 0
const captchaBtnDisabled = computed(() => !/^1[3-9]\d{9}$/.test(loginForm.phone))
const doSend = ref(false)
const sendError = ref('')

function sendCaptcha() {
  if (captchaWaitTime.value) return
  doSend.value = true
  sendError.value = ''
  sendPhone.value = loginForm.phone
  api
    .post(`/auth/captcha`, { phone: loginForm.phone })
    .then(() => {
      captchaSent.value = true
      captchaWaitTime.value = 60
      captchaInterval = setInterval(() => {
        const value = captchaWaitTime.value - 1
        if (value === 0) clearInterval(captchaInterval)
        captchaWaitTime.value = value
      }, 1000)
    })
    .catch(({ message }) => (sendError.value = message || '未知错误'))
    .finally(() => (doSend.value = false))
}

const doLogin = ref(false)
const loginError = ref('')
watchEffect(() => {
  if (loginForm.captcha.length === 5) {
    doLogin.value = true
    loginError.value = ``
    auth
      .login(loginForm)
      .then(() => {
        if (route.query.next) navigateTo(`${route.query.next}`)
        else navigateTo('/disk')
      })
      .catch(({ message }) => (loginError.value = message || '未知错误'))
      .finally(() => (doLogin.value = false))
  }
})
</script>

<template>
  <div class="login">
    <div class="login-page">
      <div class="d-flex flex-column justify-center align-start">
        <h2 class="title logo-text slide-y">Shiru</h2>
        <p class="info">为你电脑/手机中的文件提供云存储、分享等服务，帮你更便捷安全地管理数据。</p>
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ props }">
            <VBtn class="mt-6 btn" color="light-blue-lighten-4" prepend-icon="mdi-login" rounded size="large" v-bind="props"
                  variant="flat">
              立即登录
            </VBtn>
          </template>
          <v-card :disabled="doLogin" :loading="doSend || doLogin">
            <v-card-text>
              <v-text-field
                v-model="loginForm.phone"
                :disabled="!!captchaWaitTime"
                :rules="[() => /^1[3-9]\d{9}$/.test(loginForm.phone) || '请输入正确手机号']"
                label="手机号"
                required
                validate-on="blur"
              >
                <template #append>
                  <VBtn :disabled="captchaBtnDisabled" color="light-blue" rounded @click="sendCaptcha">
                    {{ captchaWaitTime > 0 ? `等待(${captchaWaitTime}秒)` : '发送验证码' }}
                  </VBtn>
                </template>
              </v-text-field>
              <template v-if="captchaSent">
                <div class="text-body-2 font-weight-light text-center">
                  输入我们刚刚发送到您手机的验证码
                  <span class="font-weight-black text-light-blue">
                    {{ sendPhone }}
                  </span>
                </div>
                <v-otp-input v-model="loginForm.captcha" :error="!!loginError" label="验证码" length="5"></v-otp-input>
              </template>
              <error-alert :show="!!(sendError || loginError)" :text="sendError || loginError" />
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
      <div class="d-none d-sm-flex banner-sub align-center">
        <v-img :src="logo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url("../assets/img/login-bg.webp");
  background-position: center center;
  background-size: cover;
}

.login-page {
  display: flex;
  justify-content: space-evenly;
  height: 100%;
  padding: 1em 1em 6rem;
  background-color: rgba(255, 255, 255, 0.2);
  gap: 3rem;
  backdrop-filter: blur(6px);
  animation: BG 0.6s;
}

.login-page .title {
  font-size: 3rem;
  color: #454545;
}

.login-page .info {
  font-size: 0.875rem;
  max-width: 23rem;
  padding-top: 1rem;
  color: #6a6a6a;
}

.banner-sub {
  width: 24rem;
}

.banner-sub :deep(img) {
  width: 100%;
  filter: drop-shadow(0 0 0.4rem rgb(171, 227, 255));
  animation: FadeIn 0.6s;
}

@keyframes BG {
  from {
    backdrop-filter: blur(100px);
  }
}
</style>
