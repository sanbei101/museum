<template>
  <n-layout-header bordered class="header">
    <div class="header-content">
      <div class="logo" @click="router.push({ name: RouteName.Home })">
        <h1>博物馆藏品管理</h1>
      </div>
      <div class="nav-links">
        <n-menu mode="horizontal" :options="menuOptions" />
      </div>
      <div class="user-actions">
        <n-button quaternary circle size="large">
          <template #icon>
            <Search />
          </template>
        </n-button>
        <n-button quaternary circle size="large">
          <template #icon>
            <Bell />
          </template>
        </n-button>
        <n-dropdown :options="userMenuOptions" trigger="click">
          <n-avatar
            round
            size="medium"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            style="cursor: pointer" />
        </n-dropdown>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import {
  NLayoutHeader,
  NMenu,
  NButton,
  NAvatar,
  NDropdown,
  type MenuOption,
  type DropdownOption
} from 'naive-ui';
import { Search, Bell } from 'lucide-vue-next';
import { h } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { RouteName } from '@/router';

const router = useRouter();

const menuOptions: MenuOption[] = [
  {
    label: () => {
      return h(RouterLink, { to: { name: RouteName.ArtifactDisplay } }, () => '藏品展示');
    },
    key: 'artifacts'
  },
  {
    label: () => {
      return h(RouterLink, { to: { name: RouteName.VirtualMuseum } }, () => '虚拟展厅');
    },
    key: 'virtual-tour'
  },
  {
    label: () => {
      return h(RouterLink, { to: { name: RouteName.Exhibition } }, () => '展览信息');
    },
    key: 'exhibition'
  },
  {
    label: () => {
      return h(RouterLink, { to: { name: RouteName.VisitGuide } }, () => '导览服务');
    },
    key: 'guide'
  }
];

const userMenuOptions: DropdownOption[] = [
  {
    label: '登入管理页面',
    key: 'admin',
    props: {
      onClick: () => {
        router.push({ name: RouteName.AdminLogin });
      }
    }
  }
];
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

/* 头部样式 */
.header {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  cursor: pointer;
  font-size: 18px;
  margin: 0;
  color: #18a058;
  white-space: nowrap;
}

.nav-links {
  flex: 1;
  margin-left: 40px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
