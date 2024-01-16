import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(({ vueApp }) => {
  const options: PluginOptions = {
    position: POSITION.TOP_CENTER,
  }
  vueApp.use(Toast, options)
})
