<script setup lang="ts">
import { NDialogProvider, NMessageProvider } from 'naive-ui';
</script>

<template>
  <NMessageProvider>
    <NDialogProvider>
      <RouterView />
    </NDialogProvider>
  </NMessageProvider>
</template>
