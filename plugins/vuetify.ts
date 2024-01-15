import { createVuetify } from 'vuetify'
import { zhHans } from 'vuetify/locale'

export default defineNuxtPlugin(({ vueApp }) => {
  const vuetify = createVuetify({
    ssr: true,
    locale: {
      locale: 'zhHans',
      messages: { zhHans },
    },
    defaults: {
      VBtn: {
        rounded: 'lg',
        variant: 'tonal',
      },
      VChip: {
        rounded: true,
      },
      VCard: {
        rounded: 'lg',
        elevation: 0,
      },
      VTextField: {
        variant: 'underlined',
      },
    },
  })

  vueApp.use(vuetify)

  return { provide: { vuetify } }
})
