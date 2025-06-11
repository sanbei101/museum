<template>
  <n-layout has-sider>
    <n-layout-sider bordered :width="240" :native-scrollbar="false">
      <n-menu :options="menuOptions" :default-value="activeMenu" @update:value="handleMenuSelect" />
    </n-layout-sider>

    <div v-if="activeMenu === 'artifacts'">
      <ArtifactAdmin></ArtifactAdmin>
    </div>

    <div v-else-if="activeMenu === 'exhibitions'">
      <ExhibitionAdmin></ExhibitionAdmin>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { NLayout, NLayoutSider, NMenu, NIcon } from 'naive-ui';
import { Archive, Home } from 'lucide-vue-next';
import ArtifactAdmin from './ArtifactAdmin.vue';
import ExhibitionAdmin from './ExhibitionAdmin.vue';

// 菜单配置
const activeMenu = ref<string>('artifacts');
const menuOptions = [
  {
    label: '文物管理',
    key: 'artifacts',
    icon: () => h(NIcon, null, { default: () => h(Home) })
  },
  {
    key: 'exhibitions',
    label: '展览管理',
    icon: () => h(NIcon, null, { default: () => h(Archive) })
  }
];

function handleMenuSelect(key: string) {
  activeMenu.value = key;
}
</script>
