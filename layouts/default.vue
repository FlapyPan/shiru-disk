<script setup>
</script>

<template>
  <v-app>
    <app-bar />
    <v-main class="main">
      <slot />
    </v-main>
    <side-bar />
    <upload-dialog />
    <share-dialog />
  </v-app>
</template>

<style scoped>
.main {
  padding-top: 4rem;
  background-color: rgb(245, 251, 255);
}
</style>
