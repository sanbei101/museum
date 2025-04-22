<template>
  <!-- 搜索和筛选区域 -->
  <div class="search-section">
    <n-card>
      <div class="search-container">
        <n-input-group>
          <n-input placeholder="搜索藏品名称、年代、类别..." clearable>
            <template #prefix>
              <Search />
            </template>
          </n-input>
          <n-button type="primary">搜索</n-button>
        </n-input-group>
        <div class="filters">
          <n-select placeholder="藏品类别" :options="categoryOptions" class="filter-item" />
          <n-select placeholder="历史年代" :options="eraOptions" class="filter-item" />
          <n-select placeholder="展厅位置" :options="locationOptions" class="filter-item" />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
// 筛选选项
import { Search } from 'lucide-vue-next';
import { NInput, NButton, NSelect, NCard, NInputGroup } from 'naive-ui';
const categoryOptions = [
  { label: '青铜器', value: 'bronze' },
  { label: '陶瓷器', value: 'ceramics' },
  { label: '玉器', value: 'jade' },
  { label: '书画', value: 'paintings' },
  { label: '钱币', value: 'coins' }
];

const eraOptions = [
  { label: '先秦', value: 'pre-qin' },
  { label: '秦汉', value: 'qin-han' },
  { label: '魏晋南北朝', value: 'wei-jin' },
  { label: '隋唐', value: 'sui-tang' },
  { label: '宋元', value: 'song-yuan' },
  { label: '明清', value: 'ming-qing' }
];

const locationOptions = [
  { label: '一号展厅', value: 'hall-1' },
  { label: '二号展厅', value: 'hall-2' },
  { label: '三号展厅', value: 'hall-3' },
  { label: '临时展厅', value: 'temp-hall' }
];
</script>

<style scoped>
/* 搜索区域 */
.search-section {
  margin: 24px 0;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 150px;
}
</style>
