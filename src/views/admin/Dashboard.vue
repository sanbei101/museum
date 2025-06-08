<template>
  <div class="admin-dashboard">
    <n-layout>
      <n-layout-header bordered class="admin-header">
        <div class="admin-header-content">
          <h1>博物馆管理系统</h1>
          <n-button @click="$router.push('/')"> 返回前台 </n-button>
        </div>
      </n-layout-header>
      <n-layout-content>
        <div class="dashboard-content">
          <n-h1>管理员仪表板</n-h1>
          <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="16" :y-gap="16">
            <n-grid-item>
              <n-card title="藏品管理">
                <n-statistic label="总藏品数量" :value="120" />
                <template #footer>
                  <n-button type="primary" block> 管理藏品 </n-button>
                </template>
              </n-card>
            </n-grid-item>
            <n-grid-item>
              <n-card title="用户管理">
                <n-statistic label="注册用户" :value="1580" />
                <template #footer>
                  <n-button type="primary" block> 管理用户 </n-button>
                </template>
              </n-card>
            </n-grid-item>
            <n-grid-item>
              <n-card title="展览管理">
                <n-statistic label="正在进行的展览" :value="5" />
                <template #footer>
                  <n-button type="primary" block> 管理展览 </n-button>
                </template>
              </n-card>
            </n-grid-item>
          </n-grid>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NH1,
  NGrid,
  NGridItem,
  NCard,
  NStatistic,
  NButton
} from 'naive-ui';
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.admin-header {
  background-color: #001529;
}

.admin-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-header h1 {
  color: white;
  margin: 0;
  font-size: 20px;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
