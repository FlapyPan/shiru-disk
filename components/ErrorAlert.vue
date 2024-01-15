<script setup>
const props = defineProps({
  show: {},
  text: {},
})
</script>

<template>
  <v-alert v-show="!!show" :text="text" type="error" variant="tonal"></v-alert>
</template>

<style scoped></style>
