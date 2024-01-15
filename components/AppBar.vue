<script setup>
import logo from '../assets/img/logo-small.png'
import { useDisplay } from 'vuetify'

const { user, logout } = useAuth()
const { mobile } = useDisplay()

const settingStore = useSettingStore()
</script>

<template>
  <v-app-bar class="app-bar align-center" color="blue-lighten-5" elevation="0">
    <template #prepend>
      <v-btn v-if="mobile" icon="mdi-menu" @click="settingStore.sideBarOpened = !settingStore.sideBarOpened">
      </v-btn>
      <v-app-bar-title v-else v-ripple class="rounded mr-2 d-none d-sm-flex">
        <div class="d-flex align-center">
          <v-avatar :image="logo" rounded="0"></v-avatar>
          <span class="logo-text ml-2">
            Shiru
          </span>
        </div>
      </v-app-bar-title>
    </template>
    <template #append>
      <v-btn icon="mdi-cog" size="small" title="设置" to="/setting"></v-btn>
      <v-menu close-on-content-click open-on-hover>
        <template #activator="{ props }">
          <v-btn class="mx-2" v-bind="props">
            <template #prepend>
              <v-avatar :image="user.avatar" size="36">
                <template #append>
                  <v-icon>mdi-arrow-right</v-icon>
                </template>
              </v-avatar>
            </template>
            <span class="text-none">{{ user.nickname || user.phone }}</span>
            <template #append>
              <v-icon>mdi-menu-down</v-icon>
            </template>
          </v-btn>
        </template>
        <v-list elevation="1">
          <v-list-item color="blue" @click="logout"> 退出登录</v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon="mdi-magnify" to="/search"></v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>
</style>
