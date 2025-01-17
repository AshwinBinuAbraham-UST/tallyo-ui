<template>
  <component :is="layout">
    <router-view />
  </component>
  <DialogsWrapper />
</template>
<scr"+"ipt  lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DialogsWrapper } from 'vuejs-confirm-dialog';
const defaultLayout = 'default'
const { currentRoute } = useRouter()
const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`)
</script>
