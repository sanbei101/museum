<template>
  <!-- 数据统计区域 -->
  <n-card class="stats-section">
    <n-grid cols="1 m:2 l:4" responsive="screen" :x-gap="16">
      <n-grid-item v-for="(stat, index) in statsData" :key="index">
        <div class="stat-item">
          <div class="stat-icon">
            <component :is="stat.icon" :size="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import { Database, Users, Calendar, Medal } from 'lucide-vue-next';
import { NGrid, NGridItem, NCard } from 'naive-ui';
import { ref } from 'vue';
// 数据统计
const statsData = ref([
  {
    icon: Database,
    value: '12,000+',
    label: '馆藏文物'
  },
  {
    icon: Users,
    value: '150万+',
    label: '年访问量'
  },
  {
    icon: Calendar,
    value: '120+',
    label: '年度展览'
  },
  {
    icon: Medal,
    value: '36+',
    label: '国家级珍品'
  }
]);
</script>

<style scoped>
/* 数据统计区域 */
.stats-section {
  margin: 40px 0;
}

.stat-item {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  color: #18a058;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #18a058;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}
</style>
