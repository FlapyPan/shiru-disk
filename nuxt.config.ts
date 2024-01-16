import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  typescript: {
    typeCheck: true,
  },
  modules: [
    '@nuxtjs/color-mode',
    'nuxt-icon',
    'nuxt-mongoose',
  ],
  build: {
    transpile: ['vuetify', 'jsonwebtoken'],
  },
  hooks: {
    'vite:extendConfig': (config) => {
      if (!config.plugins) config.plugins = []
      config.plugins.push(vuetify({ autoImport: true }))
    },
  },
  vite: {
    build: {
      target: 'modules',
      modulePreload: { polyfill: true },
    },
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      title: 'Shiru',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/styles',
    '~/assets/css/main.css',
  ],
})
